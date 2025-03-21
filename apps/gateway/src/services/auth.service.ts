import {
  AuthSubjects,
  AuthTokensDto,
  RefreshTokensDto,
  SigninDto,
  SignoutDto,
  SignupDto,
} from '@app/common/dto-command';
import { ApiResponse } from '@app/common/dto-generic';
import { NatsJetStreamClientProxy } from '@nestjs-plugins/nestjs-nats-jetstream-transport';
import {
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Response } from 'express';
import { map } from 'rxjs/operators';
import { JwtPayloadDto } from '../dto/auth/jwt-payload.dto';

@Injectable()
export class AuthService {
  constructor(private readonly natsClient: NatsJetStreamClientProxy) {}

  signup(dto: SignupDto, res: Response) {
    return this.natsClient
      .send<
        ApiResponse<AuthTokensDto>,
        SignupDto
      >({ cmd: AuthSubjects.SIGNUP }, dto)
      .pipe(
        map((response) => {
          if (response.success && response.data) {
            this.setTokensToCookies(res, response.data);
            return response;
          } else if (response.success && !response.data) {
            throw new InternalServerErrorException(
              'Something went wrong issuing tokens. Please sign in again.',
            );
          } else if (!response.success) {
            return new HttpException(
              response.error?.message || 'Somthing Went Wrong',
              response.error?.code || 500,
            );
          }
        }),
      );
  }

  signin(dto: SigninDto, res: Response) {
    return this.natsClient
      .send<
        ApiResponse<AuthTokensDto>,
        SigninDto
      >({ cmd: AuthSubjects.SIGNIN }, dto)
      .pipe(
        map((response) => {
          if (response.success && response.data) {
            this.setTokensToCookies(res, response.data);
            return response;
          } else if (response.success && !response.data) {
            throw new InternalServerErrorException(
              'Something went wrong issuing tokens. Please sign in again.',
            );
          } else if (!response.success) {
            return new HttpException(
              response.error?.message || 'Somthing Went Wrong',
              response.error?.code || 500,
            );
          }
        }),
      );
  }

  signout(jwtPayload: JwtPayloadDto, res: Response) {
    this.natsClient.emit<ApiResponse<null>, SignoutDto>(AuthSubjects.SIGNOUT, {
      agentId: jwtPayload.sub,
    });
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
  }

  refreshTokens(
    refreshToken: string,
    jwtPaylaod: JwtPayloadDto,
    res: Response,
  ) {
    return this.natsClient
      .send<ApiResponse<AuthTokensDto>, RefreshTokensDto>(
        { cmd: AuthSubjects.REFRESH_TOKENS },
        {
          agentId: jwtPaylaod.sub,
          refreshToken,
        },
      )
      .pipe(
        map((response) => {
          if (response.success && response.data) {
            this.setTokensToCookies(res, response.data);
            return response;
          } else if (response.success && !response.data) {
            throw new InternalServerErrorException(
              'Something went wrong issuing tokens. Please sign in again.',
            );
          } else if (!response.success) {
            return new HttpException(
              response.error?.message || 'Somthing Went Wrong',
              response.error?.code || 500,
            );
          }
        }),
      );
  }

  private setTokensToCookies(res: Response, tokens: AuthTokensDto) {
    res.cookie('access_token', tokens.accessToken, {
      maxAge: 1000 * 60 * 60,
      httpOnly: true,
    });

    res.cookie('refresh_token', tokens.refreshToken, {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      httpOnly: true,
    });
  }
}
