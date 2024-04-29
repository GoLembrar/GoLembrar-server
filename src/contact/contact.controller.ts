import { Request } from 'express';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { AuthorizationGuard } from '../common/guards/authorization.guard';

@UseGuards(AuthorizationGuard)
@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  create(@Body() createContactDto: CreateContactDto, request: Request | any) {
    createContactDto.userId = Number(request.user.id);
    return this.contactService.create(createContactDto);
  }

  @Get()
  findAll(request: Request | any) {
    const userId = Number(request.user.id);
    return this.contactService.findAll(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, request: Request | any) {
    const userId = Number(request.user.id);
    return this.contactService.findOne(+id, userId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateContactDto: UpdateContactDto,
    request: Request | any,
  ) {
    updateContactDto.userId = Number(request.user.id);
    return this.contactService.update(+id, updateContactDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, request: Request | any) {
    const userId = Number(request.user.id);
    return this.contactService.remove(+id, userId);
  }
}
