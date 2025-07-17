# 🍕 Pizza Shop

Esse sistema foi desenvolvido para fazer o gerenciamento de pizzarias, com o objetivo de fornecer uma plataforma simples de gerenciar pedidos, cardápio, avaliações e métricas de forma eficiente e intuitiva

Funcionalidades:

Autenticação via Magic Link (sem senha): Envia um email com link para acesso

Cadastro e login de estabelecimentos: Permite o cadastro de novos estabelecimentos e login

Gerenciamento de pedidos: aprove, cancele ou altere o status de cada pedido

Gestão de cardápio e avaliações:  gerencie o cardápio adicionando ou editando, e consiga ver avaliações

Dashboard com métricas e gráficos interativos: Veja os produtos com mais receita no mes ou dia e cancelamentos do mês, e gráficos para produtos populaores

Tecnologias Utilizadas

Reactjs: Linguagem de progamação principal do projeto.

Tailwind Css: Biblioteca usada para interface gráfica

Next.js: back-end e front-end no mesmo projeto

PostgreSQL: database usado no projeto

link github: https://github.com/Valdiberto/pizzashop-web

## 🚀 Demonstração

[Confira a versão em produção](https://pizzashop-web-sable.vercel.app/)

## ✨ Funcionalidades

✅ Autenticação via Magic Link (sem senha)

✅ Cadastro e login de estabelecimentos e clientes

✅ Gerenciamento de pedidos

✅ Gestão de cardápio e avaliações

✅ Dashboard com métricas e gráficos interativos


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
