import React, { useState } from 'react';
import Controls from './components/Controls';
import Preview from './components/Preview';
import { DEFAULT_CONFIG } from './constants';
import { HandwritingConfig } from './types';
import { draftTextWithAI } from './services/geminiService';

const App: React.FC = () => {
  const [text, setText] = useState<string>("Dear friend,\n\nI hope this letter finds you well. I'm currently experimenting with this amazing tool that turns digital text into handwriting. \n\nIt feels almost like magic, doesn't it?\n\nSincerely,\nYour AI Assistant");
  const [config, setConfig] = useState<HandwritingConfig>(DEFAULT_CONFIG);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  const handleGenerateAI = async (prompt: string) => {
    setIsGeneratingAI(true);
    try {
      const draft = await draftTextWithAI(prompt);
      if (draft) {
        setText(draft);
      }
    } catch (error) {
      alert("Failed to generate content. Please make sure your API key is set properly.");
    } finally {
      setIsGeneratingAI(false);
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 font-sans text-slate-900">
      {/* Sidebar Controls */}
      <div className="w-full md:w-[400px] flex-shrink-0 z-20 shadow-xl">
        <Controls
          text={text}
          setText={setText}
          config={config}
          setConfig={setConfig}
          isGeneratingAI={isGeneratingAI}
          onGenerateAI={handleGenerateAI}
        />
      </div>

      {/* Main Preview Area */}
      <div className="flex-1 h-full relative z-10">
        <Preview text={text} config={config} />
      </div>

      {/* Mobile Notice (Overlay for very small screens) */}
      <div className="md:hidden fixed inset-0 bg-white z-50 flex flex-col items-center justify-center p-8 text-center" style={{ display: 'none' }}> 
        {/* We hide this for now but could use it if we wanted to block mobile */}
        <p>Please use a tablet or desktop for the best experience.</p>
      </div>
    </div>
  );
};

export default App;
