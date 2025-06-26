import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contact } from './models/contact.entity';
import { config } from 'dotenv';
config(); // Load environment variables from .env file

@Module({
  imports: [
     TypeOrmModule.forRoot({
      type: process.env.TYPE as 'postgres',
      host: process.env.HOST_NAME,
      port: process.env.DB_PORT? parseInt(process.env.DB_PORT) : 5432,
      username: process.env.USERNAME,
      password: process.env.PASSWORD,
      database: process.env.DATABASE,
      entities: [Contact],
      synchronize: true,
      ssl: true,                     // Render requires SSL
      extra: {
        ssl: {
          rejectUnauthorized: false, // Required for Render
        },
      },
    }),
    TypeOrmModule.forFeature([Contact]),
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [TypeOrmModule]
})
export class AppModule {}
