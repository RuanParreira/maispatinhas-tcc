# Mensagem

O retorno ao usuário usa três componentes, conforme o momento.

| Situação | Componente | Exemplo real |
| --- | --- | --- |
| Resultado de uma ação | `toast` do Sonner (`ui/sonner.jsx`, montado em `main.jsx` no topo central) | `toast.success("Foto atualizada.")`, `toast.error("Não foi possível copiar o link.")` |
| Lista sem itens ou falha ao carregar | `Empty` (`ui/empty.jsx`) com `EmptyMedia variant="brand"` | "Meus anúncios" vazio, catálogo sem resultado |
| Erro de validação de campo | `FieldError` (`ui/field.jsx`), dentro do [[Campo]] | Mensagem do backend abaixo do campo |

Variantes do `Empty`: `card` (painel em `superficie` com sombra leve, para a área principal da página) e `outline` (borda tracejada, para abas e blocos dentro do perfil).

**Faça**
- Diga o que aconteceu e o que vem a seguir, em frases curtas.
- Em erro, diga como corrigir.
- No `Empty`, ofereça a próxima ação com um [[Botao]] ("Criar anúncio", "Tentar novamente").

**Não faça**
- Não use `ambar` em mensagens de atenção; o aviso é `warning`.
- Não use emoji nem ponto de exclamação duplo.
