import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class PaginationQueryDto {
    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    category?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsNumber()
    minPrice?: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsNumber()
    maxPrice?: number;

    @ApiProperty({ default: 1, required: false })
    @IsNumber()
    @IsOptional()
    @Min(1)
    page?: number = 1;

    @ApiProperty({ default: 5, required: false })
    @IsNumber()
    @IsOptional()
    @Min(1)
    limit?: number = 5;
}
