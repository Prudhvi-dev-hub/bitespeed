import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contact } from './models/contact.entity';
import { Repository } from 'typeorm';

@Module({
  imports: [
     TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'dpg-d1d0tg7diees73cbudk0-a.oregon-postgres.render.com',
      port: 5432,
      username: 'prudhvi',
      password: 'Pyt5t1iLRzbnojSVYAbkr9cWb6gdaxBB',
      database: 'bitespeed_dgss',
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
