import React, { useState } from 'react';
import { X, Brain, Camera, Volume2, Zap } from 'lucide-react';
import { AgentConfig } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: AgentConfig;
  onSave: (config: AgentConfig) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  config,
  onSave
}) => {
  const [localConfig, setLocalConfig] = useState<AgentConfig>(config);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(localConfig);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Agent Settings</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-3">
              <Brain className="w-4 h-4 text-purple-600" />
              <span>AI Model Configuration</span>
            </label>
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="text-sm text-gray-600">Model: GPT-OSS 20B</div>
              <div className="text-xs text-gray-500 mt-1">
                Open-source large language model optimized for reasoning tasks
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Temperature: {localConfig.temperature}
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={localConfig.temperature}
              onChange={(e) => setLocalConfig({
                ...localConfig,
                temperature: parseFloat(e.target.value)
              })}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Conservative</span>
              <span>Creative</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Max Tokens
            </label>
            <input
              type="number"
              min="100"
              max="4000"
              value={localConfig.maxTokens}
              onChange={(e) => setLocalConfig({
                ...localConfig,
                maxTokens: parseInt(e.target.value)
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                <Zap className="w-4 h-4 text-yellow-500" />
                <span>Enhanced Reasoning</span>
              </label>
              <input
                type="checkbox"
                checked={localConfig.reasoning}
                onChange={(e) => setLocalConfig({
                  ...localConfig,
                  reasoning: e.target.checked
                })}
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                <Camera className="w-4 h-4 text-blue-500" />
                <span>Capture Screenshots</span>
              </label>
              <input
                type="checkbox"
                checked={localConfig.screenshots}
                onChange={(e) => setLocalConfig({
                  ...localConfig,
                  screenshots: e.target.checked
                })}
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                <Volume2 className="w-4 h-4 text-green-500" />
                <span>Verbose Logging</span>
              </label>
              <input
                type="checkbox"
                checked={localConfig.verbose}
                onChange={(e) => setLocalConfig({
                  ...localConfig,
                  verbose: e.target.checked
                })}
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
            </div>
          </div>
        </div>

        <div className="flex space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={handleSave}
            className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors font-medium"
          >
            Save Settings
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};