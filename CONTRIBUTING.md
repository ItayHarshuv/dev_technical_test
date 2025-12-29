# Contributing to Net Yield Return Simulator

Thank you for your interest in contributing to this project! This document provides project-specific guidelines and setup instructions.

## Table of Contents

- [Development Setup](#development-setup)
- [Making Changes](#making-changes)
- [Code Style Guidelines](#code-style-guidelines)
- [Project Structure](#project-structure)

## Development Setup

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 20 or higher)
- **npm** (comes with Node.js)
- **Docker** and **Docker Compose** (for containerized development)
- **Git**

### Option 1: Docker Development (Recommended)

This is the easiest way to get started as it handles all dependencies automatically.

1. **Start the development environment:**

   ```bash
   docker-compose up
   ```

2. **The application will be available at:**
   - Main application: http://localhost:3000
   - MongoDB: localhost:27017

3. **To stop the containers:**

   ```bash
   docker-compose down
   ```

4. **To rebuild containers after dependency changes:**
   ```bash
   docker-compose up --build
   ```

The Docker setup includes:

- Hot-reload development server (changes to `src/` are automatically reflected)
- MongoDB database
- All necessary environment variables

### Option 2: Local Development

If you prefer to run the project locally without Docker:

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Set up MongoDB:**
   - Install MongoDB locally, or
   - Use a cloud MongoDB instance (MongoDB Atlas)
   - Update the `MONGODB_URI` environment variable accordingly

3. **Create a `.env` file** (if needed):

   ```bash
   NODE_ENV=development
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/dev_technical_test
   ```

4. **Build the client-side TypeScript:**

   ```bash
   npm run build:client
   ```

   Or watch for changes:

   ```bash
   npm run watch:client
   ```

5. **Start the development server:**

   ```bash
   npm run dev
   ```

6. **The application will be available at:**
   - http://localhost:3000

### Building for Production

To build the project for production:

```bash
npm run build
```

This compiles both server and client TypeScript code.

## Making Changes

### Before Submitting

1. Make your code changes following the [Code Style Guidelines](#code-style-guidelines)
2. Test your changes locally
3. Ensure the code builds without errors:
   ```bash
   npm run build
   ```

### Commit Message Guidelines

When committing your changes, use clear and descriptive messages:

- Use present tense ("Add feature" not "Added feature")
- Use imperative mood ("Move cursor to..." not "Moves cursor to...")
- Keep the first line under 50 characters
- Add more details in the body if needed

Examples:

- `Add: admin page authentication`
- `Fix: calculation formula for monthly net return`
- `Update: MongoDB connection handling`

### Pull Request Guidelines

- Keep pull requests focused on a single feature or fix
- Ensure the code builds without errors
- Update documentation if needed
- Respond to review comments promptly

## Code Style Guidelines

### TypeScript

- Use **TypeScript** for all new code
- Follow **strict mode** settings (already configured in `tsconfig.json`)
- Use meaningful variable and function names
- Add type annotations where helpful
- Avoid `any` type when possible

### Code Formatting

- Use consistent indentation (spaces, not tabs)
- Keep lines under 100 characters when possible
- Add comments for complex logic
- Remove unused imports and variables

### Project-Specific Guidelines

- **Server-side code**: Place in `src/` directory
- **Client-side code**: Place in `src/js/` directory (compiled to `public/js/`)
- **Static assets**: Place in `public/` directory
- **Views/Templates**: Place in `src/views/` directory

### Example Code Structure

```typescript
// Good: Clear types, descriptive names
function calculateMonthlyNetIncome(
  purchasePrice: number,
  monthlyRent: number,
  annualFee: number,
): number {
  // Implementation
}

// Avoid: Unclear types, vague names
function calc(x: number, y: number, z: number): number {
  // Implementation
}
```

## Project Structure

```
dev_technical_test/
├── src/                    # Server-side TypeScript source
│   ├── app.ts             # Main application entry point
│   ├── config/            # Configuration files
│   ├── js/                # Client-side TypeScript source
│   └── views/             # EJS templates
├── public/                # Static assets (CSS, compiled JS)
│   ├── css/               # Stylesheets
│   └── js/                # Compiled client-side JavaScript
├── dist/                  # Compiled server-side JavaScript (generated)
├── docker-compose.yml     # Docker Compose configuration
├── Dockerfile             # Production Dockerfile
├── Dockerfile.dev         # Development Dockerfile
├── package.json           # Dependencies and scripts
├── tsconfig.json          # Server-side TypeScript config
└── tsconfig.client.json   # Client-side TypeScript config
```

## Getting Help

If you need help or have questions:

1. Check existing issues and pull requests
2. Review the README.md for project overview
3. Open a new issue with your question
