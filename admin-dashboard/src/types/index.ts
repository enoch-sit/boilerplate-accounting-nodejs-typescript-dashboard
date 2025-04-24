export interface User {
  _id?: string;
  username: string;
  email: string;
  password?: string;
  role?: string;
  isVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface BatchUserRequest {
  username: string;
  email: string;
  role?: string;
}

export interface BatchUserResponse {
  username: string;
  email: string;
  success: boolean;
  message: string;
  userId?: string;
}

export interface BatchCreationResponse {
  message: string;
  results: BatchUserResponse[];
  summary: {
    total: number;
    successful: number;
    failed: number;
  };
}

export interface ApiResponse {
  message: string;
  userId?: string;
}