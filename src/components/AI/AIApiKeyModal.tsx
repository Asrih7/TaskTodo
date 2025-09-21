import React, { useState } from 'react';
import Modal from '../Utilities/Modal';

interface AIApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (apiKey: string) => void;
}

const AIApiKeyModal: React.FC<AIApiKeyModalProps> = ({ isOpen, onClose, onSave }) => {
  const [apiKey, setApiKey] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      onSave(apiKey.trim());
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <Modal onClose={onClose} title="Configure AI Assistant">
      <div className="space-y-4">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          To enable AI features, please provide your Lovable AI Gateway API key.
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="apiKey" className="block text-sm font-medium mb-2">
              API Key
            </label>
            <input
              id="apiKey"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your API key..."
              className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg 
                         bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100
                         focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              required
            />
          </div>
          
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-slate-600 dark:text-slate-400 
                         hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-rose-500 text-white rounded-lg 
                         hover:bg-rose-600 transition font-medium"
            >
              Save API Key
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default AIApiKeyModal;