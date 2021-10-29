import { Test, TestingModule } from '@nestjs/testing';
import * as sgMail from '@sendgrid/mail';
import { SendgridService } from './sendgrid.service';

describe('LikesService', () => {
  let sendgridService: SendgridService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SendgridService],
    }).compile();

    sendgridService = module.get<SendgridService>(SendgridService);
  });

  beforeAll(() => {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  });

  it('Sendgrid service should be defined', () => {
    expect(sendgridService).toBeDefined();
  });

  it('should create a new email', () => {
    const email = async () => {
      await sendgridService.createEmail({
        to: 'test@gmail.com',
        subject: 'test subject',
        message: 'test message',
        link: 'http://test.com',
        token: 'my.token',
      });
    };
    console.log(email);

    expect(email).toHaveProperty('statusCode');
  });
});
