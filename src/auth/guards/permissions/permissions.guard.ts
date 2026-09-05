// src/auth/guards/permissions.guard.ts
import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../../decorators/permissions.decorator.js';
@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(ctx: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
      ctx.getHandler(),
      ctx.getClass(),
    ]);
    if (!required || required.length === 0) return true;

    const { user } = ctx.switchToHttp().getRequest();
    // console.log('user:', user);
    // user.roles is populated with nested permissions from JwtStrategy
    const userPermissionKeys: string[] = user.roles.flatMap((r: any) =>
      r.permissions.map((p: any) => p.key),
    );

    const hasAll = required.every((perm) => userPermissionKeys.includes(perm));
    if (!hasAll) throw new ForbiddenException('Insufficient permissions');
    return true;
  }
}