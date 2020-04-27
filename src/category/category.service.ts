import { Injectable, NotFoundException, Req, Res } from '@nestjs/common';
import { CategoryRepository } from './category.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Product } from '../product/product.entity';
import { ProductService } from '../product/product.service';
import { DeleteResult } from 'typeorm';
import { UpdateCategoryDto } from './dto/update-category.dto';
import * as fs from 'fs';
import { AwsService } from '../shared/aws/aws.service';
@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryRepository)
    private categoryRepository: CategoryRepository,
    private readonly productService: ProductService,
    private readonly awsService: AwsService,
  ) {}

  async getCategories(): Promise<Category[]> {
    return await this.categoryRepository.find();
  }

  async getCategory(id: number): Promise<Category> {
    const category: Category = await this.categoryRepository.findOne({
      where: { id },
    });
    if (!category) {
      throw new NotFoundException(`Category with id: ${id}  not found `);
    }
    return category;
  }

  async createCategory(
    createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    return await this.categoryRepository.createCategory(createCategoryDto);
  }

  async createProduct(
    id: number,
    name: string,
    description: string,
    price: number,
    quantity: number,
    image: any,
  ) {
    const category: Category = await this.getCategory(id);
    const product = new Product();
    product.name = name;
    product.description = description;
    product.price = price;
    product.quantity = quantity;
    product.publishedIn = new Date();
    product.category = category;
    product.order_items = [];
    product.image = await this.awsService.fileupload(image);
    console.log(product.image);
    category.products.push(await product.save());
  }

  async updateProduct(
    categoryId: number,
    productId: number,
    name: string,
    description: string,
    price: number,
    quantity: number,
    image: any,
  ): Promise<void> {
    const category: Category = await this.getCategory(categoryId);
    const product = category.products.find(prod => prod.id === productId);
    if (name) {
      product.name = name;
    }
    if (description) {
      product.description = description;
    }
    if (price) {
      product.price = price;
    }
    if (quantity) {
      product.quantity = quantity;
    }
    if (image) {
      await this.awsService.fileDelete(product.image);
      product.image = await this.awsService.fileupload(image);
    }
    await product.save();
  }
  async updateCategory(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<void> {
    const category = await this.getCategory(id);
    const { name, description } = updateCategoryDto;
    if (name) {
      category.name = name;
    }
    if (description) {
      category.description = description;
    }
    await category.save();
  }

  async getProducts(categoryId: number) {
    const category = await this.getCategory(categoryId);
    const products = category.products;
    products.forEach(prod => {
      if (prod.id === 81) {
        console.log(prod.image.substring(55));
      }
    });
    return products;
  }

  async deleteCategory(categoryId: number): Promise<DeleteResult> {
    const result = await this.categoryRepository.delete(categoryId);
    if (result.affected === 0) {
      throw new NotFoundException(
        `Category with id: ${categoryId} is not found `,
      );
    }
    return result;
  }

  async deleteProduct(categoryId: number, productId: number) {
    const category: Category = await this.getCategory(categoryId);
    const product = category.products.find(prod => prod.id === productId);
    if (product.image) {
      await this.awsService.fileDelete(product.image);
    }
    await this.productService.deleteProduct(productId);
  }
}
