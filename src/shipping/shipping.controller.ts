import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ShippingService } from './shipping.service';

@Controller('shipping')
export class ShippingController {
  constructor(private shippingService: ShippingService) {}

  // Get all shippings (protected)
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll() {
    return this.shippingService.getAll();
  }

  // Get single shipping by id (protected)
  @UseGuards(JwtAuthGuard)
  @Get(':shipping_id')
  async getOne(@Param('shipping_id') shipping_id: string) {
    return this.shippingService.findById(shipping_id);
  }

  // Create shipping (open - for demo)
  @Post()
  async create(@Body() body: { order_id: string; courier: string; tracking_number: string; shipping_status: string; }) {
    return this.shippingService.createShipping(body.order_id, body.courier, body.tracking_number, body.shipping_status);
  }

  // Update shipping (protected)
  @UseGuards(JwtAuthGuard)
  @Put(':shipping_id')
  async update(@Param('shipping_id') shipping_id: string, @Body() body: any) {
    return this.shippingService.updateShipping(shipping_id, body);
  }

  // Delete shipping (protected)
  @UseGuards(JwtAuthGuard)
  @Delete(':shipping_id')
  async remove(@Param('shipping_id') shipping_id: string) {
    return this.shippingService.deleteShippings(shipping_id);
  }
}
