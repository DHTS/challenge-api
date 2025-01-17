import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from '../products/schemas/product.schema';

@Injectable()
export class ReportsService {
    constructor(
        @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    ) {}

    async getDeletedProductsPercentage(): Promise<{ percentage: number }> {
        const [deletedCount, totalCount] = await Promise.all([
            this.productModel.countDocuments({ deleted: true }),
            this.productModel.countDocuments({}),
        ]);

        const percentage =
            totalCount > 0 ? (deletedCount / totalCount) * 100 : 0;
        return { percentage };
    }

    async getNonDeletedProductsPercentage(
        hasPrice?: boolean,
        startDate?: Date,
        endDate?: Date,
    ): Promise<{ percentage: number }> {
        const query: any = { deleted: false };

        if (hasPrice !== undefined) {
            query.price = hasPrice ? { $ne: null } : null;
        }

        if (startDate) {
            query.createdAt = query.createdAt || {};
            query.createdAt.$gte = startDate;
        }

        if (endDate) {
            query.createdAt = query.createdAt || {};
            query.createdAt.$lte = endDate;
        }

        const [filteredCount, totalNonDeletedCount] = await Promise.all([
            this.productModel.countDocuments(query),
            this.productModel.countDocuments({ deleted: false }),
        ]);

        const percentage =
            totalNonDeletedCount > 0
                ? (filteredCount / totalNonDeletedCount) * 100
                : 0;

        return { percentage };
    }

    async getStatistics() {
        try {
            const stats = await this.productModel.aggregate([
                {
                    $match: { deleted: false },
                },
                {
                    $group: {
                        _id: '$category',
                        count: { $sum: 1 },
                        avgPrice: { $avg: '$price' },
                        minPrice: { $min: '$price' },
                        maxPrice: { $max: '$price' },
                    },
                },
                {
                    $project: {
                        category: '$_id',
                        count: 1,
                        avgPrice: { $round: ['$avgPrice', 2] },
                        minPrice: 1,
                        maxPrice: 1,
                        _id: 0,
                    },
                },
                {
                    $sort: { count: -1 },
                },
            ]);

            return {
                success: true,
                stats,
                total: stats.reduce((acc, curr) => acc + curr.count, 0),
            };
        } catch (error) {
            console.error('ReportsService.getStatistics', error);
            throw new Error('Error get product statistics');
        }
    }
}
