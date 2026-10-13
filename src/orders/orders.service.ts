import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { RowDataPacket, OkPacket } from 'mysql2';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class OrdersService {
  constructor(private db: DatabaseService) {}

  private pool = () => this.db.getPool();

  async createOrder(id: string, address_id: string, order_status = "Pending", total_amount = 0.00) {
    const [result] = await this.pool().execute<OkPacket>(
      'INSERT INTO orders (id, address_id, order_status, total_amount) VALUES (?, ?, ?, ?)',
      [id, address_id, order_status, total_amount],
    );
    return { orders_id: result.insertId, id, address_id, order_status, total_amount };
  }

  async findById(orders_id: number) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT * FROM orders WHERE order_id = ?',
      [orders_id],
    );
    return rows[0];
  }

  async getAll() {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT * FROM orders',
    );
    return rows;
  }

  async updateOrder(orders_id: number, partial: { order_id?: string; id?: string; address_id?: string; order_status?: string; total_amount?: string }) {
    const fields: string[] = [];
    const values: any[] = [];

    if (partial.id) {
      fields.push('id = ?');
      values.push(partial.id);
    }

    if (partial.address_id) {
      fields.push('address_id = ?');
      values.push(partial.address_id);
    }

    if (partial.order_status) {
      fields.push('order_status = ?');
      values.push(partial.order_status);
    }

    if (partial.total_amount) {
      fields.push('total_amount = ?');
      values.push(partial.total_amount);
    }

    if (fields.length === 0) return await this.findById(orders_id);

    values.push(orders_id);

    const sql = `UPDATE orders SET ${fields.join(', ')} WHERE order_id = ?`;
    await this.pool().execute(sql, values);

    return this.findById(orders_id);
  }

  async deleteOrder(orders_id: number) {
    const [result] = await this.pool().execute<OkPacket>(
      'DELETE FROM orders WHERE order_id = ?',
      [orders_id],
    );
    return result.affectedRows > 0;
  }
}