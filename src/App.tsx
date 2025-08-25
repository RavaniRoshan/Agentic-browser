import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { TaskCreator } from './components/TaskCreator';
import { TaskList } from './components/TaskList';
import { SettingsModal } from './components/SettingsModal';
import { TaskDetailModal } from './components/TaskDetailModal';
import { BrowserTask, AgentConfig } from './types';

function App() {
  const [tasks, setTasks] = useState<BrowserTask[]>([]);
  const [selectedTask, setSelectedTask] = useState<BrowserTask | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isTaskDetailOpen, setIsTaskDetailOpen] = useState(false);
  const [config, setConfig] = useState<AgentConfig>({
    model: 'gpt-oss-20b',
    temperature: 0.7,
    maxTokens: 2000,
    reasoning: true,
    screenshots: true,
    verbose: false
  });

  // Load tasks from localStorage on mount
  useEffect(() => {
    const savedTasks = localStorage.getItem('browserTasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem('browserTasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleCreateTask = (taskData: Omit<BrowserTask, 'id' | 'createdAt' | 'status'>) => {
    const newTask: BrowserTask = {
      ...taskData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      status: 'pending'
    };
    setTasks(prev => [newTask, ...prev]);
  };

  const handleRunTask = async (taskId: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { ...task, status: 'running' as const }
        : task
    ));

    // Simulate API call to backend
    try {
      // This would be replaced with actual API call to your FastAPI backend
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Simulate successful completion
      setTasks(prev => prev.map(task => 
        task.id === taskId 
          ? { 
              ...task, 
              status: 'completed' as const,
              completedAt: new Date().toISOString(),
              result: {
                success: true,
                executionTime: 2847,
                screenshots: ['screenshot1.png', 'screenshot2.png'],
                data: { extracted: 'sample data' }
              }
            }
          : task
      ));
    } catch (error) {
      setTasks(prev => prev.map(task => 
        task.id === taskId 
          ? { 
              ...task, 
              status: 'failed' as const,
              completedAt: new Date().toISOString(),
              result: {
                success: false,
                executionTime: 1200,
                error: 'Failed to complete task'
              }
            }
          : task
      ));
    }
  };

  const handleViewTask = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      setSelectedTask(task);
      setIsTaskDetailOpen(true);
    }
  };

  const handleSaveConfig = (newConfig: AgentConfig) => {
    setConfig(newConfig);
    localStorage.setItem('agentConfig', JSON.stringify(newConfig));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onSettingsClick={() => setIsSettingsOpen(true)} />
      
      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Browser Automation Dashboard
          </h1>
          <p className="text-gray-600">
            Create and manage intelligent browser automation tasks powered by GPT-OSS 20B
          </p>
        </div>

        <div className="space-y-8">
          <TaskCreator onCreateTask={handleCreateTask} />
          
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Recent Tasks ({tasks.length})
            </h2>
            <TaskList 
              tasks={tasks}
              onRunTask={handleRunTask}
              onViewTask={handleViewTask}
            />
          </div>
        </div>
      </main>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        config={config}
        onSave={handleSaveConfig}
      />

      <TaskDetailModal
        isOpen={isTaskDetailOpen}
        onClose={() => setIsTaskDetailOpen(false)}
        task={selectedTask}
      />
    </div>
  );
}

export default App;