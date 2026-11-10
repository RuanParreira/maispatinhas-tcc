# Etiqueta

Componente `Badge` (`src/components/ui/badge.jsx`): pílula pequena que classifica o anúncio e o animal nos cartões. A situação do anúncio usa o mesmo componente, mas segue [[StatusAnuncio]].

| Uso | `variant` | Exemplo |
| --- | --- | --- |
| Tipo do anúncio | `success`, `destructive`, `info` (de `postTypes` em `lib/posts.js`) | "Adoção", "Perdido", "Encontrado" |
| Disponibilidade no catálogo | `success` | "Disponível para adoção" |
| Atributo do animal | `muted` (contorno `borda`, texto `tinta-suave`) | "Porte médio" |
| Destaque de marca | `default` (`ambar`) | Contadores e novidades |

Sobre foto, a etiqueta ganha `h-6 px-3 shadow-xs` e fica no canto superior esquerdo.

**Faça**
- Uma ou duas palavras, em caixa de frase: "Porte médio", "Fêmea".
- Use os mesmos termos dos filtros do catálogo.

**Não faça**
- Não use etiqueta para a situação do anúncio fora do mapa de [[StatusAnuncio]].
