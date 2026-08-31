import GoogleDriveIntegration from "./GoogleDriveIntegration";
import React, { useState, useEffect } from 'react';
import { Tool } from '../types';
import { ArrowLeft, Copy, Check, Heart, ExternalLink, Download } from 'lucide-react';

interface ToolViewProps {
  tool: Tool;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

export default function ToolView({ tool, isFavorite, onToggleFavorite }: ToolViewProps) {
  const [textInput, setTextInput] = useState('');
  const [calcInputs, setCalcInputs] = useState<Record<string, number>>({});
  const [output, setOutput] = useState<string | number>('');
  const [copied, setCopied] = useState(false);
  
  // Specific tool states
  const [loading, setLoading] = useState(false);
  const [selectedExt, setSelectedExt] = useState('.html');
  const [pwaData, setPwaData] = useState({ name: 'My App', shortName: 'App', color: '#4f46e5', html: '<h1>Hello PWA</h1>' });
  const [webAppConfig, setWebAppConfig] = useState({ url: 'https://example.com', name: 'My App', pkg: 'com.myapp.web' });

  // Auto-run for generators on mount
  useEffect(() => {
    if (tool.type === 'generator') {
      setOutput(tool.action());
    }
  }, [tool]);

  // Update text tool output on input change
  useEffect(() => {
    if (tool.type === 'text') {
      setOutput(tool.action(textInput));
    }
  }, [textInput, tool]);

  // Update calculator output on input change
  useEffect(() => {
    if (tool.type === 'calculator' && tool.inputs) {
      const args = tool.inputs.map(i => calcInputs[i.name] || 0);
      setOutput(tool.action(...args));
    }
  }, [calcInputs, tool]);

  const handleCopy = async (textToCopy: string = output.toString()) => {
    if (!textToCopy) return;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const handleShortenUrl = async () => {
    if (!textInput) return;
    setLoading(true);
    try {
      const response = await fetch(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(textInput)}`);
      if (response.ok) {
        setOutput(await response.text());
      } else {
        setOutput('Error shortening URL');
      }
    } catch (e) {
      setOutput('Failed to connect to shortener service');
    }
    setLoading(false);
  };

  const Icon = tool.icon;

  return (
    <div className="max-w-5xl mx-auto py-8">
      <div className="bg-white dark:bg-gray-800 dark:bg-gray-800 rounded-3xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] dark:shadow-none border-b-4 border-gray-100 dark:border-gray-900 overflow-hidden relative transition-colors duration-200">
        <div className="p-8 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-800 flex justify-between items-start sm:items-center flex-col sm:flex-row gap-4 transition-colors duration-200">
          <div className="flex items-center">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-2xl flex items-center justify-center mr-6 shadow-[0_8px_16px_-6px_rgba(99,102,241,0.6)] border border-white/20">
              <Icon className="w-8 h-8 drop-shadow-md" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-gray-900 dark:text-white dark:text-white mb-1 tracking-tight">{tool.title} Interface</h2>
              <p className="text-gray-500 dark:text-gray-400 dark:text-gray-400 font-medium text-sm">Enter your values below</p>
            </div>
          </div>
          
          {onToggleFavorite && (
            <button 
              onClick={onToggleFavorite}
              className={`flex items-center px-5 py-3 rounded-xl font-bold transition-all shadow-sm border ${
                isFavorite 
                ? 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 border-red-100 dark:border-red-900/50 hover:bg-red-100 dark:hover:bg-red-900/50' 
                : 'bg-white dark:bg-gray-800 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 dark:border-gray-700 hover:bg-gray-50 dark:bg-gray-900 dark:hover:bg-gray-700'
              }`}
            >
              <Heart className={`w-5 h-5 mr-2 ${isFavorite ? 'fill-red-500' : ''}`} />
              {isFavorite ? 'Saved' : 'Save Tool'}
            </button>
          )}
        </div>

        <div className="p-8">
          {/* TEXT TOOLS */}
          {tool.type === 'text' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">Input text</label>
                <textarea
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  className="w-full h-72 p-5 bg-gray-50 dark:bg-gray-900 border-2 border-transparent focus:border-indigo-500 rounded-2xl shadow-inner transition-all resize-none outline-none text-gray-800"
                  placeholder="Type or paste your text here..."
                />
              </div>
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="block text-sm font-bold text-gray-700">Result output</label>
                  <button onClick={() => handleCopy()} className="text-indigo-600 hover:text-indigo-800 flex items-center text-sm font-bold bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors">
                    {copied ? <Check className="w-4 h-4 mr-1" /> : <Copy className="w-4 h-4 mr-1" />}
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <textarea
                  readOnly
                  value={output.toString()}
                  className="w-full h-72 p-5 bg-gray-900 border-2 border-gray-800 rounded-2xl text-green-400 font-mono text-sm resize-none shadow-inner outline-none selection:bg-indigo-500"
                  placeholder="Output will appear here..."
                />
              </div>
            </div>
          )}

          {/* GENERATORS */}
          {tool.type === 'generator' && (
            <div className="flex flex-col items-center py-12">
              <div className="w-full max-w-2xl bg-gray-900 border-4 border-gray-800 rounded-3xl p-10 mb-10 text-center relative group shadow-2xl">
                <span className="text-4xl md:text-5xl font-mono font-bold text-green-400 break-all drop-shadow-[0_0_8px_rgba(74,222,128,0.5)]">
                  {output}
                </span>
                <button 
                  onClick={() => handleCopy()}
                  className="absolute top-4 right-4 p-3 bg-gray-800 rounded-xl shadow-lg text-gray-400 hover:text-white opacity-0 group-hover:opacity-100 transition-all border border-gray-700"
                  title="Copy to clipboard"
                >
                  {copied ? <Check className="w-6 h-6 text-green-400" /> : <Copy className="w-6 h-6" />}
                </button>
              </div>
              <button
                onClick={() => setOutput(tool.action())}
                className="px-10 py-5 bg-indigo-600 text-white text-lg rounded-2xl font-extrabold hover:bg-indigo-700 transition-all shadow-[0_8px_20px_-6px_rgba(79,70,229,0.5)] hover:-translate-y-1 active:translate-y-0"
              >
                Generate Another
              </button>
            </div>
          )}

          {/* CALCULATORS */}
          {tool.type === 'calculator' && tool.inputs && (
            <div className="max-w-lg mx-auto py-8">
              <div className="space-y-6 mb-10">
                {tool.inputs.map((input) => (
                  <div key={input.name}>
                    <label className="block text-sm font-bold text-gray-700 mb-3">{input.label}</label>
                    <input
                      type="number"
                      value={calcInputs[input.name] === undefined ? '' : calcInputs[input.name]}
                      onChange={(e) => setCalcInputs({ ...calcInputs, [input.name]: parseFloat(e.target.value) || 0 })}
                      className="block w-full px-5 py-4 bg-gray-50 dark:bg-gray-900 border-2 border-transparent focus:border-indigo-500 rounded-2xl shadow-inner transition-all text-gray-900 dark:text-white font-bold outline-none text-lg"
                      placeholder="Enter value..."
                    />
                  </div>
                ))}
              </div>
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-8 text-center relative shadow-[0_10px_30px_-10px_rgba(99,102,241,0.6)] border border-white/20">
                <span className="block text-sm font-bold text-indigo-100 mb-2 uppercase tracking-widest">Result</span>
                <span className="text-4xl font-extrabold text-white drop-shadow-md">{output || '-'}</span>
                {output && (
                   <button 
                   onClick={() => handleCopy()}
                   className="absolute top-4 right-4 p-2 bg-white dark:bg-gray-800/20 rounded-xl hover:bg-white dark:bg-gray-800/30 transition-colors"
                 >
                   {copied ? <Check className="w-5 h-5 text-white" /> : <Copy className="w-5 h-5 text-white" />}
                 </button>
                )}
              </div>
            </div>
          )}

          {/* URL SHORTENER */}
          {tool.type === 'url_shortener' && (
            <div className="max-w-2xl mx-auto py-8 text-center">
              <label className="block text-sm font-bold text-gray-700 mb-3">Paste your long URL here</label>
              <input
                type="url"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                className="w-full px-5 py-5 bg-gray-50 dark:bg-gray-900 border-2 border-transparent focus:border-indigo-500 rounded-2xl shadow-inner transition-all text-gray-900 dark:text-white font-medium outline-none text-lg mb-6"
                placeholder="https://very-long-url.com/..."
              />
              <button
                onClick={handleShortenUrl}
                disabled={loading || !textInput}
                className="w-full px-8 py-5 bg-indigo-600 disabled:bg-indigo-300 text-white rounded-2xl font-extrabold hover:bg-indigo-700 transition-all shadow-md mb-8"
              >
                {loading ? 'Shortening...' : 'Shorten URL'}
              </button>

              {output && (
                <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-6 flex flex-col items-center">
                  <span className="text-sm font-bold text-green-700 mb-2">Your Shortened URL:</span>
                  <a href={output.toString()} target="_blank" rel="noreferrer" className="text-xl font-bold text-indigo-600 hover:underline mb-4 flex items-center">
                    {output} <ExternalLink className="w-4 h-4 ml-2" />
                  </a>
                  <button onClick={() => handleCopy()} className="px-6 py-2 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-colors shadow-sm">
                    {copied ? 'Copied!' : 'Copy to Clipboard'}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* HTML VIEWER */}
          {tool.type === 'html_viewer' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">HTML/CSS/JS Code</label>
                <textarea
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  className="w-full h-[500px] p-5 bg-gray-900 border-2 border-gray-800 rounded-2xl shadow-inner transition-all resize-none outline-none text-green-400 font-mono text-sm selection:bg-indigo-500"
                  placeholder={`<style>\n  h1 { color: blue; }\n</style>\n\n<h1>Hello World!</h1>`}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">Live Preview</label>
                <div className="w-full h-[500px] bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden shadow-inner">
                  <iframe 
                    srcDoc={textInput || '<html><body><h3 style="color:#9ca3af;font-family:sans-serif;text-align:center;margin-top:50px;">Preview will appear here</h3></body></html>'}
                    title="Live Preview" 
                    className="w-full h-full border-0" 
                    sandbox="allow-scripts"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TEXT TO FILE */}
          {tool.type === 'text_to_file' && (
            <div className="max-w-3xl mx-auto py-6">
              <label className="block text-sm font-bold text-gray-700 mb-3">Code / Text Content</label>
              <textarea
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                className="w-full h-72 p-5 bg-gray-900 border-2 border-gray-800 rounded-2xl text-green-400 font-mono text-sm resize-none shadow-inner outline-none mb-6"
                placeholder="Type or paste your code/text here..."
              />
              <div className="flex flex-col sm:flex-row gap-4">
                <select
                  value={selectedExt}
                  onChange={(e) => setSelectedExt(e.target.value)}
                  className="flex-1 px-5 py-4 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 focus:border-indigo-500 rounded-2xl outline-none font-bold text-gray-700"
                >
                  <option value=".html">HTML Document (.html)</option>
                  <option value=".css">CSS Stylesheet (.css)</option>
                  <option value=".js">JavaScript File (.js)</option>
                  <option value=".json">JSON File (.json)</option>
                  <option value=".txt">Plain Text (.txt)</option>
                  <option value=".md">Markdown (.md)</option>
                </select>
                <button
                  onClick={() => {
                    if (!textInput) return;
                    const blob = new Blob([textInput], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `document${selectedExt}`;
                    a.click();
                  }}
                  className="flex-1 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-extrabold hover:bg-indigo-700 transition-all shadow-[0_8px_20px_-6px_rgba(79,70,229,0.5)] hover:-translate-y-1"
                >
                  Download File
                </button>
              </div>
            </div>
          )}

          {/* IMAGE HOSTING (ImgBB) */}
          {tool.type === 'image_hosting' && (
            <div className="max-w-2xl mx-auto py-8 text-center">
              <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 mb-8 text-left">
                <h3 className="text-lg font-bold text-indigo-900 mb-2">Upload Image to ImgBB</h3>
                <p className="text-indigo-700 text-sm">
                  Upload any image and instantly get a direct link, HTML embed code, or Markdown link to share anywhere. Images are hosted securely on ImgBB.
                </p>
              </div>

              {!output ? (
                <div className={`border-4 border-dashed border-indigo-200 bg-indigo-50/50 rounded-3xl p-10 mb-8 hover:bg-indigo-50 transition-colors relative ${loading ? 'opacity-50 pointer-events-none' : ''}`}>
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      setLoading(true);
                      try {
                        const formData = new FormData();
                        formData.append('image', file);
                        const res = await fetch('https://api.imgbb.com/1/upload?key=b9508cf7b899d9f12a11018d72c711ad', {
                          method: 'POST',
                          body: formData
                        });
                        const data = await res.json();
                        if (data.success) {
                          setOutput(data.data.url);
                        } else {
                          alert('Upload failed: ' + (data.error?.message || 'Unknown error'));
                        }
                      } catch (err) {
                        alert('Upload failed. Check your connection.');
                      }
                      setLoading(false);
                    }}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="pointer-events-none">
                    <div className="w-20 h-20 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                      {loading ? (
                        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <Icon className="w-10 h-10 text-indigo-500" />
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-indigo-900 mb-2">{loading ? 'Uploading...' : 'Drop your image here'}</h3>
                    <p className="text-indigo-600 font-medium">{loading ? 'Please wait while we host your image.' : 'or click to browse from your device'}</p>
                  </div>
                </div>
              ) : (
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-3xl p-8 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.1)] text-left">
                  <p className="text-green-600 font-bold mb-4 text-lg text-center">Image Uploaded Successfully!</p>
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-4 mb-6 text-center border border-gray-100">
                    <img src={output.toString()} alt="Uploaded" className="max-h-64 object-contain rounded-lg shadow-sm mx-auto" />
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Direct URL</label>
                      <div className="flex">
                        <input type="text" readOnly value={output.toString()} className="flex-1 px-4 py-3 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-l-xl outline-none font-medium text-gray-800" />
                        <button onClick={() => handleCopy(output.toString())} className="px-5 py-3 bg-indigo-600 text-white rounded-r-xl font-bold hover:bg-indigo-700 transition-colors">Copy</button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">HTML Code</label>
                      <div className="flex">
                        <input type="text" readOnly value={`<img src="${output.toString()}" alt="image" border="0">`} className="flex-1 px-4 py-3 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-l-xl outline-none font-medium text-gray-800" />
                        <button onClick={() => handleCopy(`<img src="${output.toString()}" alt="image" border="0">`)} className="px-5 py-3 bg-indigo-600 text-white rounded-r-xl font-bold hover:bg-indigo-700 transition-colors">Copy</button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Markdown</label>
                      <div className="flex">
                        <input type="text" readOnly value={`![image](${output.toString()})`} className="flex-1 px-4 py-3 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-l-xl outline-none font-medium text-gray-800" />
                        <button onClick={() => handleCopy(`![image](${output.toString()})`)} className="px-5 py-3 bg-indigo-600 text-white rounded-r-xl font-bold hover:bg-indigo-700 transition-colors">Copy</button>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => setOutput('')} className="mt-8 w-full px-6 py-4 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors">
                    Upload Another Image
                  </button>
                </div>
              )}
            </div>
          )}

          {/* PDF TOOL */}
          {tool.type === 'text_to_pdf' && (
            <div className="max-w-2xl mx-auto py-6">
              <label className="block text-sm font-bold text-gray-700 mb-3">Text Content</label>
              <textarea
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                className="w-full h-72 p-5 bg-gray-50 dark:bg-gray-900 border-2 border-transparent focus:border-indigo-500 rounded-2xl shadow-inner transition-all resize-none outline-none text-gray-800 mb-6"
                placeholder="Type your content here..."
              />
              <button
                onClick={async () => {
                  if (!textInput) return;
                  const { jsPDF } = await import('jspdf');
                  const doc = new jsPDF();
                  const lines = doc.splitTextToSize(textInput, 180);
                  doc.text(lines, 15, 20);
                  doc.save('document.pdf');
                }}
                className="w-full px-8 py-5 bg-red-600 text-white rounded-2xl font-extrabold hover:bg-red-700 transition-all shadow-[0_8px_20px_-6px_rgba(220,38,38,0.5)] hover:-translate-y-1"
              >
                Generate & Download PDF
              </button>
            </div>
          )}

          {/* IMAGE TOOLS (Compressor/Converter) */}
          {(tool.type === 'image_compressor' || tool.type === 'image_converter') && (
            <div className="max-w-2xl mx-auto py-10 text-center">
              <div className="border-4 border-dashed border-indigo-200 bg-indigo-50/50 rounded-3xl p-10 mb-8 hover:bg-indigo-50 transition-colors relative">
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setOutput(''); 
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      const img = new Image();
                      img.onload = () => {
                        const canvas = document.createElement('canvas');
                        canvas.width = img.width;
                        canvas.height = img.height;
                        const ctx = canvas.getContext('2d');
                        ctx?.drawImage(img, 0, 0);
                        
                        if (tool.type === 'image_compressor') {
                          setOutput(canvas.toDataURL('image/jpeg', 0.5));
                        } else {
                          (window as any)._tempCanvas = canvas;
                        }
                      };
                      if (event.target?.result) img.src = event.target.result as string;
                    };
                    reader.readAsDataURL(file);
                  }}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="pointer-events-none">
                  <div className="w-20 h-20 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                    <Icon className="w-10 h-10 text-indigo-500" />
                  </div>
                  <h3 className="text-xl font-bold text-indigo-900 mb-2">Drop your image here</h3>
                  <p className="text-indigo-600 font-medium">or click to browse from your device</p>
                </div>
              </div>

              {tool.type === 'image_converter' && (
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                  <span className="font-bold text-gray-700">Convert to:</span>
                  <select 
                    className="px-6 py-3 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-indigo-500 text-gray-700 font-bold outline-none shadow-sm"
                    onChange={(e) => {
                      const format = e.target.value;
                      const canvas = (window as any)._tempCanvas;
                      if (canvas && format) {
                        setOutput(canvas.toDataURL(format));
                        (window as any)._tempFormat = format.split('/')[1];
                      }
                    }}
                  >
                    <option value="">Select Format</option>
                    <option value="image/png">PNG</option>
                    <option value="image/jpeg">JPG</option>
                    <option value="image/webp">WEBP</option>
                  </select>
                </div>
              )}
              
              {output && typeof output === 'string' && output.startsWith('data:image') && (
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-3xl p-8 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.1)]">
                  <p className="text-green-600 font-bold mb-4 text-lg">Image Ready!</p>
                  <div className="bg-gray-100 rounded-2xl p-4 mb-6 inline-block">
                    <img src={output} alt="Processed" className="max-h-64 object-contain rounded-lg shadow-sm" />
                  </div>
                  <a 
                    href={output} 
                    download={`processed-image.${tool.type === 'image_converter' ? ((window as any)._tempFormat || 'png') : 'jpg'}`}
                    className="block w-full px-8 py-5 bg-indigo-600 text-white rounded-2xl font-extrabold hover:bg-indigo-700 transition-all shadow-[0_8px_20px_-6px_rgba(79,70,229,0.5)] hover:-translate-y-1"
                  >
                    Download Image
                  </a>
                </div>
              )}
            </div>
          )}
          {/* PWA GENERATOR */}
          {tool.type === 'pwa_generator' && (
            <div className="max-w-3xl mx-auto py-8">
              <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 mb-8">
                <h3 className="text-lg font-bold text-indigo-900 mb-2">Build a Progressive Web App (PWA)</h3>
                <p className="text-indigo-700 text-sm">
                  Browser directly <strong>APK file generate nahi kar sakta</strong> kyunke uske liye Android SDK aur Java/Kotlin compilers chahiye hote hain jo server ya PC par run hote hain. 
                  <br/><br/>
                  Lekin aap apni HTML/JS/CSS site ko <strong>PWA (Progressive Web App)</strong> bana sakte hain! PWA aapki website ko mobile me install hone wali app me convert kar deta hai jo bilkul native app ki tarah chalti hai. Yahan details daalein aur zip download karein.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">App Name</label>
                  <input
                    type="text"
                    value={pwaData.name}
                    onChange={e => setPwaData({...pwaData, name: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border-2 border-transparent focus:border-indigo-500 rounded-xl outline-none font-medium text-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Short Name (for Home Screen)</label>
                  <input
                    type="text"
                    value={pwaData.shortName}
                    onChange={e => setPwaData({...pwaData, shortName: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border-2 border-transparent focus:border-indigo-500 rounded-xl outline-none font-medium text-gray-800"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Theme Color</label>
                  <div className="flex items-center gap-4">
                    <input
                      type="color"
                      value={pwaData.color}
                      onChange={e => setPwaData({...pwaData, color: e.target.value})}
                      className="w-14 h-14 rounded-xl cursor-pointer border-0"
                    />
                    <span className="font-mono text-gray-600">{pwaData.color}</span>
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Your HTML/JS/CSS Code</label>
                  <textarea
                    value={pwaData.html}
                    onChange={e => setPwaData({...pwaData, html: e.target.value})}
                    className="w-full h-64 p-5 bg-gray-900 border-2 border-gray-800 rounded-2xl shadow-inner text-green-400 font-mono text-sm resize-none outline-none selection:bg-indigo-500"
                    placeholder="<html>..."
                  />
                </div>
              </div>

              <button
                onClick={async () => {
                  setLoading(true);
                  try {
                    const JSZip = (await import('jszip')).default;
                    const zip = new JSZip();
                    
                    // 1. Generate index.html
                    let htmlContent = pwaData.html;
                    if (!htmlContent.includes('<head>')) {
                      htmlContent = `<!DOCTYPE html>\n<html lang="en">\n<head>\n<meta charset="UTF-8">\n<meta name="viewport" content="width=device-width, initial-scale=1.0">\n<title>${pwaData.name}</title>\n<link rel="manifest" href="manifest.json">\n<meta name="theme-color" content="${pwaData.color}">\n</head>\n<body>\n${htmlContent}\n<script>\nif ('serviceWorker' in navigator) {\n  navigator.serviceWorker.register('sw.js');\n}\n</script>\n</body>\n</html>`;
                    } else if (!htmlContent.includes('manifest.json')) {
                       htmlContent = htmlContent.replace('</head>', `  <link rel="manifest" href="manifest.json">\n  <meta name="theme-color" content="${pwaData.color}">\n</head>`);
                       htmlContent = htmlContent.replace('</body>', `  <script>\n  if ('serviceWorker' in navigator) {\n    navigator.serviceWorker.register('sw.js');\n  }\n  </script>\n</body>`);
                    }
                    zip.file("index.html", htmlContent);

                    // 2. Generate manifest.json
                    const manifest = {
                      name: pwaData.name,
                      short_name: pwaData.shortName,
                      start_url: ".",
                      display: "standalone",
                      background_color: "#ffffff",
                      theme_color: pwaData.color,
                      icons: [
                        {
                          src: "https://via.placeholder.com/192/4f46e5/ffffff?text=Icon",
                          sizes: "192x192",
                          type: "image/png"
                        },
                        {
                          src: "https://via.placeholder.com/512/4f46e5/ffffff?text=Icon",
                          sizes: "512x512",
                          type: "image/png"
                        }
                      ]
                    };
                    zip.file("manifest.json", JSON.stringify(manifest, null, 2));

                    // 3. Generate service worker (sw.js)
                    const swCode = `
const CACHE_NAME = 'pwa-cache-v1';
const urlsToCache = [ '/', '/index.html', '/manifest.json' ];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache)));
});
self.addEventListener('fetch', event => {
  event.respondWith(caches.match(event.request).then(response => response || fetch(event.request)));
});
                    `.trim();
                    zip.file("sw.js", swCode);

                    // 4. Generate & Download Zip
                    const content = await zip.generateAsync({ type: "blob" });
                    const url = URL.createObjectURL(content);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `${pwaData.shortName.toLowerCase().replace(/\s+/g, '-')}-pwa.zip`;
                    a.click();
                  } catch (e) {
                    console.error(e);
                  }
                  setLoading(false);
                }}
                disabled={loading}
                className="w-full px-8 py-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-extrabold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:-translate-y-1 flex items-center justify-center disabled:opacity-70"
              >
                <Download className="w-5 h-5 mr-2" />
                {loading ? 'Generating...' : 'Download PWA Zip'}
              </button>
            </div>
          )}

          {/* WEB TO APP (Android Studio Project) */}
          {tool.type === 'web_to_app' && (
            <div className="max-w-3xl mx-auto py-8">
              <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 mb-8">
                <h3 className="text-lg font-bold text-indigo-900 mb-2">Generate Android Studio App Project</h3>
                <p className="text-indigo-700 text-sm">
                  Convert your website link into a native Android application! This will generate a ready-to-build Android Studio project containing a WebView. Extract the zip, open it in Android Studio, and click "Build APK" to get your app.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6 mb-8">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Website URL</label>
                  <input
                    type="url"
                    value={webAppConfig.url}
                    onChange={e => setWebAppConfig({...webAppConfig, url: e.target.value})}
                    className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-900 border-2 border-transparent focus:border-indigo-500 rounded-xl outline-none font-medium text-gray-800"
                    placeholder="https://mywebsite.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">App Name</label>
                  <input
                    type="text"
                    value={webAppConfig.name}
                    onChange={e => setWebAppConfig({...webAppConfig, name: e.target.value})}
                    className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-900 border-2 border-transparent focus:border-indigo-500 rounded-xl outline-none font-medium text-gray-800"
                    placeholder="My Store App"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">App Package Name</label>
                  <input
                    type="text"
                    value={webAppConfig.pkg}
                    onChange={e => setWebAppConfig({...webAppConfig, pkg: e.target.value})}
                    className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-900 border-2 border-transparent focus:border-indigo-500 rounded-xl outline-none font-medium text-gray-800"
                    placeholder="com.myname.app"
                  />
                </div>
              </div>

              <button
                onClick={async () => {
                  setLoading(true);
                  try {
                    const JSZip = (await import('jszip')).default;
                    const zip = new JSZip();
                    const packagePath = webAppConfig.pkg.replace(/\./g, '/');

                    // Readme instructions
                    zip.file("README.md", `# ${webAppConfig.name} - Android App Source\n\n1. Download and install Android Studio.\n2. Extract this ZIP file.\n3. Open Android Studio -> Select "Open" -> Choose this extracted folder.\n4. Wait for Gradle to sync.\n5. In the top menu, go to Build -> Build Bundle(s) / APK(s) -> Build APK(s).\n6. Locate your generated APK and install it on your phone!`);

                    // Main Activity Java
                    const javaCode = `package ${webAppConfig.pkg};

import android.annotation.SuppressLint;
import android.os.Bundle;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import androidx.appcompat.app.AppCompatActivity;

public class MainActivity extends AppCompatActivity {
    private WebView webView;

    @SuppressLint("SetJavaScriptEnabled")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        webView = findViewById(R.id.webview);
        WebSettings webSettings = webView.getSettings();
        webSettings.setJavaScriptEnabled(true);
        webSettings.setDomStorageEnabled(true);
        
        webView.setWebViewClient(new WebViewClient());
        webView.loadUrl("${webAppConfig.url}");
    }

    @Override
    public void onBackPressed() {
        if (webView.canGoBack()) {
            webView.goBack();
        } else {
            super.onBackPressed();
        }
    }
}`;
                    zip.file(`app/src/main/java/${packagePath}/MainActivity.java`, javaCode);

                    // layout XML
                    const layoutXml = `<?xml version="1.0" encoding="utf-8"?>
<WebView xmlns:android="http://schemas.android.com/apk/res/android"
    android:id="@+id/webview"
    android:layout_width="match_parent"
    android:layout_height="match_parent" />`;
                    zip.file("app/src/main/res/layout/activity_main.xml", layoutXml);

                    // AndroidManifest
                    const manifestXml = `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="${webAppConfig.pkg}">
    
    <uses-permission android:name="android.permission.INTERNET" />
    
    <application
        android:allowBackup="true"
        android:label="${webAppConfig.name}"
        android:supportsRtl="true"
        android:theme="@style/Theme.AppCompat.Light.NoActionBar">
        <activity
            android:name=".MainActivity"
            android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>`;
                    zip.file("app/src/main/AndroidManifest.xml", manifestXml);

                    // build.gradle (app)
                    const appBuildGradle = `plugins {
    id 'com.android.application'
}

android {
    namespace '${webAppConfig.pkg}'
    compileSdk 34

    defaultConfig {
        applicationId "${webAppConfig.pkg}"
        minSdk 24
        targetSdk 34
        versionCode 1
        versionName "1.0"
    }
    buildTypes {
        release {
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
    compileOptions {
        sourceCompatibility JavaVersion.VERSION_1_8
        targetCompatibility JavaVersion.VERSION_1_8
    }
}

dependencies {
    implementation 'androidx.appcompat:appcompat:1.6.1'
    implementation 'com.google.android.material:material:1.11.0'
}`;
                    zip.file("app/build.gradle", appBuildGradle);

                    // build.gradle (project)
                    const projectBuildGradle = `plugins {
    id 'com.android.application' version '8.2.2' apply false
}`;
                    zip.file("build.gradle", projectBuildGradle);

                    // settings.gradle
                    zip.file("settings.gradle", `rootProject.name = "${webAppConfig.name}"\ninclude ':app'`);

                    // gradle wrapper properties
                    zip.file("gradle/wrapper/gradle-wrapper.properties", `distributionBase=GRADLE_USER_HOME\ndistributionPath=wrapper/dists\ndistributionUrl=https\\://services.gradle.org/distributions/gradle-8.2-bin.zip\nzipStoreBase=GRADLE_USER_HOME\nzipStorePath=wrapper/dists`);

                    const content = await zip.generateAsync({ type: "blob" });
                    const url = URL.createObjectURL(content);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `${webAppConfig.name.replace(/\\s+/g, '')}AppSource.zip`;
                    a.click();
                  } catch (e) {
                    console.error(e);
                  }
                  setLoading(false);
                }}
                disabled={loading || !webAppConfig.url}
                className="w-full px-8 py-5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl font-extrabold hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg hover:-translate-y-1 flex items-center justify-center disabled:opacity-70"
              >
                <Download className="w-5 h-5 mr-2" />
                {loading ? 'Generating Project...' : 'Download Android Studio Project'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
