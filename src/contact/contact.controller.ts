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
import { response, Response } from 'express';
import { AccessTokenGuard } from '../auth/guards/access-token/access-token.guard';
import { AddRequestUserId } from '../common/decorators/add-request-user-id.decorator';
import { RequestWithUser } from '../common/utils/types/RequestWithUser';
import { UnauthorizedResponse } from '../swagger/decorators/unauthorized.decorator';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { NotFoundResponse } from '../swagger/decorators/not-found.decorator';
import { CreatedResponse } from '../swagger/decorators/created.decorator';
import { OkResponse } from '../swagger/decorators/ok.decorator';
import { GetContactResponse } from './swagger/getContactResponse.swagger';
import { NoContentResponse } from '../swagger/decorators/no-content.decorator';

@UseGuards(AccessTokenGuard)
@Controller('contact')
@ApiTags('contact')
@ApiBearerAuth('JWT-Token')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  @HttpCode(201)
  @UseGuards(AccessTokenGuard)
  @ApiOperation({ summary: 'Create contact' })
  @CreatedResponse('Contact created response successfully', 'contact created')
  @UnauthorizedResponse()
  public async create(
    @Body() @AddRequestUserId() createContactDto: CreateContactDto,
    @Req() request: RequestWithUser,
  ): Promise<Response> {
    createContactDto.userId = request.user['sub'];
    await this.contactService.create(createContactDto);

    return response.status(HttpStatus.CREATED);
  }

  @Get()
  @ApiOperation({ summary: 'Get all contacts' })
  @OkResponse('Contacts found response successfully', [GetContactResponse])
  @UnauthorizedResponse()
  async findAll(@Req() request: RequestWithUser) {
    const userId = request.user['sub'];
    return await this.contactService.findAll(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one contact' })
  @OkResponse('Contact found response successfully', GetContactResponse)
  @UnauthorizedResponse()
  @NotFoundResponse()
  async findOne(@Param('id') id: string, @Req() request: RequestWithUser) {
    const userId = request.user['sub'];
    return await this.contactService.findOne(id, userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update contact' })
  @NoContentResponse('Contact updated response successfully')
  @UnauthorizedResponse()
  @NotFoundResponse()
  async update(
    @Param('id') id: string,
    @Body() @AddRequestUserId() updateContactDto: UpdateContactDto,
    @Res() response: Response,
  ) {
    await this.contactService.update(id, updateContactDto);
    return response.status(HttpStatus.NO_CONTENT).json({
      message: 'user updated',
    });
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete contact' })
  @OkResponse('Contact response removed successfully', Boolean)
  @UnauthorizedResponse()
  @NotFoundResponse()
  async remove(
    @Param('id') id: string,
    @Req() request: RequestWithUser,
  ): Promise<boolean> {
    const userId = request.user['sub'];
    return await this.contactService.remove(id, userId);
  }
}
