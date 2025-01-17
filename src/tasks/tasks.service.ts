import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ProductsService } from '../products/products.service';

@Injectable()
export class TasksService {
    constructor(private readonly products: ProductsService) {}

    @Cron(CronExpression.EVERY_HOUR)
    async hourlyExecution() {
        try {
            const savedQuantity = await this.products.getAndSaveProducts();

            console.log(`${savedQuantity} products were upserted`);
        } catch (error) {
            console.error('TasksService.hourlyExecution: ', error);
        }
    }
}
