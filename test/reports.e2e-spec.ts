import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { JwtService } from '@nestjs/jwt';

describe('ReportsModule (e2e)', () => {
    let app: INestApplication;
    let jwtService: JwtService;
    let jwtToken: string;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        jwtService = moduleFixture.get<JwtService>(JwtService);

        await app.init();

        // Generate JWT token
        jwtToken = jwtService.sign(
            { userId: 'test-user-id' },
            { secret: '8e650e15-1238-4e87-9c1f-e911a824393e' },
        );
    });

    afterAll(async () => {
        await app.close();
    });

    it('GET /reports/products-statistics - should return 401 without token', () => {
        return request(app.getHttpServer())
            .get('/reports/products-statistics')
            .expect(401);
    });

    it('GET /reports/products-statistics - should return statistics with valid token', () => {
        return request(app.getHttpServer())
            .get('/reports/products-statistics')
            .set('Authorization', `Bearer ${jwtToken}`)
            .expect(200)
            .then((response) => {
                expect(response.body).toHaveProperty('totalProducts');
                expect(response.body).toHaveProperty('deletedPercentage');
            });
    });
});
