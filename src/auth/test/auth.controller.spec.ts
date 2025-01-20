import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';

describe('AuthController', () => {
    let controller: AuthController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [
                {
                    provide: AuthService,
                    useValue: {
                        generateToken: jest
                            .fn()
                            .mockResolvedValue('test-token'),
                    },
                },
            ],
        }).compile();

        controller = module.get<AuthController>(AuthController);
    });

    it('should generate token', async () => {
        const payload = { userId: '1', username: 'test' };
        const result = await controller.generateToken(payload);
        expect(result).toEqual({ token: 'test-token' });
    });
});
