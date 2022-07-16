import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import Post from "../posts/post.entity";

@Entity()
class Category {
    @PrimaryGeneratedColumn('uuid')
    public id: string

    @Column()
    public name: string;

    // Bi-Direction, we do not use JoinTable here since it has been used at the other side
    @ManyToMany(() => Post, (post: Post) => post.categories)
    public posts: Post[];
}

export default Category;