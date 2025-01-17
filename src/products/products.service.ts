import { Injectable, NotFoundException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';
import { AxiosResponse } from 'axios';
import { InjectModel } from '@nestjs/mongoose';
import { Product, ProductDocument } from './schemas/product.schema';
import { Model } from 'mongoose';
import { PaginationQueryDto } from './dto/pagination-query.dto';

@Injectable()
export class ProductsService {
    constructor(
        @InjectModel(Product.name)
        private productModel: Model<ProductDocument>,
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
    ) {}

    async findAll(paginationQuery: PaginationQueryDto) {
        const {
            page = 1,
            limit = 5,
            name,
            category,
            minPrice,
            maxPrice,
        } = paginationQuery;
        const skip = (page - 1) * limit;

        const query: any = { deleted: false };
        if (name) query.name = { $regex: name, $options: 'i' };
        if (category) query.category = category;
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = minPrice;
            if (maxPrice) query.price.$lte = maxPrice;
        }

        const [items, total] = await Promise.all([
            this.productModel.find(query).skip(skip).limit(limit).exec(),
            this.productModel.countDocuments(query),
        ]);

        return {
            items,
            total,
            page,
            pages: Math.ceil(total / limit),
        };
    }

    async getProducts(): Promise<IProducts> {
        try {
            const url = this.getUrl();

            const response: AxiosResponse<IProducts> = await lastValueFrom(
                this.httpService.get(url),
            );

            return response.data;
        } catch (error) {
            console.error('ProductsService.getProducts: ', error);
            throw error;
        }
    }

    private getUrl() {
        const url = new URL('https://cdn.contentful.com');

        const spaceId = this.configService.get('CONTENTFUL_SPACE_ID');
        const environment = this.configService.get('CONTENTFUL_ENVIRONMENT');
        const access_token = this.configService.get('CONTENTFUL_ACCESS_TOKEN');
        const content_type = this.configService.get('CONTENTFUL_CONTENT_TYPE');

        url.pathname = `/spaces/${spaceId}/environments/${environment}/entries`;
        url.searchParams.append('access_token', access_token);
        url.searchParams.append('content_type', content_type);

        return url.toString();
    }

    mapProducts(productList: IProducts) {
        return productList.items.map((product) => product.fields);
    }

    async saveProducts(productList: IProductFields[]): Promise<void> {
        try {
            const operations = productList.map((product) => ({
                updateOne: {
                    filter: { sku: product.sku },
                    update: { $set: { ...product, deleted: false } },
                    upsert: true,
                },
            }));

            await this.productModel.bulkWrite(operations);
        } catch (error) {
            console.error('ProductsService.saveProducts: ', error);
            throw error;
        }
    }

    async getAndSaveProducts(): Promise<number> {
        try {
            const response: IProducts = await this.getProducts();
            const mappedProducts = this.mapProducts(response);
            await this.saveProducts(mappedProducts);
            return mappedProducts.length;
        } catch (error) {
            console.error('ProductsService.getAndSaveProducts: ', error);
            throw error;
        }
    }

    async deleteProduct(id: string): Promise<Product> {
        const product = await this.productModel.findByIdAndUpdate(
            id,
            { deleted: true },
            { new: true },
        );

        if (!product) {
            throw new NotFoundException(`Product with id ${id} not found`);
        }

        return product;
    }
}
