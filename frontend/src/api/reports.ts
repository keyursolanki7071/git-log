import axios from 'axios';

const API_URL = 'http://localhost:8000/api/v1';

export interface ReportContent {
  executive_summary: string;
  key_achievements: string[];
  areas_of_concern: string[];
  developer_metrics: Record<string, string>;
  all_commits?: {
    author: string;
    date: string;
    message: string;
    summary: string;
  }[];
}

export interface Report {
  id: string;
  integration_id: string;
  repository_name: string;
  branch_name: string | null;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  date_from: string;
  date_to: string;
  content: ReportContent | null;
  error_message: string | null;
  created_at: string;
  updated_at: string;
}

export const reportsApi = {
  generateReport: async (data: { integration_id: string; repository_name: string; branch_name?: string; date_from: string; date_to: string }) => {
    const token = localStorage.getItem('token');
    const response = await axios.post<Report>(`${API_URL}/reports/generate`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },
  
  getReports: async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get<Report[]>(`${API_URL}/reports/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },
  
  getReport: async (id: string) => {
    const token = localStorage.getItem('token');
    const response = await axios.get<Report>(`${API_URL}/reports/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  }
};
