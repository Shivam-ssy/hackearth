import { Module } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseModule } from './database/database.module.js';
import { MongooseModule } from '@nestjs/mongoose';
import { PermissionModule } from './permission/permission.module.js';
import { SessionModule } from './session/session.module.js';
import { RoleModule } from './role/role.module.js';
import { UserModule } from './user/user.module.js';
import { AuthModule } from './auth/auth.module.js';
import configuration from './config/configuration.js';
import { SeedersModule } from './database/seeder/seeder.module.js';
import { HackthonModule } from './hackthon/hackthon.module.js';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    // Distributed tracing, auto-correlated logs, request/job metrics, error
    // telemetry, alarms, and more — out of the box. Sign up at https://observe.nestjs.com
    // ObserveModule.forRoot({
    //   appKey: 'YOUR_APP_KEY',
    //   appSecret: 'YOUR_APP_SECRET',
    //   serviceId: 'hackearth',
    // }),

    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration]
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('MONGO_URI'), // mongodb+srv://... or mongodb://localhost/dbname
      }),
    }),
    PermissionModule,
    SessionModule,
    RoleModule,
    UserModule,
    AuthModule,
    SeedersModule,
    HackthonModule, // Add the SeedersModule here
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
