import { Category } from './category.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';

@EntityRepository(Category)
export class CategoryRepository extends Repository<Category> {
  async createCategory(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const { name, description, type } = createCategoryDto;
    const category = new Category();
    category.name = name;
    category.description = description;
    category.type = type;
    try {
      await category.save();
      return category;

    } catch (error) {
      console.log(error);
    }
  }


}
