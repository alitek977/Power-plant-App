# Power Plant Calculations

## Overview

Power Plant Calculations is a mobile-first application designed for power plant engineers and technicians to perform critical computations quickly and accurately. The app enables users to track feeder readings, turbine data, perform energy calculations, and generate reports - all with offline support via local storage.

The application follows a bold/industrial design aesthetic with high contrast, electric blue accents, and a dark mode default to reduce eye strain during extended use.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React Native with Expo SDK 54
- **Navigation**: React Navigation v7 with a bottom tab navigator containing 4 main tabs (Feeders, Turbines, Calculations, Reports)
- **State Management**: React Context API for day-to-day data (`DayContext`), TanStack React Query for server state
- **Animations**: React Native Reanimated for smooth micro-interactions
- **Styling**: Custom theme system with light/dark mode support, centralized in `client/constants/theme.ts`
- **Path Aliases**: `@/` maps to `./client`, `@shared/` maps to `./shared`

### Backend Architecture
- **Server**: Express.js running on Node.js
- **API Pattern**: RESTful endpoints prefixed with `/api`
- **Database ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema Definition**: Shared between client and server in `shared/schema.ts`
- **Storage Layer**: Abstracted via `IStorage` interface in `server/storage.ts`, currently using in-memory storage with database-ready patterns

### Data Storage
- **Local Storage**: AsyncStorage for offline persistence of daily calculations
- **Data Structure**: Day-based records containing feeder readings (start/end kWh) and turbine data (previous/present readings, hours)
- **Storage Keys**: Prefixed with `pp-app:v2` for versioning

### Key Design Patterns
1. **Stack-per-tab navigation**: Each tab has its own stack navigator for consistent header behavior
2. **Keyboard-aware components**: Custom `KeyboardAwareScrollViewCompat` for cross-platform input handling
3. **Themed components**: `ThemedText`, `ThemedView`, and custom hooks for consistent styling
4. **Error boundaries**: Class-based error boundary with development-mode debugging
5. **Responsive layouts**: `useResponsiveLayout` hook detects tablet vs phone screens (768px breakpoint), enabling 2-column grid layouts on tablets with max content width of 900px

### Build Configuration
- **Development**: Expo dev server with Metro bundler, proxied through Replit domains
- **Production**: Static web build via custom build script, server bundled with esbuild
- **Type Safety**: Strict TypeScript configuration with Zod schemas for runtime validation

## External Dependencies

### Core Services
- **PostgreSQL**: Database backend (configured via `DATABASE_URL` environment variable)
- **Drizzle Kit**: Database migrations and schema management

### Third-Party Packages
- **Expo Ecosystem**: Font loading, haptics, blur effects, clipboard, splash screen, web browser
- **Google Fonts**: Outfit font family for typography
- **React Navigation**: Native stack and bottom tab navigators
- **TanStack Query**: Server state management and caching

### Environment Variables
- `DATABASE_URL`: PostgreSQL connection string
- `EXPO_PUBLIC_DOMAIN`: Public domain for API requests
- `REPLIT_DEV_DOMAIN`: Development domain for Expo proxy configuration
- `REPLIT_DOMAINS`: Comma-separated list of allowed CORS origins