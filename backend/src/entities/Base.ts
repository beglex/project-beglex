import {Entity, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
export abstract class Base {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    [key: string]: any;
}
