import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type ProductDocument = Product & Document;

@Schema()
export class Product {
    @Prop()
    sku: string;
    @Prop()
    name: string;
    @Prop()
    brand: string;
    @Prop()
    model: string;
    @Prop()
    category: string;
    @Prop()
    color: string;
    @Prop()
    price: number;
    @Prop()
    currency: string;
    @Prop()
    stock: number;
    @Prop({ default: false })
    deleted: boolean;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
