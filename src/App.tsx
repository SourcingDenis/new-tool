import React, { useState, useEffect } from 'react';
import { SearchContainer } from '@/components/search/SearchContainer';
import { SavedProfiles } from '@/components/saved/SavedProfiles';
import { SavedSearches } from '@/components/saved/SavedSearches';
import { AuthProvider } from '@/components/auth/AuthProvider';
import { ThemeProvider } from '@/components/theme/ThemeProvider';
import { Header } from '@/components/layout/Header';
import { Hero } from '@/components/layout/Hero';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/components/auth/AuthProvider';
import { useLocation } from 'react-router-dom';

function App() {
  const [activeTab, setActiveTab] = useState('search');
  const [hasSearched, setHasSearched] = useState(false);
  const { user } = useAuth();
  const location = useLocation();

  useEffect(() => {
    // If there are search params in the URL, switch to search tab
    if (location.search) {
      setActiveTab('search');
      setHasSearched(true);
    }
  }, [location.search]);

  const handleSearch = () => {
    setHasSearched(true);
  };

  return (
    <ThemeProvider>
      <AuthProvider>
        <div className="min-h-screen bg-background">
          <Header />
          {!hasSearched && !user && activeTab === 'search' && <Hero />}
          <main className="container max-w-screen-2xl py-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground mb-6">
                <TabsTrigger value="search" className="rounded-md px-3 py-1 text-sm font-medium">
                  Search
                </TabsTrigger>
                <TabsTrigger value="saved-profiles" className="rounded-md px-3 py-1 text-sm font-medium">
                  Saved Profiles
                </TabsTrigger>
                <TabsTrigger value="saved-searches" className="rounded-md px-3 py-1 text-sm font-medium">
                  Saved Searches
                </TabsTrigger>
              </TabsList>
              <TabsContent value="search" className="mt-0">
                <SearchContainer onSearch={handleSearch} />
              </TabsContent>
              <TabsContent value="saved-profiles" className="mt-0">
                <SavedProfiles />
              </TabsContent>
              <TabsContent value="saved-searches" className="mt-0">
                <SavedSearches />
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;