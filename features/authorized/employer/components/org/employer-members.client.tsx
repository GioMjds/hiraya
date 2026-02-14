'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import {
  useGetEmployerMembers,
  useInviteOrganizationMember,
  useRemoveOrganizationMember,
  useUpdateOrganizationMemberRole,
} from '@/features/authorized/employer/hooks';
import { Loader2, Plus, Search, Users } from 'lucide-react';
import type { EmployerMemberListItem, OrganizationRole } from '@/lib/api/authorized/employer';
import { EmployerWorkspaceHero } from '../shared/employer-workspace-hero';

interface EmployerMembersClientProps {
  employerId: string;
}

export function EmployerMembersClient({ employerId }: EmployerMembersClientProps) {
  const [search, setSearch] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isInviteOpen, setIsInviteOpen] = useState<boolean>(false);
  const [inviteEmail, setInviteEmail] = useState<string>('');
  const [inviteRole, setInviteRole] = useState<OrganizationRole>('member');
  const [selectedMember, setSelectedMember] = useState<EmployerMemberListItem | null>(
    null,
  );
  const [selectedRole, setSelectedRole] = useState<OrganizationRole>('member');
  const { data: members = [] } = useGetEmployerMembers();
  const { mutateAsync: inviteMember, isPending: isInviting } =
    useInviteOrganizationMember();
  const { mutateAsync: updateMemberRole, isPending: isUpdatingRole } =
    useUpdateOrganizationMemberRole();
  const { mutateAsync: removeMember, isPending: isRemovingMember } =
    useRemoveOrganizationMember();

  const filteredMembers = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return members;

    return members.filter((member) => {
      const name = member.user?.fullName?.toLowerCase() ?? '';
      const email = member.user?.email?.toLowerCase() ?? '';
      return (
        name.includes(term) ||
        email.includes(term) ||
        member.organizationRole.toLowerCase().includes(term)
      );
    });
  }, [members, search]);

  const openManageModal = (member: EmployerMemberListItem) => {
    setError('');
    setSelectedMember(member);
    setSelectedRole(member.organizationRole);
  };

  const handleInvite = async () => {
    if (!inviteEmail.trim()) {
      setError('Email is required.');
      return;
    }

    setError('');
    try {
      await inviteMember({
        email: inviteEmail.trim(),
        organizationRole: inviteRole,
      });
      setInviteEmail('');
      setInviteRole('member');
      setIsInviteOpen(false);
    } catch (inviteError) {
      setError(
        inviteError instanceof Error ? inviteError.message : 'Failed to invite member.',
      );
    }
  };

  const handleManageSave = async () => {
    if (!selectedMember) return;

    setError('');
    try {
      await updateMemberRole({
        memberId: selectedMember.id,
        data: { organizationRole: selectedRole },
      });
      setSelectedMember(null);
    } catch (updateError) {
      setError(
        updateError instanceof Error
          ? updateError.message
          : 'Failed to update member role.',
      );
    }
  };

  const handleRemoveMember = async () => {
    if (!selectedMember) return;

    setError('');
    try {
      await removeMember(selectedMember.id);
      setSelectedMember(null);
    } catch (removeError) {
      setError(
        removeError instanceof Error ? removeError.message : 'Failed to remove member.',
      );
    }
  };

  return (
    <div className="space-y-6">
      <EmployerWorkspaceHero
        title="Members"
        description="Manage access and responsibilities for your hiring team."
        actions={
          <>
            <Button variant="outline" asChild>
              <Link href={`/employer/${employerId}/org`}>Back to organization</Link>
            </Button>
            <Button onClick={() => setIsInviteOpen(true)}>
              <Plus className="mr-1 h-4 w-4" />
              Invite member
            </Button>
          </>
        }
        badges={[
          { label: 'Team size', value: members.length },
          {
            label: 'Owners/Admins',
            value: members.filter((member) => member.organizationRole !== 'member').length,
            variant: 'outline',
          },
        ]}
      />

      <Card className="border-border/80">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <CardTitle className="text-base">Team</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Search members..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
          <Separator />
          <div className="grid gap-3">
            {filteredMembers.length === 0 ? (
              <div className="rounded-lg border border-border/80 p-6 text-sm text-muted-foreground">
                No members yet.
              </div>
            ) : (
              filteredMembers.map((member) => (
                <div
                  key={member.id}
                  className="rounded-lg border border-border/80 p-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <div className="font-medium">
                      {member.user?.fullName ?? member.userId}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {member.user?.email ?? 'Unknown email'}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {member.organizationRole.toUpperCase()}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openManageModal(member)}
                    >
                      Manage
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Invite member</AlertDialogTitle>
            <AlertDialogDescription>
              Send an invitation and assign an initial organization role.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-3">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="invite-email">Email</Label>
              <Input
                id="invite-email"
                placeholder="member@company.com"
                value={inviteEmail}
                onChange={(event) => setInviteEmail(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Select
                value={inviteRole}
                onValueChange={(value) => setInviteRole(value as OrganizationRole)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="owner">Owner</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="member">Member</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel asChild>
                <Button
                  type="button"
                  variant="outline"
                  disabled={isInviting}
                  onClick={() => setError('')}
                >
                  Cancel
                </Button>
              </AlertDialogCancel>
              <Button type="button" disabled={isInviting} onClick={() => void handleInvite()}>
                {isInviting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Inviting...
                  </>
                ) : (
                  'Send invite'
                )}
              </Button>
            </AlertDialogFooter>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={Boolean(selectedMember)}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedMember(null);
            setError('');
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Manage member</AlertDialogTitle>
            <AlertDialogDescription>
              Update role permissions or remove the selected member.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-3">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="rounded-lg border p-3 text-sm">
              <div className="font-medium">
                {selectedMember?.user?.fullName ?? selectedMember?.userId}
              </div>
              <div className="text-muted-foreground">
                {selectedMember?.user?.email ?? 'Unknown email'}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Organization role</Label>
              <Select
                value={selectedRole}
                onValueChange={(value) => setSelectedRole(value as OrganizationRole)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="owner">Owner</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="member">Member</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-between gap-2">
              <Button
                type="button"
                variant="destructive"
                disabled={isRemovingMember || isUpdatingRole}
                onClick={() => void handleRemoveMember()}
              >
                {isRemovingMember ? 'Removing...' : 'Remove member'}
              </Button>
              <div className="flex gap-2">
                <AlertDialogCancel asChild>
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isRemovingMember || isUpdatingRole}
                  >
                    Cancel
                  </Button>
                </AlertDialogCancel>
                <Button
                  type="button"
                  disabled={isUpdatingRole || isRemovingMember}
                  onClick={() => void handleManageSave()}
                >
                  {isUpdatingRole ? 'Saving...' : 'Save'}
                </Button>
              </div>
            </div>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
