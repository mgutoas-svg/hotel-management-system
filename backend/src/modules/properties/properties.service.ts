import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Property } from './entities/property.entity';
import { CreatePropertyDto } from './dto/create-property.dto';

@Injectable()
export class PropertiesService {
  constructor(
    @InjectRepository(Property)
    private readonly propertyRepository: Repository<Property>,
  ) {}

  async create(createPropertyDto: CreatePropertyDto, userId: string) {
    const property = this.propertyRepository.create({
      ...createPropertyDto,
      ownerId: userId,
    });
    return await this.propertyRepository.save(property);
  }

  async findAll(filters?: { city?: string; propertyType?: string; skip?: number; take?: number }) {
    const query = this.propertyRepository.createQueryBuilder('property').where('property.isActive = true');

    if (filters?.city) {
      query.andWhere('property.city ILIKE :city', { city: `%${filters.city}%` });
    }

    if (filters?.propertyType) {
      query.andWhere('property.propertyType = :type', { type: filters.propertyType });
    }

    const take = filters?.take || 20;
    const skip = filters?.skip || 0;

    return await query.skip(skip).take(take).getMany();
  }

  async findById(id: string) {
    const property = await this.propertyRepository.findOne({ where: { id } });
    if (!property) {
      throw new NotFoundException('Property not found');
    }
    return property;
  }

  async update(id: string, updateDto: Partial<CreatePropertyDto>, userId: string) {
    const property = await this.findById(id);

    if (property.ownerId !== userId) {
      throw new ForbiddenException('You do not have permission to update this property');
    }

    Object.assign(property, updateDto);
    return await this.propertyRepository.save(property);
  }

  async delete(id: string, userId: string) {
    const property = await this.findById(id);

    if (property.ownerId !== userId) {
      throw new ForbiddenException('You do not have permission to delete this property');
    }

    property.isActive = false;
    return await this.propertyRepository.save(property);
  }

  async getOwnerProperties(userId: string) {
    return await this.propertyRepository.find({ where: { ownerId: userId, isActive: true } });
  }
}
