import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ProductsService } from 'src/products/products.service';

@Injectable()
export class TasksService {
    constructor(private readonly products: ProductsService) {
        // empty
    }
    @Cron(CronExpression.EVERY_HOUR)
    async hourlyExecution() {
        const response: IProducts = await this.products.getProducts();

        console.log(response.items[0]);
    }
}
