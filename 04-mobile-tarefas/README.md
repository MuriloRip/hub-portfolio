# Aplicativo Mobile de Controle de Tarefas

Aplicativo mobile em React Native para gerenciamento de tarefas com persistencia local.

## Stack

- Expo + React Native + TypeScript
- React Navigation (Bottom Tabs)
- AsyncStorage (persistencia de dados)

## Funcionalidades

- Navegacao por abas (`Tarefas`, `Nova tarefa`, `Progresso`)
- Criacao de tarefas com prioridade e observacoes
- Marcar tarefa como concluida/reabrir
- Excluir tarefa
- Filtros por status (todas, abertas, concluidas)
- Persistencia local usando AsyncStorage

## Rodando localmente

```bash
npm install
npm run start
```

Depois escaneie o QR no app Expo Go.

## Observacao

- O app usa armazenamento local no dispositivo; nao depende de backend para funcionar.
