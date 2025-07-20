// src/@types/express/index.d.ts
import { UserRole } from 'src/users/entities/user.entity';

declare global {
  namespace Express {
    interface User {
      id: number;
      email: string;
      role: UserRole;
    }

    interface Request {
      user?: User;
    }
  }
}
