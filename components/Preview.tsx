import React, { useEffect, useRef, useState } from 'react';
import { HandwritingConfig } from '../types';
import { downloadCanvas, drawHandwriting } from '../utils/canvasUtils';
import { Download, RefreshCw, ZoomIn, ZoomOut } from 'lucide-react';

interface PreviewProps {
    text: string;
    config: HandwritingConfig;
}

const Preview: React.FC<PreviewProps> = ({ text, config }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [zoom, setZoom] = useState(1);
    const containerRef = useRef<HTMLDivElement>(null);

    // Re-draw whenever text or config changes
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        // Ensure web fonts are loaded before drawing initially
        // A simple timeout often solves the "font not ready" flicker on first load
        // A more robust solution uses document.fonts.ready, but this is sufficient for MVP
        document.fonts.ready.then(() => {
             drawHandwriting(canvas, text, config);
        });
        
        // Immediate draw attempt as fallback
        drawHandwriting(canvas, text, config);

    }, [text, config]);

    const handleDownload = () => {
        if (canvasRef.current) {
            downloadCanvas(canvasRef.current);
        }
    };

    return (
        <div className="h-full flex flex-col bg-slate-100">
            {/* Toolbar */}
            <div className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-6 shadow-sm z-10">
                <div className="flex items-center gap-4">
                    <span className="text-sm font-semibold text-slate-600">Preview</span>
                    <div className="flex items-center bg-slate-100 rounded-lg p-1">
                        <button 
                            onClick={() => setZoom(z => Math.max(0.5, z - 0.1))}
                            className="p-1.5 hover:bg-white rounded-md text-slate-600 transition-colors"
                            title="Zoom Out"
                        >
                            <ZoomOut size={16} />
                        </button>
                        <span className="text-xs font-mono w-12 text-center text-slate-600">
                            {Math.round(zoom * 100)}%
                        </span>
                        <button 
                            onClick={() => setZoom(z => Math.min(2, z + 0.1))}
                            className="p-1.5 hover:bg-white rounded-md text-slate-600 transition-colors"
                            title="Zoom In"
                        >
                            <ZoomIn size={16} />
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                     <button
                        onClick={() => {
                            if (canvasRef.current) drawHandwriting(canvasRef.current, text, config);
                        }}
                        className="px-4 py-2 text-sm text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg font-medium transition-colors flex items-center gap-2"
                    >
                        <RefreshCw size={16} />
                        Redraw
                    </button>
                    <button
                        onClick={handleDownload}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-all shadow-md hover:shadow-lg flex items-center gap-2"
                    >
                        <Download size={16} />
                        Download Image
                    </button>
                </div>
            </div>

            {/* Canvas Container */}
            <div 
                ref={containerRef}
                className="flex-1 overflow-auto p-8 flex items-start justify-center"
                style={{ 
                    backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)',
                    backgroundSize: '20px 20px'
                }}
            >
                <div 
                    className="shadow-2xl transition-transform duration-200 origin-top"
                    style={{ transform: `scale(${zoom})` }}
                >
                    <canvas
                        ref={canvasRef}
                        width={800} // Standard letter/A4 aspect ratio approx
                        height={1000}
                        className="bg-white"
                        style={{ width: '800px', height: '1000px' }}
                    />
                </div>
            </div>
        </div>
    );
};

export default Preview;
