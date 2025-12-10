# WhatsUT
Trabalho apresentado a disciplina de Sistemas Distribuidos - 7º Periodo do Curso de Ciência da Computação na UTFPR-MD

# Problema Proposto:

Você foi contratado para o desenvolvimento de um sistema para comunicação interpessoal: o WhatsUT. Tal sistema precisa atender os seguintes requisitos:

1) Autenticação criptografada: o usuário precisa estar cadastrado para utilizar, e seu acesso deve ser feito via senha. É importante usar um processo de criptografia de dados.

2) Lista de usuários: ao realizar o login, uma lista de usuários deve ser apresentada, caracterizando o usuário que estiver atualmente logado e disponível para chat.

3) Lista de grupos: uma lista de grupos para chat deve ser apresentada. O cliente poderá pedir para entrar no grupo de conversa, sendo aprovado ou não pelo criador do grupo de conversação.

3) Dois modos de chat devem ser providos: chat privado, permitindo a conversação entre duas pessoas apenas; e chat em grupo, permitindo com que várias pessoas possam se juntar a uma conversa. No caso da conversa em grupo, o usuário que criou pode dar permissão a outros usuários para entrada.

5) Envio de arquivos: em chats privados, um usuário poderá enviar arquivos ao outro usuário.

6) Exclusão: um usuário poderá requisitar ao servidor que um usuário seja banido da aplicação. Banir um usuário do grupo é tarefa do administrador do grupo. Caso o administrador do grupo saia, o aplicativo deve decidir quem será o novo administrador, ou se o grupo seja eliminado. Tal opção pode ser ajustada no momento da criação do chat em grupo. 

É importante que se tenha telas intuitivas, modernas e "caprichadas" tanto para o cliente quanto para o servidor. Ainda, deve-se apresentar os diagramas UML (atividades, colaboração, sequencia...). Pontos serão dados para chamadas de CallBack, interfaces de servidor para configuração.

# WhatsUT - Setup and Execution Guide

This guide explains how to set up and run the WhatsUT messaging application.

## Prerequisites

- Node.js installed (v16 or higher recommended)
- npm (Node Package Manager)

## Project Structure

The project is divided into two main folders:
- `client`: The React frontend application.
- `server`: The Node.js/Express backend application.

## Installation

You need to install dependencies for both the client and the server.

### 1. Server Setup

Open a terminal and navigate to the `server` directory:

```bash
cd server
npm install
```

### 2. Client Setup

Open a new terminal (or use the same one after finishing the server setup) and navigate to the `client` directory:

```bash
cd client
npm install
```

## Running the Application

You need to run both the server and the client simultaneously. It is recommended to use two separate terminal windows/tabs.

### 1. Start the Server

In the `server` directory:

```bash
npm start
```
*The server will start on port 3000.*

### 2. Start the Client

In the `client` directory:

```bash
npm run dev
```
*The client will typically start on port 5173 (check the terminal output for the exact URL).*

## Accessing the App

Open your browser and navigate to the URL provided by the client (usually `http://localhost:5173`).

## Troubleshooting

- **Port Conflicts**: Ensure ports 3000 and 5173 are not in use.
- **Database**: The server uses SQLite. A `whatsut.db` file will be created automatically in the parent directory of `src` when the server starts.

## Como Executar este Projeto (Guia Rápido)

1.  **Instalação**:
    *   Abra o terminal na pasta `server` e execute: `npm install`
    *   Abra o terminal na pasta `client` e execute: `npm install`

2.  **Execução**:
    *   No terminal do `server`: `npm start`
    *   No terminal do `client`: `npm run dev`

3.  **Acesso**:
    *   Abra o navegador no endereço indicado (ex: `http://localhost:5173`).
