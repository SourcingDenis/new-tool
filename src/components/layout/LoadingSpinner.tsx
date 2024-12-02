
export function LoadingSpinner() {
  return (
    <div className="text-center text-muted-foreground py-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
      <p className="mt-2">Loading...</p>
    </div>
  );
}