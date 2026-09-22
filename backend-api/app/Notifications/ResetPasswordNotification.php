<?php

namespace App\Notifications;

use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ResetPasswordNotification extends Notification
{
    public function __construct(public string $token) {}

    /**
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $url = sprintf(
            '%s/reset-password?token=%s&email=%s',
            rtrim(config('app.frontend_url'), '/'),
            $this->token,
            urlencode($notifiable->getEmailForPasswordReset()),
        );

        return (new MailMessage)
            ->subject('Redefinição de senha')
            ->greeting('Olá!')
            ->line('Você solicitou a redefinição da sua senha.')
            ->action('Redefinir senha', $url)
            ->line('Este link expira em '.config('auth.passwords.users.expire').' minutos.')
            ->line('Se você não solicitou isso, nenhuma ação é necessária.')
            ->salutation('Atenciosamente, '.config('app.name'));
    }
}
