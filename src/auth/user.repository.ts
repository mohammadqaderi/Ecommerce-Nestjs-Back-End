import { Repository, EntityRepository } from 'typeorm';
import { User } from './user.entity';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { CreateProfileDto } from '../profile/dto/create-profile.dto';
import { Profile } from '../profile/profile.entity';
import { Cart } from '../cart/cart.entity';
import { CartItem } from '../cart/cart-item.entity';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async signUp(
    authCredentialsDto: AuthCredentialsDto,
    createProfileDto: CreateProfileDto,
  ): Promise<void> {
    const { username, password } = authCredentialsDto;
    const user = new User();
    user.salt = await bcrypt.genSalt();
    user.username = username;
    user.password = await this.hashPassword(password, user.salt);
    const query = this.createQueryBuilder('user');
    const users = await query
      .select('username')
      .where('user.username LIKE :username', { username });
    if (await users.getCount()) {
      throw new ConflictException('username is already exist in the database');
    } else {
      const profile = await this.createProfile(user, createProfileDto);
      user.profile = profile;
      user.orders = [];
      user.invoices = [];
      user.payments = [];
      await user.save();
    }
  }

  async existData() {
    const availableData = {
      totalUsers: 0,
      totalOrders: 0,
      totalPayments: 0,
      totalInvoices: 0,
    };
    const users = await this.find();
    for (let i = 0; i < users.length; i++) {
      availableData.totalUsers++;
      if (users[i].invoices) {
        for (let j = 0; j < users[i].invoices.length; j++) {
          availableData.totalInvoices++;
        }
      }
      if (users[i].orders) {
        for (let j = 0; j < users[i].orders.length; j++) {
          availableData.totalOrders++;
        }
      }
      if (users[i].payments) {
        for (let j = 0; j < users[i].payments.length; j++) {
          availableData.totalPayments++;
        }
      }
    }
    return availableData;
  }

  async validateUserPassword(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<string> {
    const { username, password } = authCredentialsDto;
    const user = await this.findOne({ username });
    if (user && (await user.validatePassword(password))) {
      return username;
    } else {
      return null;
    }
  }

  async createProfile(
    user: User,
    createProfileDto: CreateProfileDto,
  ): Promise<Profile> {
    const {
      firstname,
      lastname,
      phone,
      email,
      gender,
      age,
      country,
      city,
      address,
    } = createProfileDto;
    const profile = new Profile();
    profile.firstname = firstname;
    profile.lastname = lastname;
    profile.email = email;
    profile.gender = gender;
    profile.age = age;
    profile.country = country;
    profile.city = city;
    profile.address = address;
    profile.phone = phone;
    profile.user = user;
    const cart = await this.createCart(profile);
    profile.cart = cart;
    try {
      await profile.save();
      return profile;
    } catch (err) {
      console.error(err);
    }
  }

  async createCart(profile: Profile): Promise<Cart> {
    const cart = new Cart();
    const cart_item = await this.createCartItem(cart);
    cart.cart_item = cart_item;
    cart.profile = profile;
    try {
      await cart.save();
      return cart;
    } catch (err) {
      console.error(err);
    }
  }

  async createCartItem(cart: Cart): Promise<CartItem> {
    const cart_item = new CartItem();
    cart_item.total_products = 0;
    cart_item.cart = cart;
    cart_item.products = [];
    try {
      await cart_item.save();
      return cart_item;
    } catch (error) {
      console.error(error);
    }
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }


}
