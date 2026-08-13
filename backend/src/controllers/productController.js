"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getProductById = exports.getProducts = void 0;
const express_1 = require("express");
const prisma_1 = __importDefault(require("../utils/prisma"));
const getProducts = async (req, res) => {
    try {
        const { categoryId } = req.query;
        const where = categoryId ? { categoryId: Number(categoryId) } : {};
        const products = await prisma_1.default.product.findMany({
            where,
            include: { category: true }
        });
        res.json(products);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch products' });
    }
};
exports.getProducts = getProducts;
const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await prisma_1.default.product.findUnique({
            where: { id: Number(id) },
            include: { category: true }
        });
        if (!product)
            return res.status(404).json({ error: 'Product not found' });
        res.json(product);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch product' });
    }
};
exports.getProductById = getProductById;
const createProduct = async (req, res) => {
    try {
        const { name, description, price, categoryId } = req.body;
        const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
        const product = await prisma_1.default.product.create({
            data: {
                name,
                description,
                price: Number(price),
                categoryId: Number(categoryId),
                imageUrl
            },
        });
        res.status(201).json(product);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to create product' });
    }
};
exports.createProduct = createProduct;
const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price, categoryId } = req.body;
        const data = {
            name,
            description,
            price: price ? Number(price) : undefined,
            categoryId: categoryId ? Number(categoryId) : undefined,
        };
        if (req.file) {
            data.imageUrl = `/uploads/${req.file.filename}`;
        }
        const product = await prisma_1.default.product.update({
            where: { id: Number(id) },
            data,
        });
        res.json(product);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to update product' });
    }
};
exports.updateProduct = updateProduct;
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma_1.default.product.delete({ where: { id: Number(id) } });
        res.json({ message: 'Product deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to delete product' });
    }
};
exports.deleteProduct = deleteProduct;
//# sourceMappingURL=productController.js.map