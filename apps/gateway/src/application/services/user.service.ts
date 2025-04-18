import { Inject, Injectable } from '@nestjs/common';
import { JwtPayloadDto } from '../../dto/auth/jwt-payload.dto';
import { CreateUserDto } from '../../dto/user/create-user.dto';
import {
  IUserWriter,
  USER_WRITER,
} from '../../infrastructure/command-client/providers/user.writer';
import {
  IUserReader,
  USER_READER,
} from '../../infrastructure/query-client/providers/user.reader';

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_WRITER) private readonly userWriter: IUserWriter,
    @Inject(USER_READER)
    private readonly userReader: IUserReader,
  ) {}

  createUser(user: JwtPayloadDto, dto: CreateUserDto) {
    return this.userWriter.createUser({
      email: dto.email,
      accountId: user.account,
      channelIds: dto.channelIds,
      title: dto.title,
      password: dto.password,
      phone: dto.phone,
      firstName: dto.firstName,
      role: dto.role,
      lastName: dto.lastName,
    });
  }

  getAccountUsers(user: JwtPayloadDto) {
    return this.userReader.getAccountUsers(user.account);
  }
}
