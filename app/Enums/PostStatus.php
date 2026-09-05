<?php

namespace App\Enums;

/**
 * Transições válidas em "Fluxo Status de Anuncio" no vault.
 */
enum PostStatus: string
{
    case Rascunho = 'rascunho';
    case PendenteAprovacao = 'pendente_aprovacao';
    case Rejeitado = 'rejeitado';
    case Ativo = 'ativo';
    case Pausado = 'pausado';
    case Expirado = 'expirado';
    case Resolvido = 'resolvido';
    case Encerrado = 'encerrado';
    case Cancelado = 'cancelado';
}
