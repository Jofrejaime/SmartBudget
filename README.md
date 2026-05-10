# SmartBudget UI

Um frontend moderno e leve para o SmartBudget — uma aplicação de gestão financeira pessoal.

Sumário
- Descrição
- Tecnologias
- Como executar (desenvolvimento)
- Build e produção
- Testes
- Internacionalização (i18n)
- Funcionalidades relevantes
- Contribuindo
- Resolução de problemas

Descrição
-----------
Este repositório contém a interface do SmartBudget construída com Angular (standalone components). O objetivo é fornecer uma experiência de utilizador limpa para gerir transações, categorias, e obter relatórios rápidos (CSV export).

Tecnologias
-----------
- Angular 21
- TypeScript
- ngx-translate para i18n
- SCSS para estilos
- Angular CLI para build / dev server

Principais funcionalidades
-------------------------
- Dashboard com resumo financeiro, resumo mensal e últimas transações
- Gestão de categorias (criar, arquivar)
- CRUD de transações
- Exportação de relatório (CSV) a partir do Dashboard
- Suporte a múltiplos idiomas (Português / Inglês)

Pré-requisitos
--------------
- Node.js 18+ (recomendado)
- npm 9+ ou yarn

Instalação
----------
No diretório do projeto execute:

```bash
npm install
```

Execução em desenvolvimento
---------------------------
Inicia um servidor de desenvolvimento com reload automático:

```bash
npm run start
# ou
ng serve
```

Abra http://localhost:4200/ no navegador.

Build e produção
-----------------
Gerar build de produção:

```bash
npm run build
# saída em: dist/smartbudget-ui
```

Testes
------
Executar testes unitários (Vitest / Karma conforme configuração do projeto):

```bash
npm run test
```

Internacionalização (i18n)
--------------------------
O projeto usa `ngx-translate` e carrega ficheiros de tradução em `src/assets/i18n/{pt|en}.json`.

Dicas de debugging i18n
- Verificar no browser DevTools → Network se `/assets/i18n/pt.json` é carregado.
- Checar a chave `sb_language` no localStorage (valor `pt` ou `en`).

Exportação de Relatório (CSV)
----------------------------
O Dashboard tem um botão "Exportar Relatório" que gera um CSV com:

1. Resumo Geral (saldo, receitas, despesas)
2. Resumo Mensal (mês, receitas, despesas, saldo)
3. Últimas transações (Data, Descrição, Tipo, Valor)

O serviço responsável é `src/app/core/services/export.service.ts`.

Configuração e variáveis de ambiente
-----------------------------------
O frontend comunica com a API backend via endpoints configurados no serviço. As variáveis de ambiente (URL do backend, etc.) devem ser geridas onde o ambiente de produção as suporta (por exemplo, `environment.ts` / servidor de CI).

Contribuição
------------
1. Fork do repositório
2. Crie uma branch feature: `git checkout -b feat/minha-funcionalidade`
3. Adicione testes quando aplicável
4. Abra um pull request descrevendo as mudanças

Boas práticas de commits
- Mensagens pequenas e descritivas
- Faça builds antes de abrir PR

Resolução de problemas comuns
-----------------------------
- Traduções não aparecem: valide `src/assets/i18n/*.json` (formato JSON válido) e confirme o `TranslateLoader` está apontando para `/assets/i18n/{lang}.json`.
- Botões grandes / layout quebrado: ver `src/styles.scss` e componentes `.scss` para regras de altura/padding; rebuild necessário após alterações.
- API do dashboard retorna vazio: validar token JWT e chamadas em Network (GET /dashboard/summary).

Contactos
--------
Para dúvidas e suporte interno, abra uma issue no repositório ou contacte o responsável do projecto.

Licença
-------
Defina aqui a licença do projecto (por exemplo MIT) ou remova esta secção se não aplicável.

---
Arquivo: [README.md](README.md)

