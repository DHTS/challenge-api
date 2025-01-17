import { Test, TestingModule } from '@nestjs/testing';
import { ReportsService } from '../reports.service';
import { getModelToken } from '@nestjs/mongoose';
import { Product } from '../../products/schemas/product.schema';
import { Model } from 'mongoose';

describe('ReportsService', () => {
    let service: ReportsService;
    let model: Model<Product>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ReportsService,
                {
                    provide: getModelToken(Product.name),
                    useValue: {
                        countDocuments: jest.fn(),
                        aggregate: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<ReportsService>(ReportsService);
        model = module.get<Model<Product>>(getModelToken(Product.name));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('getDeletedProductsPercentage', () => {
        it('should calculate percentage of deleted products', async () => {
            jest.spyOn(model, 'countDocuments')
                .mockResolvedValueOnce(2) // deleted count
                .mockResolvedValueOnce(10); // total count

            const result = await service.getDeletedProductsPercentage();
            expect(result).toEqual({ percentage: 20 });
        });

        it('should return 0 when no products exist', async () => {
            jest.spyOn(model, 'countDocuments')
                .mockResolvedValueOnce(0)
                .mockResolvedValueOnce(0);

            const result = await service.getDeletedProductsPercentage();
            expect(result).toEqual({ percentage: 0 });
        });
    });

    describe('getNonDeletedProductsPercentage', () => {
        it('should calculate percentage with filters', async () => {
            jest.spyOn(model, 'countDocuments')
                .mockResolvedValueOnce(3) // filtered count
                .mockResolvedValueOnce(6); // total non-deleted count

            const result = await service.getNonDeletedProductsPercentage(true);
            expect(result).toEqual({ percentage: 50 });
        });
    });
});
