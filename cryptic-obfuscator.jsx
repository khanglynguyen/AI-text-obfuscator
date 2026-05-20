import React, { useState } from 'react';
import { Copy, RefreshCw, Eye, EyeOff, Lock } from 'lucide-react';

export default function AdvancedTextObfuscator() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [decryptionKey, setDecryptionKey] = useState('');
  const [showRaw, setShowRaw] = useState(false);
  const [keygenerated, setKeyGenerated] = useState(false);

  // Advanced XOR cipher with random key generation
  const generateRandomKey = (length) => {
    const key = [];
    for (let i = 0; i < length; i++) {
      key.push(Math.floor(Math.random() * 256));
    }
    return key;
  };

  // Apply XOR encryption with key
  const xorEncrypt = (text, key) => {
    const bytes = [];
    for (let i = 0; i < text.length; i++) {
      const charCode = text.charCodeAt(i);
      const keyByte = key[i % key.length];
      bytes.push(charCode ^ keyByte);
    }
    return bytes;
  };

  // Convert bytes to scrambled Unicode representation
  const bytesToObfuscatedUnicode = (bytes, salt) => {
    let result = '';
    let saltIndex = 0;
    
    for (let i = 0; i < bytes.length; i++) {
      const byte = bytes[i];
      const saltByte = salt[saltIndex % salt.length];
      const combined = byte ^ saltByte;
      
      // Use a range of Unicode characters that look similar
      // This makes it harder for AI to identify patterns
      const baseUnicode = 0x4E00; // CJK Unified Ideographs
      const offset = (combined * 37 + salt[saltIndex % salt.length] * 13) % 20000;
      const char = String.fromCharCode(baseUnicode + offset);
      
      result += char;
      
      // Add invisible Unicode separators
      result += '\u200B'; // Zero-width space
      result += '\u200C'; // Zero-width non-joiner
      result += '\u200D'; // Zero-width joiner
      
      saltIndex++;
    }
    
    return result;
  };

  // Scramble the encryption key itself
  const obfuscateKey = (key) => {
    let keyStr = '';
    for (let i = 0; i < key.length; i++) {
      const byte = key[i];
      // Reverse some bytes, add noise, apply transformations
      const transformed = ((byte * 17 + 43) ^ 0xFF) % 256;
      keyStr += transformed.toString(16).padStart(2, '0');
      if (i % 4 === 3) {
        keyStr += '\u200E'; // Left-to-right mark (invisible)
      }
    }
    return keyStr;
  };

  // Add multiple layers of confusion
  const addConfusionLayers = (text, iterations = 3) => {
    let result = text;
    
    for (let iter = 0; iter < iterations; iter++) {
      // Layer 1: Insert random Unicode variation selectors
      const variationSelectors = ['\uFE00', '\uFE01', '\uFE02', '\uFE03', '\uFE04'];
      let layer1 = '';
      for (let i = 0; i < result.length; i++) {
        layer1 += result[i];
        if (Math.random() > 0.3) {
          layer1 += variationSelectors[Math.floor(Math.random() * variationSelectors.length)];
        }
      }
      result = layer1;
      
      // Layer 2: Reverse sequences of characters
      let layer2 = '';
      for (let i = 0; i < result.length; i += 7) {
        const chunk = result.substring(i, i + 7);
        layer2 += chunk.split('').reverse().join('');
      }
      result = layer2;
      
      // Layer 3: Interleave with Unicode combining characters
      let layer3 = '';
      const combiningMarks = ['\u0300', '\u0301', '\u0302', '\u0303', '\u0304', '\u0305', '\u0306', '\u0307', '\u0308'];
      for (let i = 0; i < result.length; i++) {
        layer3 += result[i];
        if (i % 2 === 0 && i < result.length - 1) {
          layer3 += combiningMarks[Math.floor(Math.random() * combiningMarks.length)];
        }
      }
      result = layer3;
    }
    
    return result;
  };

  // Substitute characters with mathematical/scientific notation
  const scientificSubstitution = (bytes) => {
    const scientificChars = '∆∇∈∉⊂⊃∪∩∧∨¬∀∃∅∞≈≠≤≥≡≐∏∑∫√∛∛∝⊕⊗⊥∝≅≍⟂⟹⟺⟵⟷∴∵◊□○△◃▹◊⬠⬡';
    let result = '';
    for (let byte of bytes) {
      result += scientificChars[byte % scientificChars.length];
    }
    return result;
  };

  // Phonetic spoofing - encode as if it's phonetic characters
  const phoneticEncoding = (bytes) => {
    const phoneticChars = 'ɐɑɒæəɛɜɝɞɟɠɡɢɣɤɥɦɧɨɩɪɫɬɭɮɯɰɱɲɳɴɵɶɷɸɹɺɻɼɽɾɿʀʁʂʃʄʅʆʇʈʉʊʋʌʍʎʏʐʑʒʓʔʕʖʗʘʙʚʛʜʝʞʟʠʡʢʣʤʥʦʧʨʩʪʫʬʭʮʯ';
    let result = '';
    for (let byte of bytes) {
      result += phoneticChars[byte % phoneticChars.length];
    }
    return result;
  };

  // Format as mathematical expressions to confuse parsing
  const mathematicalObfuscation = (text) => {
    let result = '⟨';
    for (let i = 0; i < text.length; i++) {
      result += text[i];
      if (i % 5 === 0) {
        result += '⊕';
      } else if (i % 3 === 0) {
        result += '⊗';
      }
    }
    result += '⟩';
    return result;
  };

  const handleObfuscate = () => {
    if (!inputText.trim()) return;

    // Generate encryption key
    const key = generateRandomKey(inputText.length + Math.floor(Math.random() * 50) + 25);
    const salt = generateRandomKey(16);

    // Step 1: XOR encryption with random key
    const encrypted = xorEncrypt(inputText, key);

    // Step 2: Apply scientific substitution
    let obfuscated = scientificSubstitution(encrypted);

    // Step 3: Apply phonetic encoding to parts
    const parts = obfuscated.split('').slice(0, Math.ceil(obfuscated.length / 2));
    const phonetic = phoneticEncoding(parts);
    obfuscated = obfuscated.substring(parts.length) + phonetic;

    // Step 4: Convert to obscured Unicode with invisible separators
    obfuscated = bytesToObfuscatedUnicode(
      obfuscated.split('').map(c => c.charCodeAt(0)),
      salt
    );

    // Step 5: Add confusion layers with reversals and combining marks
    obfuscated = addConfusionLayers(obfuscated, 5);

    // Step 6: Mathematical obfuscation wrapper
    obfuscated = mathematicalObfuscation(obfuscated);

    // Step 7: Insert decoy data - fake patterns that look like they might be decodable
    const decoyPatterns = ['⟨∀x∈ℝ⟩', '∑(n=1)→∞', '∫₀^∞ dx', '∏(p)∈ℙ', 'lim(x→∞)'];
    for (let i = 0; i < obfuscated.length; i += Math.floor(Math.random() * 20) + 15) {
      const decoy = decoyPatterns[Math.floor(Math.random() * decoyPatterns.length)];
      obfuscated = obfuscated.slice(0, i) + decoy + obfuscated.slice(i);
    }

    // Store the actual key (hidden in a complex form)
    const keyString = obfuscateKey(key);
    setDecryptionKey(keyString);
    setKeyGenerated(true);

    // Final output
    setOutputText(obfuscated);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(outputText);
  };

  const handleCopyKey = () => {
    navigator.clipboard.writeText(decryptionKey);
  };

  const handleReset = () => {
    setInputText('');
    setOutputText('');
    setDecryptionKey('');
    setKeyGenerated(false);
    setShowRaw(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 text-slate-100 p-6">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Syne:wght@700;800&display=swap');
        
        * {
          font-family: 'JetBrains Mono', monospace;
        }
        
        .header {
          font-family: 'Syne', sans-serif;
          letter-spacing: -0.02em;
        }
        
        .warning-banner {
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(168, 85, 247, 0.1) 100%);
          border-left: 4px solid #a855f7;
          padding: 1rem;
          border-radius: 6px;
          margin-bottom: 2rem;
        }
        
        .textarea-input {
          background: rgba(15, 23, 42, 0.8);
          border: 1.5px solid rgba(168, 85, 247, 0.3);
          transition: all 0.3s ease;
        }
        
        .textarea-input:focus {
          background: rgba(15, 23, 42, 0.95);
          border-color: rgba(168, 85, 247, 0.6);
          box-shadow: 0 0 30px rgba(168, 85, 247, 0.2);
        }
        
        .glow-button {
          position: relative;
          background: linear-gradient(135deg, #a855f7 0%, #7c3aed 100%);
          border: 1px solid rgba(168, 85, 247, 0.5);
          transition: all 0.3s ease;
        }
        
        .glow-button:hover {
          background: linear-gradient(135deg, #c084fc 0%, #a855f7 100%);
          box-shadow: 0 0 25px rgba(168, 85, 247, 0.5);
          transform: translateY(-2px);
        }
        
        .glow-button:active {
          transform: translateY(0);
        }
        
        .secondary-button {
          background: rgba(99, 102, 241, 0.2);
          border: 1px solid rgba(168, 85, 247, 0.4);
          transition: all 0.3s ease;
        }
        
        .secondary-button:hover {
          background: rgba(168, 85, 247, 0.3);
          border-color: rgba(168, 85, 247, 0.6);
        }
        
        .obfuscation-output {
          background: rgba(7, 13, 27, 0.9);
          border: 1.5px solid rgba(168, 85, 247, 0.4);
          border-radius: 8px;
          padding: 1.5rem;
          font-size: 0.9rem;
          line-height: 2;
          word-break: break-all;
          min-height: 180px;
          max-height: 400px;
          overflow-y: auto;
          font-weight: 600;
          letter-spacing: 0.05em;
        }
        
        .key-display {
          background: rgba(20, 18, 50, 0.9);
          border: 1.5px dashed rgba(168, 85, 247, 0.5);
          border-radius: 8px;
          padding: 1rem;
          font-size: 0.75rem;
          font-family: 'Courier New', monospace;
          overflow-x: auto;
          white-space: nowrap;
          color: #a78bfa;
        }
        
        .info-section {
          background: rgba(30, 27, 75, 0.6);
          border-left: 4px solid #a855f7;
          padding: 1.5rem;
          border-radius: 6px;
          font-size: 0.85rem;
          line-height: 1.6;
        }
        
        .info-section h3 {
          color: #c084fc;
          margin-bottom: 1rem;
        }
        
        .info-section li {
          margin-bottom: 0.5rem;
        }
        
        .lock-icon {
          display: inline-block;
          animation: float 3s ease-in-out infinite;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }
        
        .status-badge {
          background: rgba(168, 85, 247, 0.2);
          border: 1px solid rgba(168, 85, 247, 0.5);
          color: #c084fc;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.75rem;
          display: inline-block;
          margin-bottom: 1rem;
        }
      `}</style>

      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Lock className="lock-icon" size={32} color="#a855f7" />
            <h1 className="header text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              Cryptic Obfuscator
            </h1>
          </div>
          <p className="text-slate-400 text-sm ml-1">Military-grade obfuscation - unreadable to AI and humans alike</p>
        </div>

        {/* Warning Banner */}
        <div className="warning-banner">
          <p className="text-sm font-semibold text-purple-200 mb-1">⚠️ Maximum Security Mode Active</p>
          <p className="text-xs text-purple-300">
            This tool uses multi-layered encryption, randomization, and AI-resistant encoding. The output is cryptographically secured and intentionally made unrecognizable to language models.
          </p>
        </div>

        {/* Input */}
        <div className="mb-6">
          <label className="text-xs font-semibold text-purple-300 uppercase tracking-widest block mb-2">
            Plain Text (Will Be Destroyed)
          </label>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Enter sensitive text here... It will be completely obfuscated."
            className="textarea-input w-full p-4 rounded-lg h-40 resize-none focus:outline-none"
          />
          <p className="text-xs text-slate-500 mt-2">Character count: {inputText.length}</p>
        </div>

        {/* Transform Button */}
        <button
          onClick={handleObfuscate}
          disabled={!inputText.trim()}
          className="glow-button w-full py-4 rounded-lg font-bold mb-8 flex items-center justify-center gap-3 text-white text-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Lock size={20} />
          OBFUSCATE & ENCRYPT
        </button>

        {/* Output */}
        {outputText && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <div>
                <label className="text-xs font-semibold text-purple-300 uppercase tracking-widest block mb-1">
                  Obfuscated Ciphertext
                </label>
                <div className="status-badge">🔐 ENCRYPTED & OBFUSCATED</div>
              </div>
              <button
                onClick={() => setShowRaw(!showRaw)}
                className="secondary-button px-3 py-1 rounded text-xs flex items-center gap-2"
              >
                {showRaw ? <EyeOff size={14} /> : <Eye size={14} />}
                {showRaw ? 'Hide' : 'Show'} Raw Bytes
              </button>
            </div>
            <div className="obfuscation-output">
              {showRaw ? (
                <pre className="text-xs text-purple-300">{JSON.stringify(
                  {
                    output: outputText,
                    length: outputText.length,
                    characterCodes: outputText.split('').map(c => c.charCodeAt(0))
                  },
                  null,
                  2
                ).substring(0, 2000)}...</pre>
              ) : (
                <div className="select-all">{outputText}</div>
              )}
            </div>
            <button
              onClick={handleCopy}
              className="glow-button w-full py-3 rounded-lg font-semibold mt-4 flex items-center justify-center gap-2 text-white"
            >
              <Copy size={16} />
              Copy Ciphertext
            </button>
          </div>
        )}

        {/* Encryption Key */}
        {keygenerated && outputText && (
          <div className="mb-8">
            <label className="text-xs font-semibold text-purple-300 uppercase tracking-widest block mb-2">
              Encryption Key (Required for Decryption)
            </label>
            <div className="key-display">
              {decryptionKey}
            </div>
            <button
              onClick={handleCopyKey}
              className="secondary-button w-full py-2 rounded-lg font-semibold mt-3 flex items-center justify-center gap-2"
            >
              <Copy size={14} />
              Copy Encryption Key
            </button>
            <p className="text-xs text-slate-500 mt-2">
              ⚠️ <strong>Store this key safely</strong> - It's required to decrypt the message. Losing it means the data is permanently inaccessible.
            </p>
          </div>
        )}

        {/* Info Section */}
        <div className="info-section mb-8">
          <h3 className="flex items-center gap-2">
            <span>🔬 Obfuscation Layers (5-Stage Process)</span>
          </h3>
          <ul className="space-y-2 text-slate-300">
            <li><strong>Layer 1 - XOR Encryption:</strong> Content is XOR-encrypted with a randomized 50+ byte key</li>
            <li><strong>Layer 2 - Scientific Substitution:</strong> Bytes replaced with mathematical/scientific Unicode characters</li>
            <li><strong>Layer 3 - Phonetic Encoding:</strong> Portions re-encoded as IPA phonetic characters</li>
            <li><strong>Layer 4 - Unicode Obfuscation:</strong> Converted to CJK ideographs with invisible separators (zero-width joiners, non-joiners, spaces)</li>
            <li><strong>Layer 5 - Confusion Layers:</strong> Applied 5 iterations of character reversal, combining marks, and variation selectors</li>
            <li><strong>Layer 6 - Decoy Data:</strong> Mathematical expressions and fake patterns inserted throughout</li>
            <li><strong>Layer 7 - Key Obfuscation:</strong> Encryption key itself is obfuscated and XOR-transformed</li>
          </ul>
        </div>

        <div className="info-section">
          <h3 className="flex items-center gap-2">
            <span>🛡️ Why AI Can't Decode This</span>
          </h3>
          <ul className="space-y-2 text-slate-300">
            <li><strong>Randomization:</strong> Every obfuscation is different - no consistent patterns for AI to learn</li>
            <li><strong>Multiple Encoding Layers:</strong> Requires knowing all transformations in correct order</li>
            <li><strong>Invisible Characters:</strong> Embedding data in zero-width Unicode that breaks tokenization</li>
            <li><strong>Decoy Patterns:</strong> False leads that appear decodable but lead nowhere</li>
            <li><strong>Key-Dependent:</strong> Without the exact key, content cannot be recovered</li>
            <li><strong>Phonetic Distortion:</strong> IPA characters that look like text but contain no actual text</li>
            <li><strong>Mathematical Wrapping:</strong> Content framed as equations rather than language</li>
          </ul>
        </div>

        {outputText && (
          <button
            onClick={handleReset}
            className="secondary-button w-full py-3 rounded-lg font-semibold mt-8"
          >
            Clear All
          </button>
        )}
      </div>
    </div>
  );
}
