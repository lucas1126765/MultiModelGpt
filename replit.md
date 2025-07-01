# AI Chat Application

## Overview

This is a full-stack AI chat application built with React and Express, featuring a modern chat interface with support for multiple AI models. The application allows users to create conversations, send messages to AI assistants, and manage chat history. It's designed with a clean, responsive interface using shadcn/ui components and Tailwind CSS.

## System Architecture

The application follows a standard full-stack architecture with clear separation between frontend and backend:

- **Frontend**: React-based single-page application with TypeScript
- **Backend**: Express.js REST API server
- **Database**: PostgreSQL with Drizzle ORM for data persistence
- **Styling**: Tailwind CSS with shadcn/ui component library
- **Build Tool**: Vite for frontend bundling and development

## Key Components

### Frontend Architecture
- **React with TypeScript**: Main frontend framework using functional components and hooks
- **Wouter**: Lightweight client-side routing library
- **TanStack Query**: Data fetching and caching solution for API interactions
- **shadcn/ui**: Modern UI component library built on Radix UI primitives
- **Tailwind CSS**: Utility-first CSS framework for styling

### Backend Architecture
- **Express.js**: Web application framework for Node.js
- **REST API**: RESTful endpoints for conversation and message management
- **TypeScript**: Type safety across the entire backend
- **Modular Design**: Separate modules for routes, storage, and AI services

### Database Layer
- **PostgreSQL**: Primary database for data persistence with Neon Database hosting
- **Drizzle ORM**: Type-safe SQL toolkit and ORM with serverless connection pooling
- **Schema**: Well-defined database schema with users, conversations, and messages tables
- **DatabaseStorage**: Production database storage implementation replacing in-memory storage
- **Migration**: Database schema pushed and tables created successfully

### AI Integration
- **Multi-Model Support**: Support for DeepSeek-V3, Llama-3 70B, Mixtral 8x7B, GPT-4o, and GPT-3.5 Turbo
- **Together AI Integration**: Primary AI service integration using Together API for advanced models
- **OpenAI Integration**: Secondary support for OpenAI models
- **Flexible API Key Management**: Per-conversation API key configuration supporting multiple providers

## Data Flow

1. **User Interaction**: User creates conversations and sends messages through the React frontend
2. **API Requests**: Frontend makes HTTP requests to Express backend using TanStack Query
3. **Data Processing**: Backend validates requests, manages conversations, and interfaces with AI services
4. **AI Communication**: Backend sends user messages to configured AI models and receives responses
5. **Data Persistence**: Conversations and messages are stored in PostgreSQL database
6. **Real-time Updates**: Frontend automatically updates with new messages and conversation state

## External Dependencies

### Core Dependencies
- **React Ecosystem**: React, React DOM, TanStack Query for frontend state management
- **UI Components**: Radix UI primitives, Lucide React icons, various utility libraries
- **Backend Framework**: Express.js with middleware for JSON parsing and CORS
- **Database**: Neon Database serverless PostgreSQL, Drizzle ORM
- **AI Services**: OpenAI SDK for AI model integration
- **Development Tools**: Vite, TypeScript, ESBuild for building and bundling

### AI Model Providers
- **Together AI**: DeepSeek-V3, Llama-3 70B, and Mixtral 8x7B models
- **OpenAI**: GPT-4o and GPT-3.5 Turbo models

## Deployment Strategy

### Development Environment
- **Vite Dev Server**: Hot module replacement and fast development builds
- **Node.js**: Direct execution of TypeScript server code using tsx
- **Database**: Neon Database for cloud PostgreSQL hosting

### Production Build
- **Frontend**: Vite builds optimized static assets to `dist/public`
- **Backend**: ESBuild bundles server code to `dist/index.js`
- **Single Server**: Express serves both API endpoints and static frontend files
- **Environment Variables**: Database URL and API keys configured via environment

### Database Management
- **Migrations**: Drizzle Kit handles database schema migrations
- **Schema Sync**: `db:push` command for development schema updates
- **Connection**: Neon Database serverless PostgreSQL for production

## Changelog

```
Changelog:
- July 01, 2025. Initial setup
- July 01, 2025. Added user authentication system with login/register functionality
- July 01, 2025. Integrated PostgreSQL database with Drizzle ORM, replaced in-memory storage
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```