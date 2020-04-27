import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { ProfileRepository } from './profile.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile } from './profile.entity';
import { User } from '../auth/user.entity';
import { CreateProfileDto } from './dto/create-profile.dto';
import { AwsService } from '../shared/aws/aws.service';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(ProfileRepository)
    private profileRepository: ProfileRepository,
    private readonly awsService: AwsService
  ) {}

  async getProfileData(user: User): Promise<Profile> {
    const profile = await this.profileRepository.findOne(user);
    if (!profile) {
      throw new NotFoundException(`profile does not exist`);
    }
    return profile;
  }

  async deleteProfile(profile: Profile): Promise<void> {
    if(profile.image) {
      await this.awsService.fileDelete(profile.image);
    }
    await this.profileRepository.delete(profile);
  }
  async editUserProfile(user: User, createProfileDto: CreateProfileDto): Promise<Profile> {
    const profile = await this.getProfileData(user);
    const {
      firstname,
      lastname,
      email,
      age,
      gender,
      address,
      country,
      city,
      phone,
    } = createProfileDto;

    if (firstname) {
      profile.firstname = firstname;
    }
    if (lastname) {
      profile.lastname = lastname;
    }
    if (email) {
      profile.email = email;
    }
    if (gender) {
      profile.gender = gender;
    }
    if (age) {
      profile.age = age;
    }
    if (country) {
      profile.country = country;
    }
    if (city) {
      profile.city = city;
    }
    if (address) {
      profile.address = address;
    }
    if (phone) {
      profile.phone = phone;
    }
    try {
     return await profile.save();
    } catch (error) {
      console.error(error);
    }
  }

  async setProfileImage(user: User, image: any): Promise<Profile> {
    const profile = await this.getProfileData(user);
    profile.image = await this.awsService.fileupload(image);
    try {
      await profile.save();
      return profile;
    } catch (error) {
      console.error(error);
    }
  }

  async deleteProfileImage(user: User): Promise<void> {
    const profile = await this.getProfileData(user);
    if (profile.image === null) {
      throw new ConflictException(`Profile Image is already set to null!!`);
    }
    await this.awsService.fileDelete(profile.image);
    profile.image = null;
    try {
      await profile.save();
    } catch (error) {
      console.error(error);
    }
  }
  async changeProfileImage(user: User, image: any): Promise<Profile> {
    const profile = await this.getProfileData(user);
    if (profile.image) {
      await this.deleteProfileImage(user);
      profile.image = await this.awsService.fileupload(image);
      try {
        await profile.save();
        return profile;
      } catch (error) {
        console.error(error);
      }
    }
  }
}
