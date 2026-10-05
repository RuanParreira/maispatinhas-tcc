import { KeyRound, Mail, MonitorSmartphone, TriangleAlert } from "lucide-react";
import AccountOverview from "@/components/settings/AccountOverview";
import DeleteAccountDialog from "@/components/settings/DeleteAccountDialog";
import EmailForm from "@/components/settings/EmailForm";
import PasswordForm from "@/components/settings/PasswordForm";
import SessionsCard from "@/components/settings/SessionsCard";
import {
  SettingsBody,
  SettingsCard,
  SettingsFooter,
} from "@/components/settings/SettingsCard";

export default function Settings() {
  return (
    <div className="flex w-full flex-col gap-6">
      <AccountOverview />

      <div className="grid gap-6 xl:grid-cols-2">
        <SettingsCard
          icon={KeyRound}
          title="Senha"
          description="Use uma senha forte que você não usa em outros sites."
        >
          <PasswordForm />
        </SettingsCard>

        <SettingsCard
          icon={Mail}
          title="E-mail"
          description="Usado para entrar e receber avisos da plataforma."
        >
          <EmailForm />
        </SettingsCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <SettingsCard
          icon={MonitorSmartphone}
          title="Sessões ativas"
          description="Dispositivos conectados à sua conta agora."
          className="xl:col-span-2"
        >
          <SessionsCard />
        </SettingsCard>

        <SettingsCard
          icon={TriangleAlert}
          title="Zona de perigo"
          description="Ações permanentes, sem como desfazer."
          tone="danger"
        >
          <SettingsBody className="gap-1">
            <p className="font-medium">Excluir conta</p>
            <p className="text-sm text-muted-foreground">
              Seus dados pessoais são apagados e anúncios abertos cancelados.
              Avaliações ficam anônimas.
            </p>
          </SettingsBody>
          <SettingsFooter hint="Exige confirmação com senha.">
            <DeleteAccountDialog />
          </SettingsFooter>
        </SettingsCard>
      </div>
    </div>
  );
}
