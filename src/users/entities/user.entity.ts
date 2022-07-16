import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Exclude, Expose, Transform } from 'class-transformer';
import Address from './address.entity';
import Post from '../../posts/post.entity';

@Entity()
class User {
    @PrimaryGeneratedColumn('uuid')
    public id: string;

    @Column({ unique: true })
    @Expose()
    public email: string;

    @Column()
    public name: string

    @Column()
    @Exclude()
    public password: string;

    @OneToOne(() => Address, {
        eager: true, // we want the related entities to always be included,

        // setting cascade allows us to pass the address along with the user data during POST
        // and the address table will be populated with the passed address data and the user table will be updated with the 
        // address id
        cascade: true
    })
    @JoinColumn()
    public address: Address

    // OneToMany must declare the ManyToOne in the other table
    @OneToMany(() => Post, (post: Post) => post.author)
    public posts?: Post[]
}

export default User;