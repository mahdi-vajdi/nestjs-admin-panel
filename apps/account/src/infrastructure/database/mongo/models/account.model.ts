import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';

export type AccountDocument = HydratedDocument<AccountModel>;

@Schema({ collection: 'accounts', timestamps: true, versionKey: false })
export class AccountModel {
  @Prop({ type: SchemaTypes.ObjectId })
  _id: Types.ObjectId;

  @Prop({ type: Date, required: true })
  createdAt: Date;

  @Prop({ type: Date, required: true })
  updatedAt: Date;

  @Prop({ required: true })
  email: string;
}

export const AccountSchema = SchemaFactory.createForClass(AccountModel);
