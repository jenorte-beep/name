import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { RowDataPacket, OkPacket } from 'mysql2';

@Injectable()
export class ShippingService {
  constructor(private db: DatabaseService) {}

  private pool = () => this.db.getPool();

  // Create shipping
  async createShipping(order_id: string, courier: string, tracking_number: string, shipping_status = 'Preparing') {
    const [result] = await this.pool().execute<OkPacket>(
      `INSERT INTO shipping
      (order_id, courier, tracking_number, shipping_status)
      VALUES (?, ?, ?, ?)`,
      [order_id, courier, tracking_number, shipping_status], 
    );

    return { order_id, courier, tracking_number , shipping_status };
  }

  // Find shipping by ID
  async findById(shipping_id: string) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      `SELECT * FROM shipping WHERE shipping_id = ?`,
      [shipping_id],
    );

    return rows[0];
  }

  // Get all shipping
  async getAll() {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      `SELECT * FROM shipping`,
    );

    return rows;
  }

  // Update Shipping
  async updateShipping(
    shipping_id: string,
    partial: {
      courier?: string; tracking_number?: string; shipping_status?: string; }, ) {
    const fields: string[] = [];
    const values: any[] = [];

    if (partial.courier !== undefined) {
      fields.push('courier = ?');
      values.push(partial.courier);
    }

    if (partial.tracking_number !== undefined) {
      fields.push('tracking_number = ?');
      values.push(partial.tracking_number);
    }

    if (partial.shipping_status !== undefined) {
      fields.push('shipping_status = ?');
      values.push(partial.shipping_status);
    }

    if (fields.length === 0) {
      return await this.findById(shipping_id);
    }

    values.push(shipping_id);

    const sql = `
      UPDATE shipping
      SET ${fields.join(', ')}
      WHERE shipping_id = ?
    `;

    await this.pool().execute(sql, values);

    return await this.findById(shipping_id);
  }

  // Delete Shipping
  async deleteShippings(shipping_id: string) {
    const [result] = await this.pool().execute<OkPacket>(
      `DELETE FROM shipping WHERE shipping_id = ?`,
      [shipping_id],
    );

    return result.affectedRows > 0;
  }
}