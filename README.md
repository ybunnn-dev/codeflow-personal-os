# Codeflow Personal OS

A personal productivity system built with Next.js, Prisma, and Tailwind CSS.

## Installation

```bash
git clone https://github.com/ybunnn-dev/codeflow-personal-os
cd codeflow-personal-os
npm install
```

## Environment Setup

1. Create a database named `codeflow` in MySQL.

2. Generate your authentication secret:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

3. Create a `.env` file in the root directory:

```env
DATABASE_URL="your_database_url"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="paste_generated_secret_here"

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
