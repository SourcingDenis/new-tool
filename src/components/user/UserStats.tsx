import { Users, BookOpen, GitFork } from 'lucide-react';

interface UserStatsProps {
  followers: number;
  following: number;
  publicRepos: number;
}

export function UserStats({ followers, following, publicRepos }: UserStatsProps) {
  return (
    <div className="flex space-x-4 mt-2">
      <div className="flex items-center text-sm text-muted-foreground">
        <Users className="h-4 w-4 mr-1" />
        <span>{followers} followers</span>
      </div>
      <div className="flex items-center text-sm text-muted-foreground">
        <GitFork className="h-4 w-4 mr-1" />
        <span>{following} following</span>
      </div>
      <div className="flex items-center text-sm text-muted-foreground">
        <BookOpen className="h-4 w-4 mr-1" />
        <span>{publicRepos} repos</span>
      </div>
    </div>
  );
}