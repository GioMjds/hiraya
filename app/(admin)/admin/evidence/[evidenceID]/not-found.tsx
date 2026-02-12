import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle className="text-base">Evidence not found</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-muted-foreground">
            The evidence item you tried to open doesn’t exist or is no longer available.
          </div>
          <Button asChild className="w-full">
            <Link href="/admin/evidence">Back to evidence queue</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
