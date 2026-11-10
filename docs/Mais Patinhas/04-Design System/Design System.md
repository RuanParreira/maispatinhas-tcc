---
title: Design System
tags:
  - design
---

# Design System — Mais Patinhas

Identidade visual e componentes de interface do sistema "Mais Patinhas". Substitui o briefing "Aconchego · Paleta e tipografia v1", cuja paleta e tipografia foram mantidas sem alteração.

Este guia descreve o que o `frontend-web` implementa. Os componentes são os do próprio frontend (React, Tailwind 4 e shadcn/ui); quando o código e o guia divergirem, o guia é que deve ser atualizado, exceto nas regras de acessibilidade marcadas como obrigatórias.

- **Atualizado em:** 10/11/2026

## Arquivos desta pasta

| Arquivo | Conteúdo |
| --- | --- |
| `Design System.md` | Este guia: princípios, voz, cor, tipografia, espaço, imagens, ícones e uso no frontend |
| `Design System - Mais Patinhas.pdf` | Versão diagramada deste guia, para entrega e impressão |
| [[Tokens]] | Tabela de referência de todos os tokens |
| `tokens.json` | Tokens em formato de dados (fonte da verdade da documentação) |
| `tokens.css` | Tokens como variáveis CSS e classes de tipografia, para uso fora do frontend |
| `componentes/*.md` | Diretrizes de cada componente do frontend |

Uma família quente única — creme, âmbar e marrom — com títulos em Instrument Serif e interface em Public Sans. A paleta foi amostrada da tela inicial aprovada: creme do fundo, âmbar do botão, mel do pelo, bege do sofá e marrom escuro do título. Não existe segunda cor de marca: o contraste vem da variação de claro e escuro dentro da mesma faixa, o que mantém a interface calma em telas longas de listagem.

## Princípios

- **Acolhedor, não infantil.** É uma plataforma de adoção responsável: tom caloroso, mas sério. Nada de emoji, mascotes ou exclamações em série.
- **O animal em primeiro plano.** Foto e nome do pet são o que a pessoa procura; a interface recua para o creme.
- **Confiança visível.** Situação do anúncio, e-mail verificado, avaliações e motivo de rejeição sempre explícitos, com palavra e cor.
- **Camadas suaves.** Cartões e painéis em `superficie` sobre o creme, com sombra leve e cantos bem arredondados; bordas ficam para divisórias, campos e estados vazios.

## Conteúdo e voz

- Português do Brasil, tratando o usuário por **você**. A plataforma fala em primeira pessoa do plural só quando age: "Guardamos só o município, nunca o endereço."
- Frases curtas, em caixa de frase: "Criar anúncio", "Meus anúncios", "Aguardando moderação". Caixa alta só em rótulos de seção, e é o CSS que transforma.
- Botões dizem a ação com verbo: "Quero adotar", "Encontrar um pet", "Publicar anúncio". Nunca "Clique aqui" ou "OK".
- Avisos dizem o que aconteceu e o próximo passo: "Senha redefinida. Entre com a nova senha." / "Não foi possível copiar o link."
- Use os nomes do sistema: anúncio (de adoção, de animal perdido, de animal encontrado), finais felizes, doador, adotante, anunciante, interessado, moderador.
- Sem emoji em nenhuma tela.

## Cor

| Papel | Token | Classe | Regra |
| --- | --- | --- | --- |
| Fundo da página | `fundo` | `bg-background` | Creme base de todas as telas. |
| Cartões, campos, modais | `superficie` | `bg-card`, `bg-popover` | Sobre `fundo`, com sombra leve. |
| Realce suave | `realce` | `bg-secondary`, `bg-muted` | Foto ausente, chips, item selecionado, barra lateral. |
| Divisórias e contornos | `borda` | `border-border`, `border-input` | Divisórias, campos, estados vazios tracejados. |
| Ação | `ambar` | `bg-primary` | Só preenchimento, com `tinta` por cima. |
| Etiquetas e realce de marca | `mel` | `bg-accent` | Só preenchimento, com `tinta` por cima. |
| Links e destaques em texto | `aviso` | `text-warning` | "Conhecer", "Esqueci a senha", rótulos de seção, raça no cartão. |
| Texto | `tinta`, `tinta-suave` | `text-foreground`, `text-muted-foreground` | Principal e secundário. |

