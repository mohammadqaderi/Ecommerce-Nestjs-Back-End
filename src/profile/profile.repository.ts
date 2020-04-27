import { Repository, EntityRepository } from 'typeorm';
import { Profile } from './profile.entity';
import { CreateProfileDto } from './dto/create-profile.dto';

@EntityRepository(Profile)
export class ProfileRepository extends Repository<Profile> {

}
