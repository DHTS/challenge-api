import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from '../tasks.service';
import { ProductsService } from '../../products/products.service';

describe('TasksService', () => {
    let service: TasksService;
    let productsService: ProductsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                TasksService,
                {
                    provide: ProductsService,
                    useValue: {
                        getAndSaveProducts: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<TasksService>(TasksService);
        productsService = module.get<ProductsService>(ProductsService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
        expect(productsService).toBeDefined();
    });

    describe('hourlyExecution', () => {
        let consoleSpy;
        let consoleErrorSpy;

        beforeEach(() => {
            consoleSpy = jest.spyOn(console, 'log').mockImplementation();
            consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
        });

        afterEach(() => {
            consoleSpy.mockRestore();
            consoleErrorSpy.mockRestore();
        });

        it('should call getAndSaveProducts and log success', async () => {
            const mockSavedCount = 5;
            jest.spyOn(productsService, 'getAndSaveProducts').mockResolvedValue(
                mockSavedCount,
            );

            await service.hourlyExecution();

            expect(productsService.getAndSaveProducts).toHaveBeenCalled();
            expect(consoleSpy).toHaveBeenCalledWith('5 products were upserted');
        });

        it('should handle errors gracefully', async () => {
            const testError = new Error('Test error');
            jest.spyOn(productsService, 'getAndSaveProducts').mockRejectedValue(
                testError,
            );

            await service.hourlyExecution();

            expect(consoleErrorSpy).toHaveBeenCalledWith(
                'TasksService.hourlyExecution: ',
                testError,
            );
        });
    });
});
