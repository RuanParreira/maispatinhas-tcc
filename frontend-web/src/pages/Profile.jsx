import { useCallback, useEffect, useState } from "react";
import { UserX } from "lucide-react";
import { toast } from "sonner";
import api from "@/api/axios";
import { useAuth } from "@/auth/useAuth";
import EditProfileDialog from "@/components/profile/EditProfileDialog";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileStats from "@/components/profile/ProfileStats";
import ProfileTabs from "@/components/profile/ProfileTabs";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
} from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";

function ProfileSkeleton() {
  return (
    <div className="flex w-full flex-col gap-6">
      <Skeleton className="h-80 rounded-2xl" />
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {[1, 2, 3, 4].map((item) => (
          <Skeleton key={item} className="h-22 rounded-2xl" />
        ))}
      </div>
    </div>
  );
}

// O dono lê o próprio perfil pelo endpoint público, para ver o mesmo que os outros.
export default function Profile() {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(false);
  const [editing, setEditing] = useState(false);

  const loadProfile = useCallback(
    () =>
      api
        .get(`/api/users/${user.id}`)
        .then((res) => {
          setProfile(res.data.data);
          setError(false);
        })
        .catch(() => setError(true)),
    [user.id],
  );

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  function handleAvatarChange(avatarUrl) {
    updateUser({ ...user, avatar_url: avatarUrl });
    setProfile((current) => ({ ...current, avatar_url: avatarUrl }));
  }

  async function handleSaved(updatedUser) {
    updateUser(updatedUser);
    await loadProfile();
    setEditing(false);
    toast.success("Perfil atualizado.");
  }

  if (error) {
    return (
      <Empty variant="outline">
        <EmptyHeader>
          <EmptyMedia variant="brand">
            <UserX />
          </EmptyMedia>
          <EmptyDescription>Não foi possível carregar o perfil.</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button type="button" variant="outline" onClick={loadProfile}>
            Tentar de novo
          </Button>
        </EmptyContent>
      </Empty>
    );
  }

  if (!profile) return <ProfileSkeleton />;

  return (
    <div className="flex w-full flex-col gap-6">
      <ProfileHeader
        profile={profile}
        isOwner
        onEdit={() => setEditing(true)}
      />
      <ProfileStats stats={profile.stats} memberSince={profile.member_since} />
      <ProfileTabs profile={profile} isOwner />

      <EditProfileDialog
        open={editing}
        onOpenChange={setEditing}
        user={user}
        profile={profile}
        onSaved={handleSaved}
        onAvatarChange={handleAvatarChange}
      />
    </div>
  );
}
