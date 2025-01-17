import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('token')
    async generateToken(@Body() payload: any): Promise<{ token: string }> {
        const token = await this.authService.generateToken(payload);
        return { token };
    }
}
