import React from 'react';
import { Bot, Settings, Activity } from 'lucide-react';

interface HeaderProps {
  onSettingsClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onSettingsClick }) => {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 bg-purple-600 rounded-lg">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Agentic Browser</h1>
            <p className="text-sm text-gray-500">Powered by GPT-OSS 20B</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 px-3 py-1 bg-green-100 rounded-full">
            <Activity className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-green-700">Online</span>
          </div>
          
          <button
            onClick={onSettingsClick}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};