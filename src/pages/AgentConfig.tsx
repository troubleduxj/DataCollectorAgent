import React, { useState } from 'react';
import { Bot, Key, Cpu, Wrench, Save, CheckCircle2, Loader2, BrainCircuit, Network, ShieldAlert, Database, Plus, X, Code, Trash2, Download, Store, Activity } from 'lucide-react';
import { cn } from '../lib/utils';

interface Skill {
  id: string;
  name: string;
  description: string;
  icon: any;
  enabled: boolean;
  category: 'discovery' | 'diagnostics' | 'optimization' | 'security' | 'custom' | 'market';
  apiEndpoint?: string;
  source: 'core' | 'custom' | 'market';
}

const defaultSkills: Skill[] = [
  { id: 's1', name: 'Network Auto-Discovery', description: 'Scan subnets to find unconfigured PLCs and sensors.', icon: Network, enabled: true, category: 'discovery', source: 'core' },
  { id: 's2', name: 'Protocol Inference', description: 'Analyze raw byte streams to guess registers and data types.', icon: BrainCircuit, enabled: true, category: 'discovery', source: 'core' },
  { id: 's3', name: 'Connection Diagnostics', description: 'Automatically ping, traceroute, and analyze logs when a connection drops.', icon: Wrench, enabled: true, category: 'diagnostics', source: 'core' },
  { id: 's4', name: 'Schema Evolution', description: 'Propose updates to the cloud schema when new data fields are detected.', icon: Database, enabled: false, category: 'optimization', source: 'core' },
  { id: 's5', name: 'Anomaly Detection', description: 'Flag unusual data spikes before sending them to the central platform.', icon: ShieldAlert, enabled: false, category: 'security', source: 'core' },
];

const marketSkillsMock: Skill[] = [
  { id: 'm1', name: 'ERP SAP Sync', description: 'Synchronize production data directly with SAP ERP systems.', icon: Database, enabled: false, category: 'market', source: 'market' },
  { id: 'm2', name: 'Predictive Maintenance', description: 'Analyze vibration and temperature to predict motor failures.', icon: Activity, enabled: false, category: 'market', source: 'market' },
  { id: 'm3', name: 'MQTT Auto-Bridge', description: 'Automatically bridge local topics to cloud MQTT brokers.', icon: Network, enabled: false, category: 'market', source: 'market' },
];

