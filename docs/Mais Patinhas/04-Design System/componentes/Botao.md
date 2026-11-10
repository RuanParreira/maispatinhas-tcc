# Botao

Componente `Button` (`src/components/ui/button.jsx`). Aceita `asChild` para virar um `Link` sem perder o estilo.

| Variante | `variant` | Quando usar |
| --- | --- | --- |
| Primário | `default` | A ação principal da tela: "Encontrar um pet", "Entrar", "Salvar". Fundo `ambar`, texto `tinta`. |
| Contorno | `outline` | Ação de apoio ao lado do primário: "Quero anunciar um pet". |
| Secundário | `secondary` | Ações neutras em painéis: "Tentar novamente", filtros. Fundo `realce`. |
| Fantasma | `ghost` | Ações de baixo peso e botões de ícone: favoritar, fechar, menus. |
| Perigo | `destructive` | Ações destrutivas: "Excluir conta". Sempre com confirmação em `Dialog`. |
| Link | `link` | Ação em linha de texto, em `text-warning` sublinhado no hover. |

| `size` | Altura | Uso |
| --- | --- | --- |
| `default`, `sm`, `xs` | 32 / 28 / 24px | Barras compactas e painéis internos |
| `lg` | 36px | Ações em cabeçalhos de painel |
| `md` | 40px | Padrão das páginas |
| `toolbar` | 44px | Barras de filtro |
| `field` | 48px | Envio de formulário, alinhado aos campos de 48px |
| `xl` | 56px | Herói e chamadas da home |
| `icon`, `icon-sm`, `icon-lg` | 32 / 28 / 36px | Botões só com ícone, sempre com `aria-label` |

**Faça**
- Escreva o verbo da ação em caixa normal: "Quero adotar", não "QUERO ADOTAR" nem "Clique aqui".
- Em telas de toque, o botão já ganha área de clique de 44px; não aumente o tamanho só por isso.
- Ícone Lucide antes ou depois do texto; a seta `arrow-right` desliza 2px no hover.

**Não faça**
- Não coloque dois primários lado a lado; o segundo vira `outline`.
- Não use o âmbar para avisos — avisos usam `warning`.
