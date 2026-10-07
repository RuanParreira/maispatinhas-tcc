import { useCallback, useEffect, useState } from "react";
import { UserX } from "lucide-react";
import { Link, useParams } from "react-router-dom";
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
  EmptyTitle,
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

// Todo perfil, inclusive o próprio, fica em /users/:id, para o link compartilhado
// funcionar para qualquer pessoa. A key recria a página ao trocar de perfil, para
// não sobrar dados nem abas do anterior.
export default function Profile() {
  const { id } = useParams();
  const { user } = useAuth();

  return <ProfilePage key={id} userId={id} isOwner={String(user.id) === id} />;
}

// O dono também lê pelo endpoint público, para ver o mesmo que os outros.
function ProfilePage({ userId, isOwner }) {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);

  const loadProfile = useCallback(
    () =>
      api
        .get(`/api/users/${userId}`)
        .then((res) => {
          setProfile(res.data.data);
          setError(null);
        })
        .catch((err) =>
          setError(err.response?.status === 404 ? "not_found" : "failed"),
        ),
    [userId],
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

  if (error === "not_found") {
    return (
      <Empty variant="outline">
        <EmptyHeader>
          <EmptyMedia variant="brand">
            <UserX />
          </EmptyMedia>
          <EmptyTitle>Perfil não encontrado</EmptyTitle>
          <EmptyDescription>
            Esta conta não existe ou foi removida.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button asChild variant="outline">
            <Link to="/adoptions">Ver anúncios</Link>
          </Button>
        </EmptyContent>
      </Empty>
    );
  }

  if (error) {
    return (
      <Empty variant="outline">
        <EmptyHeader>
          <EmptyMedia variant="brand">
            <UserX />
          </EmptyMedia>
          <EmptyDescription>
            Não foi possível carregar o perfil.
          </EmptyDescription>
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
        isOwner={isOwner}
        onEdit={() => setEditing(true)}
      />
      <ProfileStats stats={profile.stats} memberSince={profile.member_since} />
      <ProfileTabs profile={profile} isOwner={isOwner} />

      {isOwner && (
        <EditProfileDialog
          open={editing}
          onOpenChange={setEditing}
          user={user}
          profile={profile}
          onSaved={handleSaved}
          onAvatarChange={handleAvatarChange}
        />
      )}
    </div>
  );
}
