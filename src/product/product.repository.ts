import { EntityRepository, Repository } from 'typeorm';
import { Product } from './product.entity';
import { GetProductsFilterDto } from './dto/get-products-filter.dto';

@EntityRepository(Product)
export class ProductRepository extends Repository<Product> {
  async getProducts(
  ): Promise<Product[]> {
    try {
      return await this.find();
    } catch (error) {
      console.error(error);
    }
  }
}
