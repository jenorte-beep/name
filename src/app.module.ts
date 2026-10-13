import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { AddressModule } from './address/address.module';
import { OrdersModule } from './orders/orders.module';
import { PaymentModule } from './payment/payment.module';
import { ShippingModule } from './shipping/shipping.module';

@Module({
imports: [DatabaseModule, UsersModule, AuthModule, AddressModule, OrdersModule, PaymentModule, ShippingModule],
})

export class AppModule {}