import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/auth/useAuth";
import EditProfileDialog from "@/components/profile/EditProfileDialog";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileStats from "@/components/profile/ProfileStats";
import ProfileTabs from "@/components/profile/ProfileTabs";
import { mockProfile } from "@/data/mockProfile";

// Identidade vem do usuário logado; o resto é mock até o endpoint de perfil existir.
// Salvar altera só o estado local por enquanto.
export default function Profile() {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [changes, setChanges] = useState({});

  const profile = {
    ...mockProfile,
    name: user.name,
    phone: user.phone,
    createdAt: user.created_at,
    verified: Boolean(user.email_verified_at),
    ...changes,
  };

  function handleSave(values) {
    setChanges(values);
    setEditing(false);
    toast.success("Perfil atualizado.");
  }

  return (
    <div className="flex w-full flex-col gap-6">
      <ProfileHeader
        profile={profile}
        isOwner
        onEdit={() => setEditing(true)}
      />
      <ProfileStats stats={profile.stats} createdAt={profile.createdAt} />
      <ProfileTabs profile={profile} isOwner />

      <EditProfileDialog
        open={editing}
        onOpenChange={setEditing}
        profile={profile}
        onSave={handleSave}
      />
    </div>
  );
}
