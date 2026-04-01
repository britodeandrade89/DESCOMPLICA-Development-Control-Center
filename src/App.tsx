import React, { useState } from 'react';
import { 
  Terminal, Copy, Database, Code2, 
  Sparkles
} from 'lucide-react';

const App = () => {
  // --- Gestão de Apps e Requisições ---
  const [apps, setApps] = useState([
    { name: 'AnalisAI', requests: [{ date: '2026-04-01', count: 1, model: 'gemini-3.1-pro-preview' }] }
  ]);
  const [currentAppName, setCurrentAppName] = useState('AnalisAI');
  
  const models = [
    { name: 'Default (Gemini 3 Flash Preview)', limit: 1500 },
    { name: 'Gemini 3 Flash Preview', limit: 1500 },
    { name: 'Gemini 3.1 Pro Preview', limit: 50 },
    { name: 'Gemini 3.1 Flash Lite Preview', limit: 3000 }
  ];
  const [selectedModel, setSelectedModel] = useState(models[0]);
  const [rpmCooldown, setRpmCooldown] = useState(0);

  // --- Editor e Prompt ---
  const [activeTab, setActiveTab] = useState('fix_analisai');
  const [customPrompt, setCustomPrompt] = useState('');

  const currentApp = apps.find(a => a.name === currentAppName) || apps[0];
  const today = '2026-04-01';
  const todayRequests = currentApp.requests.find(r => r.date === today) || { date: today, count: 0, model: 'N/A' };

  // --- Funções de Ação ---
  const handleCopyAndTrack = (textToCopy: string) => {
    if (rpmCooldown > 0) return;
    
    navigator.clipboard.writeText(textToCopy);

    setApps(prev => prev.map(app => {
      if (app.name === currentAppName) {
        const todayReq = app.requests.find(r => r.date === today);
        if (todayReq) {
          return { ...app, requests: app.requests.map(r => r.date === today ? { ...r, count: r.count + 1, model: selectedModel.name } : r) };
        } else {
          return { ...app, requests: [...app.requests, { date: today, count: 1, model: selectedModel.name }] };
        }
      }
      return app;
    }));

    setRpmCooldown(30);
  };

  return (
    <div className="min-h-screen bg-black text-green-500 p-6 md:p-10 font-mono text-lg">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Retro */}
        <header className="border border-green-500 p-8 rounded-none backdrop-blur-md">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex items-center gap-6">
              <div className="border border-green-500 p-4">
                <Terminal className="text-green-500" size={36} />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-green-400 uppercase">DEV_CONTROL_CENTER</h1>
                <p className="text-green-700 text-lg font-medium">
                  SYSTEM_READY • {currentAppName}
                </p>
              </div>
            </div>

            <div className="flex gap-8 mt-4 md:mt-0 border border-green-800 p-6">
              <div className="text-right">
                <p className="text-xs text-green-700 font-bold uppercase">DATE</p>
                <p className="text-xl font-bold text-green-400">{today}</p>
              </div>
              <div className="text-right border-l border-green-800 pl-8">
                <p className="text-xs text-green-700 font-bold uppercase">DAILY_REQ / LIMIT</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black text-green-400">{todayRequests.count}</span>
                  <span className="text-2xl text-green-700">/ {selectedModel.limit}</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* App Selector & Model */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-green-500 p-4 flex flex-col gap-2">
            <span className="text-sm font-bold text-green-700 uppercase">SELECT_MODEL:</span>
            <select 
              value={selectedModel.name} 
              onChange={(e) => setSelectedModel(models.find(m => m.name === e.target.value) || models[0])}
              className="bg-black border border-green-500 text-green-400 font-bold p-3 focus:outline-none"
            >
              {models.map(m => <option key={m.name} value={m.name}>{m.name}</option>)}
            </select>
          </div>
          <div className="border border-green-500 p-4 flex flex-col gap-2">
            <span className="text-sm font-bold text-green-700 uppercase">ACTIVE_APP:</span>
            <select 
              value={currentAppName} 
              onChange={(e) => setCurrentAppName(e.target.value)}
              className="bg-black border border-green-500 text-green-400 font-bold p-3 focus:outline-none"
            >
              {apps.map(a => <option key={a.name} value={a.name}>{a.name}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Editor */}
          <div className="lg:col-span-2 space-y-4">
            <div className="border border-green-500 rounded-none overflow-hidden flex flex-col h-[600px]">
              <div className="flex border-b border-green-500 bg-black">
                <button onClick={() => setActiveTab('fix_analisai')} className={`px-8 py-5 text-sm font-bold uppercase ${activeTab === 'fix_analisai' ? 'text-black bg-green-500' : 'text-green-700'}`}>
                  <Sparkles size={18} className="inline mr-3" /> FIX_ANALISAI
                </button>
                <button onClick={() => setActiveTab('custom')} className={`px-8 py-5 text-sm font-bold uppercase ${activeTab === 'custom' ? 'text-black bg-green-500' : 'text-green-700'}`}>
                  <Code2 size={18} className="inline mr-3" /> CUSTOM_CMD
                </button>
              </div>

              <div className="flex-1 p-8 bg-black overflow-y-auto">
                <textarea
                  value={activeTab === 'fix_analisai' ? 'ATENÇÃO: Aja como um engenheiro de software sênior...' : customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  className="w-full h-full bg-transparent resize-none focus:outline-none text-green-500 font-mono text-lg leading-relaxed"
                />
              </div>

              <div className="p-6 border-t border-green-500 flex justify-between items-center">
                <button
                  onClick={() => handleCopyAndTrack(activeTab === 'fix_analisai' ? '...' : customPrompt)}
                  disabled={rpmCooldown > 0}
                  className={`flex items-center gap-4 px-10 py-4 font-bold transition-all text-lg ${
                    rpmCooldown > 0 
                    ? 'bg-green-900 text-green-700' 
                    : 'bg-green-600 hover:bg-green-500 text-black'
                  }`}
                >
                  <Copy size={22} /> EXECUTE_CMD
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <div className="border border-green-500 p-8">
              <h3 className="text-sm font-bold text-green-700 uppercase mb-8 flex items-center gap-3">
                <Database size={20} /> SYSTEM_LOG
              </h3>
              <div className="space-y-6 text-sm">
                <p>AnalisAI: {todayRequests.count} req today</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default App;
