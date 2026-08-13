import { Request, Response } from 'express';
import prisma from '../utils/prisma';

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const totalProducts = await prisma.product.count();
    const totalCategories = await prisma.category.count();
    const totalSubCategories = await prisma.subCategory.count();

    res.json({
      totalProducts,
      totalCategories,
      totalSubCategories
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
};
