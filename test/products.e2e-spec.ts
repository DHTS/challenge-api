import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app/app.module';

describe('ProductsModule (e2e)', () => {
    let app: INestApplication;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    it('GET /products - should return paginated products', () => {
        return request(app.getHttpServer())
            .get('/products')
            .query({ page: 1, limit: 5 })
            .expect(200)
            .then((response) => {
                expect(response.body).toHaveProperty('items');
                expect(response.body).toHaveProperty('meta');
            });
    });
});