export default function AgentConfig() {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [skills, setSkills] = useState<Skill[]>(defaultSkills);
  
  // Custom Skill Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSkill, setNewSkill] = useState({ name: '', description: '', apiEndpoint: '' });

  // Market Modal State
  const [showMarketModal, setShowMarketModal] = useState(false);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }, 1500);
  };

  const toggleSkill = (id: string) => {
    setSkills(skills.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s));
  };

  const handleDeleteSkill = (id: string) => {
    setSkills(skills.filter(s => s.id !== id));
  };

  const handleInstallSkill = (skill: Skill) => {
    if (!skills.find(s => s.id === skill.id)) {
      setSkills([...skills, { ...skill, enabled: true }]);
    }
  };

  const handleAddCustomSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkill.name.trim() || !newSkill.description.trim()) return;

    const skill: Skill = {
      id: `custom_${Date.now()}`,
      name: newSkill.name,
      description: newSkill.description,
      apiEndpoint: newSkill.apiEndpoint,
      icon: Code,
      enabled: true,
      category: 'custom',
      source: 'custom'
    };

    setSkills([...skills, skill]);
    setNewSkill({ name: '', description: '', apiEndpoint: '' });
    setShowAddModal(false);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto relative">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white tracking-tight mb-2 flex items-center gap-3">
          <Bot className="w-8 h-8 text-purple-500" />
          Agent Settings
        </h1>
        <p className="text-zinc-400">Configure the LLM backend and manage the autonomous skills of your Data Collector.</p>
      </div>

      <div className="space-y-6">
        {/* LLM Backend Configuration */}
        <div className="bg-[#1A1A1A] border border-zinc-800 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <Cpu className="w-5 h-5 text-purple-500" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">LLM Engine</h2>
              <p className="text-sm text-zinc-500">The "brain" powering the agent's reasoning capabilities.</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-400">Provider</label>
                <select className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors">
                  <option value="google">Google Gemini</option>
                  <option value="openai">OpenAI</option>
                  <option value="anthropic">Anthropic</option>
                  <option value="local">Local Model (Ollama)</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-400">Model</label>
                <select className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors">
                  <option value="gemini-1.5-pro">Gemini 1.5 Pro (Recommended)</option>
                  <option value="gemini-1.5-flash">Gemini 1.5 Flash (Faster)</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-400">API Key</label>
              <div className="relative">
                <Key className="absolute left-3 top-2.5 w-5 h-5 text-zinc-500" />
                <input 
                  type="password" 
                  placeholder="Enter your API key..."
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors font-mono"
                />
              </div>
            </div>
            
            <div className="space-y-2 pt-2">
              <label className="text-sm font-medium text-zinc-400">System Prompt Override (Optional)</label>
              <textarea 
                rows={3}
                placeholder="You are an expert industrial data engineer..."
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Skills Configuration */}
        <div className="bg-[#1A1A1A] border border-zinc-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Wrench className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Agent Skills (Tools)</h2>
                <p className="text-sm text-zinc-500">Enable or disable specific capabilities the agent can use autonomously.</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setShowMarketModal(true)}
                className="px-4 py-2 bg-purple-600/10 hover:bg-purple-600/20 text-purple-400 border border-purple-500/20 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
              >
                <Store className="w-4 h-4" />
                Skill Market
              </button>
              <button 
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Custom
              </button>
            </div>
          </div>

          <div className="grid gap-3">
            {skills.map((skill) => (
              <div 
                key={skill.id}
                className={cn(
                  "flex items-center justify-between p-4 rounded-lg border transition-colors",
                  skill.enabled ? "bg-zinc-900/80 border-zinc-700" : "bg-zinc-900/30 border-zinc-800/50 opacity-70"
                )}
              >
                <div className="flex items-start gap-4">
                  <div className={cn(
                    "p-2 rounded-lg mt-0.5",
                    skill.enabled ? "bg-zinc-800 text-zinc-300" : "bg-zinc-800/50 text-zinc-600"
                  )}>
                    <skill.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className={cn("font-medium", skill.enabled ? "text-white" : "text-zinc-500")}>
                        {skill.name}
                      </h3>
                      {skill.source === 'custom' && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                          CUSTOM
                        </span>
                      )}
                      {skill.source === 'market' && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20">
                          MARKET
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-zinc-500 mt-0.5">{skill.description}</p>
                    {skill.apiEndpoint && (
                      <p className="text-xs text-zinc-600 mt-1 font-mono">{skill.apiEndpoint}</p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleSkill(skill.id)}
                    className={cn(
                      "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                      skill.enabled ? "bg-purple-500" : "bg-zinc-700"
                    )}
                  >
                    <span
                      className={cn(
                        "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                        skill.enabled ? "translate-x-5" : "translate-x-0"
                      )}
                    />
                  </button>
                  {skill.source !== 'core' && (
                    <button
                      onClick={() => handleDeleteSkill(skill.id)}
                      className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-red-400/10 rounded-md transition-colors"
                      title="Uninstall Skill"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end pt-4">
          <button 
            onClick={handleSave}
            disabled={saving || saved}
            className={cn(
              "px-6 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-all shadow-lg",
              saved 
                ? "bg-purple-500 text-white shadow-purple-900/20" 
                : "bg-purple-600 hover:bg-purple-500 text-white shadow-purple-900/20",
              saving && "opacity-80 cursor-wait"
            )}
          >
            {saving ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
            ) : saved ? (
              <><CheckCircle2 className="w-4 h-4" /> Saved Successfully</>
            ) : (
              <><Save className="w-4 h-4" /> Save Agent Settings</>
            )}
          </button>
        </div>
      </div>

      {/* Skill Market Modal */}
      {showMarketModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#1A1A1A] border border-zinc-800 rounded-xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[80vh]">
            <div className="flex items-center justify-between p-6 border-b border-zinc-800">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Store className="w-5 h-5 text-purple-500" />
                Skill Marketplace
                <span className="text-[10px] font-medium bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded border border-purple-500/20 ml-2">
                  PREVIEW
                </span>
              </h3>
              <button 
                onClick={() => setShowMarketModal(false)}
                className="text-zinc-500 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-4">
              <p className="text-sm text-zinc-400 mb-4">
                Discover and install new skills for your agent. The full marketplace is currently under development.
              </p>
              
              <div className="grid gap-3">
                {marketSkillsMock.map((ms) => {
                  const isInstalled = skills.some(s => s.id === ms.id);
                  return (
                    <div key={ms.id} className="flex items-center justify-between p-4 rounded-lg border border-zinc-800 bg-zinc-900/50">
                      <div className="flex items-start gap-4">
                        <div className="p-2 rounded-lg bg-zinc-800 text-zinc-300 mt-0.5">
                          <ms.icon className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-medium text-white">{ms.name}</h4>
                          <p className="text-sm text-zinc-500 mt-0.5">{ms.description}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleInstallSkill(ms)}
                        disabled={isInstalled}
                        className={cn(
                          "px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors ml-4 shrink-0",
                          isInstalled 
                            ? "bg-zinc-800 text-zinc-500 cursor-not-allowed" 
                            : "bg-purple-600 hover:bg-purple-500 text-white"
                        )}
                      >
                        {isInstalled ? (
                          <><CheckCircle2 className="w-4 h-4" /> Installed</>
                        ) : (
                          <><Download className="w-4 h-4" /> Install</>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Custom Skill Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#1A1A1A] border border-zinc-800 rounded-xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-zinc-800">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Code className="w-5 h-5 text-blue-500" />
                Add Custom Skill
              </h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-zinc-500 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleAddCustomSkill} className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-400">Skill Name</label>
                <input 
                  type="text" 
                  required
                  value={newSkill.name}
                  onChange={e => setNewSkill({...newSkill, name: e.target.value})}
                  placeholder="e.g., ERP Sync, Reset PLC"
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-400">Description</label>
                <textarea 
                  required
                  rows={2}
                  value={newSkill.description}
                  onChange={e => setNewSkill({...newSkill, description: e.target.value})}
                  placeholder="Describe what this skill does so the LLM knows when to use it..."
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-400">API Endpoint (Optional)</label>
                <input 
                  type="text" 
                  value={newSkill.apiEndpoint}
                  onChange={e => setNewSkill({...newSkill, apiEndpoint: e.target.value})}
                  placeholder="e.g., http://localhost:8080/api/custom-action"
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors font-mono text-sm"
                />
                <p className="text-xs text-zinc-500">The webhook or API the agent will call to execute this skill.</p>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={!newSkill.name.trim() || !newSkill.description.trim()}
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-800 disabled:text-zinc-500 text-white transition-colors"
                >
                  Add Skill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
