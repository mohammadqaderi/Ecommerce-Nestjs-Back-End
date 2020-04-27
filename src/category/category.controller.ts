import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Body,
  Delete,
  UseGuards,
  Put,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { AuthGuard } from '@nestjs/passport';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  getCategories() {
    return this.categoryService.getCategories();
  }

  @Get(':id')
  getCategory(@Param('id', ParseIntPipe) id: number) {
    return this.categoryService.getCategory(id);
  }

  @UseGuards(AuthGuard())
  @Post(':id/products')
  @UseInterceptors(
    FileInterceptor('image')
  )
  createProduct(
    @Param('id', ParseIntPipe) categoryId: number,
    @Body('name') name: string,
    @Body('description') description: string,
    @Body('price') price: number,
    @Body('quantity') quantity: number,
    @UploadedFile() image,
  ) {
    return this.categoryService.createProduct(
      categoryId,
      name,
      description,
      price,
      quantity,
      image
    );
  }

  @UseGuards(AuthGuard())
  @Put(':id/products/:productId')
  @UseInterceptors(
    FileInterceptor('image')
  )
  updateProduct(
    @Param('id', ParseIntPipe) categoryId: number,
    @Param('productId', ParseIntPipe) productId: number,
    @Body('name') name: string,
    @Body('description') description: string,
    @Body('price') price: number,
    @Body('quantity') quantity: number,
    @UploadedFile() image,
  ) {
    return this.categoryService.updateProduct(
      categoryId,
      productId,
      name,
      description,
      price,
      quantity,
      image,
    );
  }
  @UseGuards(AuthGuard())
  @Delete(':id/products/:productId')
  deleteProduct(
    @Param('id', ParseIntPipe) categoryId: number,
    @Param('productId', ParseIntPipe) productId: number,
  ) {
    return this.categoryService.deleteProduct(
      categoryId,
      productId,
    );
  }

  @Get(':id/products')
  getProducts(@Param('id', ParseIntPipe) id: number) {
    return this.categoryService.getProducts(id);
  }

  @UseGuards(AuthGuard())
  @Post()
  createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.createCategory(createCategoryDto);
  }

  @UseGuards(AuthGuard())
  @Put(':id')
  updateCategory(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.updateCategory(id, updateCategoryDto);
  }

  @UseGuards(AuthGuard())
  @Delete(':id')
  deleteCategory(@Param('id', ParseIntPipe) id: number) {
    return this.categoryService.deleteCategory(id);
  }
}
