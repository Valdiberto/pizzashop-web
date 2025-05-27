rode o docker no arquivo docker-compose.yml

npm run db:migrate
npm run seed

# 🍕 Pizza Shop

Uma aplicação moderna e responsiva para gestão de pizzarias, construída com Next.js, TypeScript, Tailwind CSS e outras tecnologias modernas. Gerencie pedidos, cardápio, avaliações e métricas de forma eficiente e intuitiva.

## 🚀 Demonstração

Confira a versão ao vivo: https://pizzashop-web.vercel.app

## ✨ Funcionalidades

✅ Autenticação via Magic Link (sem senha)

✅ Cadastro e login de estabelecimentos e clientes

✅ Criação e gerenciamento de pedidos

✅ Gestão de cardápio e avaliações

✅ Dashboard com métricas e gráficos interativos

✅ Notificações visuais para novos pedidos

✅ Layout totalmente responsivo com Tailwind CSS

## 📸 Capturas de Tela

![SignIn](public/sigin.png)

![Dashboard](public/dashboard.png)

## 🛠️ Tecnologias Utilizadas

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- React Hook Form
- Zod
- Radix UI
- ShadCN/UI
- React Query
- Drizzle ORM
- PostgreSQL
- Resend (para envio de emails)
- Docker (para ambiente de desenvolvimento)

## 📦 Como Começar

Siga os passos abaixo para rodar o projeto localmente:

1. Clone o repositório:
   `git clone https://github.com/Valdiberto/pizzashop-web.git`

2. Navegue até a pasta do projeto:
   `cd pizzashop-web`

3. Instale as dependências:
   `npm install`

4. Configure as variáveis de ambiente:
   Crie um arquivo .env.local com base no .env.example

Preencha as variáveis necessárias, como DATABASE_URL e RESEND_API_KEY

rode o docker no arquivo `docker-compose.yml`

na variável
`DATABASE_URL=postgresql://docker:docker@localhost:5432/pizzashop`

5. Inicie o servidor de desenvolvimento:
   rode os scripts para gerar o banco de dados e os dados:
   `npm run db:migrate`
   `npm run seed`

`npm run dev`
Abra o navegador e acesse http://localhost:3000

6. Acesse o arquivo src/db/seed.ts e ache a area de manager, e altere o email para o seu preferido

## 🧪 Testes

Este projeto atualmente não inclui testes automatizados. Sinta-se à vontade para contribuir com testes ou melhorias!

## 📁 Implantação

Este projeto está pronto para implantação com a Vercel. Basta conectar seu repositório GitHub e implantar — sem necessidade de configurações adicionais.

## 📄 Licença

Este projeto está licenciado sob a Licença MIT.

## 🙋 Autor

Feito com ❤️ por Valdiberto
