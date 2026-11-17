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
import { PetCardSkeletonGrid } from "@/components/PetCardSkeleton";

// Mesma estrutura do ProfileHeader, ProfileStats e ProfileTabs, para a página não pular ao carregar.
function ProfileSkeleton() {
  return (
    <div
      role="status"
      aria-label="Carregando perfil"
      className="flex w-full flex-col gap-6"
    >
      <section className="overflow-hidden rounded-2xl bg-card shadow-xs">
        <Skeleton className="h-28 rounded-none sm:h-36" />
        <div className="flex flex-col gap-5 px-5 pb-6 sm:px-8">
          <div className="-mt-12 flex flex-wrap items-end justify-between gap-4 sm:-mt-14">
            <Skeleton className="size-24 rounded-full ring-4 ring-card sm:size-28" />
            <div className="flex gap-2">
              <Skeleton className="h-10 w-34 rounded-xl" />
              <Skeleton className="h-10 w-34 rounded-xl" />
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <Skeleton className="h-9 w-64 max-w-full" />
            <div className="flex flex-wrap gap-5">
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-4 w-44" />
            </div>
          </div>
          <Skeleton className="h-20 rounded-xl" />
        </div>
      </section>

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="flex items-center gap-4 rounded-2xl bg-card p-5 shadow-xs"
          >
            <Skeleton className="size-12 shrink-0 rounded-xl" />
            <div className="flex flex-1 flex-col gap-2">
              <Skeleton className="h-7 w-12" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        <Skeleton className="h-11 w-full max-w-md rounded-full" />
        <PetCardSkeletonGrid label="Carregando anúncios" />
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
