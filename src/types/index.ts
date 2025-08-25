export interface BrowserTask {
  id: string;
  name: string;
  description: string;
  url: string;
  actions: BrowserAction[];
  status: 'pending' | 'running' | 'completed' | 'failed';
  createdAt: string;
  completedAt?: string;
  result?: TaskResult;
}

export interface BrowserAction {
  id: string;
  type: 'click' | 'type' | 'scroll' | 'wait' | 'extract' | 'navigate' | 'screenshot';
  selector?: string;
  value?: string;
  description: string;
  completed: boolean;
}

export interface TaskResult {
  success: boolean;
  data?: any;
  screenshots?: string[];
  error?: string;
  executionTime: number;
}

export interface AgentConfig {
  model: 'gpt-oss-20b';
  temperature: number;
  maxTokens: number;
  reasoning: boolean;
  screenshots: boolean;
  verbose: boolean;
}

export interface WebsiteTarget {
  url: string;
  name: string;
  description: string;
  commonActions: string[];
}