import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Download, Loader2 } from 'lucide-react';
import { GitHubUser, UserSearchParams } from '@/types';
import { convertToCSV, downloadCSV } from '@/lib/csv-utils';
import { fetchAllUsers } from '@/lib/github-api';
import { useAuth } from '../auth/AuthProvider';

interface ExportButtonProps {
  currentUsers: GitHubUser[];
  searchParams: Omit<UserSearchParams, 'page'> | null;
  disabled?: boolean;
}

export function ExportButton({ currentUsers, searchParams, disabled }: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);
  const { user } = useAuth();

  const handleExport = async () => {
    if (!user) return;
    
    if (!searchParams) {
      // If no search has been performed, export current page only
      const csvContent = convertToCSV(currentUsers);
      const timestamp = new Date().toISOString().split('T')[0];
      downloadCSV(csvContent, `github-users-${timestamp}.csv`);
      return;
    }

    setIsExporting(true);
    try {
      const allUsers = await fetchAllUsers(searchParams);
      const csvContent = convertToCSV(allUsers);
      const timestamp = new Date().toISOString().split('T')[0];
      downloadCSV(csvContent, `github-users-${timestamp}.csv`);
    } catch (error) {
      console.error('Error exporting users:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleExport}
      disabled={!user || disabled || isExporting || currentUsers.length === 0}
      title={!user ? "Sign in to export results" : "Export to CSV"}
      className="flex items-center gap-2"
    >
      {isExporting ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Download className="h-4 w-4" />
      )}
      {isExporting ? 'Exporting...' : 'Export to CSV'}
    </Button>
  );
}