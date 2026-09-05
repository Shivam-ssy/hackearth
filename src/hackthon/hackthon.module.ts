import { Module } from '@nestjs/common';
import { HackthonService } from './hackthon.service.js';
import { HackthonController } from './hackthon.controller.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard.js';
import { PermissionsGuard } from '../auth/guards/permissions/permissions.guard.js';
import { AuthModule } from '../auth/auth.module.js';
import { Hackthon, HackthonSchema } from './schemas/hackthon.schema.js';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../user/schemas/user.schema.js';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      { name: Hackthon.name, schema: HackthonSchema },
      { name: User.name, schema: UserSchema }
    ])
  ],
  controllers: [HackthonController],
  providers: [HackthonService],
})
export class HackthonModule {}
