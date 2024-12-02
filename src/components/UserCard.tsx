import { GitHubUser } from '@/types';

interface UserCardProps {
  user: GitHubUser;
}

export function UserCard({ user }: UserCardProps) {
  return (
    <div className="bg-card rounded-lg shadow-md p-4">
      <div className="flex items-center space-x-4">
        <img
          src={user.avatar_url}
          alt={`${user.login}'s avatar`}
          className="w-16 h-16 rounded-full"
        />
        <div>
          <h3 className="text-lg font-semibold">
            <a
              href={user.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              {user.name || user.login}
            </a>
          </h3>
          {user.bio && <p className="text-sm text-muted-foreground">{user.bio}</p>}
          {user.location && (
            <p className="text-sm text-muted-foreground mt-1">📍 {user.location}</p>
          )}
        </div>
      </div>
    </div>
  );
}