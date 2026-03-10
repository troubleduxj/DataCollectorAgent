import React, { useState } from 'react';
import { Bot, Key, Cpu, Wrench, Save, CheckCircle2, Loader2, BrainCircuit, Network, ShieldAlert, Database } from 'lucide-react';
import { cn } from '../lib/utils';

interface Skill {
  id: string;
  name: string;
  description: string;
  icon: any;
  enabled: boolean;
  category: 'discovery' | 'diagnostics' | 'optimization' | 'security';
}

const defaultSkills: Skill[] = [
  { id: 's1', name: 'Network Auto-Discovery', description: 'Scan subnets to find unconfigured PLCs and sensors.', icon: Network, enabled: true, category: 'discovery' },
  { id: 's2', name: 'Protocol Inference', description: 'Analyze raw byte streams to guess registers and data types.', icon: BrainCircuit, enabled: true, category: 'discovery' },
  { id: 's3', name: 'Connection Diagnostics', description: 'Automatically ping, traceroute, and analyze logs when a connection drops.', icon: Wrench, enabled: true, category: 'diagnostics' },
  { id: 's4', name: 'Schema Evolution', description: 'Propose updates to the cloud schema when new data fields are detected.', icon: Database, enabled: false, category: 'optimization' },
  { id: 's5', name: 'Anomaly Detection', description: 'Flag unusual data spikes before sending them to the central platform.', icon: ShieldAlert, enabled: false, category: 'security' },
];

export default function AgentConfig() {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [skills, setSkills] = useState<Skill[]>(defaultSkills);

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

  return (
    <div className="p-8 max-w-4xl mx-auto">
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
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Wrench className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Agent Skills (Tools)</h2>
              <p className="text-sm text-zinc-500">Enable or disable specific capabilities the agent can use autonomously.</p>
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
                    <h3 className={cn("font-medium", skill.enabled ? "text-white" : "text-zinc-500")}>
                      {skill.name}
                    </h3>
                    <p className="text-sm text-zinc-500 mt-0.5">{skill.description}</p>
                  </div>
                </div>
                
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
    </div>
  );
}
