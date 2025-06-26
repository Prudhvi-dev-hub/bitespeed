import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Contact{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        nullable: true
    })    
    phoneNumber?: string;

    @Column({
        nullable: true
    })
    email?: string;

    @Column({
        nullable: true
    })
    linkedId: number;

    @Column({
        nullable: false,
        default: 'primary'
    })
    linkPrecedence: string;


    @CreateDateColumn({
        type: 'timestamptz',
        nullable: false,
        default: ()=> 'CURRENT_TIMESTAMP',
    })
    createdAt: Date;

    @CreateDateColumn({
        type: 'timestamptz',
        nullable: false,
        default: ()=> 'CURRENT_TIMESTAMP',
    })
    updatedAt: Date;

    @CreateDateColumn({        
        nullable: true,  
        default: null,      
    })
    deletedAt: Date;
}