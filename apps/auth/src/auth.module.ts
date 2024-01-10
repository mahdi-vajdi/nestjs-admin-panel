import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthGrpcController } from './controllers/auth.grpc-controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { NATS_AGENT, GRPC_ACCOUNT, GRPC_AGENT } from '@app/common';
import { JwtHelperService } from './services/jwt-helper.service';
import { AuthNatsController } from './controllers/auth.nats-controller';
import { join } from 'path';
import { NatsJetStreamTransport } from '@nestjs-plugins/nestjs-nats-jetstream-transport';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        JWT_ACCESS_SECRET: Joi.string().required(),
        JWT_REFRESH_SECRET: Joi.string().required(),
        NATS_URI: Joi.string().required(),
        AUTH_GRPC_URL: Joi.string().required(),
        ACCOUNT_GRPC_URL: Joi.string().required(),
        AGENT_GRPC_URL: Joi.string().required(),
      }),
    }),
    JwtModule.register({}),
    NatsJetStreamTransport.register({
      connectionOptions: {
        servers: 'nats:4222',
        name: 'auth-publisher',
      },
    }),
    ClientsModule.registerAsync([
      {
        name: NATS_AGENT,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.NATS,
          options: {
            servers: [configService.getOrThrow('NATS_URI')],
            queue: NATS_AGENT,
          },
        }),
        inject: [ConfigService],
      },
      {
        name: GRPC_AGENT,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: GRPC_AGENT,
            protoPath: join(__dirname, '../../../proto/agent.proto'),
            url: configService.getOrThrow('AGENT_GRPC_URL'),
          },
        }),
        inject: [ConfigService],
      },
      {
        name: GRPC_ACCOUNT,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: GRPC_ACCOUNT,
            protoPath: join(__dirname, '../../../proto/account.proto'),
            url: configService.getOrThrow('ACCOUNT_GRPC_URL'),
          },
        }),
        inject: [ConfigService],
      },
    ]),
    ClientsModule.register([]),
  ],
  controllers: [AuthNatsController, AuthGrpcController],
  providers: [AuthService, JwtHelperService],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
