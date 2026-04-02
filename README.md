# WoorkFlow — Backend

API REST em Node.js + Express + MySQL para o WoorkFlow.

## Estrutura

### 1. Instalar dependências

```bash
cd woorkflow-backend
npm install
```

### 2. Criar o banco de dados

```bash
mysql -u root -p < database/schema.sql
```

### 3. Configurar variáveis de ambiente

```bash
cp .env.example .env
# Edite o .env com seu usuário, senha e secret JWT
```

### 4. Iniciar o servidor

```bash
# Produção
npm start

# Desenvolvimento (reinicia automaticamente)
npm run dev
```

O servidor roda em: `http://localhost:3001`

## Endpoints

### Exemplo — Login

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"ana@email.com","password":"MinhaS3nha!"}'
```

### Resposta

```json
{
  "message": "Login realizado com sucesso!",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "name": "Ana Silva",
    "email": "ana@email.com",
    "avatar": "AS"
  }
}
```

## Autenticação

Após o login, salve o token e envie em todas as requisições protegidas:

```
Authorization: Bearer <seu_token_aqui>
```
