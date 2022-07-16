import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm'
import User from './user.entity';

@Entity()
class Address {
    @PrimaryGeneratedColumn('uuid')
    public id: string;

    @Column()
    public street: string

    @Column()
    public city: string;

    @Column()
    public country: string

    // setting up bi-direction between the two entities
    // fetch addresses with users
    // .find({ relations: ['user]})
    // When setting up bi-directional entities do not use JoinTable here since it has been used in User table
    @OneToOne(() => User, (user: User) => user.address)
    public user?: User;
}

export default Address