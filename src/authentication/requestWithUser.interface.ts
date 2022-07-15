import User from "src/users/user.entity";
import { Request } from '@nestjs/common';

interface RequestWithUser extends Request {
    user: User
}
export default RequestWithUser