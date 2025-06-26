import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Contact } from './models/contact.entity';
import { Repository } from 'typeorm';
import { CreatePurchaseOrderRequestDto } from './dtos/create-purchase-order.dto';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Contact)
    private contactRepository: Repository<Contact>
  ){}

  async create(data: CreatePurchaseOrderRequestDto){
    return this.contactRepository.save(data);
  }

  async findAll(){
    return await this.contactRepository.find({
      order: {
        createdAt: 'DESC',
      },
      take: 10,
      select: {
        id: true,
        email: true,
        phoneNumber: true,
        linkedId: true,
        linkPrecedence: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
      }      
    });
  }
}
