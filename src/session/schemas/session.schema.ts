import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Session extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop() ip: string;
  @Prop() userAgent: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: Date.now })
  lastActiveAt: Date; // update this on every authenticated request (heartbeat)

  @Prop() refreshTokenHash: string;
  @Prop() expiresAt: Date;
}
export const SessionSchema = SchemaFactory.createForClass(Session);