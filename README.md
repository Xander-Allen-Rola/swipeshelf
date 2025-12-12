# SwipeShelf Frontend

This repository contains the React + TypeScript mobile frontend for SwipeShelf.
It provides the user interface for browsing, swiping, searching, and organizing books, with support for authentication, user profiles, and book shelves.

The application is built with Vite and packaged for mobile using Capacitor.

## Features

- Swipe-based recommendation interface
  - Swipe right to add a book to the To Read shelf
  - Swipe left to skip
  - Tap to flip the card and view the description
- Search page for finding books by title or author
- Shelf page displaying To Read and Finished books
- Profile page showing name, bio, profile photo, and favorite books
- Authentication (register and login)
- Session caching for books and user profile data
- Mobile-only, packaged via Capacitor for Android

## Tech Stack

- React + TypeScript
- Vite with @vitejs/plugin-react
- React Router
- Axios for API requests
- Framer Motion for animations
- Font Awesome for icons
- jwt-decode for token handling in ProtectedRoute
- Capacitor for Android packaging
- ESLint with TypeScript support
- Plain CSS for styling (no UI frameworks)

## Installation

```bash
npm install
npm run dev
```

## Environment Variables

Create a .env file in the project root

```bash
VITE_BACKEND_URL=<your-backend-url>
```

## Building for Mobile

The frontend can be built and synced using standard Capacitor commands

```bash
npx cap add android
npx cap sync
npx cap open android
```

An Android project is included in the repository.

## APK

An [APK](https://drive.google.com/file/d/1H_1uUO3TgDew6VjI5RacTKxotA-17-DX/view?usp=drive_link) build is available for installation and testing

## Project Status

This project is an MVP and is still under active development.
This repository is part of a two-repository setup (frontend and backend).