import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export class BaseDocument extends Document {
  createdBy?: string;
  updatedBy?: string;
  createdAt?: Date;
  updatedAt?: Date;

  deletedAt?: Date;
  deletedBy?: string;
}

@Schema({ timestamps: true }) // Automatically adds createdAt and updatedAt
export class BaseSchema {
  @Prop({ required: true })
  createdBy: string;

  @Prop({ required: true })
  updatedBy: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;

  @Prop({ nullable: true, default: null })
  deletedAt?: Date;

  @Prop({ nullable: true, default: null })
  deletedBy?: string;
}

export const BaseSchemaFactory = SchemaFactory.createForClass(BaseSchema);
