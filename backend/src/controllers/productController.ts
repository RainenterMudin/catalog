import { Request, Response } from 'express';
import prisma from '../utils/prisma';

export const getProducts = async (req: Request, res: Response) => {
  try {
    const { subCategoryId, categoryId } = req.query;
    let where: any = {};
    if (subCategoryId) {
      where.subCategoryId = Number(subCategoryId);
    } else if (categoryId) {
      where.subCategory = { categoryId: Number(categoryId) };
    }
    
    const products = await prisma.product.findMany({
      where,
      include: { subCategory: { include: { category: true } } }
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    let whereClause: any = {};
    if (!isNaN(Number(id))) {
      whereClause = { id: Number(id) };
    } else {
      whereClause = { slug: id };
    }
    const product = await prisma.product.findUnique({ 
      where: whereClause,
      include: { subCategory: { include: { category: true } } }
    });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch product' });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, description, price, subCategoryId } = req.body;
    const imageUrl = req.file ? req.file.path : null;
    
    const slugify = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    let baseSlug = slugify(name);
    let slug = baseSlug;
    let count = 1;
    while (await prisma.product.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${count}`;
      count++;
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: Number(price),
        slug,
        subCategoryId: Number(subCategoryId),
        imageUrl
      },
    });
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create product' });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, price, subCategoryId } = req.body;
    
    const data: any = {
      name,
      description,
      price: price ? Number(price) : undefined,
      subCategoryId: subCategoryId ? Number(subCategoryId) : undefined,
    };

    if (name) {
      const slugify = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      let baseSlug = slugify(name);
      let slug = baseSlug;
      let count = 1;
      while (await prisma.product.findFirst({ where: { slug, id: { not: Number(id) } } })) {
        slug = `${baseSlug}-${count}`;
        count++;
      }
      data.slug = slug;
    }

    if (req.file) {
      data.imageUrl = req.file.path;
    }

    const product = await prisma.product.update({
      where: { id: Number(id) },
      data,
    });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update product' });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.product.delete({ where: { id: Number(id) } });
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
};
