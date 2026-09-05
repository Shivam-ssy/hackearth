import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, Types } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  @Prop({ required: true, select: false }) // never returned by default
  password: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Role' }], default: [] })
  roles: Types.ObjectId[];

  @Prop({ default: true })
  isActive: boolean; // account enabled/disabled by admin

  @Prop({ default: false })
  isLoggedIn: boolean; // currently has an active session

  @Prop()
  lastLoginAt: Date;

  @Prop({ select: false })
  refreshTokenHash: string; // hashed refresh token, rotated on each use
}
export const UserSchema = SchemaFactory.createForClass(User);
export type UserDocument = HydratedDocument<User>;