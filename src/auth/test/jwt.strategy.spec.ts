import { Test, TestingModule } from '@nestjs/testing';
import { JwtStrategy } from '../jwt.strategy';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException } from '@nestjs/common';

describe('JwtStrategy', () => {
    let strategy: JwtStrategy;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                JwtStrategy,
                {
                    provide: ConfigService,
                    useValue: {
                        get: jest.fn().mockReturnValue('test-secret'),
                    },
                },
            ],
        }).compile();

        strategy = module.get<JwtStrategy>(JwtStrategy);
    });

    it('should be defined', () => {
        expect(strategy).toBeDefined();
    });

    describe('validate', () => {
        it('should return payload for valid token', async () => {
            const payload = { username: 'test', role: 'user' };
            const result = await strategy.validate(payload);
            expect(result).toEqual(payload);
        });

        it('should throw UnauthorizedException for invalid payload', async () => {
            await expect(strategy.validate(null)).rejects.toThrow(
                UnauthorizedException,
            );
        });
    });
});
