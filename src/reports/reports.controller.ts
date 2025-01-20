import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth-guard';
import {
    ApiTags,
    ApiOperation,
    ApiBearerAuth,
    ApiQuery,
} from '@nestjs/swagger';

@ApiTags('Reports')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('reports')
export class ReportsController {
    constructor(private readonly reportsService: ReportsService) {}

    @Get('deleted-percentage')
    @ApiOperation({ summary: 'Get percentage of deleted products' })
    async getDeletedPercentage() {
        return await this.reportsService.getDeletedProductsPercentage();
    }

    @Get('non-deleted-percentage')
    @ApiOperation({
        summary: 'Get percentage of non-deleted products with filters',
    })
    @ApiQuery({
        name: 'startDate',
        required: false,
        type: String,
        description: 'Start date in the format DD-MM-YY',
        example: '24-01-01',
    })
    @ApiQuery({
        name: 'endDate',
        required: false,
        type: String,
        description: 'End date in the format DD-MM-YY',
        example: '24-01-01',
    })
    async getNonDeletedPercentage(
        @Query('hasPrice') hasPrice?: boolean,
        @Query('startDate') startDate?: Date,
        @Query('endDate') endDate?: Date,
    ) {
        return await this.reportsService.getNonDeletedProductsPercentage(
            hasPrice,
            startDate,
            endDate,
        );
    }

    @Get('products-statistics')
    @ApiOperation({ summary: 'Get quantity of products by category' })
    async getStatistics() {
        return await this.reportsService.getStatistics();
    }
}
