import { useState } from "react";
import { Phone, User } from "lucide-react";
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
import { Field, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";

const BIO_MAX = 500;

function EditProfileForm({ profile, onSave, onCancel }) {
  const [name, setName] = useState(profile.name);
  const [phone, setPhone] = useState(formatPhone(profile.phone ?? ""));
  const [bio, setBio] = useState(profile.bio ?? "");

  function handleSubmit(e) {
    e.preventDefault();
    onSave({ name: name.trim(), phone, bio: bio.trim() });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <DialogHeader>
        <DialogTitle>Editar perfil</DialogTitle>
        <DialogDescription>
          Nome e bio aparecem para todos. O telefone fica visível só para você.
        </DialogDescription>
      </DialogHeader>

      <IconField
        id="profile_name"
        label="Nome completo"
        icon={User}
        autoComplete="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

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
      />

      <Field className="gap-1.5">
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
          className="min-h-28 rounded-xl px-4 py-3"
        />
      </Field>

      <DialogFooter>
        <Button
          type="button"
          variant="ghost"
          className="h-10 px-4"
          onClick={onCancel}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={!name.trim()} className="h-10 px-4">
          Salvar alterações
        </Button>
      </DialogFooter>
    </form>
  );
}

export default function EditProfileDialog({
  open,
  onOpenChange,
  profile,
  onSave,
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        {open && (
          <EditProfileForm
            profile={profile}
            onSave={onSave}
            onCancel={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
