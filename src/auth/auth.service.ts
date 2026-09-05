import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service.js';

@Injectable()
export class AuthService {
    constructor(private readonly userService: UserService) {}
    registerUser(userData: any) {
        return this.userService.create(userData);
    }
    loginUser(loginData: any) {
        return this.userService.loginUser(loginData);
    }
}
