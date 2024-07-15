import { Response } from 'express';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthorizationGuard } from '../common/guards/authorization.guard';
import { RequestWithUser } from '../common/utils/types/RequestWithUser';
import { EmailQueueService } from '../queue/email-queue/emailQueue.service';
import { NotFoundResponse } from '../swagger/decorators/notFound.decorator';
import { OkResponse } from '../swagger/decorators/ok.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { okResponseModel } from './swagger/okResponseModel.swagger';
import { UserService } from './user.service';

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
  public async create(
    @Body() createUserDto: CreateUserDto,
    @Res() response: Response,
  ) {
    this.emailQueue.emailQueue(createUserDto.email);
    await this.userService.create(createUserDto);
    return response
      .status(HttpStatus.CREATED)
      .json({ message: 'user created' });
  }

  @Get('')
  @ApiOperation({ summary: 'Find a user by token' })
  @OkResponse([okResponseModel])
  @NotFoundResponse()
  @UseGuards(AuthorizationGuard)
  public async findOne(@Req() request: RequestWithUser) {
    const user = await this.userService.findOne(request.user.id);
    return user;
  }

  @Patch('')
  @ApiOperation({ summary: 'Update a user by id.' })
  @OkResponse(okResponseModel)
  @NotFoundResponse()
  @UseGuards(AuthorizationGuard)
  public async update(
    @Req() request: RequestWithUser,
    @Body() updateUserDto: UpdateUserDto,
    @Res() response: Response,
  ) {
    await this.userService.update(request.user.id, updateUserDto);
    return response.status(HttpStatus.NO_CONTENT).json({
      message: 'user updated',
    });
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
  public async remove(@Req() request: RequestWithUser) {
    return this.userService.remove(request.user.id);
  }
}
