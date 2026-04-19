import "dotenv/config";
import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const adapter = new PrismaMariaDb({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionLimit: 5,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.field.createMany({
    data: [
      { name: "Information Technology" },
      { name: "Computer Science" },
      { name: "Business Administration" },
      { name: "Civil Engineering" },
      { name: "Electrical Engineering" },
      { name: "Mechanical Engineering" },
      { name: "Architecture" },
      { name: "Nursing" },
      { name: "Medicine" },
      { name: "Education" },
      { name: "Psychology" },
      { name: "Accountancy" },
      { name: "Tourism & Hospitality" },
      { name: "Communication" },
      { name: "Law" },
      { name: "Prefer not to say" },
    ],
    skipDuplicates: true,
  });

  console.log("✅ Fields seeded!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());