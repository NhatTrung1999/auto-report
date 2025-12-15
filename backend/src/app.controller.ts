import { Controller, Get, Req, Ip } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // @Get()
  // getIp(@Ip() ip: string) {
  //   const cleanIP = ip.startsWith('::ffff:') ? ip.replace('::ffff:', '') : ip;
  //   console.log(cleanIP);
  // }
}
