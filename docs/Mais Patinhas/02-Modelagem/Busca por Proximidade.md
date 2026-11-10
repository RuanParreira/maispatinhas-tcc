---
title: Busca por Proximidade
tags:
  - modelagem
  - localizacao
aliases:
  - Municípios
  - Filtro por Região
---

# Busca por Proximidade

Como o sistema mostra primeiro os anúncios da cidade do usuário e depois os da região (ex.: quem mora em Uberaba vê Uberaba, depois Delta, Igarapava, Conceição das Alagoas...).

> **Situação (nov/2026):** a tabela `municipalities` e o `municipality_id` em `users` e `posts` já estão no código. A busca por raio descrita abaixo ainda **não foi implementada**: hoje o catálogo só filtra pelo nome da cidade, no navegador.

## Decisão

- A localização é guardada **por município**, nunca pelo endereço exato do usuário.
- Existe uma tabela de referência `municipalities` com o código IBGE e a latitude/longitude do centro de cada cidade.
- `users` e `posts` guardam apenas `municipality_id` (FK para `municipalities.ibge_code`). Nome da cidade e UF vêm do JOIN, sem duplicar dado.
- A distância é calculada no próprio MySQL, em linha reta, com `ST_Distance_Sphere`. Nenhuma API externa é consultada na hora da busca.
- A origem da busca é um parâmetro. O município do usuário é só o valor padrão, então visitante sem login ou quem procura em outra cidade também consegue buscar.

### Por que não guardar lat/long do usuário

Latitude e longitude tiradas do CEP apontam praticamente para a casa da pessoa. É dado pessoal sensível (LGPD) e não melhora o resultado: para "cidade e região", precisão de município basta.

### Por que raio em km e não região do IBGE

A "região imediata" do IBGE tem fronteira fixa e não cruza divisa de estado. Uberaba fica perto de SP (Igarapava a 38 km, Aramina a 41 km), e um animal perdido não respeita divisa.

## Fonte dos dados

**Repositório:** https://github.com/kelvins/municipios-brasileiros

- Licença MIT, mantido ativamente (último push em dez/2025).
- Arquivo de origem: `csv/municipios.csv`, texto puro. Não é preciso rodar nenhum script do repositório.
- 5571 municípios, lista conferida código por código contra a API oficial do IBGE (`servicodados.ibge.gov.br/api/v1/localidades/municipios`) em 18/09/2026: idêntica.
- Colunas na origem: `codigo_ibge, nome, latitude, longitude, capital, codigo_uf, siafi_id, ddd, fuso_horario`.
- Na origem a UF vem como código numérico (`31`), não sigla (`MG`). A conversão foi feita uma vez, e o projeto guarda só o resultado em `backend-api/database/data/municipalities.csv`, com as colunas `ibge_code,name,state,latitude,longitude`. O `MunicipalitySeeder` lê esse arquivo.

Exemplo (já convertido): `3170107,Uberaba,MG,-19.7472,-47.9381`

## Tabela

Migration `0000_01_01_000000_create_municipalities_table.php`. Equivalente em SQL:

```sql
CREATE TABLE municipalities (
  ibge_code  INT UNSIGNED PRIMARY KEY,
  name       VARCHAR(100) NOT NULL,
  state      CHAR(2) NOT NULL,
  latitude   DECIMAL(9,6) NOT NULL,
  longitude  DECIMAL(9,6) NOT NULL,
  INDEX (name),
  INDEX (state),
  INDEX (latitude, longitude)
);
```

Tabela só de leitura, populada uma vez por seeder. Sem timestamps.

## Cadastro do usuário

1. O campo é um **autocomplete de cidade** (`CityCombobox`). O frontend busca a lista completa em `GET /api/municipalities` (código, nome e UF) e filtra no próprio navegador enquanto o usuário digita.
2. O backend recebe só `municipality_id` e valida com `exists:municipalities,ibge_code`. Isso vale no cadastro e na edição do perfil, e também no `municipality_id` do anúncio.

> Ideia não implementada: atalho pelo CEP via **ViaCEP** (`viacep.com.br/ws/{cep}/json/`), cuja resposta traz o campo `ibge` com o mesmo código da tabela. O CEP não seria salvo.

## Query de busca

Proposta, ainda não implementada:

```sql
WITH proximos AS (
  SELECT ibge_code,
         ST_Distance_Sphere(POINT(longitude, latitude), POINT(:lng, :lat)) / 1000 AS km
  FROM municipalities
  WHERE latitude  BETWEEN :lat - :dlat AND :lat + :dlat
    AND longitude BETWEEN :lng - :dlng AND :lng + :dlng
)
SELECT p.*, prox.km
FROM proximos prox
JOIN posts p ON p.municipality_id = prox.ibge_code
WHERE prox.km <= :raio
  AND p.status = 'active'
  AND p.deleted_at IS NULL
ORDER BY prox.km, p.published_at DESC
LIMIT 15 OFFSET :offset;
```

- `:lat` e `:lng` são as coordenadas do município de origem.
- O `BETWEEN` (bounding box) usa o índice e corta a busca para poucas dezenas de municípios. Um grau de latitude tem cerca de 111 km; para 100 km, `:dlat ≈ 0.9` e `:dlng ≈ 1.0`.
- A própria cidade fica no km 0, então "Uberaba primeiro, depois a região" sai direto do `ORDER BY`.
- A migration de `posts` já cria o índice `(status, municipality_id, published_at)`.
- Raio padrão de 50 km, com opção de 25/50/100 km. Se vierem poucos resultados, ampliar o raio automaticamente.

## Exemplo real a partir de Uberaba

| Cidade | UF | Distância |
|---|---|---|
| Uberaba | MG | 0 km |
| Delta | MG | 29.7 km |
| Igarapava | SP | 38.3 km |
| Água Comprida | MG | 38.8 km |
| Veríssimo | MG | 40.2 km |
| Aramina | SP | 41.1 km |
| Conceição das Alagoas | MG | 50.3 km |
| Uberlândia | MG | 99 km |

34 municípios num raio de 100 km.

## Limitação

A distância é em linha reta, não por estrada. Para "cidades da região" isso basta; distância por estrada exigiria uma API paga e não traz ganho aqui.

Ver [[Entidades.canvas|Entidades]].
