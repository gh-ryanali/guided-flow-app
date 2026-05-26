# Guided Flow Pricing App

A simple web-based guided flow app for service recommendation, pricing guidance, and document checklist results.

## Run locally

1. Install Node.js from https://nodejs.org
2. Open this folder in VS Code or Terminal
3. Run:

```bash
npm install
npm run dev
```

Then open the local link shown in the terminal.

## Publish on Vercel

1. Create a GitHub account.
2. Create a new GitHub repository.
3. Upload this full project folder to the repository.
4. Create a Vercel account.
5. Click Add New Project in Vercel.
6. Import the GitHub repository.
7. Use these default settings:
   - Framework: Vite
   - Build command: npm run build
   - Output directory: dist
8. Click Deploy.

Vercel will give you a live web link.

## User access

This first version is a public web app. Anyone with the Vercel link can open it.

For restricted access, add login later using Supabase, Firebase, Clerk, or Auth0.

## Editing questions and pricing

Open `src/App.jsx` and edit the `FLOW` object. You can change:

- Questions
- Answer options
- Result pages
- Pricing text
- Document checklist
- Flow routing
