import React, { useState, useEffect, useRef } from 'react';
import { Bot, User, Terminal, Play, Square, CheckCircle2, XCircle, Loader2, Send, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

type AgentState = 'idle' | 'thinking' | 'executing' | 'waiting_approval';

interface ChatMessage {
  id: string;
  role: 'user' | 'agent';
  content: string;
  timestamp: Date;
}

interface ThoughtLog {
  id: string;
  type: 'thought' | 'action' | 'observation' | 'system';
  content: string;
  timestamp: Date;
}

export default function AgentWorkspace() {
  const [agentState, setAgentState] = useState<AgentState>('idle');
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'agent',
      content: 'Hello. I am your autonomous Data Collector Agent. I can help you discover devices, configure protocols, debug connection issues, and manage data schemas. What would you like to do?',
      timestamp: new Date()
    }
  ]);
  const [thoughts, setThoughts] = useState<ThoughtLog[]>([
    { id: 't1', type: 'system', content: 'Agent initialized. Core modules loaded. LLM reasoning engine online.', timestamp: new Date() }
  ]);
  const [pendingAction, setPendingAction] = useState<{ title: string; description: string } | null>(null);

  const thoughtsEndRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll
  useEffect(() => {
    thoughtsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [thoughts]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const addThought = (type: ThoughtLog['type'], content: string, delay: number) => {
    return new Promise(resolve => {
      setTimeout(() => {
        setThoughts(prev => [...prev, { id: Date.now().toString(), type, content, timestamp: new Date() }]);
        resolve(true);
      }, delay);
    });
  };

  const handleSimulatedScenario = async () => {
    setAgentState('thinking');
    
    await addThought('thought', 'User wants to scan for new Modbus devices on the local subnet.', 500);
    await addThought('action', 'Call tool: scan_network(subnet="192.168.1.0/24", port=502)', 1000);
    
    setAgentState('executing');
    await addThought('observation', 'Found 1 active device at 192.168.1.50 responding on port 502.', 2000);
    await addThought('thought', 'I should probe this device to infer its registers and generate a data schema.', 1000);
    await addThought('action', 'Call tool: probe_modbus(ip="192.168.1.50", count=10)', 1000);
    await addThought('observation', 'Registers 40001-40004 contain fluctuating float values. Register 40005 is a boolean status.', 2500);
    await addThought('thought', 'I have enough information to generate a configuration and schema. I need human approval before applying it to the production database.', 1000);

    setAgentState('waiting_approval');
    setPendingAction({
      title: 'Add New Modbus Device (192.168.1.50)',
      description: 'The agent has discovered a Modbus TCP device and inferred a schema with 4 analog values and 1 digital status. Do you want to add this protocol and begin syncing to the Real-time Database?'
    });

    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      role: 'agent',
      content: 'I found a Modbus device at 192.168.1.50. I have successfully probed its registers and generated a data schema. Please review and approve the configuration to start data collection.',
      timestamp: new Date()
    }]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || agentState !== 'idle') return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { id: Date.now().toString(), role: 'user', content: userMsg, timestamp: new Date() }]);
    setInput('');

    // Trigger simulation if it matches keywords
    if (userMsg.toLowerCase().includes('scan') || userMsg.toLowerCase().includes('modbus') || userMsg.toLowerCase().includes('find')) {
      handleSimulatedScenario();
    } else {
      // Generic response
      setAgentState('thinking');
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          role: 'agent',
          content: 'I understand. However, for this demonstration, try asking me to "Scan the network for new Modbus devices".',
          timestamp: new Date()
        }]);
        setAgentState('idle');
      }, 1500);
    }
  };

  const handleApprove = async () => {
    setPendingAction(null);
    setAgentState('executing');
    await addThought('action', 'Call tool: add_protocol(config=...)', 500);
    await addThought('action', 'Call tool: update_platform_schema(schema=...)', 1000);
    await addThought('observation', 'Protocol added successfully. Real-time Database Platform accepted the new schema.', 1500);
    await addThought('system', 'Task completed successfully.', 500);
    
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      role: 'agent',
      content: 'Configuration applied successfully. The new Modbus device is now active and data is streaming to the platform.',
      timestamp: new Date()
    }]);
    setAgentState('idle');
  };

  const handleReject = async () => {
    setPendingAction(null);
    setAgentState('thinking');
    await addThought('thought', 'User rejected the configuration. Discarding generated schema and aborting.', 500);
    await addThought('system', 'Task aborted by user.', 500);
    
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      role: 'agent',
      content: 'Understood. I have discarded the configuration. Let me know if you need anything else.',
      timestamp: new Date()
    }]);
    setAgentState('idle');
  };

  return (
    <div className="p-8 max-w-[1600px] mx-auto h-full flex flex-col">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight mb-2 flex items-center gap-3">
            <Bot className="w-8 h-8 text-emerald-500" />
            AI Agent Workspace
          </h1>
          <p className="text-zinc-400">Autonomous data engineering, protocol inference, and self-healing operations.</p>
        </div>
        
        {/* Agent Status Badge */}
        <div className="flex items-center gap-3 bg-[#1A1A1A] border border-zinc-800 px-4 py-2 rounded-lg">
          <div className="text-sm font-medium text-zinc-400">Agent Status:</div>
          <div className="flex items-center gap-2">
            {agentState === 'idle' && <><Square className="w-4 h-4 text-zinc-500" /><span className="text-zinc-300 text-sm">Idle</span></>}
            {agentState === 'thinking' && <><Loader2 className="w-4 h-4 text-purple-500 animate-spin" /><span className="text-purple-400 text-sm">Reasoning...</span></>}
            {agentState === 'executing' && <><Play className="w-4 h-4 text-blue-500 animate-pulse" /><span className="text-blue-400 text-sm">Executing Tools...</span></>}
            {agentState === 'waiting_approval' && <><ShieldAlert className="w-4 h-4 text-yellow-500 animate-pulse" /><span className="text-yellow-400 text-sm">Awaiting Approval</span></>}
          </div>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0">
        
        {/* Left Column: Chat Interface */}
        <div className="bg-[#1A1A1A] border border-zinc-800 rounded-xl flex flex-col overflow-hidden">
          <div className="p-4 border-b border-zinc-800 bg-zinc-900/50 flex items-center gap-2">
            <User className="w-5 h-5 text-zinc-400" />
            <h2 className="font-semibold text-white">Human-Agent Interaction</h2>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.map((msg) => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={msg.id} 
                className={cn(
                  "flex gap-4 max-w-[85%]",
                  msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
                )}
              >
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                  msg.role === 'user' ? "bg-blue-500/20 text-blue-400" : "bg-emerald-500/20 text-emerald-400"
                )}>
                  {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>
                <div className={cn(
                  "p-4 rounded-2xl text-sm leading-relaxed",
                  msg.role === 'user' 
                    ? "bg-blue-600 text-white rounded-tr-sm" 
                    : "bg-zinc-800 text-zinc-200 rounded-tl-sm"
                )}>
                  {msg.content}
                </div>
              </motion.div>
            ))}

            <AnimatePresence>
              {pendingAction && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="ml-12 mr-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-5"
                >
                  <div className="flex items-start gap-3 mb-4">
                    <ShieldAlert className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-yellow-500 font-semibold mb-1">Action Required: {pendingAction.title}</h3>
                      <p className="text-zinc-300 text-sm leading-relaxed">{pendingAction.description}</p>
                    </div>
                  </div>
                  <div className="flex gap-3 justify-end">
                    <button 
                      onClick={handleReject}
                      className="px-4 py-2 rounded-lg text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                    >
                      Reject
                    </button>
                    <button 
                      onClick={handleApprove}
                      className="px-4 py-2 rounded-lg text-sm font-medium bg-emerald-600 hover:bg-emerald-500 text-white transition-colors flex items-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Approve & Execute
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t border-zinc-800 bg-zinc-900/50">
            <form onSubmit={handleSubmit} className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={agentState !== 'idle'}
                placeholder={agentState === 'idle' ? "Tell the agent what to do... (e.g., 'Scan for Modbus devices')" : "Agent is busy..."}
                className="w-full bg-[#141414] border border-zinc-700 rounded-xl pl-4 pr-12 py-3 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 disabled:opacity-50 transition-colors"
              />
              <button 
                type="submit"
                disabled={!input.trim() || agentState !== 'idle'}
                className="absolute right-2 top-2 p-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-zinc-800 text-white rounded-lg transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Thought Process Terminal */}
        <div className="bg-black border border-zinc-800 rounded-xl flex flex-col overflow-hidden font-mono text-sm">
          <div className="p-4 border-b border-zinc-800 bg-zinc-900/80 flex items-center gap-2">
            <Terminal className="w-5 h-5 text-zinc-400" />
            <h2 className="font-semibold text-white font-sans">Agent Thought Process</h2>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-1">
            {thoughts.map((log) => (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                key={log.id} 
                className="flex gap-3 py-1"
              >
                <span className="text-zinc-600 shrink-0 select-none">
                  {log.timestamp.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </span>
                <span className={cn(
                  "shrink-0 font-bold select-none",
                  log.type === 'thought' && "text-purple-500",
                  log.type === 'action' && "text-blue-500",
                  log.type === 'observation' && "text-emerald-500",
                  log.type === 'system' && "text-zinc-500"
                )}>
                  [{log.type.toUpperCase()}]
                </span>
                <span className={cn(
                  "break-words",
                  log.type === 'thought' && "text-zinc-400",
                  log.type === 'action' && "text-blue-300",
                  log.type === 'observation' && "text-emerald-300",
                  log.type === 'system' && "text-zinc-500"
                )}>
                  {log.content}
                </span>
              </motion.div>
            ))}
            {agentState !== 'idle' && agentState !== 'waiting_approval' && (
              <div className="flex gap-3 py-1 animate-pulse">
                <span className="text-zinc-600">--:--:--</span>
                <span className="text-zinc-500">...</span>
              </div>
            )}
            <div ref={thoughtsEndRef} />
          </div>
        </div>

      </div>
    </div>
  );
}
