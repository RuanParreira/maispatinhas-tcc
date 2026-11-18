# Campo

Componentes `IconField` e `PasswordField` (`src/components/form/IconField.jsx`), montados sobre `Field` e `InputGroup` do shadcn. Para seleção de cidade, `CityCombobox` (`components/auth/`).

Estrutura:
- Rótulo (`FieldLabel`) em `text-xs tracking-wide`, com espaço à direita para uma ação ("Esqueci a senha").
- Entrada de 48px (`h-12`, `rounded-xl`) com ícone Lucide à esquerda, texto em `text-body` (15px) e contorno `border-input`.
- Erro em `FieldError` abaixo do campo; o `Field` recebe `data-invalid` e a entrada `aria-invalid`.
- `PasswordField` adiciona o botão de mostrar/ocultar senha e, com `showStrength`, a barra de segurança em quatro passos.
- Sem `label`, a linha do rótulo some: é o caso dos filtros (catálogo e busca da home), em que o campo leva `aria-label` e fica com 44px (`h-11`) ou 40px (`h-10`) para alinhar com os vizinhos.
- `CityCombobox` com `clearOnEdit={false}` (catálogo): a cidade anterior vale até escolher outra, o texto vem selecionado ao clicar e apagar o campo vale "Todo o Brasil". Nos formulários fica o padrão, que limpa ao editar para não salvar uma cidade velha.

**Faça**
- Rótulos curtos e concretos: "E-mail", "Nome do pet", "Data do ocorrido".
- Use o placeholder para exemplo ("Ex.: Thor"), nunca no lugar do rótulo.
- Quando o campo envolve dado pessoal, explique o uso ("Guardamos só o município, nunca o endereço.").
- Mostre o erro ao enviar, com a mensagem que diz como corrigir.

**Não faça**
- Não use campos de 32px (`Input` puro) em formulários de página; eles são para filtros e barras.
