import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query } from '@nestjs/common';
import { HackthonService } from './hackthon.service.js';
import { CreateHackthonDto } from './dto/create-hackthon.dto.js';
import { UpdateHackthonDto } from './dto/update-hackthon.dto.js';
import { PermissionsGuard } from '../auth/guards/permissions/permissions.guard.js';
import { Permissions } from '../auth/decorators/permissions.decorator.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard.js';
import { GetUser } from '../auth/decorators/user.decorator.js';
import type { UserDocument } from '../user/schemas/user.schema.js';

@Controller('hackthon')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class HackthonController {
  constructor(private readonly hackthonService: HackthonService) { }

  @Post('create')
  @Permissions('hackathon:create')
  create(@Body() createHackthonDto: CreateHackthonDto, @GetUser() user: UserDocument) {
    return this.hackthonService.create(createHackthonDto, user);
  }
  @Get('all')
  @Permissions('hackathon:read')
  getAllHackathons(@GetUser() user: UserDocument, @Query('page') page: string, @Query('limit') limit: string) {
    return this.hackthonService.findAll(user, page, limit);
  }
  @Post('join')
  @Permissions('hackathon:join')
  join(@Body('hackathonId') hackathonId: string, @GetUser() user: UserDocument) {
    return this.hackthonService.join(hackathonId, user);
  }
  @Post('leave')
  @Permissions('hackathon:leave')
  leave(@Body('hackathonId') hackathonId: string, @GetUser() user: UserDocument) {
    return this.hackthonService.leave(hackathonId, user);
  }
  @Get(':id')
  @Permissions('hackathon:read')
  findOne(@Param('id') id: string) {
    return this.hackthonService.findOne(id);
  }

  @Patch(':id')
  @Permissions('hackathon:update')
  update(@Param('id') id: string, @Body() updateHackthonDto: UpdateHackthonDto, @GetUser() user: UserDocument) {
    return this.hackthonService.update(id, updateHackthonDto, user);
  }

  @Delete(':id')
  @Permissions('hackathon:delete')
  remove(@Param('id') id: string) {
    return this.hackthonService.remove(id);
  }
}
