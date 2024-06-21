//import { SendEmailService } from './../Email/sendEmail.service';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { OkResponse } from '../swagger/decorators/ok.decorator';
import { NotFoundResponse } from '../swagger/decorators/notFound.decorator';
import { okResponseModel } from './swagger/okResponseModel.swagger';
import { EmailQueueService } from '../queue/email-queue/emailQueue.service';
import { AuthorizationGuard } from '../common/guards/authorization.guard';
import { RequestWithUser } from '../common/utils/types/RequestWithUser';
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';

@Controller('user')
@ApiTags('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly emailQueue: EmailQueueService,
  ) {}

  @Post()
  @OkResponse(okResponseModel)
  @ApiOperation({ summary: 'Create a new user.' })
  public async create(@Body() createUserDto: CreateUserDto) {
    this.emailQueue.emailQueue(createUserDto.email);
    return await this.userService.create(createUserDto);
  }

  @Get('')
  @ApiOperation({ summary: 'Find a user by token' })
  @OkResponse([okResponseModel])
  @NotFoundResponse()
  @UseGuards(AuthorizationGuard)
  public async findOne(@Req() request: Request | any) {
    const user = await this.userService.findOne(request.user.id);
    return user;
  }

  @Patch('')
  @ApiOperation({ summary: 'Update a user by id.' })
  @OkResponse(okResponseModel)
  @NotFoundResponse()
  @UseGuards(AuthorizationGuard)
  public async update(
    @Req() request: Request | any,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(request.user.id, updateUserDto);
  }

  @Patch('update-password')
  @ApiOperation({ summary: 'Update a user password by id.' })
  @OkResponse(okResponseModel)
  @NotFoundResponse()
  @UseGuards(AuthorizationGuard)
  public async updatePassword(
    @Req() request: RequestWithUser,
    @Body() updateUserPasswordDto: UpdateUserPasswordDto,
  ) {
    return await this.userService.upddatePassword(
      request.user.id,
      updateUserPasswordDto,
    );
  }

  @Delete()
  @ApiOperation({ summary: 'Remove a user by id.' })
  @OkResponse(okResponseModel)
  @NotFoundResponse()
  @UseGuards(AuthorizationGuard)
  public async remove(@Req() request: Request | any) {
    return this.userService.remove(request.user.id);
  }
}
