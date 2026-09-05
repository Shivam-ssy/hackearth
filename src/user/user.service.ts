import { ConflictException, Injectable, NotImplementedException, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema.js';
import { RegisterDto, LoginDto } from '../auth/dto/auth.dto.js';
import { Role } from '../role/schemas/role.schema.js';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Session } from '../session/schemas/session.schema.js';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Role.name) private readonly roleModel: Model<Role>,
    @InjectModel(Session.name) private readonly sessionModel: Model<Session>,
    private jwt: JwtService,
    private readonly config: ConfigService
  ) { }

  async create(createUserDto: RegisterDto) {
    const existingUser = await this.userModel.findOne({ email: createUserDto.email });
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }
    const defaultRole = await this.roleModel.findOne({ name: 'user' });
    if (!defaultRole) {
      throw new NotImplementedException('Default role not found');
    }
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    createUserDto.password = hashedPassword;
    const createdUser = await this.userModel.create({ ...createUserDto, roles: [defaultRole._id] });
    if (!createdUser) {
      throw new InternalServerErrorException('User could not be created');
    }
    return { ...createdUser.toObject(), password: undefined };

  }
  async loginUser(loginData: LoginDto & { ip: string; userAgent: string }) {
    const user = await this.userModel.findOne({ email: loginData.email })
      .select("+password")
      .populate({ path: 'roles', populate: { path: 'permissions' } });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    if (!user.isActive) {
      throw new UnauthorizedException('User account is inactive');
    }
    const matched = await bcrypt.compare(loginData.password, user.password);
    if (!matched) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = { sub: user._id, email: user.email };
    const accessToken = this.jwt.sign(payload, {
      secret: this.config.get('accessToken.secret'),
      expiresIn: this.config.get('accessToken.expiresIn'),
    });
    const refreshToken = this.jwt.sign(payload, {
      secret: this.config.get('refreshToken.secret'),
      expiresIn: this.config.get('refreshToken.expiresIn'),
    });
    const refreshHash = await bcrypt.hash(refreshToken, 10);
    await this.sessionModel.create({
      userId: user._id,
      ip: loginData.ip,
      userAgent: loginData.userAgent,
      refreshTokenHash: refreshHash,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });
    user.isLoggedIn = true;
    user.lastLoginAt = new Date();
    user.refreshTokenHash = refreshHash;
    await user.save();

    return { accessToken, refreshToken, user: { id: user._id, email: user.email } };
  }

  async logout(userId: string, sessionId: string) {
    await this.sessionModel.findByIdAndUpdate(sessionId, { isActive: false });
    const stillActive = await this.sessionModel.exists({ userId, isActive: true });
    if (!stillActive) {
      await this.userModel.findByIdAndUpdate(userId, { isLoggedIn: false });
    }
  }

  async heartbeat(sessionId: string) {
    // call this from a guard/interceptor on every request to know who's "active now"
    await this.sessionModel.findByIdAndUpdate(sessionId, { lastActiveAt: new Date() });
  }

  async refresh(userId: string, oldRefreshToken: string) {
    const user = await this.userModel.findById(userId).select('+refreshTokenHash');
    if (!user?.refreshTokenHash) throw new UnauthorizedException();

    const valid = await bcrypt.compare(oldRefreshToken, user.refreshTokenHash);
    if (!valid) throw new UnauthorizedException('Token reuse detected');

    const payload = { sub: user._id, email: user.email };
    const accessToken = this.jwt.sign(payload, {
      secret: this.config.get('accessToken.secret'),
      expiresIn: this.config.get('accessToken.expiresIn'),
    });
    return { accessToken };
  }


  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    const user = this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true });
    if (!user) {
      throw new ConflictException('User not found');
    }
    return user;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
