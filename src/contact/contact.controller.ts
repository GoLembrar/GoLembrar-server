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
import { FindContactByNameDto } from './dto/find-contact-by-name.dto';

@UseGuards(AccessTokenGuard)
@Controller('contact')
@ApiTags('contact')
@ApiBearerAuth('JWT-Token')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  @HttpCode(201)
  @UseGuards(AccessTokenGuard)
  @ApiOperation({
    summary: 'Create contact',
    description: 'Creates a new contact for the authenticated user',
  })
  @CreatedResponse('Contact created response successfully', 'contact created')
  @UnauthorizedResponse()
  public async create(
    @Body() @AddRequestUserId() createContactDto: CreateContactDto,
    @Req() request: RequestWithUser,
    @Res() response: Response,
  ): Promise<Response> {
    createContactDto.userId = request.user['sub'];
    const contact = await this.contactService.create(createContactDto);

    return response.status(HttpStatus.CREATED).json({
      message: 'contact created',
      contact,
    });
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
  public async findOne(
    @Param('id') contactId: string,
    @Req() request: RequestWithUser,
    @Res() response: Response,
  ) {
    const userId = request.user['sub'];
    const contact = await this.contactService.findOne(contactId, userId);
    return response.status(HttpStatus.OK).json({
      message: 'contact found',
      contact,
    });
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

  @Delete('/all/')
  @ApiOperation({ summary: 'Delete all contacts' })
  @OkResponse('Contacts response removed successfully', Boolean)
  @UnauthorizedResponse()
  async removeAll(@Req() request: RequestWithUser): Promise<boolean> {
    const userId = request.user['sub'];
    return await this.contactService.removeAll(userId);
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

  @Post('search')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Find contacts by name',
    description:
      'Pass an string name and get a array of contacts that matches the name ',
  })
  @OkResponse('Contact response founds successfully', Boolean)
  @UnauthorizedResponse()
  async findByName(@Body() dto: FindContactByNameDto) {
    return await this.contactService.findByName(dto.name);
  }
}
