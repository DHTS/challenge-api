import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { TasksModule } from './tasks/tasks.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ReportsModule } from './reports/reports.module';

@Module({
    imports: [
        ConfigModule.forRoot(),
        MongooseModule.forRoot(process.env.MONGODB_URI),
        ProductsModule,
        TasksModule,
        ReportsModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
