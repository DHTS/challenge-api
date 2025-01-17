import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksService } from './tasks.service';
import { ProductsModule } from 'src/products/products.module';
import { HttpModule } from '@nestjs/axios';

@Module({
    imports: [ScheduleModule.forRoot(), ProductsModule, HttpModule],
    controllers: [],
    providers: [TasksService],
})
export class TasksModule {}
