import { HandwritingConfig, PaperType } from '../types';
import { PAPER_STYLES } from '../constants';

export const drawHandwriting = (
  canvas: HTMLCanvasElement,
  text: string,
  config: HandwritingConfig
): void => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const {
    fontFamily,
    fontSize,
    paperType,
    inkColor,
    lineHeight,
    messiness,
    margins,
  } = config;

  const width = canvas.width;
  const height = canvas.height;
  const paperStyle = PAPER_STYLES[paperType];

  // 1. Draw Background
  ctx.fillStyle = paperStyle.bg;
  ctx.fillRect(0, 0, width, height);

  // 2. Draw Paper Lines/Pattern
  ctx.lineWidth = 1;
  const lineSpacing = fontSize * lineHeight;
  
  // Calculate starting Y to align text with lines naturally
  const startY = margins + fontSize; 

  if (paperType === PaperType.LINED) {
    ctx.strokeStyle = paperStyle.line;
    ctx.beginPath();
    // Draw vertical margin line
    ctx.moveTo(margins - 10, 0);
    ctx.lineTo(margins - 10, height);
    ctx.strokeStyle = '#f87171'; // Red margin line
    ctx.stroke();

    // Draw horizontal lines
    ctx.strokeStyle = paperStyle.line;
    ctx.beginPath();
    for (let y = startY; y < height; y += lineSpacing) {
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
    }
    ctx.stroke();
  } else if (paperType === PaperType.GRID) {
    ctx.strokeStyle = paperStyle.line;
    ctx.beginPath();
    const gridSize = lineSpacing; // Make grid match line height approx
    for (let x = 0; x < width; x += gridSize) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
    }
    for (let y = 0; y < height; y += gridSize) {
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
    }
    ctx.stroke();
  } else if (paperType === PaperType.VINTAGE) {
     // Add some noise/stains for vintage look (simplified)
     ctx.globalAlpha = 0.05;
     ctx.fillStyle = '#5c4033';
     for(let i=0; i<20; i++) {
         const r = Math.random() * 100 + 50;
         const rx = Math.random() * width;
         const ry = Math.random() * height;
         ctx.beginPath();
         ctx.arc(rx, ry, r, 0, Math.PI * 2);
         ctx.fill();
     }
     ctx.globalAlpha = 1.0;
  }

  // 3. Draw Text
  ctx.font = `${fontSize}px ${fontFamily}`;
  ctx.fillStyle = inkColor;
  ctx.textBaseline = 'bottom'; // Align to the line

  const maxWidth = width - (margins * 2);
  
  // Improved splitting: 
  // 1. \s+ splits by whitespace (keeps English words together)
  // 2. [\u4e00-\u9fa5] splits CJK characters individually (allows Chinese character wrapping)
  // filter(Boolean) removes empty strings resulting from the split
  const words = text.split(/(\s+|[\u4e00-\u9fa5])/).filter(Boolean);
  
  let x = margins;
  let y = startY;

  // Adjust for Blueprint white text
  if (paperType === PaperType.BLUEPRINT) {
      ctx.fillStyle = '#ffffff';
  }

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    
    // Handle manual line breaks
    if (word.includes('\n')) {
       const parts = word.split('\n');
       for (let p = 0; p < parts.length; p++) {
           if (p > 0) {
               x = margins;
               y += lineSpacing;
           }
           drawWord(ctx, parts[p], x, y, messiness);
           x += ctx.measureText(parts[p]).width;
       }
       continue;
    }

    const metrics = ctx.measureText(word);
    const wordWidth = metrics.width;

    if (x + wordWidth > width - margins && x > margins) {
      x = margins;
      y += lineSpacing;
    }

    // Don't draw if we run off the page
    if (y > height) break;

    drawWord(ctx, word, x, y, messiness);
    x += wordWidth;
  }
};

const drawWord = (
    ctx: CanvasRenderingContext2D, 
    word: string, 
    x: number, 
    y: number, 
    messiness: number
) => {
    let currentX = x;
    
    // Split word into characters for jitter
    const chars = word.split('');
    
    for (const char of chars) {
        ctx.save();
        
        // Random variations
        const angle = (Math.random() - 0.5) * (messiness * 0.4); // Rotation
        const offsetY = (Math.random() - 0.5) * (messiness * 10); // Vertical jitter
        const scale = 1 + (Math.random() - 0.5) * (messiness * 0.1); // Size variation

        ctx.translate(currentX, y + offsetY);
        ctx.rotate(angle);
        ctx.scale(scale, scale);
        
        ctx.fillText(char, 0, 0);
        
        ctx.restore();
        
        const charWidth = ctx.measureText(char).width;
        currentX += charWidth;
    }
};

export const downloadCanvas = (canvas: HTMLCanvasElement, filename: string = 'handwriting.png') => {
    const link = document.createElement('a');
    link.download = filename;
    link.href = canvas.toDataURL('image/png');
    link.click();
};