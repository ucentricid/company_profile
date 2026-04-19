const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function debug() {
  console.log('--- Users ---');
  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true }
  });
  console.log(JSON.stringify(users, null, 2));

  console.log('\n--- Portfolio Posts ---');
  const posts = await prisma.portfolioPost.findMany({
    include: { User: { select: { name: true } } }
  });
  console.log(JSON.stringify(posts, null, 2));

  await prisma.$disconnect();
}

debug();
