// src/database/seeders/seeders.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Permission, PermissionSchema } from '../../permission/schemas/permission.schema.js';
import { Role, RoleSchema } from '../../role/schemas/role.schema.js';
import { RbacSeeder } from './rbac.seeder.js';
import { User, UserSchema } from '../../user/schemas/user.schema.js';


@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Permission.name, schema: PermissionSchema },
      { name: Role.name, schema: RoleSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  providers: [RbacSeeder],
})
export class SeedersModule { }