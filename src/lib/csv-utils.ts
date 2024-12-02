import { GitHubUser } from '@/types';

function guessEmail(user: GitHubUser): string {
  // Only guess if no public email is available
  if (user.email) {
    return user.email;
  }
  
  // Create a guess using username@gmail.com
  return `${user.login}@gmail.com`;
}

export function convertToCSV(users: GitHubUser[]): string {
  const headers = [
    'Username',
    'Name',
    'Email',
    'Email Guess',
    'Bio',
    'Location',
    'Company',
    'Blog',
    'Public Repos',
    'Followers',
    'Following',
    'Created At',
    'Profile URL',
    'Top Language'
  ];

  const rows = users.map(user => [
    user.login,
    user.name || '',
    user.email || '',
    guessEmail(user),
    (user.bio || '').replace(/"/g, '""'), // Escape quotes in CSV
    user.location || '',
    user.company || '',
    user.blog || '',
    user.public_repos,
    user.followers,
    user.following,
    new Date(user.created_at).toLocaleDateString(),
    user.html_url,
    user.topLanguage || ''
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');

  return csvContent;
}

export function downloadCSV(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}