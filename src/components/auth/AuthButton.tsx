import React from 'react';
import { Button } from '../ui/button';
import { supabase } from '@/lib/supabase';
import { Github, LogOut } from 'lucide-react';
import { useAuth } from './AuthProvider';

export function AuthButton() {
  const { user } = useAuth();

  const handleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: import.meta.env.VITE_GITHUB_CALLBACK_URL
        }
      });
      
      if (error) {
        console.error('Auth error:', error.message);
      }
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  if (user) {
    return (
      <Button
        variant="outline"
        onClick={handleLogout}
        className="flex items-center gap-2"
      >
        <LogOut className="h-4 w-4" />
        Sign Out ({user.email})
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      onClick={handleLogin}
      className="flex items-center gap-2"
    >
      <Github className="h-4 w-4" />
      Sign in with GitHub
    </Button>
  );
}