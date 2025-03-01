import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Quote {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    from_currency: string;

    @Column()
    to_currency: string;

    @Column('decimal')
    amount: number;

    @Column('decimal')
    conversion_rate: number;

    @Column('decimal')
    converted_amount: number;

    @Column({ type: 'timestamp' })
    created_at: Date;

    @Column({ type: 'timestamp' })
    expires_at: Date;
}