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

## Decisão

- A localização é guardada **por município**, nunca pelo endereço exato do usuário.
- Existe uma tabela de referência `municipios` com o código IBGE e a latitude/longitude do centro de cada cidade.
- `Usuário` e `Anuncios` guardam apenas `municipio_id` (FK para `municipios.codigo_ibge`). Nome da cidade e UF vêm do JOIN, sem duplicar dado.
- A distância é calculada no próprio MySQL, em linha reta, com `ST_Distance_Sphere`. Nenhuma API externa é consultada na hora da busca.
- A origem da busca é um parâmetro. O município do usuário é só o valor padrão, então visitante sem login ou quem procura em outra cidade também consegue buscar.

### Por que não guardar lat/long do usuário

Latitude e longitude tiradas do CEP apontam praticamente para a casa da pessoa. É dado pessoal sensível (LGPD) e não melhora o resultado: para "cidade e região", precisão de município basta.

### Por que raio em km e não região do IBGE

A "região imediata" do IBGE tem fronteira fixa e não cruza divisa de estado. Uberaba fica perto de SP (Igarapava a 38 km, Aramina a 41 km), e um animal perdido não respeita divisa.

## Fonte dos dados

**Repositório:** https://github.com/kelvins/municipios-brasileiros

- Licença MIT, mantido ativamente (último push em dez/2025).
- Arquivo usado: `csv/municipios.csv`, texto puro. Não é preciso rodar nenhum script do repositório.
- 5571 municípios, lista conferida código por código contra a API oficial do IBGE (`servicodados.ibge.gov.br/api/v1/localidades/municipios`) em 18/09/2026: idêntica.
- Colunas: `codigo_ibge, nome, latitude, longitude, capital, codigo_uf, siafi_id, ddd, fuso_horario`.
- A UF vem como código numérico (`31`), não sigla (`MG`). O `csv/estados.csv` do mesmo repositório faz a conversão no seeder.
- Colunas aproveitadas: `codigo_ibge`, `nome`, `latitude`, `longitude` e a UF. O resto é descartado.

Exemplo: `3170107,Uberaba,-19.7472,-47.9381,0,31,5401,34,America/Sao_Paulo`

## Tabela

```sql
CREATE TABLE municipios (
  codigo_ibge  INT UNSIGNED PRIMARY KEY,
  nome         VARCHAR(100) NOT NULL,
  uf           CHAR(2) NOT NULL,
  latitude     DECIMAL(9,6) NOT NULL,
  longitude    DECIMAL(9,6) NOT NULL,
  INDEX idx_nome (nome),
  INDEX idx_lat_lng (latitude, longitude)
);
```

Tabela só de leitura, populada uma vez por seeder. Sem timestamps.

## Cadastro do usuário

1. O campo principal é um **autocomplete de cidade**, alimentado pela própria tabela: `GET /api/municipios?busca=uber` retorna "Uberaba - MG", "Uberlândia - MG"...
2. Atalho opcional pelo CEP via **ViaCEP** (`viacep.com.br/ws/{cep}/json/`). A resposta traz o campo `ibge` (ex.: `"3170107"`), que é o mesmo código da tabela. CEP inválido retorna `{"erro": "true"}`; nesse caso o usuário escolhe a cidade manualmente.
3. O backend recebe só `municipio_id` e valida com `exists:municipios,codigo_ibge`. O CEP não é salvo.

O mesmo componente de autocomplete é usado no cadastro, na criação de anúncio e no filtro de busca.

## Query de busca

```sql
WITH proximos AS (
  SELECT codigo_ibge,
         ST_Distance_Sphere(POINT(longitude, latitude), POINT(:lng, :lat)) / 1000 AS km
  FROM municipios
  WHERE latitude  BETWEEN :lat - :dlat AND :lat + :dlat
    AND longitude BETWEEN :lng - :dlng AND :lng + :dlng
)
SELECT a.*, p.km
FROM proximos p
JOIN anuncios a ON a.municipio_id = p.codigo_ibge
WHERE p.km <= :raio
  AND a.status = 'ATIVO'
ORDER BY p.km, a.data_publicacao DESC
LIMIT 20 OFFSET :offset;
```

- `:lat` e `:lng` são as coordenadas do município de origem.
- O `BETWEEN` (bounding box) usa o índice e corta a busca para poucas dezenas de municípios. Um grau de latitude tem cerca de 111 km; para 100 km, `:dlat ≈ 0.9` e `:dlng ≈ 1.0`.
- A própria cidade fica no km 0, então "Uberaba primeiro, depois a região" sai direto do `ORDER BY`.
- Índice em `anuncios (municipio_id, status, data_publicacao)`.
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
