import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { SqlModule } from './sql/sql.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    SqlModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
