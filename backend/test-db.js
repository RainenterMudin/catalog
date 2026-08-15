const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const productsCount = await prisma.product.count();
    const categoriesCount = await prisma.category.count();
    console.log(`Connection successful!`);
    console.log(`Products in DB: ${productsCount}`);
    console.log(`Categories in DB: ${categoriesCount}`);
  } catch (e) {
    console.error("Database connection failed:");
    console.error(e.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
