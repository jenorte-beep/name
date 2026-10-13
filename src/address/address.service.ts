import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { RowDataPacket, OkPacket } from 'mysql2';

@Injectable()
export class AddressService {
  constructor(private db: DatabaseService) {}

  private pool = () => this.db.getPool();

  // Create address
  async createAddress( id: string, street: string, city: string, province: string, postal_code: string,) {
    const [result] = await this.pool().execute<OkPacket>(
      `INSERT INTO address
      (id, street, city, province, postal_code)
      VALUES (?, ?, ?, ?, ?)`,
      [id, street, city, province, postal_code],
    );

    return { id, street, city, province, postal_code };
  }

  // Find address by ID
  async findById(address_id: number) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      `SELECT * FROM address WHERE address_id = ?`,
      [address_id],
    );

    return rows[0];
  }

  // Get all addresses
  async getAll() {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      `SELECT * FROM address`,
    );

    return rows;
  }

  // Update address
  async updateAddress( address_id: number, partial: { address_id?: string; street?: string; city?: string; province?: string; postal_code?: string; },) {
    const fields: string[] = [];
    const values: any[] = [];

    if (partial.address_id) {
      fields.push('address_id = ?');
      values.push(partial.address_id);
    }

    if (partial.street) {
      fields.push('street = ?');
      values.push(partial.street);
    }

    if (partial.city) {
      fields.push('city = ?');
      values.push(partial.city);
    }

    if (partial.province) {
      fields.push('province = ?');
      values.push(partial.province);
    }

    if (partial.postal_code) {
      fields.push('postal_code = ?');
      values.push(partial.postal_code);
    }

    if (fields.length === 0) { return await this.findById(address_id); }

    values.push(address_id);

    const sql = `UPDATE address SET ${fields.join(', ')} WHERE address_id = ?`;
    await this.pool().execute(sql, values);

    return this.findById(address_id);
  }

  // Delete address
  async deleteAddress(address_id: number) {
    const [result] = await this.pool().execute<OkPacket>(
      `DELETE FROM address WHERE address_id = ?`,
      [address_id],
    );

    return result.affectedRows > 0;
  }
}