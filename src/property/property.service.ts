import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Property } from '../entities/property.entity';
import { CreatePropertyDto } from '../models/dto/create-property.dto';
import {
  customErrorResponseWithCode,
  customSuccessResponseWithCode,
} from '../models/lib/response.model';
import { Like, Repository } from 'typeorm';

@Injectable()
export class PropertyService {
  private readonly log: Logger;
  constructor(
    @InjectRepository(Property)
    private readonly propertyRepo: Repository<Property>,
  ) {}

  async getAllProperties(category, rooms) {
    const filter = [];

    if (category) {
      filter.push({ category: Like(`%${category}%`) });
    }

    if (rooms) {
      filter.push({ room: rooms });
    }

    const properties = await this.propertyRepo.find({
      where: filter.length > 0 ? filter : undefined,
    });

    if (!properties?.length) {
      return customErrorResponseWithCode('Properties not found');
    }

    const propertiesResponse = properties.map((property) => ({
      sold: property.sold,
      approved: property.approved,
      paymentStatus: property.paymentStatus,
      price: property.price,
      bathroom: property.bathroom,
      toilets: property.toilets,
      parkingSpace: property.parkingSpace,
      category: property.category,
      images: property.images,
    }));

    return customSuccessResponseWithCode('Properties retrieved successfully', propertiesResponse);
  }

  async getOneProperty(propertyId: string) {
    const property = await this.propertyRepo.findOne({
      where: { propertyId },
    });

    if (!property) {
      return customErrorResponseWithCode('Property not found');
    }

    const propertiesResponse = {
      sold: property.sold,
      approved: property.approved,
      paymentStatus: property.paymentStatus,
      price: property.price,
      bathroom: property.bathroom,
      toilets: property.toilets,
      parkingSpace: property.parkingSpace,
      category: property.category,
      images: property.images,
    };

    return customSuccessResponseWithCode('Property retrieved successfully', propertiesResponse);
  }

  async createProperty(createPropertyDto: CreatePropertyDto) {
    if (!createPropertyDto?.name) {
      return customErrorResponseWithCode('Invalid payload');
    }

    const timestamp = Date.now();
    const randomNumber = Math.floor(Math.random() * 1000);
    const propertyId = parseInt(`${timestamp}${randomNumber}`.slice(0, 12));

    const property = new Property();

    property.name = createPropertyDto.name;
    property.propertyId = createPropertyDto.propertyId;
    property.price = createPropertyDto.price;
    property.bathroom = createPropertyDto.bathroom;
    property.toilets = createPropertyDto.toilets;
    property.rooms = createPropertyDto.rooms;
    if (createPropertyDto.category) {
      property.category = createPropertyDto.category;
    }
    try {
      await this.propertyRepo.save(property);
      return customSuccessResponseWithCode('Successfully created property', property);
    } catch (err) {
      this.log.debug('Error creating property', err);
    }
  }

  async editProperty(propertyId: string, editPropertyDto) {
    if (!propertyId) {
      return customErrorResponseWithCode('Property is required!');
    }

    const property = await this.propertyRepo.findOne({
      where: { propertyId },
    });

    if (!property) {
      return customErrorResponseWithCode('Property not found!');
    }

    property.name = editPropertyDto.name ?? property.name;
    property.price = editPropertyDto.price ?? property.price;
    property.bathroom = editPropertyDto.bathroom ?? property.bathroom;
    property.toilets = editPropertyDto.toilets ?? property.toilets;
    property.rooms = editPropertyDto.rooms ?? property.rooms;
    property.category = editPropertyDto.category ?? property.category;

    try {
      await this.propertyRepo.save(property);
    } catch (err) {
      this.log.error('Error updating property.', err);
      return customErrorResponseWithCode('Unable to update property', err);
    }
  }
}
