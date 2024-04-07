import { Module } from '@nestjs/common';

import { BotModule } from './modules/bot/bot.module';
import { ClientModule } from './modules/client/client.module';
import { TelegrafModule } from 'nestjs-telegraf';
import { BotName } from './app.constants';
@Module({
  imports: [
    TelegrafModule.forRootAsync({
      botName: BotName,
      useFactory: () => ({
        token: '7034851642:AAHT9wKJqnzFPDnQrZKaU5C3_4zOQNPqhj4',
        middlewares: [],
        include: [BotModule],
      }),
    }),
    BotModule,
    ClientModule,
  ],
})
export class AppModule {}
