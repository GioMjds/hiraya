import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Save } from 'lucide-react';

export default async function Page({ params }: PageProps<'/user/[userID]/profile'>) {
  const { userID } = await params;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Profile</h1>
          <p className="text-sm text-muted-foreground">
            A lightweight mock of the profile and onboarding preferences.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href={`/user/${userID}/dashboard`}>
              <ArrowLeft className="mr-1 h-4 w-4" />
              Back
            </Link>
          </Button>
          <Button>
            <Save className="mr-1 h-4 w-4" />
            Save changes
          </Button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Basic information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="headline">Headline</Label>
                <Input id="headline" placeholder="e.g., Aspiring full-stack developer" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" placeholder="e.g., Remote / City" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="summary">Summary</Label>
              <Textarea
                id="summary"
                placeholder="Describe what you’re building and what roles you’re targeting."
                className="min-h-28"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="currentRole">Current role</Label>
                <Input id="currentRole" placeholder="e.g., Student / Junior dev" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="years">Years of experience</Label>
                <Input id="years" type="number" placeholder="0" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Onboarding tags</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">Persona</Badge>
              <Badge variant="outline">Goal</Badge>
              <Badge variant="outline">Evidence Types</Badge>
            </div>
            <Separator />
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">User ID</div>
              <div className="font-mono text-sm">{userID}</div>
            </div>
            <div className="rounded-lg border p-4">
              <div className="text-sm font-medium">Target outcome</div>
              <div className="mt-1 text-sm text-muted-foreground">
                Mock space for onboarding goal and desired results.
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
