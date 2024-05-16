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
  HttpCode,
  ParseIntPipe,
} from '@nestjs/common';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { AuthorizationGuard } from '../common/guards/authorization.guard';
import { PreventDuplicateContactGuard } from './guards/preventDuplicateContact.guard';
import { RequestWithUser } from '../common/utils/types/RequestWithUser';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateCategoryResponse } from '../category/swagger/createCategoryResponse.swagger';
import { OkResponse } from '../swagger/decorators/ok.decorator';
import { OkResponseModel } from '../auth/swagger/okResponseModel.swagger';
import { NotFoundResponse } from '../swagger/decorators/notFound.decorator';
import { UnauthorizedResponse } from '../swagger/decorators/unauthorized.decorator';
import { AddRequestUserId } from '../common/decorators/add-request-user-id.decorator';

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
    const userId = Number(request.user.id);
    return this.contactService.findAll(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one contact' })
  @UnauthorizedResponse()
  @NotFoundResponse()
  findOne(@Param('id') id: string, @Req() request: RequestWithUser) {
    const userId = request.user.id;
    return this.contactService.findOne(+id, userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update contact' })
  @UnauthorizedResponse()
  @NotFoundResponse()
  update(
    @Param('id') id: string,
    @Body() @AddRequestUserId() updateContactDto: UpdateContactDto,
  ) {
    return this.contactService.update(+id, updateContactDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete contact' })
  @UnauthorizedResponse()
  @NotFoundResponse()
  remove(
    @Param('id', new ParseIntPipe()) id: number,
    @Req() request: RequestWithUser,
  ) {
    const userId = request.user.id;
    return this.contactService.remove(id, userId);
  }
}
