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
  Req,
} from '@nestjs/common';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { AuthorizationGuard } from '../common/guards/authorization.guard';
import { PreventDuplicateContactGuard } from './guards/preventDuplicateContact.guard';
import { RequestWithUser } from '../common/utils/types/RequestWithUser';

@UseGuards(AuthorizationGuard)
@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  @UseGuards(PreventDuplicateContactGuard)
  create(@Body() createContactDto: CreateContactDto, @Req() request: Request) {
    if (
      'user' in request &&
      typeof request.user === 'object' &&
      'id' in request.user &&
      typeof request.user.id === 'string'
    )
      createContactDto.userId = Number(request.user.id);
    return this.contactService.create(createContactDto);
  }

  @Get()
  findAll(@Req() request: RequestWithUser) {
    const userId = Number(request.user.id);
    return this.contactService.findAll(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, request: Request | any) {
    const userId = Number(request.user.id);
    return this.contactService.findOne(+id, userId);
  }

  @UseGuards(PreventDuplicateContactGuard)
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
