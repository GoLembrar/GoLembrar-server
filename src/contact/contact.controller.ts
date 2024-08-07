import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { AccessTokenGuard } from '../auth/guards/access-token/access-token.guard';
import { OkResponseModel } from '../auth/swagger/okResponseModel.swagger';
import { AddRequestUserId } from '../common/decorators/add-request-user-id.decorator';
import { RequestWithUser } from '../common/utils/types/RequestWithUser';
import { NotFoundResponse } from '../swagger/decorators/notFound.decorator';
import { OkResponse } from '../swagger/decorators/ok.decorator';
import { UnauthorizedResponse } from '../swagger/decorators/unauthorized.decorator';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { PreventDuplicateContactGuard } from './guards/preventDuplicateContact.guard';

@UseGuards(AccessTokenGuard)
@Controller('contact')
@ApiTags('contact')
@ApiBearerAuth()
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Create contact' })
  @UnauthorizedResponse()
  @UseGuards(PreventDuplicateContactGuard)
  create(
    @Body() @AddRequestUserId() createContactDto: CreateContactDto,
    @Req() request: RequestWithUser,
  ) {
    createContactDto.userId = request.user.id;
    return this.contactService.create(createContactDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all contacts' })
  @UnauthorizedResponse()
  @OkResponse(OkResponseModel)
  findAll(@Req() request: RequestWithUser) {
    const userId = request.user.id;
    return this.contactService.findAll(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one contact' })
  @UnauthorizedResponse()
  @NotFoundResponse()
  findOne(@Param('id') id: string, @Req() request: RequestWithUser) {
    const userId = request.user.id;
    return this.contactService.findOne(id, userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update contact' })
  @UnauthorizedResponse()
  @NotFoundResponse()
  async update(
    @Param('id') id: string,
    @Body() @AddRequestUserId() updateContactDto: UpdateContactDto,
    @Res() response: Response,
  ) {
    const user = await this.contactService.update(id, updateContactDto);
    response.status(HttpStatus.OK).json({
      message: 'user updated',
      user,
    });
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete contact' })
  @UnauthorizedResponse()
  @NotFoundResponse()
  remove(@Param('id') id: string, @Req() request: RequestWithUser) {
    const userId = request.user.id;
    return this.contactService.remove(id, userId);
  }
}
