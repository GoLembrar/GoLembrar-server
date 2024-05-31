//import { SendEmailService } from './../Email/sendEmail.service';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Users } from '@prisma/client';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { OkResponse } from '../swagger/decorators/ok.decorator';
import { NotFoundResponse } from '../swagger/decorators/notFound.decorator';
import { okResponseModel } from './swagger/okResponseModel.swagger';
import { RabbitmqService } from '../rabbitmq/rabbitmq.service';

@Controller('user')
@ApiTags('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    //private readonly rabbitMq: RabbitmqService,
    //private readonly emailService: SendEmailService,
  ) {}

  @Post()
  @OkResponse(okResponseModel)
  @ApiOperation({ summary: 'Create a new user.' })
  async create(@Body() createUserDto: CreateUserDto) {
    //this.rabbitMq.enqueueTask();
    return await this.userService.create(createUserDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find a user by id.' })
  @OkResponse([okResponseModel])
  @NotFoundResponse()
  async findOne(@Param('id', ParseIntPipe) id: string) {
    const user: Partial<Users> | null = await this.userService.findOne(+id);
    if (!user)
      throw new NotFoundException(`Usuário com id ${id} não foi encontrado.`);
    return user;
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a user by id.' })
  @OkResponse(okResponseModel)
  @NotFoundResponse()
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove a user by id.' })
  @OkResponse(okResponseModel)
  @NotFoundResponse()
  remove(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    return this.userService.remove(id);
  }
}
