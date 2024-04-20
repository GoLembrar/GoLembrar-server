import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { AuthorizationGuard } from '../common/guards/authorization.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UnauthorizedResponse } from '../swagger/decorators/unauthorized.decorator';
import { CreateCategoryResponse } from './swagger/createCategoryResponse.swagger';
import { NotFoundResponse } from '../swagger/decorators/notFound.decorator';
import { OkResponse } from '../swagger/decorators/ok.decorator';
import { OkResponseModel } from './swagger/okResponseModel.swagger';

@Controller('category')
@UseGuards(AuthorizationGuard)
@ApiTags('category')
@ApiBearerAuth()
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create category' })
  @CreateCategoryResponse()
  @UnauthorizedResponse()
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    return await this.categoryService.create(createCategoryDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all categories' })
  @OkResponse([OkResponseModel])
  @UnauthorizedResponse()
  async findAll() {
    return await this.categoryService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one category' })
  @OkResponse(OkResponseModel)
  @UnauthorizedResponse()
  @NotFoundResponse()
  async findOne(@Param('id') id: string) {
    return await this.categoryService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update category' })
  @OkResponse(OkResponseModel)
  @UnauthorizedResponse()
  @NotFoundResponse()
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return await this.categoryService.update(+id, updateCategoryDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete category' })
  @UnauthorizedResponse()
  @NotFoundResponse()
  async remove(@Param('id') id: string) {
    await this.categoryService.remove(+id);
  }
}
