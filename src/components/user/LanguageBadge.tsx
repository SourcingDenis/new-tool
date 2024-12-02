import React from 'react';
import { cn } from '@/lib/utils';

interface LanguageBadgeProps {
  language: string;
}

const languageColors: Record<string, string> = {
  JavaScript: 'bg-yellow-100 text-yellow-800',
  TypeScript: 'bg-blue-100 text-blue-800',
  Python: 'bg-green-100 text-green-800',
  Java: 'bg-orange-100 text-orange-800',
  'C++': 'bg-purple-100 text-purple-800',
  Ruby: 'bg-red-100 text-red-800',
  Go: 'bg-cyan-100 text-cyan-800',
  Rust: 'bg-amber-100 text-amber-800',
  PHP: 'bg-indigo-100 text-indigo-800',
  Swift: 'bg-pink-100 text-pink-800',
};

export function LanguageBadge({ language }: LanguageBadgeProps) {
  const colorClasses = languageColors[language] || 'bg-gray-100 text-gray-800';

  return (
    <span className={cn(
      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
      colorClasses
    )}>
      {language}
    </span>
  );
}