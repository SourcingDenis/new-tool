import React from 'react';
import { Button } from '../ui/button';
import { Github } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export function GithubAuthButton() {
  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        scopes: 'read:user user:email'
      }
    });

    if (error) {
      console.error('Error signing in with GitHub:', error);
    }
  };

  return (
    <Button
      onClick={handleLogin}
      className="w-full gap-2"
    >
      <Github className="h-5 w-5" />
      Continue with GitHub
    </Button>
  );
}
