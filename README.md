# Codeflow Personal OS

A personal productivity system built with Next.js, Prisma, and Tailwind CSS.

## Installation

```bash
git clone https://github.com/your-username/codeflow-personal-os.git
cd codeflow-personal-os
npm install
```

## Environment Setup

Create a `.env` file:

```env
DATABASE_URL="your_database_url"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="oZTnODGlSusbNt5WPENHXnRcinQdMdJJiQw5wbsi7sA="
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=codeflow
DB_CONNECTION_LIMIT=5
```

## Database Setup

```bash
npx prisma generate
npx prisma migrate dev
```

## Run the App

```bash
npm run dev
```
