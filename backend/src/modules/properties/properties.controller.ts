import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Req, Query } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PropertiesService } from './properties.service';
import { CreatePropertyDto } from './dto/create-property.dto';

@Controller('properties')
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() createPropertyDto: CreatePropertyDto, @Req() req) {
    return this.propertiesService.create(createPropertyDto, req.user.userId);
  }

  @Get()
  async findAll(
    @Query('city') city?: string,
    @Query('type') type?: string,
    @Query('skip') skip?: string,
    @Query('take') take?: string,
  ) {
    return this.propertiesService.findAll({
      city,
      propertyType: type,
      skip: skip ? parseInt(skip) : 0,
      take: take ? parseInt(take) : 20,
    });
  }

  @Get('my-properties')
  @UseGuards(JwtAuthGuard)
  async getMyProperties(@Req() req) {
    return this.propertiesService.getOwnerProperties(req.user.userId);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.propertiesService.findById(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(@Param('id') id: string, @Body() updateDto: Partial<CreatePropertyDto>, @Req() req) {
    return this.propertiesService.update(id, updateDto, req.user.userId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async delete(@Param('id') id: string, @Req() req) {
    return this.propertiesService.delete(id, req.user.userId);
  }
}
