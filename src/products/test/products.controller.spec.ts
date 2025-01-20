import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from '../products.service';
import { getModelToken } from '@nestjs/mongoose';
import { Product } from '../schemas/product.schema';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';
import { NotFoundException } from '@nestjs/common';

describe('ProductsService', () => {
    let service: ProductsService;
    let model: Model<Product>;

    const mockProduct = {
        _id: 'test-id',
        name: 'Test Product',
        sku: 'TEST123',
        price: 100,
        category: 'test',
        deleted: false,
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ProductsService,
                {
                    provide: getModelToken(Product.name),
                    useValue: {
                        find: jest.fn().mockReturnThis(),
                        findById: jest.fn(),
                        findByIdAndUpdate: jest.fn(),
                        countDocuments: jest.fn(),
                        skip: jest.fn().mockReturnThis(),
                        limit: jest.fn().mockReturnThis(),
                        exec: jest.fn(),
                    },
                },
                {
                    provide: HttpService,
                    useValue: {
                        get: jest.fn(),
                    },
                },
                {
                    provide: ConfigService,
                    useValue: {
                        get: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<ProductsService>(ProductsService);
        model = module.get<Model<Product>>(getModelToken(Product.name));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('getPaginatedProducts', () => {
        it('should return paginated products', async () => {
            const mockProducts = [mockProduct];
            const mockTotal = 1;

            jest.spyOn(model, 'find').mockImplementation(
                () =>
                    ({
                        skip: () => ({
                            limit: () => ({
                                exec: jest.fn().mockResolvedValue(mockProducts),
                            }),
                        }),
                    }) as any,
            );

            jest.spyOn(model, 'countDocuments').mockResolvedValue(mockTotal);

            const result = await service.findAll({
                page: 1,
                limit: 5,
            });

            expect(result).toEqual({
                items: mockProducts,
                total: mockTotal,
                page: 1,
                pages: 1,
            });
        });
    });

    describe('deleteProduct', () => {
        it('should soft delete a product', async () => {
            jest.spyOn(model, 'findByIdAndUpdate').mockResolvedValue(
                mockProduct,
            );

            const result = await service.deleteProduct('test-id');
            expect(result).toEqual(mockProduct);
        });

        it('should throw NotFoundException if product not found', async () => {
            jest.spyOn(model, 'findByIdAndUpdate').mockResolvedValue(null);

            await expect(service.deleteProduct('invalid-id')).rejects.toThrow(
                NotFoundException,
            );
        });
    });
});
