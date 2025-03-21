import { Controller } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RpcException,
} from '@nestjs/microservices';
import { ApiResponse } from '@app/common/dto-generic';
import {
  AuthSubjects,
  AuthTokensDto,
  RefreshTokensDto,
  SigninDto,
  SignoutDto,
  SignupDto,
} from '@app/common/dto-command';
import { NatsJetStreamContext } from '@nestjs-plugins/nestjs-nats-jetstream-transport';
import { ForbiddenAccessError } from '@app/common/errors/forbidden-access.error';
import { NotFoundError } from '@app/common/errors';

/**
 * The controller that handles commands via nats
 *
 * @export
 * @class AuthNatsController
 */
@Controller()
export class AuthNatsController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern({ cmd: AuthSubjects.SIGNUP })
  async signup(
    @Payload() signupDto: SignupDto,
  ): Promise<ApiResponse<AuthTokensDto>> {
    return await this.authService.signup(signupDto);
  }

  @MessagePattern({ cmd: AuthSubjects.SIGNIN })
  async signin(@Payload() dto: SigninDto): Promise<ApiResponse<AuthTokensDto>> {
    try {
      return await this.authService.signin(dto);
    } catch (error) {
      if (error instanceof NotFoundError)
        throw new RpcException({
          statusCode: 409,
          message: error.message,
        });
      else throw new RpcException(error.message);
    }
  }

  @EventPattern(AuthSubjects.SIGNOUT)
  signout(
    @Payload() { agentId }: SignoutDto,
    @Ctx() context: NatsJetStreamContext,
  ): void {
    this.authService.signout(agentId);
    context.message.ack();
  }

  @MessagePattern({ cmd: AuthSubjects.REFRESH_TOKENS })
  async refresh(
    @Payload() { agentId, refreshToken }: RefreshTokensDto,
  ): Promise<ApiResponse<AuthTokensDto>> {
    try {
      return await this.authService.refreshTokens(agentId, refreshToken);
    } catch (error) {
      if (error instanceof ForbiddenAccessError)
        throw new RpcException({
          statusCode: 409,
          message: error.message,
        });
      else if (error instanceof NotFoundError)
        throw new RpcException({
          statusCode: 409,
          message: error.message,
        });
      else throw new RpcException(error.message);
    }
  }
}
