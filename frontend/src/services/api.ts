import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface Scenario {
  scenario: string;
  currentBalance: number;
  options: {
    spend: string;
    save: string;
    invest: string;
  };
}

export interface Consequence {
  result: string;
  balanceChange: number;
  newBalance: number;
  lesson: string;
  emotion: 'happy' | 'sad' | 'neutral' | 'excited';
}

export interface AdventureResponse {
  success: boolean;
  scenario?: Scenario;
  consequence?: Consequence;
  nextScenario?: Scenario;
  balance: number;
  round: number;
  history?: Array<{
    choice: string;
    balanceChange: number;
    timestamp: string;
  }>;
}

export const adventureAPI = {
  startAdventure: async (age: number = 10): Promise<AdventureResponse> => {
    const response = await api.post('/adventure/start', { age });
    return response.data;
  },

  makeChoice: async (choice: 'spend' | 'save' | 'invest'): Promise<AdventureResponse> => {
    const response = await api.post('/adventure/choice', { choice });
    return response.data;
  },

  getStatus: async () => {
    const response = await api.get('/adventure/status');
    return response.data;
  },

  reset: async () => {
    const response = await api.post('/adventure/reset');
    return response.data;
  },
};

export const hardwareAPI = {
  testConnection: async () => {
    const response = await api.get('/hardware/test');
    return response.data;
  },

  testMovement: async (zone: 'red' | 'blue' | 'yellow' | 'center') => {
    const response = await api.post('/hardware/test-movement', { zone });
    return response.data;
  },
};
