import React from 'react';
import { 
    AlignLeft, 
    Type, 
    Palette, 
    FileText, 
    Sliders,
    Sparkles,
    Loader2
} from 'lucide-react';
import { HandwritingConfig, PaperType, InkColor } from '../types';
import { HANDWRITING_FONTS, PAPER_STYLES } from '../constants';

interface ControlsProps {
    text: string;
    setText: (text: string) => void;
    config: HandwritingConfig;
    setConfig: React.Dispatch<React.SetStateAction<HandwritingConfig>>;
    isGeneratingAI: boolean;
    onGenerateAI: (prompt: string) => void;
}

const Controls: React.FC<ControlsProps> = ({
    text,
    setText,
    config,
    setConfig,
    isGeneratingAI,
    onGenerateAI,
}) => {
    const [aiPrompt, setAiPrompt] = React.useState('');
    const [showAiInput, setShowAiInput] = React.useState(false);

    const handleConfigChange = <K extends keyof HandwritingConfig>(key: K, value: HandwritingConfig[K]) => {
        setConfig(prev => ({ ...prev, [key]: value }));
    };

    const handleAiSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (aiPrompt.trim()) {
            onGenerateAI(aiPrompt);
            // Don't close immediately so user sees loading state
        }
    };

    return (
        <div className="bg-white border-r border-slate-200 h-full flex flex-col overflow-y-auto">
            {/* Header */}
            <div className="p-6 border-b border-slate-100">
                <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                    <span className="bg-indigo-600 text-white p-1 rounded-lg">
                       <FileText size={20} />
                    </span>
                    HandCraft AI
                </h1>
                <p className="text-slate-500 text-sm mt-1">Realistic handwriting generator</p>
            </div>

            {/* AI Assistant */}
            <div className="p-6 border-b border-slate-100 bg-indigo-50/50">
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-sm font-semibold text-indigo-900 flex items-center gap-2">
                        <Sparkles size={16} className="text-indigo-600" />
                        AI Writer
                    </h2>
                    <button 
                        onClick={() => setShowAiInput(!showAiInput)}
                        className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
                    >
                        {showAiInput ? 'Close' : 'Open'}
                    </button>
                </div>
                
                {showAiInput && (
                    <form onSubmit={handleAiSubmit} className="space-y-3">
                        <textarea
                            value={aiPrompt}
                            onChange={(e) => setAiPrompt(e.target.value)}
                            placeholder="e.g., Write a romantic poem about autumn rain..."
                            className="w-full text-sm p-3 rounded-lg border border-indigo-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none h-24"
                        />
                        <button 
                            type="submit" 
                            disabled={isGeneratingAI || !aiPrompt.trim()}
                            className="w-full bg-indigo-600 text-white text-sm py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isGeneratingAI ? <Loader2 className="animate-spin" size={16} /> : <Sparkles size={16} />}
                            Generate Draft
                        </button>
                    </form>
                )}
            </div>

            {/* Main Inputs */}
            <div className="p-6 space-y-8">
                
                {/* Text Input */}
                <section>
                    <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                        <AlignLeft size={16} />
                        Content
                    </label>
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Type your text here..."
                        className="w-full h-40 p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none text-slate-700"
                    />
                </section>

                {/* Font Selection */}
                <section>
                    <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                        <Type size={16} />
                        Font Style
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                        {HANDWRITING_FONTS.map((font) => (
                            <button
                                key={font.name}
                                onClick={() => handleConfigChange('fontFamily', font.family)}
                                className={`p-2 text-sm border rounded-lg text-left transition-all hover:bg-slate-50 ${
                                    config.fontFamily === font.family 
                                    ? 'border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600' 
                                    : 'border-slate-200'
                                }`}
                                style={{ fontFamily: font.family }}
                            >
                                {font.name}
                            </button>
                        ))}
                    </div>
                </section>

                {/* Paper Type */}
                <section>
                    <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                        <FileText size={16} />
                        Paper Style
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                        {Object.entries(PAPER_STYLES).map(([key, style]) => (
                            <button
                                key={key}
                                onClick={() => handleConfigChange('paperType', key as PaperType)}
                                className={`h-16 rounded-lg border-2 overflow-hidden relative transition-all ${
                                    config.paperType === key 
                                    ? 'border-indigo-600 ring-1 ring-indigo-600' 
                                    : 'border-slate-200 hover:border-slate-300'
                                }`}
                                title={style.name}
                            >
                                <div 
                                    className="absolute inset-0 w-full h-full"
                                    style={{ backgroundColor: style.bg }}
                                />
                                {/* Visual hint for lines/grid */}
                                {key === 'LINED' && <div className="absolute inset-0 w-full h-full" style={{backgroundImage: `linear-gradient(${style.line} 1px, transparent 1px)`, backgroundSize: '100% 20px'}} />}
                                {key === 'GRID' && <div className="absolute inset-0 w-full h-full" style={{backgroundImage: `linear-gradient(${style.line} 1px, transparent 1px), linear-gradient(90deg, ${style.line} 1px, transparent 1px)`, backgroundSize: '15px 15px'}} />}
                            </button>
                        ))}
                    </div>
                </section>

                {/* Colors */}
                <section>
                    <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                        <Palette size={16} />
                        Ink Color
                    </label>
                    <div className="flex gap-3">
                        {Object.values(InkColor).map((color) => (
                            <button
                                key={color}
                                onClick={() => handleConfigChange('inkColor', color)}
                                className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${
                                    config.inkColor === color 
                                    ? 'border-slate-400 ring-2 ring-indigo-500 ring-offset-2' 
                                    : 'border-transparent'
                                }`}
                                style={{ backgroundColor: color }}
                                title={color}
                            />
                        ))}
                    </div>
                </section>

                {/* Sliders */}
                <section className="space-y-4">
                    <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                        <Sliders size={16} />
                        Adjustments
                    </label>
                    
                    <div>
                        <div className="flex justify-between text-xs text-slate-500 mb-1">
                            <span>Font Size</span>
                            <span>{config.fontSize}px</span>
                        </div>
                        <input
                            type="range"
                            min="12"
                            max="64"
                            value={config.fontSize}
                            onChange={(e) => handleConfigChange('fontSize', Number(e.target.value))}
                            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                        />
                    </div>

                    <div>
                        <div className="flex justify-between text-xs text-slate-500 mb-1">
                            <span>Messiness (Humanize)</span>
                            <span>{Math.round(config.messiness * 100)}%</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.05"
                            value={config.messiness}
                            onChange={(e) => handleConfigChange('messiness', Number(e.target.value))}
                            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                        />
                    </div>
                    
                    <div>
                        <div className="flex justify-between text-xs text-slate-500 mb-1">
                            <span>Line Height</span>
                            <span>{config.lineHeight}x</span>
                        </div>
                        <input
                            type="range"
                            min="1"
                            max="3"
                            step="0.1"
                            value={config.lineHeight}
                            onChange={(e) => handleConfigChange('lineHeight', Number(e.target.value))}
                            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                        />
                    </div>
                </section>
            </div>
            
            <div className="p-4 text-center text-xs text-slate-400 mt-auto border-t border-slate-100">
                Powered by Gemini API & Canvas
            </div>
        </div>
    );
};

export default Controls;
