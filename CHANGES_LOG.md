# Registro de Alterações (Changes Log)

Este arquivo documenta todas as alterações e correções realizadas no projeto `WhatsUT`.

## 1. Repositório e Controle de Versão
- **Push para Main**: O projeto foi enviado com sucesso para o branch `main`.
- **Merge Conflict**: Resolvido conflito no `README.md` unificando as instruções do repositório remoto com o guia de setup local.

## 2. Servidor (`server/src/`)

### `server.js`
- **Rota de Grupos (`GET /groups`)**: Adicionada a rota faltante para listar os grupos criados. Sem isso, o painel não exibia os grupos.
- **Rota de Mensagens (`GET /messages`)**: Adicionada nova rota para buscar o histórico de mensagens entre usuários ou de um grupo. Isso garante que as mensagens persistam ao recarregar a página ou trocar de chat.
- **Criação de Grupos**: Adicionada validação para nomes de grupos duplicados. Retorna erro `400` com mensagem "Group name already taken" se o nome já existir (tratamento da constraint `UNIQUE`).

### `auth.js`
- **Logs de Debug**: Adicionados logs no middleware `authenticateToken` para facilitar o diagnóstico de erros de autenticação (403 Forbidden).

## 3. Cliente (`client/src/`)

### `components/CreateGroupModal.jsx`
- **Tratamento de Erros**:
    - Agora exibe a mensagem de erro específica retornada pelo servidor (ex: nome duplicado) em vez de um erro genérico.
    - Detecta erro `403/401` (Sessão Expirada) e oferece logout automático/alerta para o usuário renovar o token.
- **Correção de Bug**: Removida declaração duplicada da variável `name` que causava erro de compilação.

### `components/ChatWindow.jsx`
- **Histórico de Mensagens**: Atualizado para carregar as mensagens antigas da API (`GET /messages`) toda vez que um chat é selecionado.
- **Exibição de Nomes**:
    - O envio de mensagens foi ajustado para incluir o `senderName` (nome do remetente).
    - A interface foi atualizada para exibir o nome do usuário nas mensagens recebidas em grupos, em vez de apenas "User [ID]".

## Resumo Técnico dos Problemas Resolvidos
1.  **Conflito de Merge**: Resolvido manualmente.
2.  **Server não rodando**: Diagnosticado que o servidor não estava ativo na porta correta; resolvido reiniciando o processo.
3.  **Criação de Grupos Falhando**: Diagnosticado erro de token (403) e/ou nome duplicado; melhorada a tratativa no front e back.
4.  **Lista de Grupos Vazia**: Implementada rota `GET /groups`.
5.  **Mensagens "Sumindo"**: Implementada persistência via rota `GET /messages` e `useEffect` no front.
6.  **Nomes de Usuários Ausentes**: Ajustado payload do socket e renderização do componente de chat.
