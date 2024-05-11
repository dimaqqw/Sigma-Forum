export interface IUserData {
  username: string;
  email: string;
  password: string;
}

export interface IUserDataForLogin {
  email: string;
  password: string;
}

export interface IUser {
  id: number;
  email: string;
  token: string;
}

export interface IResponseUser {
  username: string;
  email: string;
  id: number;
  role: string;
  createdAt: string;
  updatedAt: string;
  password: string;
}

export interface IResponseUserData {
  token: string;
  user: IResponseUser;
}

export interface IComment {
  comment_id: number;
  content: string;
  createdAt: string;
  user: {
    id: number;
    username: string;
  };
}

export interface IPost {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  topic: ITopic;
  user: IResponseUser;
  comments: IComment[];
}

export interface ITopic {
  id: number;
  title: string;
  description?: string;
  user: {};
}
