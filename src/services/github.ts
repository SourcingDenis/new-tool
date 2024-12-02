import axios from 'axios';
import { UserSearchParams, GitHubUser } from '@/types';

const GITHUB_API_URL = 'https://api.github.com';

export async function searchUsers({ query, language, location }: UserSearchParams): Promise<GitHubUser[]> {
  let searchQuery = query;
  if (language) searchQuery += ` language:${language}`;
  if (location) searchQuery += ` location:${location}`;

  try {
    const response = await axios.get(`${GITHUB_API_URL}/search/users`, {
      params: {
        q: searchQuery,
        per_page: 10
      }
    });

    return response.data.items;
  } catch (error) {
    console.error('Error searching GitHub users:', error);
    return [];
  }
}