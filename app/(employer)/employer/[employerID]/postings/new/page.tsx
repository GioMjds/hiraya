import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';

export default function Page() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight">New posting</h1>
        <p className="text-sm text-muted-foreground">
          Mock posting creation form layout.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Posting details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" placeholder="e.g., Full-Stack Engineer" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Input id="role" placeholder="Select a role" />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input id="location" placeholder="Remote / City" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Employment type</Label>
              <Input id="type" placeholder="Full-time" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" className="min-h-28" placeholder="Role summary and expectations" />
          </div>
          <Separator />
          <div className="flex items-center gap-2">
            <Button>Save draft</Button>
            <Button variant="outline">Publish</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}