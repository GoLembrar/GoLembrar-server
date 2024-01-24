import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { AuthorizationGuard } from '../common/guards/authorization.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Unauthorized } from '../swagger/decorators/unauthorized.decorators';
import { CreateCategoryResponse } from './swagger/createCategoryResponse.swagger';
import { NotFoundResponse } from '../swagger/decorators/notFound.decorator';
import { OkResponse } from '../swagger/decorators/ok.decorator';
import { OkResponseModel } from './swagger/okResponseModel.swagger';

@Controller('category')
@UseGuards(AuthorizationGuard)
@ApiTags('category')
@ApiBearerAuth()
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) { }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @CreateCategoryResponse()
  @Unauthorized()
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    return await this.categoryService.create(createCategoryDto);
  }

  @Get()
  @OkResponse([OkResponseModel])
  @Unauthorized()
  async findAll() {
    return await this.categoryService.findAll();
  }

  @Get(':id')
  @OkResponse(OkResponseModel)
  @Unauthorized()
  @NotFoundResponse()
  async findOne(@Param('id') id: string) {
    return await this.categoryService.findOne(+id);
  }

  @Patch(':id')
  @OkResponse(OkResponseModel)
  @Unauthorized()
  @NotFoundResponse()
  async update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return await this.categoryService.update(+id, updateCategoryDto);
  }

  @Delete(':id')
  @Unauthorized()
  @NotFoundResponse()
  async remove(@Param('id') id: string) {
    await this.categoryService.remove(+id);
  }
}
