import api from '../lib/axios';
import { User, UserFormData, BatchUserData } from '../types/auth';

class AdminService {
  // Get all users
  async getAllUsers(): Promise<User[]> {
    try {
      const response = await api.get<User[]>('/admin/users');
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Get a single user by ID
  async getUser(userId: string): Promise<User> {
    try {
      const response = await api.get<User>(`/admin/users/${userId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Create a new user
  async createUser(userData: UserFormData & { password: string, skipVerification?: boolean }): Promise<User> {
    try {
      const response = await api.post<User>('/admin/users', userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Update a user
  async updateUser(userId: string, userData: Partial<UserFormData>): Promise<User> {
    try {
      const response = await api.put<User>(`/admin/users/${userId}`, userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Delete a user
  async deleteUser(userId: string): Promise<void> {
    try {
      await api.delete(`/admin/users/${userId}`);
    } catch (error) {
      throw error;
    }
  }

  // Delete multiple users
  async deleteUsers(userIds: string[]): Promise<void> {
    try {
      await api.delete('/admin/users', {
        data: { userIds }
      });
    } catch (error) {
      throw error;
    }
  }

  // Add batch users
  async addBatchUsers(users: BatchUserData[], skipVerification: boolean): Promise<User[]> {
    try {
      const response = await api.post<User[]>('/admin/users/batch', {
        users,
        skipVerification
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Change user status
  async changeUserStatus(userId: string, status: 'active' | 'inactive' | 'suspended'): Promise<User> {
    try {
      const response = await api.patch<User>(`/admin/users/${userId}/status`, { status });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Send password reset for a user
  async resetUserPassword(userId: string): Promise<void> {
    try {
      await api.post(`/admin/users/${userId}/reset-password`);
    } catch (error) {
      throw error;
    }
  }

  // Get user activity logs
  async getUserActivityLogs(userId: string): Promise<any[]> {
    try {
      const response = await api.get(`/admin/users/${userId}/logs`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Generate user activity report
  async generateUserReport(): Promise<Blob> {
    try {
      const response = await api.get('/admin/reports/users', {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Get admin reports
  async getAdminReports(reportType: string, startDate?: string, endDate?: string): Promise<any> {
    try {
      const params: { reportType: string; [key: string]: string } = { reportType };
      if (startDate) params['startDate'] = startDate;
      if (endDate) params['endDate'] = endDate;
      
      const response = await api.get('/admin/reports', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Download report as file
  async downloadReport(reportType: string, format: 'pdf' | 'csv' | 'excel', startDate?: string, endDate?: string): Promise<Blob> {
    try {
      const params: { reportType: string; format: string; [key: string]: string } = { reportType, format };
      if (startDate) params['startDate'] = startDate;
      if (endDate) params['endDate'] = endDate;
      
      const response = await api.get('/admin/reports/download', {
        params,
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export default new AdminService();