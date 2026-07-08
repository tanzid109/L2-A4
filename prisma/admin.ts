import "dotenv/config";
import bcrypt from "bcryptjs";
import { prisma } from "../src/lib/prisma";
import config from "../src/config";

async function main() {
  const existingAdmin = await prisma.user.findFirst({
    where: { role: "ADMIN" },
  });

  if (existingAdmin) {
    console.log("Admin already exists, skipping.");
    return;
  }

  const hashedPassword = await bcrypt.hash(config.admin_password as string, 10);

  await prisma.user.create({
    data: {
      name: "Super Admin",
      email: config.admin_email as string,
      password: hashedPassword,
      phone: config.admin_phone ?? "0000000000",
      role: "ADMIN",
      activeStatus: "ACTIVE",
    },
  });

  console.log("Admin created:", config.admin_email);
}

main()
  .catch((e) => console.error(e))
  .finally(async () => prisma.$disconnect());
