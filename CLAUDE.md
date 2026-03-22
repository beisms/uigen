# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run setup        # First-time setup: install deps, generate Prisma client, run migrations
npm run dev          # Start dev server (localhost:3000) with Turbopack
npm run build        # Production build
npm run lint         # ESLint check
npm run test         # Run all Vitest tests
npm run db:reset     # Force-reset the SQLite database
```

Run a single test file:
```bash
npx vitest run src/path/to/__tests__/file.test.ts
```

## Environment

Create a `.env` file in the project root:
```
ANTHROPIC_API_KEY=your_key   # Optional — falls back to MockLanguageModel
JWT_SECRET=your_secret       # Defaults to "development-secret-key"
```

## Architecture

UIGen is an AI-powered React component generator with live preview. Users describe components in a chat interface; Claude generates code that renders instantly in a sandboxed iframe.

### Data Flow

```
User message → ChatInterface → /api/chat (streamText) → Claude (Haiku)
  → tool calls (file-manager / str-replace-editor)
  → VirtualFileSystem updates
  → FileSystemContext notifies PreviewFrame
  → Babel transforms JSX in-browser
  → iframe renders live preview
```

### Key Subsystems

**Virtual File System** (`src/lib/file-system.ts`): In-memory filesystem — no disk I/O. Supports CRUD and rename operations. Serializes to/from JSON for Prisma persistence.

**AI Integration** (`src/lib/provider.ts`, `src/app/api/chat/route.ts`): Uses Vercel AI SDK `streamText` with Anthropic Claude Haiku. Allows up to 40 tool call iterations (4 for the mock model). When `ANTHROPIC_API_KEY` is absent, `MockLanguageModel` returns static code.

**AI Tools** (`src/lib/tools/`): Two tools exposed to Claude:
- `file-manager` — creates, deletes, renames files in the virtual FS
- `str-replace-editor` — targeted string replacement within files

**JSX Preview** (`src/lib/transform/`): Babel standalone runs in the browser to transpile JSX. Output renders in a sandboxed iframe with an import map for module resolution.

**State Management**: Two React contexts (`ChatContext`, `FileSystemContext`) provide shared state. The chat uses Vercel AI SDK's `useChat` hook for streaming.

**Authentication** (`src/lib/auth.ts`, `src/middleware.ts`): JWT in httpOnly cookies (7-day expiry). Server actions handle sign-up/sign-in/sign-out. Middleware validates sessions on protected routes.

**Database** (`prisma/schema.prisma`): SQLite via Prisma. Two models — `User` and `Project`. Projects store `messages` and file `data` as JSON strings. Cascade delete on user removal. Always reference `prisma/schema.prisma` to understand the structure of data stored in the database.

### Layout

The main UI (`src/app/main-content.tsx`) uses resizable panels:
- **Left**: `ChatInterface` — streaming chat with AI
- **Right**: Toggle between `PreviewFrame` (iframe) and `CodeEditor` (Monaco) + `FileTree`

### Path Alias

`@/*` maps to `src/*`.

## Code Style

Use comments sparingly. Only comment complex code that isn't self-explanatory.
