import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = "admin@demo.com";
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return;
  }

  const passwordHash = await bcrypt.hash("123456", 10);
  const admin = await prisma.user.create({
    data: {
      name: "Admin Demo",
      email,
      passwordHash
    }
  });

  const client = await prisma.client.create({
    data: {
      name: "Carlos Souza",
      phone: "(11) 99999-0000",
      email: "carlos@email.com",
      notes: "Cliente recorrente",
      ownerId: admin.id
    }
  });

  await prisma.appointment.create({
    data: {
      title: "Corte + Barba",
      startAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
      endAt: new Date(Date.now() + 1000 * 60 * 60 * 25),
      status: "confirmed",
      notes: "Usar navalha premium",
      ownerId: admin.id,
      clientId: client.id
    }
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
