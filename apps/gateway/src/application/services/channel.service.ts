import { Inject, Injectable } from '@nestjs/common';
import { JwtPayloadDto } from '../../dto/auth/jwt-payload.dto';
import { CreateChannelDto } from '../../dto/channel/create-channel.dto';
import { UpdateChannelUserDto } from '../../dto/channel/update-channel-user.dto';
import {
  CHANNEL_WRITER,
  IChannelWriter,
} from '../../infrastructure/command-client/providers/channel.writer';
import {
  CHANNEL_READER,
  IChannelReader,
} from '../../infrastructure/query-client/providers/channel.reader';

@Injectable()
export class ChannelService {
  constructor(
    @Inject(CHANNEL_READER) private readonly channelReader: IChannelReader,
    @Inject(CHANNEL_WRITER) private readonly channelWriter: IChannelWriter,
  ) {}

  async create(user: JwtPayloadDto, dto: CreateChannelDto) {
    await this.channelWriter.createChannel({
      accountId: user.account,
      url: dto.url,
      title: dto.title,
      addAllUsers: dto.addAllUsers,
    });
  }

  async updateUsers(
    user: JwtPayloadDto,
    channelId: string,
    dto: UpdateChannelUserDto,
  ) {
    await this.channelWriter.updateChannelUsers({
      users: dto.users,
      channelId: channelId,
      requesterAccountId: user.account,
    });
  }

  getById(user: JwtPayloadDto, channelId: string) {
    return this.channelReader.getChannelById(user.account, channelId);
  }

  getAccountChannels(user: JwtPayloadDto) {
    return this.channelReader.getAccountChannels(user.account);
  }
}
