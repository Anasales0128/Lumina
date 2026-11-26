# AGENTS.md — Lumina

> Documento de contexto para agentes de IA que trabalhem neste repositório.

---

## Visão Geral

**Lumina** é um site focado no público feminino que reúne informação sobre saúde feminina, beleza, autocuidado e comunidade. O projeto encontra-se em **estágio de MVP (Produto Mínimo Viável)** voltado para apresentação/demonstração. Não há dados reais de usuários nem transações financeiras reais.

---

## Stack Tecnológica

| Camada | Tecnologia |
|---|---|
| Front-end | HTML5 puro, CSS3 (custom properties, Grid, Flexbox), JavaScript ES6+ (vanilla) |
| Fonts | Google Fonts — DM Sans + Playfair Display |
| Ícones | Unicode / texto (sem biblioteca de ícones externa) |
| Estado (front) | `localStorage` para carrinho e dados simulados |
| Back-end | Node.js + Express.js (servindo arquivos estáticos; **não é usado pela loja**) |
| Banco de dados | SQLite3 via `db.js` (**não conectado ao front-end no MVP**) |
| Auth | bcryptjs + jsonwebtoken (**não ativo no MVP**) |

---

## Estrutura de Pastas

```
site/
├── index.html          # Único arquivo HTML — toda a UI está aqui
├── style.css           # Todo o CSS do projeto (sem pré-processador)
├── script.js           # Todo o JS do front-end (vanilla, sem bundler)
├── scripty.js          # Arquivo legado — IGNORAR (vazio/obsoleto)
├── app.js              # Ponto de entrada alternativo do backend — NÃO usado
├── server.js           # Servidor Express que serve arquivos estáticos
├── db.js               # Configuração SQLite — NÃO conectada ao front
├── .env                # Variáveis de ambiente do servidor
├── package.json        # Dependências Node.js
├── AGENTS.md           # Este arquivo
└── node_modules/       # Dependências instaladas (não editar)
```

---

## Regras de Negócio e Estado Atual

### Loja Online (simulada)
- A loja opera **100% via simulação no front-end** — sem chamadas a APIs externas ou ao backend Express.
- Os produtos são definidos como **mock data** (array de objetos) diretamente em `script.js`.
- O **carrinho persiste via `localStorage`** (`lumina_cart`) durante a navegação e entre recargas de página.
- O **checkout é simulado**: o usuário preenche dados fictícios, escolhe PIX ou Cartão, e recebe confirmação visual. Nenhum dado é enviado a servidor algum.
- Ao finalizar o pedido, o carrinho é limpo do `localStorage`.

### Outras Funcionalidades (já prontas)
- **Calendário menstrual**: registros em memória (não persistem ao recarregar).
- **Artigos de saúde**: conteúdo educativo mockado em `script.js`, exibido via `<dialog>`.
- **Modais de conta**: login/cadastro visual sem autenticação real.
- **Busca**: pesquisa local em array de itens mockados.

---

## Paleta de Cores (Design System)

```css
--pink:      #d9799d   /* primária — botões, destaques */
--pink-dark: #a94f75   /* primária escura — hover, texto de destaque */
--pink-soft: #f9e8ee   /* fundo suave */
--rose:      #f3d2dc
--cream:     #fbf6f0
--ink:       #3e3037   /* texto principal */
--muted:     #806f77   /* texto secundário */
--white:     #fff
--line:      #f0dfe5   /* bordas */
```

**Tipografia:**
- Títulos (`h1`, `h2`, `h3`): `Playfair Display`, serif
- Corpo e UI: `DM Sans`, sans-serif

---

## Diretrizes para Agentes

1. **Preserve tudo que já funciona.** Não altere layout, estilos, cores ou componentes existentes sem solicitação explícita.
2. **Não crie backend real** para a loja. Toda lógica de produtos, carrinho e checkout deve permanecer simulada no front-end.
3. **Mantenha o design system**: use as variáveis CSS (`--pink`, `--ink`, etc.), as fontes e os padrões de componentes já existentes (`.btn`, `.modal`, `.section`, `.eyebrow`, etc.).
4. **Todo o JS fica em `script.js`** (vanilla, sem bundler/transpiler). Não introduza frameworks ou build steps sem instrução explícita.
5. **Todo o CSS fica em `style.css`**. Adicione ao final do arquivo para novas seções; não reorganize o CSS existente.
6. **`scripty.js` está obsoleto** — ignore-o. O arquivo referenciado pelo HTML é `script.js`.
7. Para mock data, use produtos realistas voltados ao público feminino (beleza, autocuidado, saúde, bem-estar).
8. Mantenha acessibilidade: use `aria-label`, `aria-live`, semântica HTML5 e `<dialog>` nativo para modais.
9. Ao adicionar seções ao `index.html`, insira-as antes do `<footer>` e adicione link correspondente na `<nav>`.

---

## Como rodar localmente

```bash
npm install
npm start
# Acesse http://localhost:3000
```

> O front-end também funciona abrindo `index.html` diretamente no navegador (sem servidor), pois não há chamadas ao backend no MVP.
