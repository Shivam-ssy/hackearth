import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../../user/schemas/user.schema.js';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(
        private config: ConfigService,
        @InjectModel(User.name) private userModel: Model<User>,
    ) {
        const jwtSecret = config.getOrThrow<string>('accessToken.secret');

        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: jwtSecret,
        });
    }

    // Runs automatically after passport-jwt verifies the signature + expiry.
    // Whatever this returns becomes `request.user`.
    async validate(payload: { sub: string; email: string }) {
        const user = await this.userModel
            .findById(payload.sub)
            .populate({
                path: 'roles',
                populate: {
                    path: 'permissions',
                },
            })
            .exec();

        // console.log('JwtStrategy.validate: user found:', user);
        if (!user || !user.isActive) return null; // returning null/false → Passport throws 401 automatically
        return user;
    }
}