import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { JwtService } from '@nestjs/jwt';

describe('AuthService', () => {
    let service: AuthService;
    let jwtService: JwtService;

    const mockPayload = {
        userId: '123',
        username: 'testuser',
        role: 'user',
    };

    const mockToken = 'mock.jwt.token';

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: JwtService,
                    useValue: {
                        sign: jest.fn().mockReturnValue(mockToken),
                        verify: jest.fn().mockImplementation((token) => {
                            if (token === mockToken) {
                                return mockPayload;
                            }
                            throw new Error('Invalid token');
                        }),
                    },
                },
            ],
        }).compile();

        service = module.get<AuthService>(AuthService);
        jwtService = module.get<JwtService>(JwtService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('generateToken', () => {
        it('should generate a JWT token', async () => {
            const result = await service.generateToken(mockPayload);

            expect(jwtService.sign).toHaveBeenCalledWith(mockPayload);
            expect(result).toBe(mockToken);
        });
    });

    describe('validateToken', () => {
        it('should return payload for valid token', async () => {
            const result = await service.validateToken(mockToken);

            expect(jwtService.verify).toHaveBeenCalledWith(mockToken);
            expect(result).toEqual(mockPayload);
        });

        it('should return null for invalid token', async () => {
            const invalidToken = 'invalid.token';
            const result = await service.validateToken(invalidToken);

            expect(jwtService.verify).toHaveBeenCalledWith(invalidToken);
            expect(result).toBeNull();
        });

        it('should return null when verification throws error', async () => {
            jest.spyOn(jwtService, 'verify').mockImplementation(() => {
                throw new Error('Token verification failed');
            });

            const result = await service.validateToken(mockToken);

            expect(jwtService.verify).toHaveBeenCalledWith(mockToken);
            expect(result).toBeNull();
        });
    });
});
