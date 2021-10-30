import { Module } from '@nestjs/common';
import { SendgridService } from './services/sendgrid.service';

@Module({
  providers: [SendgridService],
  exports: [SendgridService],
})
export class SendgridModule {}
