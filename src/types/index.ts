export interface UserSearchParams {
  query: string;
  language?: string;
  locations?: string[];
  page: number;
  sort?: string;
  order?: 'asc' | 'desc';
  per_page?: number;
  hireable?: boolean;
}

export interface GitHubUser {
  id: number;
  login: string;
  avatar_url: string;
  html_url: string;
  bio?: string;
  name?: string;
  email?: string;
  location?: string;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
  company?: string;
  blog?: string;
  topLanguage?: string | null;
  hireable?: boolean;
}

export interface SearchResponse {
  items: GitHubUser[];
  total_count: number;
}