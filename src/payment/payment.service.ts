import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { RowDataPacket, OkPacket } from 'mysql2';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class PaymentService {
  constructor(private db: DatabaseService) {}

  private pool = () => this.db.getPool();

  async createPayment(order_id: string, payment_method: string, payment_status = 'Pending') {
    const [result] = await this.pool().execute<OkPacket>(
      'INSERT INTO payment (order_id, payment_method, payment_status) VALUES (?, ?, ?)',
      [order_id, payment_method, payment_status],
    );
    return { payment_id: result.insertId, order_id, payment_method, payment_status};
  }

  async findById(payment_id: number) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT * FROM payment WHERE payment_id = ?',
      [payment_id],
    );
    return rows[0];
  }

  async getAll() {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT * FROM payment',
    );
    return rows;
  }

  async updatePayment(payment_id: number, partial: { order_id?: string; payment_method?: string; payment_status?: string }) {
    const fields: string[] = [];
    const values: any[] = [];

    if (partial.order_id) {
      fields.push('order_id = ?');
      values.push(partial.order_id);
    }

    if (partial.payment_method) {
      fields.push('payment_method = ?');
      values.push(partial.payment_method);
    }

    if (partial.payment_status) {
      fields.push('payment_status = ?');
      values.push(partial.payment_status);
    }

    if (fields.length === 0) return await this.findById(payment_id);

    values.push(payment_id);

    const sql = `UPDATE payment SET ${fields.join(', ')} WHERE payment_id = ?`;
    await this.pool().execute(sql, values);

    return this.findById(payment_id);
  }

  async deletePayment(payment_id: number) {
    const [result] = await this.pool().execute<OkPacket>(
      'DELETE FROM payment WHERE payment_id = ?',
      [payment_id],
    );
    return result.affectedRows > 0;
  }
}