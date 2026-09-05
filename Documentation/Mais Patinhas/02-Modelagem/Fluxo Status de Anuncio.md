---
title: Fluxo de Status de Anúncio
tags:
  - modelagem
---

```mermaid
stateDiagram-v2
    [*] --> RASCUNHO
    RASCUNHO --> PENDENTE_APROVACAO
    PENDENTE_APROVACAO --> REJEITADO
    PENDENTE_APROVACAO --> APROVADO
    REJEITADO --> CANCELADO
    APROVADO --> ATIVO
    ATIVO --> RESOLVIDO
    RESOLVIDO --> ENCERRADO
    ENCERRADO --> [*]
```

Ver [[Tipos Anuncio]] para os tipos de post que seguem este fluxo.
