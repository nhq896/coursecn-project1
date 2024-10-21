import { UserRole } from "../enums/user.enum";

export type Avatar = {
  public_id: string;
  url: string;
};

export type User = {
  name: string;
  email: string;
  password?: string | null;
  avatar: Avatar;
  role: UserRole;
  //   isVerified: boolean;
  courses: Array<{ courseId: string }>;
};
