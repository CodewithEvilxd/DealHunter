import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export function ProductCardSkeleton() {
  return (
    <Card className="bg-theme-surface border border-theme-secondary/50 shadow-lg rounded-2xl overflow-hidden">
      <CardContent className="p-4">
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 items-center">
          <div className="col-span-1 sm:col-span-1 bg-theme-secondary/30 p-2 rounded-lg flex items-center justify-center">
            <Skeleton className="w-full h-32 rounded-md" />
          </div>
          <div className="col-span-2 sm:col-span-3 space-y-2">
            <div className="flex justify-between items-start">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
            <div className="flex items-baseline gap-2">
              <Skeleton className="h-6 w-24" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4 rounded-full" />
              <Skeleton className="h-4 w-12" />
            </div>
            <Skeleton className="h-8 w-24 rounded-full" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function SearchResultsSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
}