import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('payment')
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  // Get all payments (protected)
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllPayments() {
    return this.paymentService.getAll();
  }

  // Get single payment by id (protected)
  @UseGuards(JwtAuthGuard)
  @Get(':payment_id')
  async getOne(@Param('payment_id') payment_id: string) {
    return this.paymentService.findById(+payment_id);
  }

  // Create payment (open - for demo)
  @Post()
  async create(@Body() body: { order_id: string; payment_method: string; payment_status?: string}) {
    return this.paymentService.createPayment(body.order_id, body.payment_method, body.payment_status);
  }

  // Update payment (protected)
  @UseGuards(JwtAuthGuard)
  @Put(':payment_id')
  async update(@Param('payment_id') payment_id: string, @Body() body: any) {
    return this.paymentService.updatePayment(+payment_id, body);
  }

  // Delete payment (protected)
  @UseGuards(JwtAuthGuard)
  @Delete(':payment_id')
  async remove(@Param('payment_id') payment_id: string) {
    return this.paymentService.deletePayment(+payment_id);
  }
}