import { Schema, model, Document } from 'mongoose';
import { BaseTime, PreSaveAddingTimeStamp } from './base';

export interface Product {
    name: string;
    barcode: string;
}

export interface ProductModel extends Product, BaseTime, Document { }

const modelSchema = new Schema({
    name: { type: String, required: false },
    barcode: { type: String, required: true, unique: true },
    description: String,
});

modelSchema.pre('save', PreSaveAddingTimeStamp);

////// Create Model /////

export const ProductModel = model<ProductModel>('Product', modelSchema);

////// Functions ////////

export function getProducts(limit = 100) {
    return ProductModel.find().limit(limit);
}

export function addProduct(input: Product) {
    const rec = new ProductModel(input);
    rec.save();
    return rec;
}

export function removeProduct(root, { id }) {
    return ProductModel.findByIdAndRemove(id);
}
