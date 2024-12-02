export const API_ENDPOINTS = {
  GITHUB_API: 'https://api.github.com'
} as const;

export const SEARCH_CONFIG = {
  RESULTS_PER_PAGE: 10,
  DEFAULT_LANGUAGE: '',
  DEFAULT_LOCATION: ''
} as const;

export const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN;