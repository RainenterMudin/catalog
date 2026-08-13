"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategory = exports.updateCategory = exports.createCategory = exports.getCategoryById = exports.getCategories = void 0;
const express_1 = require("express");
const prisma_1 = __importDefault(require("../utils/prisma"));
const getCategories = async (req, res) => {
    try {
        const categories = await prisma_1.default.category.findMany();
        res.json(categories);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch categories' });
    }
};
exports.getCategories = getCategories;
const getCategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await prisma_1.default.category.findUnique({ where: { id: Number(id) } });
        if (!category)
            return res.status(404).json({ error: 'Category not found' });
        res.json(category);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch category' });
    }
};
exports.getCategoryById = getCategoryById;
const createCategory = async (req, res) => {
    try {
        const { name, description } = req.body;
        const category = await prisma_1.default.category.create({
            data: { name, description },
        });
        res.status(201).json(category);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to create category' });
    }
};
exports.createCategory = createCategory;
const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;
        const category = await prisma_1.default.category.update({
            where: { id: Number(id) },
            data: { name, description },
        });
        res.json(category);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to update category' });
    }
};
exports.updateCategory = updateCategory;
const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma_1.default.category.delete({ where: { id: Number(id) } });
        res.json({ message: 'Category deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to delete category' });
    }
};
exports.deleteCategory = deleteCategory;
//# sourceMappingURL=categoryController.js.map