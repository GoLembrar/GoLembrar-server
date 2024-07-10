import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { OkResponseModel } from '../auth/swagger/okResponseModel.swagger';
import { CreateCategoryResponse } from '../category/swagger/createCategoryResponse.swagger';
import { AddRequestUserId } from '../common/decorators/add-request-user-id.decorator';
import { AuthorizationGuard } from '../common/guards/authorization.guard';
import { RequestWithUser } from '../common/utils/types/RequestWithUser';
import { NotFoundResponse } from '../swagger/decorators/notFound.decorator';
import { OkResponse } from '../swagger/decorators/ok.decorator';
import { UnauthorizedResponse } from '../swagger/decorators/unauthorized.decorator';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { PreventDuplicateContactGuard } from './guards/preventDuplicateContact.guard';

@UseGuards(AuthorizationGuard)
@Controller('contact')
@ApiTags('contact')
@ApiBearerAuth()
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Create contact' })
  @UnauthorizedResponse()
  @CreateCategoryResponse()
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
  @OkResponse([OkResponseModel])
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
  update(
    @Param('id') id: string,
    @Body() @AddRequestUserId() updateContactDto: UpdateContactDto,
  ) {
    return this.contactService.update(id, updateContactDto);
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
