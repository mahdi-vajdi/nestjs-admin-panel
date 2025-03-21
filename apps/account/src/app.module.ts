import { Module } from '@nestjs/common';
import { AccountNatsController } from './Presentation/account.nats-controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ACCOUNT_DB_COLLECTION,
  AccountSchema,
} from './Infrastructure/models/account.model';
import { CqrsModule } from '@nestjs/cqrs';
import { AccountCommandHandlers } from './Application/commands/handlers';
import { AccountQueryHandlers } from './Application/queries/handlers';
import { AccountEventHandlers } from './Application/events/handlers';
import { AccountQueryRepository } from './Infrastructure/repositories/account.query-repo';
import { AccountEntityRepositoryImpl } from './Infrastructure/repositories/impl-account.entity-repo';
import { AccountEntityRepository } from './Domain/base-account.entity-repo';
import { AccountGrpcController } from './Presentation/account.grpc-controller';
import { NatsJetStreamTransport } from '@nestjs-plugins/nestjs-nats-jetstream-transport';
import { AccountService } from './Application/services/account.service';
import { LoggerModule } from '@app/common/logger/logger.module';

@Module({
  imports: [
    CqrsModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().required(),
        MONGODB_URI: Joi.string().required(),
        NATS_URI: Joi.string().required(),
        ACCOUNT_GRPC_URL: Joi.string().required(),
      }),
    }),
    LoggerModule,
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        uri: configService.get('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      { name: ACCOUNT_DB_COLLECTION, schema: AccountSchema },
    ]),
    NatsJetStreamTransport.registerAsync({
      useFactory: (configService: ConfigService) => ({
        connectionOptions: {
          servers: configService.getOrThrow<string>('NATS_URI'),
          name: 'account-publisher',
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AccountNatsController, AccountGrpcController],
  providers: [
    AccountService,
    AccountQueryRepository,
    { provide: AccountEntityRepository, useClass: AccountEntityRepositoryImpl },
    ...AccountCommandHandlers,
    ...AccountEventHandlers,
    ...AccountQueryHandlers,
  ],
})
export class AppModule {}
