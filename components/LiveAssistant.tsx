
import React, { useState, useRef, useEffect } from 'react';
import { getNeuralClient, decodeBase64, encodeAudio, decodeAudioData } from '../services/neuralService';
import { LiveServerMessage, Modality, Blob } from '@google/genai';

const LiveAssistant: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [status, setStatus] = useState("Ready to talk");
  const [transcriptions, setTranscriptions] = useState<{role: string, text: string}[]>([]);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const sessionRef = useRef<any>(null);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const nextStartTimeRef = useRef<number>(0);

  const startSession = async () => {
    try {
      setIsConnecting(true);
      setStatus("Establishing Secure Link...");
      
      const engine = getNeuralClient();
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const sessionPromise = engine.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            setStatus("Listening...");
            setIsActive(true);
            setIsConnecting(false);
            
            // Setup Microphone Stream
            const source = audioContextRef.current!.createMediaStreamSource(stream);
            const scriptProcessor = audioContextRef.current!.createScriptProcessor(4096, 1, 1);
            
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const l = inputData.length;
              const int16 = new Int16Array(l);
              for (let i = 0; i < l; i++) {
                int16[i] = inputData[i] * 32768;
              }
              const pcmBlob: Blob = {
                data: encodeAudio(new Uint8Array(int16.buffer)),
                mimeType: 'audio/pcm;rate=16000',
              };
              
              sessionPromise.then(session => {
                session.sendRealtimeInput({ media: pcmBlob });
              });
            };
            
            source.connect(scriptProcessor);
            scriptProcessor.connect(audioContextRef.current!.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            // Handle Audio Out
            const audioData = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (audioData && outputAudioContextRef.current) {
              const ctx = outputAudioContextRef.current;
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
              const buffer = await decodeAudioData(decodeBase64(audioData), ctx, 24000, 1);
              const source = ctx.createBufferSource();
              source.buffer = buffer;
              source.connect(ctx.destination);
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += buffer.duration;
              sourcesRef.current.add(source);
              source.onended = () => sourcesRef.current.delete(source);
            }

            // Handle Transcriptions
            if (message.serverContent?.inputTranscription) {
              setTranscriptions(prev => [...prev.slice(-4), { role: 'You', text: message.serverContent!.inputTranscription!.text }]);
            }
            if (message.serverContent?.outputTranscription) {
               setTranscriptions(prev => [...prev.slice(-4), { role: 'Aether', text: message.serverContent!.outputTranscription!.text }]);
            }

            if (message.serverContent?.interrupted) {
              sourcesRef.current.forEach(s => s.stop());
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }
          },
          onerror: (e) => {
            console.error("Link Error", e);
            stopSession();
          },
          onclose: () => {
            setIsActive(false);
            setStatus("Connection Closed");
          }
        },
        config: {
          responseModalities: [Modality.AUDIO],
          systemInstruction: "You are Aether, a sophisticated real-time operating interface. Keep responses helpful, brief, and professional.",
          inputAudioTranscription: {},
          outputAudioTranscription: {}
        }
      });

      sessionRef.current = await sessionPromise;
    } catch (err) {
      console.error(err);
      setIsConnecting(false);
      setStatus("Failed to connect");
    }
  };

  const stopSession = () => {
    if (sessionRef.current) {
      setIsActive(false);
      setStatus("Ready to talk");
      if (audioContextRef.current) audioContextRef.current.close();
      if (outputAudioContextRef.current) outputAudioContextRef.current.close();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[500px] space-y-8 bg-slate-900 border border-slate-800 rounded-3xl p-10">
      <div className="relative">
        {/* Animated Visualizer Circle */}
        <div className={`w-48 h-48 rounded-full flex items-center justify-center border-4 border-slate-800 relative ${isActive ? 'scale-110 shadow-[0_0_50px_rgba(59,130,246,0.2)]' : ''} transition-all duration-500`}>
          {isActive && (
            <>
              <div className="absolute inset-0 rounded-full border-4 border-blue-500 animate-ping opacity-20"></div>
              <div className="absolute inset-[-10px] rounded-full border border-blue-400/30 animate-pulse"></div>
            </>
          )}
          <div className={`w-32 h-32 rounded-full bg-gradient-to-tr from-slate-800 to-slate-700 flex items-center justify-center shadow-inner overflow-hidden`}>
             <span className="text-4xl">{isActive ? '💠' : '💤'}</span>
          </div>
        </div>
      </div>

      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-white">{status}</h2>
        <p className="text-slate-500 text-sm max-w-md">
          Use the Aether Voice Interface to query system health, perform data analysis, or automate architectural tasks in real-time.
        </p>
      </div>

      <div className="w-full max-w-xl space-y-3">
        {transcriptions.map((t, i) => (
          <div key={i} className={`flex ${t.role === 'You' ? 'justify-end' : 'justify-start'}`}>
            <div className={`px-4 py-2 rounded-2xl max-w-[80%] text-sm ${
              t.role === 'You' 
                ? 'bg-blue-600 text-white rounded-tr-none' 
                : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-tl-none'
            }`}>
              <span className="block text-[10px] font-bold opacity-50 mb-1 uppercase tracking-widest">{t.role}</span>
              {t.text}
            </div>
          </div>
        ))}
      </div>

      <div className="pt-6">
        {!isActive ? (
          <button
            onClick={startSession}
            disabled={isConnecting}
            className="px-8 py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 text-white font-bold rounded-full shadow-lg shadow-blue-900/40 transition-all active:scale-95 flex items-center space-x-3"
          >
            {isConnecting ? (
              <span className="flex items-center space-x-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Linking...</span>
              </span>
            ) : (
              <>
                <span>🎤</span>
                <span>Initialize Voice Link</span>
              </>
            )}
          </button>
        ) : (
          <button
            onClick={stopSession}
            className="px-8 py-4 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-full shadow-lg shadow-rose-900/40 transition-all active:scale-95 flex items-center space-x-3"
          >
            <span>⏹️</span>
            <span>Disconnect Interface</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default LiveAssistant;
