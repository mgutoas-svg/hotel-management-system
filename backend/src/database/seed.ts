import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../modules/auth/entities/user.entity';
import { Property } from '../modules/properties/entities/property.entity';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USER || 'admin',
  password: process.env.DB_PASSWORD || 'password123',
  database: process.env.DB_NAME || 'hotel_management',
  entities: [User, Property],
  synchronize: false,
  logging: false,
});

async function seed() {
  await AppDataSource.initialize();
  console.log('Database connected');

  const userRepository = AppDataSource.getRepository(User);
  const propertyRepository = AppDataSource.getRepository(Property);

  // Seed users
  const adminUser = userRepository.create({
    email: 'admin@example.com',
    password: await bcrypt.hash('password123', 10),
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin',
    isActive: true,
  });

  await userRepository.save(adminUser);
  console.log('✅ Admin user created');

  // Seed properties
  const property = propertyRepository.create({
    name: 'Hotel Paradise',
    description: 'A beautiful beachfront hotel',
    address: 'Rua das Flores, 123',
    city: 'Rio de Janeiro',
    state: 'RJ',
    country: 'Brazil',
    zipCode: '20000-000',
    latitude: -22.9068,
    longitude: -43.1729,
    totalRooms: 50,
    propertyType: 'hotel',
    stars: 5,
    amenities: ['WiFi', 'Pool', 'Gym', 'Restaurant'],
    checkInTime: 14,
    checkOutTime: 11,
    isActive: true,
    ownerId: adminUser.id,
  });

  await propertyRepository.save(property);
  console.log('✅ Sample property created');

  await AppDataSource.destroy();
  console.log('✅ Seed completed!');
}

seed().catch(console.error);
