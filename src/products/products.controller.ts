import { Controller, Delete, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { PaginationQueryDto } from './dto/pagination-query.dto';

@ApiTags('products')
@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) {}

    @Get()
    @ApiOperation({ summary: 'Get products paginated' })
    @ApiResponse({
        status: 200,
        description: 'Returns products paginated',
        schema: {
            properties: {
                items: { type: 'array' },
                total: { type: 'number' },
                page: { type: 'number' },
                pages: { type: 'number' },
            },
        },
    })
    async findAll(@Query() paginationQuery: PaginationQueryDto) {
        return this.productsService.findAll(paginationQuery);
    }

    @Get('sync')
    @ApiOperation({ summary: 'Sync products from Contentful' })
    @ApiResponse({
        status: 200,
        description: 'Products synchronized from Contentful API',
        type: Number,
    })
    async getProducts() {
        return this.productsService.getAndSaveProducts();
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Soft delete a product' })
    @ApiResponse({
        status: 200,
        description: 'Product marked as deleted',
    })
    async deleteProduct(@Param('id') id: string) {
        return this.productsService.deleteProduct(id);
    }
}
