import React, { useState } from 'react';
import { Copy, RefreshCw, Eye, EyeOff } from 'lucide-react';

export default function TextObfuscator() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [method, setMethod] = useState('unicode');
  const [showRaw, setShowRaw] = useState(false);

  const obfuscationMethods = {
    unicode: {
      name: 'Unicode Lookalikes',
      description: 'Replace letters with visually identical Unicode characters',
      transform: (text) => {
        const map = {
          'a': 'а', 'e': 'е', 'o': 'о', 'p': 'р', 'c': 'с', 'x': 'х', 'y': 'у',
          'A': 'А', 'E': 'Е', 'O': 'О', 'P': 'Р', 'C': 'С', 'X': 'Х', 'Y': 'У',
        };
        return text.split('').map(char => map[char] || char).join('');
      }
    },
    zeroWidth: {
      name: 'Zero-Width Characters',
      description: 'Embed hidden data using zero-width spaces and joiners',
      transform: (text) => {
        const zwj = '\u200d';
        const zws = '\u200b';
        const zwnj = '\u200c';
        
        const binary = text.split('').map(char => 
          char.charCodeAt(0).toString(2).padStart(8, '0')
        ).join('');
        
        let result = '';
        for (let bit of binary) {
          result += bit === '0' ? zws : zwj;
        }
        result += '​'; // visible marker
        return result;
      }
    },
    charCodeOffset: {
      name: 'Character Code Offset',
      description: 'Shift each character by a random offset',
      transform: (text) => {
        const offset = 13; // ROT13-style
        return text.split('').map(char => {
          if (/[a-z]/.test(char)) {
            return String.fromCharCode((char.charCodeAt(0) - 97 + offset) % 26 + 97);
          } else if (/[A-Z]/.test(char)) {
            return String.fromCharCode((char.charCodeAt(0) - 65 + offset) % 26 + 65);
          }
          return char;
        }).join('');
      }
    },
    htmlEntities: {
      name: 'HTML Entity Mix',
      description: 'Mix decoded entities with invisible control characters',
      transform: (text) => {
        let result = '';
        for (let char of text) {
          const code = char.charCodeAt(0);
          // Mix regular chars with their numeric entity equivalents
          if (Math.random() > 0.5) {
            result += `&#${code};`;
          } else {
            result += char;
          }
        }
        return result;
      }
    },
    rtl: {
      name: 'RTL + Encoding',
      description: 'Reverse direction with alternate encoding',
      transform: (text) => {
        const rtlMark = '\u202E';
        const encoded = text.split('').map((char, i) => {
          const shift = (i % 5) + 1;
          return String.fromCharCode(char.charCodeAt(0) + shift);
        }).join('');
        return rtlMark + encoded;
      }
    },
    combining: {
      name: 'Combining Characters',
      description: 'Add invisible combining marks to distort character recognition',
      transform: (text) => {
        const combining = ['\u0300', '\u0301', '\u0302', '\u0303', '\u0304'];
        return text.split('').map(char => {
          if (/[a-zA-Z]/.test(char)) {
            return char + combining[Math.floor(Math.random() * combining.length)];
          }
          return char;
        }).join('');
      }
    },
    base64Hybrid: {
      name: 'Base64 + Display',
      description: 'Encode in Base64 but display normally through obfuscation',
      transform: (text) => {
        const encoded = btoa(text);
        const decoded = atob(encoded);
        // Add zero-width chars every 3 chars
        let result = '';
        for (let i = 0; i < decoded.length; i++) {
          result += decoded[i];
          if ((i + 1) % 3 === 0) {
            result += '\u200b'; // zero-width space
          }
        }
        return result;
      }
    },
    homoglyphMix: {
      name: 'Homoglyph Mix',
      description: 'Replace with visually similar but different Unicode characters',
      transform: (text) => {
        const homoglyphs = {
          'a': ['а', 'ɑ', 'ａ'],
          'e': ['е', 'ё', 'ｅ'],
          'i': ['і', 'ı', 'ｉ'],
          'o': ['о', '0', 'ｏ'],
          's': ['ѕ', 'ѓ', 'ｓ'],
          'b': ['Ь', 'ｂ', 'Ϸ'],
          'c': ['с', 'ϲ', 'ｃ'],
          'l': ['l', '1', 'ｌ'],
        };
        return text.split('').map(char => {
          const lower = char.toLowerCase();
          if (homoglyphs[lower]) {
            const variant = homoglyphs[lower][Math.floor(Math.random() * homoglyphs[lower].length)];
            return char === lower ? variant : variant.toUpperCase();
          }
          return char;
        }).join('');
      }
    }
  };

  const handleTransform = () => {
    const transformed = obfuscationMethods[method].transform(inputText);
    setOutputText(transformed);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(outputText);
  };

  const handleReset = () => {
    setInputText('');
    setOutputText('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-slate-100 p-6">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Syne:wght@700;800&display=swap');
        
        * {
          font-family: 'JetBrains Mono', monospace;
        }
        
        .header {
          font-family: 'Syne', sans-serif;
          letter-spacing: -0.02em;
        }
        
        .method-button {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }
        
        .method-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
          transition: left 0.5s;
        }
        
        .method-button:hover::before {
          left: 100%;
        }
        
        .textarea-input {
          background: rgba(15, 23, 42, 0.8);
          border: 1.5px solid rgba(148, 163, 184, 0.2);
          transition: all 0.3s ease;
        }
        
        .textarea-input:focus {
          background: rgba(15, 23, 42, 0.95);
          border-color: rgba(148, 163, 184, 0.5);
          box-shadow: 0 0 20px rgba(71, 85, 105, 0.3);
        }
        
        .glow-button {
          position: relative;
          background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
          border: 1px solid rgba(59, 130, 246, 0.5);
          transition: all 0.3s ease;
        }
        
        .glow-button:hover {
          background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%);
          box-shadow: 0 0 20px rgba(59, 130, 246, 0.4);
          transform: translateY(-2px);
        }
        
        .glow-button:active {
          transform: translateY(0);
        }
        
        .secondary-button {
          background: rgba(71, 85, 105, 0.3);
          border: 1px solid rgba(148, 163, 184, 0.3);
          transition: all 0.3s ease;
        }
        
        .secondary-button:hover {
          background: rgba(71, 85, 105, 0.5);
          border-color: rgba(148, 163, 184, 0.5);
        }
        
        .obfuscation-output {
          background: rgba(7, 13, 27, 0.8);
          border: 1.5px solid rgba(59, 130, 246, 0.3);
          border-radius: 8px;
          padding: 1.5rem;
          font-size: 0.95rem;
          line-height: 1.6;
          word-break: break-all;
          min-height: 120px;
        }
        
        .method-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
          gap: 0.75rem;
        }
        
        .info-badge {
          background: rgba(30, 64, 175, 0.2);
          border-left: 3px solid #3b82f6;
          padding: 0.75rem 1rem;
          border-radius: 4px;
          font-size: 0.85rem;
          line-height: 1.5;
        }
        
        .pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
      `}</style>

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="header text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
            Text Obfuscator
          </h1>
          <p className="text-slate-400 text-sm">Hide readable text behind AI-resistant obfuscation</p>
        </div>

        {/* Method Selection */}
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-slate-300 mb-3 uppercase tracking-widest">Obfuscation Method</h2>
          <div className="method-grid">
            {Object.entries(obfuscationMethods).map(([key, details]) => (
              <button
                key={key}
                onClick={() => {
                  setMethod(key);
                  setOutputText('');
                }}
                className={`method-button p-3 rounded-lg text-left text-sm transition-all ${
                  method === key
                    ? 'bg-blue-600 border border-blue-400 shadow-lg shadow-blue-500/20'
                    : 'bg-slate-800/50 border border-slate-700 hover:bg-slate-700/50'
                }`}
              >
                <div className="font-semibold text-xs mb-1">{details.name}</div>
                <div className="text-xs opacity-70">{details.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="info-badge mb-8">
          <strong>Current Method:</strong> {obfuscationMethods[method].name}
          <br />
          <span className="text-xs">{obfuscationMethods[method].description}</span>
        </div>

        {/* Input */}
        <div className="mb-6">
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-widest block mb-2">
            Plain Text
          </label>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Enter your text here..."
            className="textarea-input w-full p-4 rounded-lg h-32 resize-none focus:outline-none"
          />
        </div>

        {/* Transform Button */}
        <button
          onClick={handleTransform}
          className="glow-button w-full py-3 rounded-lg font-semibold mb-6 flex items-center justify-center gap-2 text-white"
        >
          <RefreshCw size={18} />
          Obfuscate Text
        </button>

        {/* Output */}
        {outputText && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-widest">
                Obfuscated Output
              </label>
              <button
                onClick={() => setShowRaw(!showRaw)}
                className="secondary-button px-2 py-1 rounded text-xs flex items-center gap-1"
              >
                {showRaw ? <EyeOff size={14} /> : <Eye size={14} />}
                {showRaw ? 'Hide' : 'Show'} Raw
              </button>
            </div>
            <div className="obfuscation-output">
              {showRaw ? (
                <pre className="text-xs overflow-auto">{JSON.stringify(outputText, null, 2)}</pre>
              ) : (
                <div className="select-all">{outputText}</div>
              )}
            </div>
            <div className="flex gap-2 mt-4">
              <button
                onClick={handleCopy}
                className="glow-button flex-1 py-2 rounded-lg font-semibold flex items-center justify-center gap-2 text-white text-sm"
              >
                <Copy size={16} />
                Copy to Clipboard
              </button>
              <button
                onClick={handleReset}
                className="secondary-button flex-1 py-2 rounded-lg font-semibold text-sm"
              >
                Clear All
              </button>
            </div>
          </div>
        )}

        {/* Info Section */}
        <div className="mt-12 p-6 bg-slate-800/30 border border-slate-700 rounded-lg">
          <h3 className="text-sm font-semibold text-slate-300 mb-3 uppercase tracking-widest">How It Works</h3>
          <ul className="space-y-2 text-sm text-slate-400">
            <li>• <strong>Unicode Lookalikes:</strong> Uses Cyrillic characters that look identical to Latin</li>
            <li>• <strong>Zero-Width:</strong> Embeds data in invisible zero-width characters</li>
            <li>• <strong>Character Offset:</strong> Shifts characters making pattern recognition difficult</li>
            <li>• <strong>HTML Entities:</strong> Mixes decoded and encoded characters</li>
            <li>• <strong>RTL Encoding:</strong> Combines right-to-left marks with encoding shifts</li>
            <li>• <strong>Combining Characters:</strong> Adds invisible diacritical marks to distort recognition</li>
            <li>• <strong>Homoglyphs:</strong> Replaces characters with visually similar variants</li>
          </ul>
          <p className="text-xs text-slate-500 mt-4 italic">
            These techniques make text difficult for AI systems and automated scanners to process accurately while remaining readable to humans.
          </p>
        </div>
      </div>
    </div>
  );
}
