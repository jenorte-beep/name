import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  // Get all orders (protected)
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllOrders() {
    return this.ordersService.getAll();
  }

  // Get single order by id (protected)
  @UseGuards(JwtAuthGuard)
  @Get(':orders_id')
  async getOne(@Param('orders_id') orders_id: string) {
    return this.ordersService.findById(+orders_id);
  }

  // Create order (open - for demo)
  @Post()
  async create(@Body() body: { id: string; address_id: string; order_status?: string; total_amount?: number }) {
    return this.ordersService.createOrder(body.id, body.address_id, body.order_status, body.total_amount);
  }

  // Update order (protected)
  @UseGuards(JwtAuthGuard)
  @Put(':orders_id')
  async update(@Param('orders_id') orders_id: string, @Body() body: any) {
    return this.ordersService.updateOrder(+orders_id, body);
  }

  // Delete order (protected)
  @UseGuards(JwtAuthGuard)
  @Delete(':orders_id')
  async remove(@Param('orders_id') orders_id: string) {
    return this.ordersService.deleteOrder(+orders_id);
  }
}