import { ApiProperty } from "@nestjs/swagger";
import {
    IsOptional,
    IsString,
} from "class-validator"

export class CreatePurchaseOrderRequestDto{
    @ApiProperty({
        description: 'The email address of the user creating the purchase order',
        example: 'john@yopmail.com',
        required: false,        
    })    
    @IsOptional()
    @IsString()
    email?: string;

    @ApiProperty({
        description: 'The phone number of the user creating the purchase order',
        example: '123456',
        required: false,
    })    
    @IsOptional()
    @IsString()
    phoneNumber?: string;
}