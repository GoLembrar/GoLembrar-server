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
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';
import { AccessTokenGuard } from '../auth/guards/access-token/access-token.guard';
import { AddRequestUserId } from '../common/decorators/add-request-user-id.decorator';
import { RequestWithUser } from '../common/utils/types/RequestWithUser';
import { CreatedResponse } from '../swagger/decorators/created.decorator';
import { NoContentResponse } from '../swagger/decorators/no-content.decorator';
import { NotFoundResponse } from '../swagger/decorators/not-found.decorator';
import { OkResponse } from '../swagger/decorators/ok.decorator';
import { UnauthorizedResponse } from '../swagger/decorators/unauthorized.decorator';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { GetContactResponse } from './swagger/getContactResponse.swagger';

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
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Optional search term to filter contacts by name',
  })
  @OkResponse('Contacts found response successfully', [GetContactResponse])
  @UnauthorizedResponse()
  async findAll(
    @Req() request: RequestWithUser,
    @Query('search') search?: string,
  ) {
    const userId = request.user['sub'];
    return await this.contactService.findAll(userId, search);
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
  @ApiQuery({
    name: 'ids',
    description:
      'Comma-separated list of Contact IDs (for deleting multiple contacts)',
    required: false,
  })
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

  @Delete()
  @ApiOperation({ summary: 'Delete many contacts' })
  @OkResponse('Contacts response removed successfully', Boolean)
  @UnauthorizedResponse()
  async removeMany(
    @Query('ids') paramsContactids: string[],
    @Body('ids') bodyContactIds: string[],
    @Req() request: RequestWithUser,
  ): Promise<boolean> {
    const userId = request.user['sub'];
    const ids = [...paramsContactids, ...bodyContactIds];
    return await this.contactService.removeMany(ids, userId);
  }
}
