# Relatório técnico — Contas Bolsão Voltz V4: saldo total consolidado do admin

**Autor:** Manus AI  
**Data:** 05/06/2026

Esta versão V4 complementa a versão anterior das **Contas Bolsão Voltz** com a visão administrativa solicitada: o admin/master passa a ter uma visão clara do **saldo total consolidado de todas as contas bolsão**, enquanto os clientes continuam mantendo **saldos individuais internos por bolsão** e sem visualizar qualquer vínculo com a estrutura de bolsões.

A regra central foi preservada. O saldo normal Voltz do cliente não é alterado pelas operações do bolsão, e o cliente não passa a enxergar o bolsão no seu painel. O bolsão permanece um controle administrativo interno, porém agora o admin consegue acompanhar tanto o total geral administrado quanto o subtotal de cada bolsão.

| Área | Implementação V4 |
|---|---|
| Backend | Novo endpoint administrativo `GET /voltz-pools/admin/summary` para retornar o saldo total consolidado de todos os bolsões. |
| Backend | Cada bolsão passa a expor `totalBalance`, calculado a partir dos lançamentos de ledger, respeitando créditos e débitos. |
| Frontend | A tela **Contas Bolsão Voltz** recebeu um card superior com o **Saldo total consolidado dos bolsões**. |
| Frontend | A listagem lateral de bolsões agora mostra o **Subtotal do bolsão** em cada conta. |
| Frontend | A tela de detalhe de cada bolsão também mostra o subtotal, mantendo a aba **Saldos por cliente**. |
| Regra de cliente | O cliente continua vendo apenas seu saldo Voltz normal; o saldo interno do bolsão permanece invisível para ele. |

## Endpoint administrativo criado

Foi adicionado o endpoint `GET /voltz-pools/admin/summary`, protegido pela autenticação e pela permissão administrativa já existente no módulo de Contas Bolsão. O retorno segue a estrutura abaixo:

```json
{
  "totalConsolidatedBalance": 0,
  "totalPools": 0,
  "totalActiveClients": 0,
  "pools": [
    {
      "id": "uuid",
      "code": "001",
      "name": "Conta Bolsão 001",
      "status": "ACTIVE",
      "totalBalance": 0,
      "balance": 0,
      "totalClients": 0,
      "activeClients": 0
    }
  ]
}
```

O campo **`totalConsolidatedBalance`** representa a soma geral de todos os saldos administrativos internos dos clientes em todos os bolsões. O campo **`totalBalance`** representa o subtotal de um bolsão específico.

## Regra de saldo preservada

A implementação continua separando o saldo real da conta Voltz do cliente do saldo administrativo interno do bolsão. Portanto, uma entrada administrativa no bolsão para um cliente específico altera apenas o saldo interno desse cliente naquele bolsão; não altera o saldo bancário Voltz que o cliente visualiza.

| Visão | O que aparece |
|---|---|
| Admin/master | Saldo Voltz do cliente, saldo individual do cliente no bolsão, subtotal por bolsão e saldo total consolidado de todos os bolsões. |
| Cliente | Apenas seu saldo normal Voltz e suas operações bancárias comuns. |
| Bolsão | Controle interno com saldos individuais por cliente e total administrativo consolidado para gestão. |

## Arquivos alterados

As alterações foram pontuais e concentradas somente no módulo necessário.

| Arquivo | Alteração |
|---|---|
| `src/routes/voltz-pools.routes.js` | Adicionado cálculo de total por bolsão, campo `totalBalance` no DTO e endpoint `GET /voltz-pools/admin/summary`. |
| `api-client.js` | Adicionada função `getVoltzPoolsSummary()`. |
| `script.js` | Adicionado carregamento do resumo consolidado e exibição do card de saldo total, subtotais por bolsão e subtotal no detalhe. |

## Validação realizada

A sintaxe dos três arquivos JavaScript alterados foi validada com `node --check`:

```bash
node --check src/routes/voltz-pools.routes.js
node --check api-client.js
node --check script.js
```

Todos os arquivos passaram na validação sintática.

## Como aplicar

Se a migration das Contas Bolsão já foi aplicada anteriormente, esta V4 **não exige nova migration**, pois a alteração usa os modelos e tabelas já existentes. Basta substituir os arquivos do backend e do frontend e executar no backend:

```bash
npm install
npx prisma generate
npm start
```

Se o ambiente ainda não tiver aplicado as migrations do projeto, execute também:

```bash
npx prisma migrate deploy
```

## Resultado esperado

Após aplicar a V4, o admin/master verá no menu **CONTAS BOLSÃO** um card no topo com o **saldo total consolidado dos bolsões**. Na lista de contas, cada bolsão exibirá seu subtotal. Ao entrar em um bolsão, a aba de saldos continuará mostrando os saldos individuais de cada cliente.

Essa organização atende ao requisito definido: **o admin gerencia o saldo total de todas as contas bolsão, enquanto os clientes continuam com saldos individuais e sem ciência do vínculo com bolsões**.
