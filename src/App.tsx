import React, { useState, useRef } from 'react';
import { 
  Terminal, Copy, Database, Code2, 
  Sparkles, Upload
} from 'lucide-react';

const App = () => {
  const [apps, setApps] = useState([
    { name: 'ABFIT', requests: [] },
    { 
      name: 'AnalisAI', 
      requests: [
        { date: '2026-04-01', count: 1, model: 'gemini-3.1-pro-preview', command: 'to clicando na aba de bet manager e o app nao tá carregando!!!!' },
        { date: '2026-04-01', count: 1, model: 'gemini-3.1-pro-preview', command: 'a aba do bet manager não ta funcionano! faça o app voltar funcionar de maneira direita e total!!!' }
      ] 
    },
    { 
      name: 'BETMANAGER', 
      requests: [
        { date: '2026-04-01', count: 1, model: 'gemini-3.1-pro-preview', command: 'carregue o app pq ele nao ta querendo funcionar' }
      ] 
    }
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
  const todayRequests = apps.reduce((total, app) => total + app.requests.filter(r => r.date === today).length, 0);

  const handleExecute = () => {
    if (rpmCooldown > 0 || !editorRef.current) return;
    
    const text = editorRef.current.innerText;
    
    // Processamento do comando
    let targetApp = currentAppName;
    let targetModel = selectedModel.name;

    // Detectar novo app
    if (text.toLowerCase().includes('novo app') || text.toLowerCase().includes('app novo')) {
        const appName = prompt("Digite o nome do novo app:");
        if (appName) {
            setApps(prev => [...prev, { name: appName.toUpperCase(), requests: [] }]);
            targetApp = appName.toUpperCase();
        }
    }

    // Detectar App
    ['ABFIT', 'ANALISAI', 'BETMANAGER'].forEach(app => {
        if (text.toUpperCase().includes(app)) targetApp = app;
    });

    // Detectar Modelo
    models.forEach(m => {
        if (text.toLowerCase().includes(m.name.toLowerCase())) targetModel = m.name;
    });

    // Atualizar estado
    setCurrentAppName(targetApp);
    setSelectedModel(models.find(m => m.name === targetModel) || models[0]);

    navigator.clipboard.writeText(text);

    const now = new Date().toLocaleTimeString();
    
    setApps(prev => prev.map(app => {
      if (app.name === targetApp) {
        return { ...app, requests: [...app.requests, { date: today, count: 1, model: targetModel, command: text }] };
      }
      return app;
    }));

    setSystemLog(prev => [{timestamp: now, message: `Executado em ${targetApp}: ${text.substring(0, 30)}...`}, ...prev]);
    setRpmCooldown(30);
    editorRef.current.innerText = ''; // Limpar editor
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
              <div className="space-y-6 text-sm h-[200px] overflow-y-auto">
                {systemLog.map((log, i) => (
                  <p key={i}>[{log.timestamp}] {log.message}</p>
                ))}
              </div>
            </div>
            <div className="border border-green-500 p-8">
              <h3 className="text-sm font-bold text-green-700 uppercase mb-8 flex items-center gap-3">
                <Code2 size={20} /> HISTÓRICO_{currentAppName}
              </h3>
              <div className="space-y-6 text-sm h-[300px] overflow-y-auto">
                {currentApp.requests.map((req, i) => (
                  <div key={i} className="border-b border-green-900 pb-2">
                    <p className="text-green-400 font-bold">{req.model}</p>
                    <p className="text-green-500">{req.command}</p>
                  </div>
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
