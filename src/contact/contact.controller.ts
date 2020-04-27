import { Body, Controller, Post } from '@nestjs/common';
import { CreateContactDto } from './create-contact.dto';
import { ContactService } from './contact.service';

@Controller('contacts')
export class ContactController {
  constructor(private contactService: ContactService){}
  @Post('/new-mail')
  newMail
  (
  @Body('name') name: string, 
  @Body('phone') phone: string, 
  @Body('email') email: string, 
  @Body('title') title: string, 
  @Body('message') message: string, 
  ) {
    this.contactService.mailing(name, phone, email, title, message);
  }
}
