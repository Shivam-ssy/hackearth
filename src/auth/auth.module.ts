import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import { UserModule } from '../user/user.module.js';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy.js';
import { ConfigModule, ConfigService } from '@nestjs/config';
import type { StringValue } from 'ms';
import { PermissionsGuard } from './guards/permissions/permissions.guard.js';

@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),

    JwtModule.registerAsync({
      imports: [ConfigModule], // Important
      inject: [ConfigService],

      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>(
          'accessToken.secret',
        ),

        signOptions: {
          expiresIn: configService.getOrThrow<string>(
            'accessToken.expiresIn',
          ) as StringValue,
        },
      }),
    }),

    UserModule,
  ],

  controllers: [AuthController],

  providers: [
    AuthService,
    JwtStrategy,
    PermissionsGuard,
  ],

  exports: [
    AuthService,
    PermissionsGuard,

    // Make Passport configuration available
    PassportModule,
  ],
})
export class AuthModule {}