import { Body, Controller, HttpCode, HttpStatus, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { LoginDto, RegisterDto } from './dto/auth.dto.js';
import type { Request } from 'express';
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('register')
    registerUser(@Body() dto: RegisterDto) {
        // console.log('Registering user with data:', dto);
        return this.authService.registerUser(dto);
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    loginUser(@Body() dto: LoginDto, @Req() req: Request) {
        // console.log('Logging in user with data:', dto);
        return this.authService.loginUser({ ...dto, ip: req.ip, userAgent: req.headers['user-agent'] });
    }
}
