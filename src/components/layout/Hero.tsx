import { Search, Users, Download, BookmarkCheck } from 'lucide-react';

const features = [
  {
    icon: Search,
    title: 'Advanced Search',
    description: 'Find developers by location, language, and more'
  },
  {
    icon: Users,
    title: 'Detailed Profiles',
    description: 'View comprehensive developer information and statistics'
  },
  {
    icon: Download,
    title: 'Export Data',
    description: 'Download search results in CSV format'
  },
  {
    icon: BookmarkCheck,
    title: 'Save Profiles',
    description: 'Bookmark interesting profiles for later reference'
  }
];

export function Hero() {
  return (
    <div className="relative overflow-hidden border-b bg-background">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-background to-primary/10">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-black/10" />
      </div>

      <div className="container relative max-w-screen-2xl">
        <div className="flex flex-col items-center text-center py-16 md:py-24">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">
            Find Top GitHub Developers
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10">
            Discover talented developers worldwide. Search, analyze, and connect with GitHub users based on their skills, location, and contributions.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-screen-xl">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="flex flex-col items-center p-4 rounded-lg bg-background/60 backdrop-blur-sm border shadow-sm hover:shadow-md transition-shadow"
              >
                <feature.icon className="h-6 w-6 mb-2 text-primary" />
                <h3 className="font-medium mb-1">{feature.title}</h3>
                <p className="text-sm text-muted-foreground text-center">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}