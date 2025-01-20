import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app/app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const config = new DocumentBuilder()
        .setTitle('Products API')
        .setDescription(
            `
        Products API with Contentful integration.
        - Public endpoints for product management
        - Private endpoints for reports
        - Pagination and filtering
        - Hourly product sync
    `,
        )
        .setVersion('1.0')
        .addTag('products', 'Product endpoints')
        .addTag('reports', 'reporting endpoints')
        .addBearerAuth()
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);

    await app.listen(3000);
}
bootstrap();
