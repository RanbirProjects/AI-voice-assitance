
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'viewer';
  avatar: string;
}

export interface DataPoint {
  timestamp: string;
  value: number;
  cpu: number;
  memory: number;
  latency: number;
}

export interface SystemInsight {
  id: string;
  title: string;
  content: string;
  type: 'optimization' | 'security' | 'anomaly';
  severity: 'low' | 'medium' | 'high';
  timestamp: Date;
}

export enum DashboardTab {
  OVERVIEW = 'overview',
  VOICE_INTERFACE = 'interface',
  DATA_EXPLORER = 'explorer',
  SETTINGS = 'settings'
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}
