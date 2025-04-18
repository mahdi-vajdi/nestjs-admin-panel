import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes } from 'mongoose';

@Schema({ _id: false, versionKey: false })
export class ChannelSettingsModel {
  @Prop({ type: SchemaTypes.Mixed, required: true })
  main: {
    logo: string;
    seeWhileTyping: boolean;
    sendVoice: boolean;
    showCredit: boolean;
    infoForm: {
      isEnabled: boolean;
      isOptional: boolean;
      type: string;
    };
  };

  @Prop({ type: SchemaTypes.Mixed, required: true })
  widgetLandings: {
    laguage: string;
    title: string;
    description: string;
    startMessage: string;
    startReply: string;
  }[];

  @Prop({ type: SchemaTypes.Mixed, required: true })
  widgetCustomization: {
    logo: string;
    bgColor: string;
    loBgColor: string;
    secondaryColor: string;
    bgTheme: string;
  };

  @Prop({ type: SchemaTypes.Mixed, required: true })
  widgetDisplay: {
    showInPagesEnabled: boolean;
    showPages: string[];
    hideInPagesEnabled: boolean;
    hideInPages: string[];
  };

  @Prop({ type: SchemaTypes.Mixed, required: true })
  widgetPosition: {
    ltrPosition: string;
    ltrBottom: number;
    ltrRight: number;
    ltrShowInMobile: boolean;
    rtlPosition: string;
    rtlBottom: number;
    rtlLeft: number;
    rtlShowInMobile: boolean;
  };

  // FIXME: office hours, email settings, triggers need to be added
}

export const ChannelSettingsSchema =
  SchemaFactory.createForClass(ChannelSettingsModel);
