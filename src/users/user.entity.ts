import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { Exclude, Expose, Transform } from 'class-transformer';

@Entity()
class User {
    @PrimaryGeneratedColumn()
    public id?: number;

    @Column({ unique: true })
    @Expose()
    public email: string;

    @Column()
    @Expose()
    public name: string

    @Column()
    // @Exclude() use this if you are not using the @SerializeOptions({
    // strategy: 'excludeAll'
    // }) in the controller
    public password: string;
}

export default User;