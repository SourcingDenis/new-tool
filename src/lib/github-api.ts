import axios from 'axios';
import { UserSearchParams, GitHubUser, SearchResponse } from '@/types';
import { API_ENDPOINTS } from '@/config/constants';
import { supabase } from './supabase';

const getGithubApi = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  const provider_token = session?.provider_token;
  
  return axios.create({
    baseURL: API_ENDPOINTS.GITHUB_API,
    headers: provider_token ? {
      Authorization: `Bearer ${provider_token}`
    } : {}
  });
};

export async function searchUsers(params: UserSearchParams): Promise<SearchResponse> {
  try {
    const githubApi = await getGithubApi();
    
    // Ensure there's a valid search query
    let searchQuery = params.query || 'type:user';
    if (params.language) searchQuery += ` language:${params.language}`;
    if (params.locations?.length) {
      searchQuery += ` ${params.locations.map(loc => `location:${loc}`).join(' ')}`;
    }
    if (params.hireable) {
      searchQuery += ` is:hireable`;
    }

    const response = await githubApi.get('/search/users', {
      params: {
        q: searchQuery,
        sort: params.sort || '',
        order: params.order || 'desc',
        per_page: params.per_page || 10,
        page: params.page || 1
      }
    });

    const users = await Promise.all(
      response.data.items.map(async (user: any) => {
        const userDetailsResponse = await githubApi.get(`/users/${user.login}`);
        const userDetails = userDetailsResponse.data;
        
        // Get user's top language
        let topLanguage = null;
        try {
          const reposResponse = await githubApi.get(`/users/${user.login}/repos`, {
            params: { sort: 'pushed', per_page: 10 }
          });
          const languages = reposResponse.data
            .filter((repo: any) => repo.language)
            .map((repo: any) => repo.language);
          
          if (languages.length > 0) {
            const languageCounts = languages.reduce((acc: Record<string, number>, lang: string) => {
              acc[lang] = (acc[lang] || 0) + 1;
              return acc;
            }, {});
            topLanguage = Object.entries(languageCounts)
              .sort((a, b) => b[1] - a[1])[0][0];
          }
        } catch (error) {
          console.error('Error fetching user repositories:', error);
        }

        return {
          ...userDetails,
          topLanguage
        };
      })
    );

    // Filter users based on hireable status if specified
    const filteredUsers = params.hireable ? users.filter(user => user.hireable) : users;

    return {
      items: filteredUsers,
      total_count: response.data.total_count
    };
  } catch (error) {
    console.error('Error searching GitHub users:', error);
    throw error;
  }
}

export async function fetchAllUsers(params: Omit<UserSearchParams, 'page'>): Promise<GitHubUser[]> {
  const PER_PAGE = 100; // Maximum allowed by GitHub API
  const MAX_RESULTS = 1000; // GitHub API limit
  let allUsers: GitHubUser[] = [];
  let page = 1;
  
  try {
    while (true) {
      const githubApi = await getGithubApi();
      const response = await searchUsers({
        ...params,
        page,
        per_page: PER_PAGE
      });
      
      allUsers = [...allUsers, ...response.items];
      
      // Stop if we've reached the end of results or GitHub's limit
      if (allUsers.length >= MAX_RESULTS || response.items.length < PER_PAGE) {
        break;
      }
      
      page++;
      
      // Add a small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    return allUsers;
  } catch (error) {
    console.error('Error fetching all users:', error);
    return allUsers;
  }
}

export async function findUserEmail(username: string): Promise<string | null> {
  try {
    const githubApi = await getGithubApi();
    
    // First, try to get the email from the user's public events
    const eventsResponse = await githubApi.get(`/users/${username}/events/public`);
    const events = eventsResponse.data;
    
    // Look for push events which might contain commit information
    for (const event of events) {
      if (event.type === 'PushEvent' && event.payload?.commits?.length > 0) {
        const commitSha = event.payload.commits[0].sha;
        const repoName = event.repo.name;
        
        // Get the commit details which might contain the author's email
        const commitResponse = await githubApi.get(`/repos/${repoName}/commits/${commitSha}`);
        const email = commitResponse.data?.commit?.author?.email;
        
        if (email && !email.includes('users.noreply.github.com')) {
          return email;
        }
      }
    }
    
    // If no email found in events, try repositories
    const reposResponse = await githubApi.get(`/users/${username}/repos`, {
      params: { sort: 'pushed', per_page: 5 }
    });
    
    for (const repo of reposResponse.data) {
      const commitsResponse = await githubApi.get(`/repos/${repo.full_name}/commits`, {
        params: { author: username, per_page: 1 }
      });
      
      if (commitsResponse.data.length > 0) {
        const email = commitsResponse.data[0]?.commit?.author?.email;
        if (email && !email.includes('users.noreply.github.com')) {
          return email;
        }
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error finding user email:', error);
    return null;
  }
}