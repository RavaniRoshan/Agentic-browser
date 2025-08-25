import React, { useState } from 'react';
import { Plus, Globe, Zap, Target } from 'lucide-react';
import { BrowserTask, WebsiteTarget } from '../types';

interface TaskCreatorProps {
  onCreateTask: (task: Omit<BrowserTask, 'id' | 'createdAt' | 'status'>) => void;
}

const popularSites: WebsiteTarget[] = [
  {
    url: 'https://amazon.com',
    name: 'Amazon',
    description: 'E-commerce automation',
    commonActions: ['Search products', 'Add to cart', 'Check prices', 'Read reviews']
  },
  {
    url: 'https://linkedin.com',
    name: 'LinkedIn',
    description: 'Professional networking',
    commonActions: ['Send connections', 'Post updates', 'Search profiles', 'Message contacts']
  },
  {
    url: 'https://github.com',
    name: 'GitHub',
    description: 'Code repository management',
    commonActions: ['Create repos', 'Submit PRs', 'Review code', 'Manage issues']
  }
];

export const TaskCreator: React.FC<TaskCreatorProps> = ({ onCreateTask }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [taskName, setTaskName] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskUrl, setTaskUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskName || !taskDescription || !taskUrl) return;

    onCreateTask({
      name: taskName,
      description: taskDescription,
      url: taskUrl,
      actions: []
    });

    setTaskName('');
    setTaskDescription('');
    setTaskUrl('');
    setIsOpen(false);
  };

  const handleQuickCreate = (site: WebsiteTarget, action: string) => {
    onCreateTask({
      name: `${action} on ${site.name}`,
      description: `Automated task to ${action.toLowerCase()} on ${site.name}`,
      url: site.url,
      actions: []
    });
  };

  if (!isOpen) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <button
          onClick={() => setIsOpen(true)}
          className="w-full flex items-center justify-center space-x-2 py-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-400 hover:bg-purple-50 transition-colors group"
        >
          <Plus className="w-5 h-5 text-gray-400 group-hover:text-purple-600" />
          <span className="text-gray-600 group-hover:text-purple-700 font-medium">
            Create New Browser Task
          </span>
        </button>

        <div className="mt-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
            <Zap className="w-4 h-4 mr-2 text-yellow-500" />
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {popularSites.map((site) => (
              <div key={site.url} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Globe className="w-4 h-4 text-blue-500" />
                  <h4 className="font-medium text-gray-900">{site.name}</h4>
                </div>
                <p className="text-xs text-gray-500 mb-3">{site.description}</p>
                <div className="space-y-1">
                  {site.commonActions.slice(0, 2).map((action) => (
                    <button
                      key={action}
                      onClick={() => handleQuickCreate(site, action)}
                      className="w-full text-left px-2 py-1 text-xs text-purple-600 hover:bg-purple-50 rounded transition-colors"
                    >
                      {action}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center">
          <Target className="w-5 h-5 mr-2 text-purple-600" />
          Create Browser Task
        </h2>
        <button
          onClick={() => setIsOpen(false)}
          className="text-gray-400 hover:text-gray-600"
        >
          ×
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Task Name
          </label>
          <input
            type="text"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            placeholder="e.g., Search for laptops on Amazon"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
            placeholder="Describe what you want the agent to do..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Target URL
          </label>
          <input
            type="url"
            value={taskUrl}
            onChange={(e) => setTaskUrl(e.target.value)}
            placeholder="https://example.com"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            required
          />
        </div>

        <div className="flex space-x-3 pt-2">
          <button
            type="submit"
            className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors font-medium"
          >
            Create Task
          </button>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};