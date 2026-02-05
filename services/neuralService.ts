
import { GoogleGenAI, GenerateContentResponse, Type, Modality } from "@google/genai";

const API_KEY = process.env.API_KEY || '';

export const getNeuralClient = () => {
  return new GoogleGenAI({ apiKey: API_KEY });
};

export const analyzeDataStream = async (data: any[]): Promise<string> => {
  const engine = getNeuralClient();
  const response = await engine.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Analyze the following system metrics and provide a concise summary of health and performance: ${JSON.stringify(data)}`,
    config: {
      systemInstruction: "You are a senior SRE. Provide ultra-concise technical insights.",
      temperature: 0.2
    }
  });
  return response.text || "No analysis available.";
};

export const getStructuredInsights = async (metrics: any[]) => {
  const engine = getNeuralClient();
  const response = await engine.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Based on these metrics: ${JSON.stringify(metrics)}, generate 3 specific system insights for improvement.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            content: { type: Type.STRING },
            type: { type: Type.STRING, enum: ['optimization', 'security', 'anomaly'] },
            severity: { type: Type.STRING, enum: ['low', 'medium', 'high'] }
          },
          required: ['title', 'content', 'type', 'severity']
        }
      }
    }
  });
  
  try {
    return JSON.parse(response.text || "[]");
  } catch (e) {
    console.error("Failed to parse system insights", e);
    return [];
  }
};

// Audio Utilities for Live API
export const decodeBase64 = (base64: string) => {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
};

export const encodeAudio = (bytes: Uint8Array) => {
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
};

export async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}
