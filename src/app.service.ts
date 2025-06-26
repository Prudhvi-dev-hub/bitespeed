import { BadRequestException, Inject, Injectable } from '@nestjs/common';
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
    if(!data.email && !data.phoneNumber){
      throw new BadRequestException('Either email or phone number must be provided');
    }

    if(data.email && data.phoneNumber){
      const existingEmailContacts = await this.contactRepository.find({
        where: { email: data.email },        
        order:{
          createdAt: 'ASC',
        }
      });

      const existingPhoneContacts = await this.contactRepository.find({
        where: { phoneNumber: data.phoneNumber },      
        order:{
          createdAt: 'ASC',
        }
      });

      const existingCombinedContacts = await this.contactRepository.find({
        where: { 
          email: data.email,
          phoneNumber: data.phoneNumber,
        },        
        order:{
          createdAt: 'ASC',
        }
      });

      // If both email and phone number exist, link them
      if(existingCombinedContacts.length){
        const toCreateContact = {
          ...data,
          linkedId: existingCombinedContacts[0].linkedId?existingCombinedContacts[0].linkedId:existingCombinedContacts[0].id, // Link to primary contact
          linkPrecedence: 'secondary', // Secondary precedence for linked contacts
        }
        const createdContact = await this.contactRepository.save(toCreateContact);
        return {
          contact: {
            "primaryContactId": existingCombinedContacts[0].linkedId,
            "emails": [existingCombinedContacts[0].email],
            "phoneNumbers": [existingCombinedContacts[0].phoneNumber],
            "secondaryContactIds": [...existingCombinedContacts.map(contact=>contact.id),createdContact.id],
          }
       }
      }

      if(existingEmailContacts.length && existingPhoneContacts.length){
        // If both email and phone exist, link them
        if(existingEmailContacts[0].createdAt > existingPhoneContacts[0].createdAt){
          const toUpdateRecord = {
            ...data,
            linkedId: existingPhoneContacts[0].linkedId?existingPhoneContacts[0].linkedId:existingPhoneContacts[0].id, // Link to existing phone contact
            linkPrecedence: 'secondary', // Secondary precedence for new contacts
          }
          await this.contactRepository.update({id: existingEmailContacts[0].id},toUpdateRecord);
          const primaryId = existingPhoneContacts[0].linkedId? existingPhoneContacts[0].linkedId:existingPhoneContacts[0].id;
          return {
            contact: {
              "primaryContactId": primaryId,
              "emails": [...existingPhoneContacts.map(contact=>contact.email),...existingEmailContacts.map(contact=>contact.email)],
              "phoneNumbers": [...existingPhoneContacts.map(contact=>contact.phoneNumber),...existingEmailContacts.map(contact=>contact.phoneNumber)],
              "secondaryContactIds": [...existingPhoneContacts.filter(contact=>contact.id!=primaryId).map(contact=>contact.id),...existingEmailContacts.map(contact=>contact.id)],
            }
          }
        }else{
          const toUpdateRecord = {
            ...data,
            linkedId: existingEmailContacts[0].linkedId?existingEmailContacts[0].linkedId:existingEmailContacts[0].id, // Link to existing phone contact
            linkPrecedence: 'secondary', // Secondary precedence for new contacts
          }
          await this.contactRepository.update({id: existingPhoneContacts[0].id},toUpdateRecord);
          const primaryId = existingEmailContacts[0].linkedId? existingEmailContacts[0].linkedId:existingEmailContacts[0].id;          
          return {            
            contact: {
              "primaryContactId": primaryId,
              "emails": [...existingEmailContacts.map(contact=>contact.email),...existingPhoneContacts.map(contact=>contact.email)],
              "phoneNumbers": [...existingEmailContacts.map(contact=>contact.phoneNumber),...existingPhoneContacts.map(contact=>contact.phoneNumber)],
              "secondaryContactIds": [...existingEmailContacts.filter(contact=>contact.id!=primaryId).map(contact=>contact.id),...existingPhoneContacts.map(contact=>contact.id)],
            }
          }
        }
      }
      
      if(existingEmailContacts.length){
        // If only email exists, update it
        const toCreateContact = {
          ...data,
          linkedId: existingEmailContacts[0].linkedId?existingEmailContacts[0].linkedId:existingEmailContacts[0].id, // Link to existing email contact
          linkPrecedence: 'secondary', // Secondary precedence for new contacts
        }
        const createdLinkedContact = await this.contactRepository.save(toCreateContact);
        return {
          contact: {
            "primaryContactId": existingEmailContacts[0].linkedId,
            "emails": [data.email],
            "phoneNumbers": [...existingEmailContacts.filter(contact=>contact.phoneNumber!=null).map(contact=>contact.phoneNumber), data.phoneNumber],
            "secondaryContactIds": [...existingEmailContacts.map(contact=>contact.id),createdLinkedContact.id],
          }
        }
      }

      if(existingPhoneContacts.length){
      // If only phone exists, update it
      const toCreateContact = {
        ...data,
        linkedId: existingPhoneContacts[0].linkedId?existingPhoneContacts[0].linkedId:existingPhoneContacts[0].id, // Link to existing phone contact
        linkPrecedence: 'secondary', // Secondary precedence for new contacts
      }
      const createdLinkedContact = await this.contactRepository.save(toCreateContact);
      return {
        contact: {
          "primaryContactId": existingPhoneContacts[0].linkedId,
          "emails": [...existingPhoneContacts.filter(contact=>contact.email!=null).map(contact=>contact.email), data.email],
          "phoneNumbers": [data.phoneNumber],
          "secondaryContactIds": [...existingPhoneContacts.map(contact=>contact.id),createdLinkedContact.id],
          }
       }
      }
    }

    if(data.email){
      const existingEmailContacts = await this.contactRepository.find({
        where: { email: data.email },        
        order:{
          createdAt: 'ASC',
        }
      });

      if(existingEmailContacts.length){
      // If only email exists, update it
        const toCreateContact = {
          ...data,
          linkedId: existingEmailContacts[0].linkedId?existingEmailContacts[0].linkedId:existingEmailContacts[0].id,// Link to existing email contact
          linkPrecedence: 'secondary', // Secondary precedence for new contacts
        }
        const createdLinkedContact = await this.contactRepository.save(toCreateContact);
        return {
          contact: {
            "primaryContactId": existingEmailContacts[0].linkedId,
            "emails": [data.email],
            "phoneNumbers": [...existingEmailContacts.filter(contact=>contact.phoneNumber!=null).map(contact=>contact.phoneNumber)],
            "secondaryContactIds": [...existingEmailContacts.map(contact=>contact.id),createdLinkedContact.id],
          }
        }
      }else{
        // If email does not exist, create a new contact
        const newContact = {
          ...data,
          linkPrecedence: 'primary', // Default precedence for new contacts
        }
        const createdContact = await this.contactRepository.save(newContact);
        return {
          contact: {
            "primaryContactId": createdContact.id,
            "emails": [createdContact.email],
            "phoneNumbers": [],
            "secondaryContactIds": [],
          }
        }
      }
    }

    if(data.phoneNumber){
      const existingPhoneContacts = await this.contactRepository.find({
        where: { phoneNumber: data.phoneNumber },        
        order:{
          createdAt: 'ASC',
        }
      });

      if(existingPhoneContacts.length){
      // If only phone exists, update it
        const toCreateContact = {
          ...data,
          linkedId: existingPhoneContacts[0].linkedId?existingPhoneContacts[0].linkedId:existingPhoneContacts[0].id,// Link to existing phone contact
          linkPrecedence: 'secondary', // Secondary precedence for new contacts
        }
        const createdLinkedContact = await this.contactRepository.save(toCreateContact);
        return {
          contact: {
            "primaryContactId": existingPhoneContacts[0].linkedId,
            "emails": [...existingPhoneContacts.filter(contact=>contact.email!=null).map(contact=>contact.email)],
            "phoneNumbers": [data.phoneNumber],
            "secondaryContactIds": [...existingPhoneContacts.map(contact=>contact.id),createdLinkedContact.id],
          }
        }
      }else{
        // If phone does not exist, create a new contact
        const newContact = {
          ...data,
          linkPrecedence: 'primary', // Default precedence for new contacts
        }
        const createdContact = await this.contactRepository.save(newContact);
        return {
          contact: {
            "primaryContactId": createdContact.id,
            "emails": [],
            "phoneNumbers": [createdContact.phoneNumber],
            "secondaryContactIds": [],
          }
        }
      }
    }
  }

  async findAll(){
    return await this.contactRepository.find({
      order: {
        createdAt: 'DESC',
      },                  
    });
  }

  async deleteAll(){
    return await this.contactRepository.deleteAll();
  }
}
