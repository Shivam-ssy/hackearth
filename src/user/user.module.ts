import { Module } from '@nestjs/common';
import { UserService } from './user.service.js';
import { UserController } from './user.controller.js';
import { UserSchema, User } from './schemas/user.schema.js';
import { MongooseModule } from '@nestjs/mongoose';
import { RoleSchema, Role } from '../role/schemas/role.schema.js';
import { Session, SessionSchema } from '../session/schemas/session.schema.js';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Role.name, schema: RoleSchema },
      { name: Session.name, schema: SessionSchema }
    ]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'defaultSecret',
      signOptions: { expiresIn: '24h' },
    }),
  ],
  exports: [UserService, MongooseModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule { }
