# Spendwise

> An offline-first mobile expense tracker built for fast, local-first transaction logging with seamless cloud background sync.

[![React Native](https://img.shields.io/badge/React_Native-0.82-61DAFB?logo=react&logoColor=black)](https://reactnative.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![SQLite](https://img.shields.io/badge/SQLite-op--sqlite-003B57?logo=sqlite&logoColor=white)](https://github.com/OP-Engineering/op-sqlite)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

## Overview

Spendwise is engineered for instantaneous response times by writing directly to an embedded SQLite database first. Transactions are tracked locally regardless of network state, while a dedicated sync engine processes mutation queues in the background once connectivity is restored.

### Key Features

- **Local-First Writes:** Zero latency UI updates using native SQLite bindings.
- **Offline Mutation Queue:** Queued updates with exponential backoff retry execution.
- **Secure Auth Flow:** Google OAuth integration via PKCE flow backed by Supabase.
- **Fluid Motion System:** Custom screen transition animations built with `react-native-reanimated`.

## Tech Stack

| Layer                        | Technology                                                                         |
| :--------------------------- | :--------------------------------------------------------------------------------- |
| **Framework**                | React Native (`v0.82` Bare Workflow)                                               |
| **Language**                 | TypeScript                                                                         |
| **Database & ORM**           | SQLite (`op-sqlite`) + Drizzle ORM                                                 |
| **Auth & Cloud Persistence** | `@supabase/supabase-js` (`v2.110.7`) + `@react-native-async-storage/async-storage` |
| **Animations**               | `react-native-reanimated`                                                          |

## Architecture

```text
┌─────────────────────────┐
│     User Action (UI)    │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│ Drizzle ORM + op-sqlite │ ──► Instant UI Update
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│ Background Sync Queue   │ ──► Reconciles when online
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│  Supabase (PostgreSQL)  │
└─────────────────────────┘
```
