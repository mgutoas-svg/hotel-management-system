import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AnalyticsService } from './analytics.service';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('property/:propertyId/revenue')
  @UseGuards(JwtAuthGuard)
  async getRevenue(
    @Param('propertyId') propertyId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.analyticsService.getRevenueReport(propertyId, new Date(startDate), new Date(endDate));
  }

  @Get('property/:propertyId/occupancy')
  @UseGuards(JwtAuthGuard)
  async getOccupancy(
    @Param('propertyId') propertyId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.analyticsService.getOccupancyReport(propertyId, new Date(startDate), new Date(endDate));
  }
}
