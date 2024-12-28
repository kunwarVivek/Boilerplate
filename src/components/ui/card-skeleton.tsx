import { Card, CardContent, CardHeader } from "./card";

export function CardSkeleton() {
  return (
    <Card className="animate-pulse">
      <CardHeader className="space-y-2">
        <div className="h-4 w-1/2 bg-muted rounded"></div>
        <div className="h-3 w-1/4 bg-muted rounded"></div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="h-3 w-3/4 bg-muted rounded"></div>
        <div className="h-3 w-full bg-muted rounded"></div>
        <div className="h-3 w-2/3 bg-muted rounded"></div>
      </CardContent>
    </Card>
  );
}