import React from 'react';
import { X, Clock, CheckCircle, XCircle, Camera, Code } from 'lucide-react';
import { BrowserTask } from '../types';

interface TaskDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: BrowserTask | null;
}

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
  isOpen,
  onClose,
  task
}) => {
  if (!isOpen || !task) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">{task.name}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-600">{task.description}</p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Target URL</h3>
              <a
                href={task.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-600 hover:text-purple-700 underline"
              >
                {task.url}
              </a>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Task Timeline</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-3 text-sm">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">
                    Created: {new Date(task.createdAt).toLocaleString()}
                  </span>
                </div>
                {task.completedAt && (
                  <div className="flex items-center space-x-3 text-sm">
                    {task.status === 'completed' ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-500" />
                    )}
                    <span className="text-gray-600">
                      {task.status === 'completed' ? 'Completed' : 'Failed'}: {new Date(task.completedAt).toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {task.actions.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Planned Actions</h3>
                <div className="space-y-2">
                  {task.actions.map((action, index) => (
                    <div
                      key={action.id}
                      className={`flex items-center space-x-3 p-3 rounded-lg ${
                        action.completed ? 'bg-green-50' : 'bg-gray-50'
                      }`}
                    >
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                        action.completed ? 'bg-green-200 text-green-800' : 'bg-gray-200 text-gray-600'
                      }`}>
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-gray-900 capitalize">
                            {action.type}
                          </span>
                          {action.selector && (
                            <code className="text-xs bg-gray-200 px-2 py-1 rounded">
                              {action.selector}
                            </code>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{action.description}</p>
                        {action.value && (
                          <p className="text-xs text-purple-600 mt-1">Value: "{action.value}"</p>
                        )}
                      </div>
                      {action.completed && (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {task.result && (
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Execution Results</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Status:</span>
                    <span className={`font-medium ${
                      task.result.success ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {task.result.success ? 'Success' : 'Failed'}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Execution Time:</span>
                    <span className="font-medium text-gray-900">
                      {task.result.executionTime}ms
                    </span>
                  </div>

                  {task.result.screenshots && task.result.screenshots.length > 0 && (
                    <div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                        <Camera className="w-4 h-4" />
                        <span>Screenshots Captured: {task.result.screenshots.length}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {task.result.screenshots.slice(0, 4).map((screenshot, index) => (
                          <div
                            key={index}
                            className="aspect-video bg-gray-200 rounded border flex items-center justify-center"
                          >
                            <Camera className="w-6 h-6 text-gray-400" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {task.result.data && (
                    <div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                        <Code className="w-4 h-4" />
                        <span>Extracted Data</span>
                      </div>
                      <pre className="text-xs bg-white p-3 rounded border overflow-x-auto">
                        {JSON.stringify(task.result.data, null, 2)}
                      </pre>
                    </div>
                  )}

                  {task.result.error && (
                    <div className="bg-red-50 border border-red-200 rounded p-3">
                      <div className="text-sm font-medium text-red-800 mb-1">Error Details</div>
                      <div className="text-sm text-red-600">{task.result.error}</div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};