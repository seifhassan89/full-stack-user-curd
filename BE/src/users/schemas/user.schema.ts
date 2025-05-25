import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { BaseDocument } from './../../common/base/base.schema';

export type UserDocument = User & Document;

@Schema({
  timestamps: true,
  toJSON: {
    transform: (doc, ret) => {
      delete ret.password;
      delete ret.refreshToken;
      delete ret.__v;
      ret.id = ret._id;
      delete ret._id;
      return ret;
    },
  },
})
export class User extends BaseDocument {
  @Prop({ required: true })
  fullName: string;

  @Prop({ required: true, unique: true, lowercase: true })
  email: string;

  @Prop({ required: true, select: false })
  password: string;

  @Prop({ default: 'user', enum: ['user', 'admin'] })
  role: string;

  @Prop({ default: 'active', enum: ['active', 'inactive'] })
  status: string;

  @Prop({ select: false })
  refreshToken: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
