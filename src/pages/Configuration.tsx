import React, { useState } from 'react';
import { Save, Database, Key, Globe, CheckCircle2, Loader2, Wifi, AlertCircle, Code } from 'lucide-react';

export default function Configuration() {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testStatus, setTestStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }, 1500);
  };

  const handleTestConnection = () => {
    setTesting(true);
    setTestStatus('idle');
    // Simulate API call
    setTimeout(() => {
      setTesting(false);
      setTestStatus(Math.random() > 0.3 ? 'success' : 'error');
    }, 2000);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white tracking-tight mb-2">System Configuration</h1>
        <p className="text-zinc-400">Configure connection to the Real-time Database Platform.</p>
      </div>

      <div className="space-y-6">
        {/* Platform Connection */}
        <div className="bg-[#1A1A1A] border border-zinc-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Globe className="w-5 h-5 text-blue-500" />
              </div>
              <h2 className="text-lg font-semibold text-white">Platform Connection</h2>
            </div>
            <div className="flex items-center gap-2">
              {testStatus === 'success' && (
                <span className="text-sm text-emerald-500 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Connected
                </span>
              )}
              {testStatus === 'error' && (
                <span className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" /> Connection Failed
                </span>
              )}
              <button 
                onClick={handleTestConnection}
                disabled={testing}
                className="text-sm bg-zinc-800 hover:bg-zinc-700 text-white px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {testing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Wifi className="w-3 h-3" />}
                {testing ? 'Testing...' : 'Test Connection'}
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-400">Platform URL</label>
                <input 
                  type="text" 
                  defaultValue="https://api.rtdb-platform.com/v1"
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-400">Agent ID</label>
                <input 
                  type="text" 
                  defaultValue="agent-us-east-042"
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-400">Access Token</label>
              <div className="relative">
                <Key className="absolute left-3 top-2.5 w-5 h-5 text-zinc-500" />
                <input 
                  type="password" 
                  defaultValue="sk_live_51Mz..."
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors font-mono"
                />
              </div>
              <p className="text-xs text-zinc-500">Token used to authenticate with the central collection platform.</p>
            </div>
          </div>
        </div>

        {/* Data Schema Configuration */}
        <div className="bg-[#1A1A1A] border border-zinc-800 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-orange-500/10 rounded-lg">
              <Code className="w-5 h-5 text-orange-500" />
            </div>
            <h2 className="text-lg font-semibold text-white">Data Schema</h2>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-400">JSON Schema Definition</label>
              <textarea 
                rows={6}
                defaultValue={`{
  "type": "object",
  "properties": {
    "timestamp": { "type": "string", "format": "date-time" },
    "sensor_id": { "type": "string" },
    "value": { "type": "number" },
    "unit": { "type": "string" }
  },
  "required": ["timestamp", "sensor_id", "value"]
}`}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
              />
              <p className="text-xs text-zinc-500">Define the structure of the data payload sent to the platform.</p>
            </div>
          </div>
        </div>

        {/* Local Storage */}
        <div className="bg-[#1A1A1A] border border-zinc-800 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <Database className="w-5 h-5 text-purple-500" />
            </div>
            <h2 className="text-lg font-semibold text-white">Local Buffer Settings</h2>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-400">Buffer Strategy</label>
              <select className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors">
                <option>FIFO (First In First Out)</option>
                <option>LIFO (Last In First Out)</option>
                <option>Drop Oldest</option>
              </select>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-400">Max Buffer Size (MB)</label>
                <input 
                  type="number" 
                  defaultValue="1024"
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-400">Sync Interval (ms)</label>
                <input 
                  type="number" 
                  defaultValue="1000"
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button 
            onClick={handleSave}
            disabled={saving || saved}
            className={`
              px-6 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-all shadow-lg
              ${saved 
                ? 'bg-emerald-500 text-white shadow-emerald-900/20' 
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/20'}
              ${saving ? 'opacity-80 cursor-wait' : ''}
            `}
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : saved ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                Saved Successfully
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Configuration
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
