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
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Response } from 'express';
import { AccessTokenGuard } from '../auth/guards/access-token/access-token.guard';
import { RequestWithUser } from '../common/utils/types/RequestWithUser';
// import { EmailQueueService } from '../queue/email-queue/emailQueue.service';
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
  @ApiOperation({ summary: 'Create a new user.' })
  @ApiCreatedResponse({
    description: 'User creation success response',
    type: okResponseModel,
  })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiConflictResponse({ description: 'User already exists' })
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
  @ApiOkResponse({
    description: 'User response found successfully',
    type: okResponseModel,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized user response' })
  @ApiNotFoundResponse({ description: 'User not found response' })
  @UseGuards(AccessTokenGuard)
  public async findOne(@Req() request: RequestWithUser) {
    const user = await this.userService.findOne(request.user['sub']);
    return user;
  }

  @Patch('')
  @ApiOperation({ summary: 'Update a user by id.' })
  @ApiNoContentResponse({ description: 'User response updated successfully' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized user response' })
  @ApiNotFoundResponse({ description: 'User not found response' })
  @UseGuards(AccessTokenGuard)
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
  @ApiOperation({ summary: 'Update a user password by id.' })
  @ApiNoContentResponse({
    description: 'User response password updated successfully',
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized user response' })
  @ApiNotFoundResponse({ description: 'User not found response' })
  @UseGuards(AccessTokenGuard)
  public async updatePassword(
    @Req() request: RequestWithUser,
    @Body() updateUserPasswordDto: UpdateUserPasswordDto,
  ) {
    return await this.userService.upddatePassword(
      request.user['sub'],
      updateUserPasswordDto,
    );
  }

  @Delete()
  @ApiOperation({ summary: 'Remove a user by id.' })
  @ApiOkResponse({ description: 'User response removed successfully' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized user response' })
  @ApiNotFoundResponse({ description: 'User not found response' })
  @UseGuards(AccessTokenGuard)
  public async remove(@Req() request: RequestWithUser) {
    return this.userService.remove(request.user['sub']);
  }
}
