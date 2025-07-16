#  Projeto com Foundry + React

Este projeto utiliza [Foundry](https://book.getfoundry.sh/) para desenvolvimento de smart contracts e um frontend em React.

---

## Etapas para rodar localmente

### 1. Inicie o Anvil (em um terminal separado)

Anvil é a blockchain local usada para desenvolvimento e testes:

```bash
docker run -it --rm --network host ghcr.io/foundry-rs/foundry anvil
```

---

### 2. Entre no container com acesso ao host

Abra outro terminal e execute:

```bash
docker run -it --rm \
  --network host \
  -v "$PWD":/code \
  -w /code \
  ghcr.io/foundry-rs/foundry bash
```

---

### 3. Faça o deploy do contrato dentro do container

Já dentro do container, execute:

```bash
forge script script/Deploy.s.sol \
  --rpc-url http://localhost:8545 \
  --broadcast \
  --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```

> Esta chave é a padrão da conta 0 do Anvil, que já tem saldo pré-carregado.

---

### 4. Atualize o frontend com o endereço do contrato

Abra o arquivo:

```
frontend/src/AppRoutes.tsx
```

E substitua o valor do endereço do contrato implantado, caso necessário.

---

### 5. Inicie o frontend

Em outro terminal:

```bash
cd frontend
npm install
npm start
```

---

##  Para testar

- Verifique se a rede local Anvil está rodando em `127.0.0.1:8545`
- Certifique-se de que há contas com ETH disponíveis (a Anvil já fornece contas com saldo automaticamente)

---

## Requisitos

- Docker
- Node.js (para o frontend)

---
