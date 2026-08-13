"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma = new client_1.PrismaClient();
async function main() {
    // Create admin user
    const hashedPassword = await bcrypt_1.default.hash('admin123', 10);
    const admin = await prisma.user.upsert({
        where: { email: 'admin@catalog.local' },
        update: {},
        create: {
            email: 'admin@catalog.local',
            name: 'Administrator',
            password: hashedPassword,
        },
    });
    // Create some categories
    const cat1 = await prisma.category.create({
        data: {
            name: 'Electronics',
            description: 'Gadgets and devices',
        }
    });
    const cat2 = await prisma.category.create({
        data: {
            name: 'Clothing',
            description: 'Apparel and accessories',
        }
    });
    // Create some products
    await prisma.product.create({
        data: {
            name: 'Laptop Pro',
            description: 'High performance laptop',
            price: 1500.00,
            categoryId: cat1.id,
        }
    });
    await prisma.product.create({
        data: {
            name: 'Cotton T-Shirt',
            description: 'Comfortable cotton t-shirt',
            price: 25.00,
            categoryId: cat2.id,
        }
    });
    console.log('Seed data created successfully');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map