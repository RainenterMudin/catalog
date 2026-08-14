import prisma from './src/utils/prisma';

const slugify = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

async function main() {
  const products = await prisma.product.findMany({
    where: { slug: null }
  });

  for (const product of products) {
    let baseSlug = slugify(product.name);
    let slug = baseSlug;
    let count = 1;

    while (true) {
      const existing = await prisma.product.findUnique({ where: { slug } });
      if (!existing) {
        break;
      }
      slug = `${baseSlug}-${count}`;
      count++;
    }

    await prisma.product.update({
      where: { id: product.id },
      data: { slug }
    });
    console.log(`Updated product ${product.id} with slug: ${slug}`);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
