import { Injectable } from '@nestjs/common';
import { CreateContactDto } from './create-contact.dto';
import { Nodemailer, NodemailerDrivers } from '@crowdlinker/nestjs-mailer';
import * as config from '../config';

@Injectable()
export class ContactService {
  constructor(private readonly nodeMailerService: Nodemailer<NodemailerDrivers.SMTP>) {
  }

   mailing(
   name: string, 
   phone: string, 
   email: string, 
   title: string, 
   message: string, 
   ) {
       this.nodeMailerService.sendMail({
        to: config.default.mail.email,
        from: email,
        subject: title,
        text: message,
        html: `<h2>hey ${name} i want to greet to you</h2>
          <br />
          <h2>check your phone number: ${phone} for any additional details</h2>`,
      }).then(value => {
      console.log(value);
      }).catch(err => {
        console.error(err);
      });
    }
}
