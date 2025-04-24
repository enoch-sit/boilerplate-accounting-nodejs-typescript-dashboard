/**
 * Admin Service
 * 
 * This file contains methods to interact with admin-related API endpoints.
 */

import ApiService from './apiService';
import { AdminAPIEndpoint } from './apiEndpoints';

// Types for admin API requests and responses
export interface User {
  _id: string;
  username: string;
  email: string;
  isVerified: boolean;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserRequest {
  username: string;
  email: string;
  password: string;
  role?: string;
  skipVerification?: boolean;
}

export interface BatchUserRequest {
  users: {
    username: string;
    email: string;
    role?: string;
  }[];
  skipVerification?: boolean;
}

export interface BatchUserResult {
  username: string;
  email: string;
  success: boolean;
  message: string;
  userId?: string;
}

export interface BatchUserResponse {
  message: string;
  results: BatchUserResult[];
  summary: {
    total: number;
    successful: number;
    failed: number;
  };
}

// Admin service methods
const AdminService = {
  /**
   * Get all users
   */
  getAllUsers: () => {
    return ApiService.get<{ users: User[] }>(AdminAPIEndpoint.GET_ALL_USERS);
  },

  /**
   * Create a new user (admin only)
   */
  createUser: (data: CreateUserRequest) => {
    return ApiService.post<{ message: string; userId: string }>(
      AdminAPIEndpoint.CREATE_USER, 
      data
    );
  },

  /**
   * Create multiple users in batch
   */
  createBatchUsers: (data: BatchUserRequest) => {
    return ApiService.post<BatchUserResponse>(
      AdminAPIEndpoint.CREATE_BATCH_USERS, 
      data
    );
  },

  /**
   * Delete all non-admin users
   */
  deleteAllUsers: (confirmDelete: string, preserveAdmins: boolean = true) => {
    return ApiService.delete<{ message: string; preservedAdmins: boolean }>(
      AdminAPIEndpoint.DELETE_ALL_USERS,
      { data: { confirmDelete, preserveAdmins } }
    );
  },

  /**
   * Delete a specific user
   */
  deleteUser: (userId: string) => {
    return ApiService.delete<{ message: string; user: { username: string; email: string; role: string } }>(
      AdminAPIEndpoint.DELETE_USER(userId)
    );
  },

  /**
   * Update a user's role
   */
  updateUserRole: (userId: string, role: string) => {
    return ApiService.put<{ user: User }>(
      AdminAPIEndpoint.UPDATE_USER_ROLE(userId),
      { role }
    );
  },

  /**
   * Access reports (admin/supervisor)
   */
  getReports: () => {
    return ApiService.get<{ message: string; role: string }>(AdminAPIEndpoint.REPORTS);
  },

  /**
   * Access admin dashboard
   */
  getAdminDashboard: () => {
    return ApiService.get<{ message: string; role: string }>(AdminAPIEndpoint.ADMIN_DASHBOARD);
  },
};

export default AdminService;