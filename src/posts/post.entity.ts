
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import Category from '../categories/category.entity';
import User from '../users/entities/user.entity';


@Entity()
class Post {
    @PrimaryGeneratedColumn('uuid')
    public id: string;

    @Column()
    public title: string

    @Column()
    public content: string


    @Column({ nullable: true })
    public category?: string

    @ManyToOne(() => User, (author: User) => author.posts)
    public author: User

    // Uni-Direction
    // @ManyToMany(() => Category)
    // @JoinTable()
    // public categories: Category[]

    // Bi-Directional: do not forget to use JoinTable only one side
    @ManyToMany(() => Category, (category: Category) => category.posts)
    @JoinTable()
    public categories: Category[];
}

export default Post;