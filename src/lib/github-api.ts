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

    const response = await githubApi.get<SearchResponse>('/search/users', {
      params: {
        q: searchQuery,
        sort: params.sort || '',
        order: params.order || 'desc',
        per_page: params.per_page || 10,
        page: params.page || 1
      }
    });

    const users = await Promise.all(
      response.data.items.map(async (user) => {
        const userDetailsResponse = await githubApi.get<GitHubUser>(`/users/${user.login}`);
        const userDetails = userDetailsResponse.data;
        
        // Get user's top language
        let topLanguage = null;
        try {
          const reposResponse = await githubApi.get<{ language: string }[]>(`/users/${userDetails.login}/repos`, {
            params: { sort: 'pushed', per_page: 10 }
          });
          
          // Count languages
          const languageCounts = reposResponse.data.reduce((acc, repo) => {
            if (repo.language) {
              acc[repo.language] = (acc[repo.language] || 0) + 1;
            }
            return acc;
          }, {} as Record<string, number>);
          topLanguage = Object.keys(languageCounts).sort((a, b) => languageCounts[b] - languageCounts[a])[0];
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
  const allUsers: GitHubUser[] = [];
  let currentPage = 1;
  
  while (true) {
    const response = await searchUsers({ ...params, page: currentPage });
    allUsers.push(...response.items);
    
    if (response.items.length < (params.per_page || 10) || allUsers.length >= 1000) {
      break;
    }
    currentPage++;
  }
  
  return allUsers;
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