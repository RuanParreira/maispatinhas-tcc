import { useEffect, useState } from "react";
import { Phone, User } from "lucide-react";
import api from "@/api/axios";
import CityCombobox from "@/components/auth/CityCombobox";
import AvatarField from "@/components/profile/AvatarField";
import { IconField } from "@/components/form/IconField";
import { formatPhone } from "@/lib/phone";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";

const BIO_MAX = 500;

function EditProfileForm({ user, profile, onSaved, onAvatarChange, onCancel }) {
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(formatPhone(user.phone ?? ""));
  const [municipalityId, setMunicipalityId] = useState(user.municipality_id);
  const [bio, setBio] = useState(user.bio ?? "");
  const [municipalities, setMunicipalities] = useState([]);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.get("/api/municipalities").then((res) => setMunicipalities(res.data));
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setErrors({});
    setSubmitting(true);

    try {
      const { data } = await api.put("/api/user/profile", {
        name,
        phone,
        bio,
        municipality_id: municipalityId,
      });
      onSaved(data);
    } catch (err) {
      setErrors(
        err.response?.data?.errors ?? { name: ["Erro ao salvar o perfil."] },
      );
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <DialogHeader>
        <DialogTitle>Editar perfil</DialogTitle>
        <DialogDescription>
          Nome, cidade e bio aparecem para todos. O telefone fica visível só
          para você.
        </DialogDescription>
      </DialogHeader>

      <AvatarField
        name={user.name}
        avatarUrl={user.avatar_url}
        onChange={onAvatarChange}
      />

      <IconField
        id="profile_name"
        label="Nome completo"
        icon={User}
        autoComplete="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        error={errors.name?.[0]}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <IconField
          id="profile_phone"
          label="Telefone"
          icon={Phone}
          type="tel"
          autoComplete="tel"
          inputMode="numeric"
          placeholder="(16) 99999-9999"
          value={phone}
          onChange={(e) => setPhone(formatPhone(e.target.value))}
          error={errors.phone?.[0]}
        />

        <CityCombobox
          id="profile_municipality"
          label="Cidade / Estado"
          municipalities={municipalities}
          value={municipalityId}
          initialLabel={`${profile.municipality.name} - ${profile.municipality.state}`}
          onChange={setMunicipalityId}
          error={errors.municipality_id?.[0]}
        />
      </div>

      <Field data-invalid={Boolean(errors.bio)} className="gap-1.5">
        <div className="flex items-center justify-between gap-3">
          <FieldLabel htmlFor="profile_bio" className="text-xs tracking-wide">
            Sobre você
          </FieldLabel>
          <span className="text-[0.6875rem] text-muted-foreground">
            {bio.length}/{BIO_MAX}
          </span>
        </div>
        <Textarea
          id="profile_bio"
          rows={5}
          maxLength={BIO_MAX}
          placeholder="Sua casa, sua rotina, sua experiência com animais..."
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          aria-invalid={Boolean(errors.bio)}
          className="min-h-28 rounded-xl px-4 py-3"
        />
        {errors.bio && (
          <FieldError className="text-xs">{errors.bio[0]}</FieldError>
        )}
      </Field>

      <DialogFooter>
        <Button
          type="button"
          variant="ghost"
          size="md"
          onClick={onCancel}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={submitting || !name.trim() || !municipalityId}
          size="md"
        >
          {submitting && <Spinner />}
          Salvar alterações
        </Button>
      </DialogFooter>
    </form>
  );
}

export default function EditProfileDialog({
  open,
  onOpenChange,
  user,
  profile,
  onSaved,
  onAvatarChange,
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl!">
        {open && (
          <EditProfileForm
            user={user}
            profile={profile}
            onSaved={onSaved}
            onAvatarChange={onAvatarChange}
            onCancel={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
