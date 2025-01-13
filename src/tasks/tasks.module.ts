import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksService } from './tasks.service';
import { ProductsModule } from 'src/products/products.module';

@Module({
  imports: [ScheduleModule.forRoot(), ProductsModule],
  controllers: [],
  providers: [TasksService],
})
export class TasksModule {}
