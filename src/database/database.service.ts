
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import * as mysql from 'mysql2/promise';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
    pool!: mysql.Pool;

    async onModuleInit() {
        this.pool = mysql.createPool({
            host: process.env.DB_HOST || 'mysql-23e5b4e5-gbox-db6a.e.aivencloud.com',
            port: Number(process.env.DB_PORT || 18550),
            user: process.env.DB_USER || 'avnadmin',
            password: process.env.DB_PASSWORD || 'AVNS_l4Bl-Ia2Zlf7Hh_8p-e',
            database: process.env.DB_NAME || 'defaultdb',
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0,
        });

        const conn = await this.pool.getConnection();
        try {
            await conn.ping();
        } finally {
            conn.release();
        }

        console.log('MySQL pool created');
    }

    async onModuleDestroy() {
        if (this.pool) {
            await this.pool.end();
        }
    }

    getPool() {
        return this.pool;
    }
}
