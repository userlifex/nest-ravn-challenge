import { Injectable } from '@nestjs/common';
import * as sgMail from '@sendgrid/mail';
import { MessageDto } from 'src/common/dtos/message.dto';

@Injectable()
export class SendgridService {
  constructor() {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  }
  async createEmail(email: MessageDto): Promise<void> {
    const msg = {
      to: email.to,
      subject: email.subject,
      from: 'efrainholguin@ravn.co',
      html: `<h1>${email.subject}</h1>
      <p>${email.message}</p><p>${email.link}</p>
      ${
        email.token
          ? `<p>or change the token in params<br>${email.token}</p>`
          : ''
      }`,
    };

    await sgMail
      .send(msg)
      .then((response) => {
        console.log(response[0].statusCode);
      })
      .catch((error) => {
        console.error(error);
      });
  }
}
