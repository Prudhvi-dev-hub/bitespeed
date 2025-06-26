import { Body, Controller, Delete, Get, Post, ValidationPipe } from '@nestjs/common';
import { AppService } from './app.service';
import { CreatePurchaseOrderRequestDto } from './dtos/create-purchase-order.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('api/v1/identity')
@ApiTags('Identity APIs')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()  
  async create(@Body(new ValidationPipe()) data: CreatePurchaseOrderRequestDto){
    return await this.appService.create(data);
  }

  @Get()
  async findIdentities() {
    return await this.appService.findAll();
  }

  @Delete('/flush-all')
  async deleteAll() {
    return await this.appService.deleteAll();
  }
}
