# LinkedIn Chrome Extension

## Tech Stack
- Next.js, tRPC, TailwindCSS, PostgreSQL, Prisma

## Description
- This is a Chrome Extension that can scrape LinkedIn connections from the user
- Under development


## Setup & Installation
- Clone the project
  
  ```bash
  git clone https://github.com/thanhnguyen123-dev/LinkedIn-Chrome-Extension.git
  ```
- Setup necessary dependencies
  
  ```bash
  # Install dependencies
  pnpm i
  
  # Configure environment variables
  # There is an `.env.example` in the root directory you can use for reference
  cp .env.example .env
  ```
- Build the extension
  
  ```bash
  cd apps/extension
  npm run build
  ```
- Go to chrome://extensions and click "Load unpacked", then find the `dist` folder in `apps/extension`
- More instructions will be added in the future with more incoming features
  


