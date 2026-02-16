const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Clearing existing applications...');
  await prisma.internshipApplication.deleteMany({});
  
  console.log('Clearing existing roles...');
  await prisma.internshipRole.deleteMany({});
  
  console.log('Seeding roles with slugs...');
  await prisma.internshipRole.create({
    data: { 
      title: 'Frontend Developer Intern', 
      slug: 'frontend-developer-intern', 
      department: 'Engineering', 
      type: 'Internship', 
      location: 'Remote' 
    }
  });
  
  await prisma.internshipRole.create({
    data: { 
      title: 'UI/UX Designer Intern', 
      slug: 'ui-ux-designer-intern', 
      department: 'Product', 
      type: 'Internship', 
      location: 'Remote' 
    }
  });
  
  await prisma.internshipRole.create({
    data: { 
      title: 'Content Creator Intern', 
      slug: 'content-creator-intern', 
      department: 'Marketing', 
      type: 'Internship', 
      location: 'Remote' 
    }
  });

  console.log('Seeding complete.');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