**Regra de contraste (obrigatória).** O âmbar só aparece como preenchimento com `tinta` por cima (7,6:1) — nunca como texto sobre creme, onde fica em 1,9:1. Como texto, só sobre fundo escuro (rodapé, tema escuro). Para texto colorido sobre o creme, use `text-warning` (5,5:1). `tinta-suave` passa 4,5:1 em `fundo`, `superficie` e `realce`; sobre fundos com transparência, só use texto com opacidade (`text-foreground/70`) se a combinação passar 4,5:1.

**Estados.** Cada estado tem um par: o tom forte (`success`, `destructive`, `warning`, `info`) para ícone, ponto e texto; o claro (`*-subtle`) para o fundo. Sobre `success-subtle` o texto vai em `tinta` (o verde fica em 4,1:1) e só o ícone é verde. Estado nunca é comunicado só pela cor — sempre há uma palavra ("Publicado", "Rejeitado").

**Foco (obrigatório).** No foco, a borda do controle passa para `--ring` e ganha um anel sólido de 1px (`focus-visible:border-ring ring-1 ring-ring`), formando um contorno de 2px. No tema claro, `--ring` é o `aviso` (5,5:1 em `fundo`).

## Tipografia

| Nível | Estilo | Classe | Tamanho | Uso |
| --- | --- | --- | --- | --- |
| Herói | `heroi` | `text-5xl sm:text-hero tracking-tight` | 48 / 56–64 | Uma vez por tela |
| Título de seção | `titulo-secao` | `text-section` | 32–40 / 1.1 | Seções da home e da 404 |
| Título de página | `titulo-pagina` | `text-4xl` | 36 / 1.25 | Páginas internas, login, nome no perfil |
| Título de painel | `titulo-painel` | `text-2xl` | 24 / 1.25 | Painéis de configuração, modais, estados vazios, chat |
| Título de cartão | `titulo-card` | `text-xl leading-7` | 20 / 1.4 | Nome do pet, título do anúncio, marca |
| Número de destaque | `numero-destaque` | `text-3xl leading-none` | 30 / 1 | Indicadores do perfil |
| Subtítulo | `subtitulo` | `text-lg leading-relaxed` | 18 / 1.625 | Texto sob o herói |
| Corpo | `corpo` | `text-body` | 15 / 1.7 | Padrão do `body` e dos campos |
| Corpo compacto | `corpo-compacto` | `text-sm` | 14 / 1.5 | Painéis, chat, listas, botões |
| Legenda | `legenda` | `text-[0.8125rem] leading-5` | 13 / 1.54 | Meta e descrição curta nos cartões |
| Apoio | `apoio` | `text-xs` | 12 / 1.33 | Erros de campo, dicas, horários, dados secundários |
| Rótulo | `rotulo` | `text-label font-semibold uppercase` | 11 · 0,16em | Rótulos de seção, categorias |

- **Instrument Serif** (`font-heading`, aplicada a `h1`–`h3`): títulos, nomes de pets, marca e números de destaque. Peso único, regular. Nunca abaixo de 20px.
- **Public Sans** (`font-sans`): todo o resto. Abaixo de 12px, só rótulos de seção (`text-label`).
- **Noto Sans Mono** (`--font-mono`, estilo `dado`): só para códigos e medidas em documentação e no painel administrativo.
- No frontend, as fontes vêm dos pacotes `@fontsource-variable/public-sans` e `@fontsource/instrument-serif` (regular e itálico). Fora dele, use o Google Fonts:
  `https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Public+Sans:wght@300;400;600&family=Noto+Sans+Mono&display=swap`

## Espaço, raio e camadas

