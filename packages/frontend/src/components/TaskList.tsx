import React from 'react';
import { Play, Pause, CheckCircle, XCircle, Clock, Eye, Download } from 'lucide-react';
import { BrowserTask } from '../types';

interface TaskListProps {
  tasks: BrowserTask[];
  onRunTask: (taskId: string) => void;
  onViewTask: (taskId: string) => void;
}

export const TaskList: React.FC<TaskListProps> = ({ tasks, onRunTask, onViewTask }) => {
  const getStatusIcon = (status: BrowserTask['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'running':
        return <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: BrowserTask['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'running':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (tasks.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Clock className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks yet</h3>
        <p className="text-gray-500">Create your first browser automation task to get started.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <div key={task.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                {getStatusIcon(task.status)}
                <h3 className="text-lg font-semibold text-gray-900">{task.name}</h3>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(task.status)}`}>
                  {task.status}
                </span>
              </div>
              
              <p className="text-gray-600 mb-3">{task.description}</p>
              
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span>Target: {new URL(task.url).hostname}</span>
                <span>•</span>
                <span>Created: {new Date(task.createdAt).toLocaleDateString()}</span>
                {task.completedAt && (
                  <>
                    <span>•</span>
                    <span>Completed: {new Date(task.completedAt).toLocaleDateString()}</span>
                  </>
                )}
              </div>

              {task.result && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">
                      Execution time: {task.result.executionTime}ms
                    </span>
                    {task.result.screenshots && task.result.screenshots.length > 0 && (
                      <span className="text-purple-600">
                        {task.result.screenshots.length} screenshot(s) captured
                      </span>
                    )}
                  </div>
                  {task.result.error && (
                    <div className="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded">
                      Error: {task.result.error}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2 ml-4">
              <button
                onClick={() => onViewTask(task.id)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                title="View details"
              >
                <Eye className="w-4 h-4" />
              </button>
              
              {task.status === 'completed' && task.result?.screenshots && (
                <button
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Download results"
                >
                  <Download className="w-4 h-4" />
                </button>
              )}
              
              {task.status === 'pending' && (
                <button
                  onClick={() => onRunTask(task.id)}
                  className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <Play className="w-4 h-4" />
                  <span>Run</span>
                </button>
              )}
              
              {task.status === 'running' && (
                <button
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <Pause className="w-4 h-4" />
                  <span>Stop</span>
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};