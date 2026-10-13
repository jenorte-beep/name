import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AddressService } from './address.service';

@Controller('address')
export class AddressController {
  constructor(private addressService: AddressService) {}

  // Get all addresses (protected)
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll() {
    return this.addressService.getAll();
  }

  // Get single address by id (protected)
  @UseGuards(JwtAuthGuard)
  @Get(':address_id')
  async getOne(@Param('address_id') address_id: string) {
    return this.addressService.findById(+address_id);
  }

  // Create address (open - for demo)
  @Post()
  async create(@Body() body: { id: string; street: string; city: string; province: string; postal_code: string }) {
    return this.addressService.createAddress(body.id, body.street, body.city, body.province, body.postal_code);
  }

  // Update address (protected)
  @UseGuards(JwtAuthGuard)
  @Put(':address_id')
  async update(@Param('address_id') address_id: string, @Body() body: any) {
    return this.addressService.updateAddress(+address_id, body);
  }

  // Delete address (protected)
  @UseGuards(JwtAuthGuard)
  @Delete(':address_id')
  async remove(@Param('address_id') address_id: string) {
    return this.addressService.deleteAddress(+address_id);
  }
}
