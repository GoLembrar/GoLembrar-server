import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { AccessTokenGuard } from '../auth/guards/access-token/access-token.guard';
import { RequestWithUser } from '../common/utils/types/RequestWithUser';
import { EmailQueueService } from '../queue/email-queue/emailQueue.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { okResponseModel } from './swagger/okResponseModel.swagger';
import { UserService } from './user.service';
import { UnauthorizedResponse } from '../swagger/decorators/unauthorized.decorator';
import { NotFoundResponse } from '../swagger/decorators/not-found.decorator';
import { CreatedResponse } from '../swagger/decorators/created.decorator';
import { ConflictResponse } from '../swagger/decorators/conflict.decorator';
import { BadRequestResponse } from '../swagger/decorators/bad-request.decorator';
import { OkResponse } from '../swagger/decorators/ok.decorator';
import { NoContentResponse } from '../swagger/decorators/no-content.decorator';
import { UnprocessableEntityResponse } from '../swagger/decorators/unprocessable-entity.decorator';

@Controller('user')
@ApiTags('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly emailQueue: EmailQueueService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new user.' })
  @CreatedResponse('User created response successfully', 'user created')
  @BadRequestResponse()
  @ConflictResponse()
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
  @UseGuards(AccessTokenGuard)
  @ApiOperation({ summary: 'Find a user by token' })
  @ApiBearerAuth('JWT-Token')
  @OkResponse('User response found successfully', okResponseModel)
  @UnauthorizedResponse()
  @NotFoundResponse()
  public async findOne(@Req() request: RequestWithUser) {
    const user = await this.userService.findOne(request.user['sub']);
    return user;
  }

  @Patch('')
  @UseGuards(AccessTokenGuard)
  @ApiOperation({ summary: 'Update a user by id.' })
  @ApiBearerAuth('JWT-Token')
  @NoContentResponse('User response updated successfully')
  @UnauthorizedResponse()
  @NotFoundResponse()
  @ConflictResponse()
  public async update(
    @Req() request: RequestWithUser,
    @Body() updateUserDto: UpdateUserDto,
    @Res() response: Response,
  ) {
    await this.userService.update(request.user['sub'], updateUserDto);
    return response.status(HttpStatus.NO_CONTENT).json({
      message: 'user updated',
    });
  }

  @Patch('update-password')
  @UseGuards(AccessTokenGuard)
  @ApiOperation({ summary: 'Update a user password by id.' })
  @ApiBearerAuth('JWT-Token')
  @NoContentResponse('User response password updated successfully')
  @BadRequestResponse()
  @UnauthorizedResponse()
  @NotFoundResponse()
  @UnprocessableEntityResponse()
  public async updatePassword(
    @Req() request: RequestWithUser,
    @Body() updateUserPasswordDto: UpdateUserPasswordDto,
    @Res() response: Response,
  ): Promise<Response> {
    await this.userService.upddatePassword(
      request.user['sub'],
      updateUserPasswordDto,
    );
    return response.status(HttpStatus.NO_CONTENT).json({
      message: 'user password updated',
    });
  }

  @Delete()
  @UseGuards(AccessTokenGuard)
  @ApiOperation({ summary: 'Remove a user by id.' })
  @ApiBearerAuth('JWT-Token')
  @OkResponse('User response removed successfully')
  @UnauthorizedResponse()
  @NotFoundResponse()
  public async remove(@Req() request: RequestWithUser) {
    return await this.userService.remove(request.user['sub']);
  }
}
