import React, { useState, useRef } from 'react';
import { 
  Terminal, Copy, Database, Code2, 
  Sparkles, Upload
} from 'lucide-react';

const App = () => {
  const [apps, setApps] = useState([
    { name: 'AnalisAI', requests: [{ date: '2026-04-01', count: 1, model: 'gemini-3.1-pro-preview' }] }
  ]);
  const [currentAppName, setCurrentAppName] = useState('AnalisAI');
  
  const models = [
    { name: 'Padrão (Gemini 3 Flash Preview)', limit: 1500 },
    { name: 'Gemini 3 Flash Preview', limit: 1500 },
    { name: 'Gemini 3.1 Pro Preview', limit: 50 },
    { name: 'Gemini 3.1 Flash Lite Preview', limit: 3000 }
  ];
  const [selectedModel, setSelectedModel] = useState(models[0]);
  const [rpmCooldown, setRpmCooldown] = useState(0);

  const [systemLog, setSystemLog] = useState<{timestamp: string, message: string}[]>([]);
  const editorRef = useRef<HTMLDivElement>(null);

  const today = '2026-04-01';
  const currentApp = apps.find(a => a.name === currentAppName) || apps[0];
  const todayRequests = currentApp.requests.find(r => r.date === today) || { date: today, count: 0, model: 'N/A' };

  const handleExecute = () => {
    if (rpmCooldown > 0 || !editorRef.current) return;
    
    const content = editorRef.current.innerHTML;
    navigator.clipboard.writeText(editorRef.current.innerText);

    const now = new Date().toLocaleTimeString();
    
    setApps(prev => prev.map(app => {
      if (app.name === currentAppName) {
        return { ...app, requests: app.requests.map(r => r.date === today ? { ...r, count: r.count + 1, model: selectedModel.name } : r) };
      }
      return app;
    }));

    setSystemLog(prev => [{timestamp: now, message: `Executado: ${editorRef.current!.innerText.substring(0, 30)}...`}, ...prev]);
    setRpmCooldown(30);
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf("image") !== -1) {
        const blob = items[i].getAsFile();
        const reader = new FileReader();
        reader.onload = (event) => {
          const img = document.createElement('img');
          img.src = event.target?.result as string;
          img.style.maxWidth = '100%';
          editorRef.current?.appendChild(img);
        };
        reader.readAsDataURL(blob!);
      }
    }
  };

  return (
    <div className="min-h-screen bg-black text-green-500 p-6 md:p-10 font-mono text-lg">
      <div className="max-w-7xl mx-auto space-y-8">
        
        <header className="border border-green-500 p-8 rounded-none backdrop-blur-md">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex items-center gap-6">
              <div className="border border-green-500 p-4">
                <Terminal className="text-green-500" size={36} />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-green-400 uppercase">CENTRAL DE CONTROLE DE DESENVOLVIMENTO</h1>
                <p className="text-green-700 text-lg font-medium">
                  SISTEMA_PRONTO • {currentAppName}
                </p>
              </div>
            </div>

            <div className="flex gap-8 mt-4 md:mt-0 border border-green-800 p-6">
              <div className="text-right">
                <p className="text-xs text-green-700 font-bold uppercase">DATA</p>
                <p className="text-xl font-bold text-green-400">{today}</p>
              </div>
              <div className="text-right border-l border-green-800 pl-8">
                <p className="text-xs text-green-700 font-bold uppercase">REQ_DIÁRIAS / LIMITE</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black text-green-400">{todayRequests.count}</span>
                  <span className="text-2xl text-green-700">/ {selectedModel.limit}</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-green-500 p-4 flex flex-col gap-2">
            <span className="text-sm font-bold text-green-700 uppercase">SELECIONAR_MODELO:</span>
            <select 
              value={selectedModel.name} 
              onChange={(e) => setSelectedModel(models.find(m => m.name === e.target.value) || models[0])}
              className="bg-black border border-green-500 text-green-400 font-bold p-3 focus:outline-none"
            >
              {models.map(m => <option key={m.name} value={m.name}>{m.name}</option>)}
            </select>
          </div>
          <div className="border border-green-500 p-4 flex flex-col gap-2">
            <span className="text-sm font-bold text-green-700 uppercase">APP_ATIVO:</span>
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
          
          <div className="lg:col-span-2 space-y-4">
            <div className="border border-green-500 rounded-none overflow-hidden flex flex-col h-[700px]">
              <div className="flex border-b border-green-500 bg-black p-4 text-green-700 font-bold uppercase">
                <Sparkles size={18} className="inline mr-3" /> EDITOR_COMANDOS_ENGENHEIRO
              </div>

              <div 
                ref={editorRef}
                contentEditable
                onPaste={handlePaste}
                className="flex-1 p-8 bg-black overflow-y-auto text-green-500 font-mono text-lg leading-relaxed focus:outline-none"
              />

              <div className="p-6 border-t border-green-500 flex gap-4 items-center">
                <button
                  onClick={handleExecute}
                  disabled={rpmCooldown > 0}
                  className={`flex items-center gap-4 px-10 py-4 font-bold transition-all text-lg w-full justify-center ${
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

          <div className="space-y-8">
            <div className="border border-green-500 p-8">
              <h3 className="text-sm font-bold text-green-700 uppercase mb-8 flex items-center gap-3">
                <Database size={20} /> LOG_SISTEMA
              </h3>
              <div className="space-y-6 text-sm h-[500px] overflow-y-auto">
                {systemLog.map((log, i) => (
                  <p key={i}>[{log.timestamp}] {log.message}</p>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default App;
