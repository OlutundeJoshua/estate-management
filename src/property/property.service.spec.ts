import { Test, TestingModule } from '@nestjs/testing';
import { PropertyService } from './property.service';
import { Repository } from 'typeorm';
import { Property } from '../entities/property.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreatePropertyDto } from '../models/dto/create-property.dto';

const mockPropertyRepo = {
  find: jest.fn(),
  findOne: jest.fn(),
  save: jest.fn(),
};

describe('PropertyService', () => {
  let service: PropertyService;
  let propertyRepo: Repository<Property>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PropertyService,
        {
          provide: getRepositoryToken(Property),
          useValue: mockPropertyRepo,
        },
      ],
    }).compile();

    service = module.get<PropertyService>(PropertyService);
    propertyRepo = module.get<Repository<Property>>(
      getRepositoryToken(Property),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAllProperties', () => {
    it('should return properties if found', async () => {
      const properties = [{ category: 'apartment', rooms: 3 }];
      mockPropertyRepo.find.mockResolvedValue(properties);

      const result = await service.getAllProperties('apartment', 3);

      expect(propertyRepo.find).toHaveBeenCalled();
      expect(result.code).toBe(0);
    });

    it('should return error if no properties found', async () => {
      mockPropertyRepo.find.mockResolvedValue([]);

      const result = await service.getAllProperties('villa', 5);

      expect(result).toMatchObject({ message: 'Properties not found' });
    });
  });

  describe('getOneProperty', () => {
    it('should return a property if found', async () => {
      const property = { propertyId: '123', category: 'apartment' };
      mockPropertyRepo.findOne.mockResolvedValue(property);

      const result = await service.getOneProperty('123');

      expect(propertyRepo.findOne).toHaveBeenCalledWith({
        where: { propertyId: '123' },
      });
      expect(result.code).toBe(0);
    });

    it('should return error if property not found', async () => {
      mockPropertyRepo.findOne.mockResolvedValue(null);

      const result = await service.getOneProperty('999');

      expect(result).toMatchObject({ message: 'Property not found' });
    });
  });

  describe('createProperty', () => {
    it('should create a property successfully', async () => {
      const createPropertyDto: CreatePropertyDto = {
        name: 'Villa Test',
        propertyId: '123456',
        price: '500000',
        bathroom: 2,
        toilets: 2,
        rooms: 4,
        category: 'shortlet' as any,
        parkingSpace: 1,
      };

      mockPropertyRepo.save.mockResolvedValue(createPropertyDto);

      const result = await service.createProperty(createPropertyDto);

      expect(propertyRepo.save).toHaveBeenCalled();
      expect(result.message).toBe('Successfully created property');
    });

    it('should return error for invalid payload', async () => {
      const result = await service.createProperty({} as CreatePropertyDto);

      expect(result).toMatchObject({ message: 'Invalid payload' });
    });
  });

  describe('editProperty', () => {
    it('should update property successfully', async () => {
      const property = { propertyId: '123', name: 'Old Name', price: 400000 };
      const editPropertyDto = { name: 'New Name', price: 450000 };

      mockPropertyRepo.findOne.mockResolvedValue(property);
      mockPropertyRepo.save.mockResolvedValue({
        ...property,
        ...editPropertyDto,
      });

      const result = await service.editProperty('123', editPropertyDto);

      expect(propertyRepo.save).toHaveBeenCalledWith({
        ...property,
        ...editPropertyDto,
      });
    });

    it('should return error if property not found', async () => {
      mockPropertyRepo.findOne.mockResolvedValue(null);

      const result = await service.editProperty('999', { name: 'New Name' });

      expect(result).toMatchObject({ message: 'Property not found!' });
    });
  });
});
