import { Request, Response } from 'express';
import prisma from '../utils/prisma';

export const getSubCategories = async (req: Request, res: Response) => {
  try {
    const subCategories = await prisma.subCategory.findMany({
      include: { category: true }
    });
    res.json(subCategories);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch sub-categories' });
  }
};

export const getSubCategoryById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const subCategory = await prisma.subCategory.findUnique({ 
      where: { id: Number(id) },
      include: { category: true }
    });
    if (!subCategory) return res.status(404).json({ error: 'Sub-Category not found' });
    res.json(subCategory);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch sub-category' });
  }
};

export const createSubCategory = async (req: Request, res: Response) => {
  try {
    const { name, description, categoryId } = req.body;
    const subCategory = await prisma.subCategory.create({
      data: { name, description, categoryId: Number(categoryId) },
    });
    res.status(201).json(subCategory);
  } catch (error: any) {
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Sub-category name already exists' });
    }
    res.status(500).json({ error: 'Failed to create sub-category' });
  }
};

export const updateSubCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, categoryId } = req.body;
    const subCategory = await prisma.subCategory.update({
      where: { id: Number(id) },
      data: { name, description, categoryId: Number(categoryId) },
    });
    res.json(subCategory);
  } catch (error: any) {
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Sub-category name already exists' });
    }
    res.status(500).json({ error: 'Failed to update sub-category' });
  }
};

export const deleteSubCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.subCategory.delete({ where: { id: Number(id) } });
    res.json({ message: 'Sub-category deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete sub-category' });
  }
};
