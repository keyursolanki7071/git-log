import axios from 'axios';

const API_URL = 'http://localhost:8000/api/v1';

export const integrationsApi = {
  getGitHubLoginUrl: async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/auth/github/login`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.url;
  },

  getIntegrations: async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/integrations/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  getRepositories: async (integrationId: string) => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/integrations/${integrationId}/repositories`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  getBranches: async (integrationId: string, repositoryFullName: string) => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/integrations/${integrationId}/repositories/${repositoryFullName}/branches`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },
};