- Escala de espaço do Tailwind (múltiplos de 4px). Cartões com `p-6`; grade de cartões com `gap-6`; seções da home com `py-12` a `py-16`.
- Raios (ver [[Tokens]]): `rounded-lg` (10px) em botões e campos pequenos, `rounded-xl` (14px) em botões e campos grandes, `rounded-2xl` (18px) em cartões e painéis, `rounded-3xl` (22px) em blocos de destaque da home, `rounded-full` em selos, chips e avatares.
- Sombras: `shadow-xs` em cartões e painéis em repouso, `shadow-md` no hover de cartão clicável e em blocos que flutuam sobre a página, `shadow-lg` em listas suspensas e painéis laterais.
- Cabeçalhos fixos usam `bg-background/80` com `backdrop-blur` e uma sombra de 1px.
- Layout: conteúdo em até `max-w-7xl`, margem lateral `px-6` no celular e `lg:px-12` no desktop.
- Movimento: transições de cor em hover e foco; elevação de sombra no hover dos cartões; seta de "Conhecer" e de botões desliza 2px no hover; botão desce 1px ao ser pressionado; ponto pulsante no selo "Aguardando moderação". Modais, painéis laterais, listas suspensas e dicas entram e saem com o fade padrão do shadcn; carregamento usa `Skeleton` (pulso) e `Spinner` (giro); ao trocar filtro ou página, a lista atual esmaece para 60% até o novo resultado chegar. Nada além disso.

## Imagens

- Fotos reais dos animais, enviadas pelos anunciantes (WebP, até 5 por anúncio), em `object-cover` com 280px de altura nos cartões (`h-70`).
- Sem foto, mostre o bloco `realce` com o ícone `paw-print` — não use foto genérica de outro animal.
- Nunca aplique filtros de cor sobre as fotos. Exceção: anúncio aguardando moderação, que aparece esmaecido em "Meus anúncios".
- Texto sobre foto (login, 404) vai em branco sobre degradê escuro.

## Iconografia

- **Lucide** (`lucide-react`), traço padrão de 2px, cantos arredondados.
- Tamanhos: 16px (`size-4`) dentro de botões e junto de texto, 14px (`size-3.5`) na meta do cartão, 18px (`size-4.5`) nos campos.
- Cor por `currentColor`, herdando a cor do texto ou do estado. Ícone sozinho sempre leva `aria-label`.
- Ícones recorrentes: `heart` (favoritar), `map-pin` (cidade), `message-circle` (chat), `paw-print` (anúncios e foto ausente), `mail-check` (e-mail verificado), `star` (avaliações), `arrow-right` (seguir).
- Sem emoji como ícone.

## Marca

Logotipo em `src/assets/logo.png` (patinha em âmbar), com 32px (`size-8`) e `alt=""`, seguido do nome "Mais Patinhas" em Instrument Serif, regular, em `tinta` (`font-heading text-xl`); o link em volta leva o `aria-label`. Não reutilize a marca "A" do briefing "Aconchego", que era o nome provisório da paleta.

## Componentes

Componentes base em `src/components/ui/` (shadcn/ui, ajustados à paleta) e componentes do domínio em `src/components/`.

| Componente | Arquivo | Onde aparece |
| --- | --- | --- |
| [[Botao]] | `ui/button.jsx` | Ações de todas as telas |
| [[Etiqueta]] | `ui/badge.jsx` | Tipo do anúncio, porte, atributos do pet |
| [[StatusAnuncio]] | `ui/badge.jsx` + `lib/posts.js` | Meus anúncios, moderação |
| [[Mensagem]] | `ui/sonner.jsx`, `ui/empty.jsx`, `ui/field.jsx` | Retorno de ações, listas vazias, erros de campo |
| [[Campo]] | `form/IconField.jsx` | Login, cadastro, configurações |
| [[CartaoPet]] | `PetCard.jsx`, `PostCard.jsx` | Catálogo, Meus anúncios, home, perfil |

Demais componentes do shadcn usados sem alteração de estilo: `Dialog`, `Sheet`, `Select`, `Tabs`, `ToggleGroup`, `Popover`, `Command`, `Tooltip`, `Avatar`, `Pagination`, `Sidebar`, `Skeleton`, `Spinner`; no chat, `Bubble` e `Message`.

## Tema escuro

O `src/index.css` já define as variáveis de um tema escuro (classe `.dark`): fundo marrom quase preto, cartões um tom acima, texto creme, âmbar mantido no primário e no foco, estados clareados. Ainda não há como ativá-lo na interface, por isso ele não faz parte deste guia.

## Área de toque

Em telas de toque (`pointer: coarse`), todo `Button` ganha uma área de clique invisível de pelo menos 44 × 44px, centrada no botão, sem mudar o tamanho visível. Por isso os tamanhos compactos (`default`, `sm`, `xs`, `icon-sm`) podem ser usados também no celular.
