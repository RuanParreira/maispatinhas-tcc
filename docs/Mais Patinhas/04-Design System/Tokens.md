# Tokens

Referência gerada de `tokens.json`. No frontend, use a classe do Tailwind indicada em [[Design System]]; aqui ficam os valores.

## Cores

| Token | Valor | Uso |
| --- | --- | --- |
| `--fundo` | `#fdf6ec` | Fundo da página (creme). Base de todas as telas de listagem; o contraste vem de claro/escuro dentro da família quente. |
| `--superficie` | `#fffcf7` | Cartões, painéis, campos de formulário e modais sobre `fundo`. |
| `--realce` | `#f3e3c9` | Realce suave: fundo de foto ausente, linha selecionada, botão desabilitado, bloco de destaque. Não usar como fundo de texto em `ocre`. |
| `--borda` | `#e8dcc6` | Divisórias, contorno de campos (`border-input`) e estados vazios tracejados. Cartões não têm borda: ficam sobre o creme com sombra leve. |
| `--ambar` | `#f0a93c` | Âmbar de ação: preenchimento do botão primário, item ativo e ícones de marca (`bg-primary`), com `tinta` por cima (7,6:1). Nunca como texto sobre creme (1,9:1); como texto só sobre fundo escuro (rodapé, tema escuro). |
| `--mel` | `#c98b3e` | Mel: preenchimento de etiquetas (espécie, porte, sexo) e estado hover/pressionado do botão primário, sempre com `tinta` por cima (5,2:1). Nunca como texto. |
| `--ocre` | `#b47818` | Reservado para palavras destacadas em títulos de 24px ou mais (`--chart-3`). Ainda não usado nas telas. Atinge só 3,5:1 em `fundo`. |
| `--tinta` | `#2e2418` | Tinta: títulos, corpo de texto e texto sobre `ambar`, `mel` e fundos de estado. 14,2:1 em `fundo`, 12,0:1 em `realce`. |
| `--tinta-suave` | `#706455` | Texto secundário (raça, cidade, data, legendas, placeholder): 5,4:1 em `fundo`, 5,6:1 em `superficie` e 4,6:1 em `realce`. Valor do `--muted-foreground`; escurecido do briefing (#7c6f60) para passar 4,5:1 também sobre os fundos bege. |
| `--foco` | `{aviso}` | Foco de qualquer controle: borda nesta cor mais anel sólido de 1px (`ring-1 ring-ring`), contorno de 2px. No frontend é `--ring`. Segue o `aviso` (5,5:1 em `fundo`, 4,6:1 em `realce`). |
| `--sucesso` | `#4e7a55` | Sucesso: ícone, ponto e borda de mensagens (anúncio ativo, pedido enviado). Como texto, só sobre `fundo`/`superficie` (4,6:1); sobre `sucesso-fundo` fica em 4,1:1, então o texto da mensagem vai em `tinta`. |
| `--sucesso-fundo` | `#e3ede1` | Fundo de selos e blocos de sucesso, com texto em `tinta` e ícone em `sucesso`. |
| `--erro` | `#a8432f` | Erro: ícone, borda e texto de validação (4,8:1 em `erro-fundo`, 5,6:1 em `fundo`); anúncio rejeitado. |
| `--erro-fundo` | `#f6e1da` | Fundo de mensagens e selos de erro. |
| `--aviso` | `#8a5b10` | Ocre escuro com dois papéis: (1) cor de links e destaques em texto — "Conhecer", "Esqueci a senha", raça no cartão, rótulos de seção (`text-warning`, 5,5:1 em `fundo`); (2) estado de aviso, sempre com palavra ou ícone e o fundo `aviso-fundo`. Nunca troque por `ambar`. |
| `--aviso-fundo` | `#f7e7c4` | Fundo de mensagens e selos de aviso. |
| `--info` | `#40616f` | Informação: ícone, borda e texto (5,4:1 em `info-fundo`); anúncio resolvido, dicas e conteúdo educativo. |
| `--info-fundo` | `#dfe9ec` | Fundo de mensagens e selos informativos. |

## Espaçamento

| Token | Valor | Uso |
| --- | --- | --- |
| `--espaco-1` | `4px` | Folga entre ícone e texto; entre etiquetas empilhadas. |
| `--espaco-2` | `8px` | Entre etiquetas lado a lado; entre rótulo e campo. |
| `--espaco-3` | `12px` | Padding vertical de botões e campos; entre linhas de meta do cartão. |
| `--espaco-4` | `16px` | Padding de cartões e mensagens; margem lateral no celular. |
| `--espaco-6` | `24px` | Gutter da grade do catálogo; padding de painéis e modais. |
| `--espaco-8` | `32px` | Entre blocos dentro de uma seção. |
| `--espaco-12` | `48px` | Entre seções da página. |
| `--espaco-16` | `64px` | Respiro do herói e topo de páginas. |

## Raios

| Token | Valor | Uso |
| --- | --- | --- |
| `--raio-sm` | `6px` | Checkbox e miniaturas (`rounded-sm`). |
| `--raio-md` | `10px` | Botões e campos de 32–40px de altura (`rounded-lg`, o `--radius`). |
| `--raio-lg` | `14px` | Botões `toolbar`, `field` e `xl`, campos de 48px, blocos internos e listas suspensas (`rounded-xl`). |
| `--raio-xl` | `18px` | Cartões de pet e de anúncio, painéis de configuração, estados vazios, foto do login (`rounded-2xl`). |
| `--raio-2xl` | `22px` | Blocos de destaque da home: foto do herói, chamada final, moldura da 404 (`rounded-3xl`). |
| `--raio-pilula` | `999px` | Selos, chips de filtro, avatares e botão de favoritar (`rounded-full`). |

## Sombras

| Token | Valor | Uso |
| --- | --- | --- |
| `--sombra-cartao` | `0 1px 2px 0 rgb(0 0 0 / 0.05)` | Cartões e painéis em repouso, botões grandes, selos sobre foto (`shadow-xs`). |
| `--sombra-cartao-hover` | `0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)` | Hover de cartão clicável, busca e chamada final da home, popovers (`shadow-md`). |
| `--sombra-flutuante` | `0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)` | Listas suspensas, `Select`, `Sheet`, foto do login (`shadow-lg`). A foto do herói usa `shadow-xl`. |

## Tipografia

| Estilo | Família | Tamanho / altura | Peso | Uso |
| --- | --- | --- | --- | --- |
| `.heroi` | `--font-display` | 56px / 1.04 | 400 | Herói, uma vez por tela. `text-5xl` (48px) no celular e `text-hero` (56–64px) a partir de `sm`, com `tracking-tight`. |
| `.titulo-secao` | `--font-display` | 36px / 1.1 | 400 | Títulos de seção da home e da 404 (`text-section`, 32–40px). |
| `.titulo-pagina` | `--font-display` | 36px / 1.25 | 400 | Título das páginas internas, do login e nome no perfil (`text-4xl`). |
| `.titulo-painel` | `--font-display` | 24px / 1.25 | 400 | Título de painel de configuração, de estado vazio e do chat (`text-2xl`). |
| `.titulo-card` | `--font-display` | 20px / 1.4 | 400 | Nome do pet e título do anúncio nos cartões (`text-xl leading-7`); também a marca "Mais Patinhas" no cabeçalho. 20px é o mínimo da serifa. |
| `.numero-destaque` | `--font-display` | 30px / 1 | 400 | Indicadores do perfil público (`text-3xl leading-none`). |
| `.subtitulo` | `--font-sans` | 18px / 1.625 | 400 | Subtítulo sob o herói (`text-lg leading-relaxed`), em `tinta-suave`. |
| `.corpo` | `--font-sans` | 15px / 1.7 | 400 | Padrão do `body` (`text-body`) e do texto digitado nos campos. |
| `.corpo-compacto` | `--font-sans` | 14px / 1.5 | 400 | Textos de interface em painéis de configuração, chat, listas e botões (`text-sm`). |
| `.legenda` | `--font-sans` | 13px / 1.54 | 400 | Meta e descrição curta nos cartões, textos de apoio (`text-[0.8125rem] leading-5`), em `tinta-suave`. |
| `.apoio` | `--font-sans` | 12px / 1.33 | 400 | Erros de campo, dicas, horários e dados secundários (`text-xs`). |
| `.botao` | `--font-sans` | 14px / 1.2 | 500 | Botões `default` a `md` (`text-sm font-medium`). Os tamanhos `field` e `xl` sobem para 16px em 600. |
| `.rotulo` | `--font-sans` | 11px / 1.4 | 600 | Rótulos de seção e categorias (`text-label font-semibold uppercase`). Rótulos de campo usam `text-xs tracking-wide`, sem caixa alta. |
| `.dado` | `--font-mono` | 13px / 1.5 | 400 | Códigos e valores técnicos em documentação e no painel administrativo. Nunca em telas do adotante. |
