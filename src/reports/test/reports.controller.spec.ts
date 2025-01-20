import { Test, TestingModule } from '@nestjs/testing';
import { ReportsController } from '../reports.controller';
import { ReportsService } from '../reports.service';

describe('ReportsController', () => {
    let controller: ReportsController;
    let service: ReportsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ReportsController],
            providers: [
                {
                    provide: ReportsService,
                    useValue: {
                        getDeletedProductsPercentage: jest
                            .fn()
                            .mockResolvedValue({ percentage: 25 }),
                        getNonDeletedProductsPercentage: jest
                            .fn()
                            .mockResolvedValue({ percentage: 75 }),
                        getStatistics: jest.fn().mockResolvedValue({
                            success: true,
                            stats: [],
                            total: 0,
                        }),
                    },
                },
            ],
        }).compile();

        controller = module.get<ReportsController>(ReportsController);
        service = module.get<ReportsService>(ReportsService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('getDeletedPercentage', () => {
        it('should return deleted products percentage', async () => {
            const result = await controller.getDeletedPercentage();
            expect(result).toEqual({ percentage: 25 });
            expect(service.getDeletedProductsPercentage).toHaveBeenCalled();
        });
    });

    describe('getNonDeletedPercentage', () => {
        it('should return non-deleted products percentage with filters', async () => {
            const hasPrice = true;
            const startDate = new Date();
            const endDate = new Date();

            const result = await controller.getNonDeletedPercentage(
                hasPrice,
                startDate,
                endDate,
            );
            expect(result).toEqual({ percentage: 75 });
            expect(
                service.getNonDeletedProductsPercentage,
            ).toHaveBeenCalledWith(hasPrice, startDate, endDate);
        });
    });

    describe('getStatistics', () => {
        it('should return products statistics', async () => {
            const result = await controller.getStatistics();
            expect(result).toEqual({
                success: true,
                stats: [],
                total: 0,
            });
            expect(service.getStatistics).toHaveBeenCalled();
        });
    });
});
