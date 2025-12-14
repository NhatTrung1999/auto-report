import { Controller, Get, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { type Request } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getIp(@Req() req: Request) {
    console.log(req.ip);
    const ip =
      (req.headers['x-forwarded-for'] as string)?.split(',')[0] ||
      req.socket.remoteAddress;
    console.log(ip);
    // return {
    //   ip: req.ip,
    //   forwarded: req.headers['x-forwarded-for'],
    // };
  }
}
