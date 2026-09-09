import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Sparkles, MessageSquare, Minimize2, Check, RefreshCw } from 'lucide-react';
import { LanguageCode } from '../types';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

interface CitizenAIAssistantProps {
  language: LanguageCode;
  citizenName?: string;
  activeWard?: string;
}

export const CitizenAIAssistant: React.FC<CitizenAIAssistantProps> = ({
  language,
  citizenName = 'Citizen',
  activeWard,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-init',
      sender: 'assistant',
      text: `Namaste ${citizenName}! 🙏 I am your Citizen AI Assistant.
I can help you file multi-department complaints (e.g. pothole + street light + garbage), check SLA resolution timelines, locate your administrative ward, and answer any civic grievance questions in your preferred language. How can I help you today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || loading) return;

    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          language,
          complaintContext: {
            citizenName,
            activeWard,
          },
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const botMsg: Message = {
          id: `bot-${Date.now()}`,
          sender: 'assistant',
          text: data.reply || 'Your request has been received. Please let me know if you need more assistance.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, botMsg]);
      } else {
        throw new Error('API failure');
      }
    } catch (err) {
      // Offline fallback
      let fallbackText = '';
      const lower = query.toLowerCase();

      if (lower.includes('pothole') || lower.includes('road')) {
        fallbackText = 'Road potholes and pavement defects are routed to the Public Works Department (PWD). Standard SLA resolution time is 48 hours. Urgent caved-in roads have a 6-hour critical SLA.';
      } else if (lower.includes('water') || lower.includes('sewage') || lower.includes('drain')) {
        fallbackText = 'Water leakages, pipe bursts, and sewage overflows are routed directly to the Water Supply & Sewerage Board. Drinking water pipeline leaks have a 24-hour SLA, and sewage overflow has a 12-hour SLA.';
      } else if (lower.includes('streetlight') || lower.includes('street light') || lower.includes('electricity')) {
        fallbackText = 'Streetlight outages and electrical pole hazards are auto-routed to the Electricity / Power Distribution corporation (DISCOM). Streetlights are replaced within 24 hours; live wires within 2 hours.';
      } else if (lower.includes('garbage') || lower.includes('waste')) {
        fallbackText = 'Garbage accumulation, dead animals, and solid waste overflow are managed by the Municipal Corporation. Routine waste clearing SLA is 12 hours, with mandatory penalty for delayed clearance.';
      } else if (lower.includes('multi') || lower.includes('together') || lower.includes('single')) {
        fallbackText = 'Yes! The Citizen portal allows filing multiple issues in a single submission. For instance, you can type "Deep pothole and broken streetlight near school" and our engine splits it to PWD, Electricity, and Education automatically!';
      } else {
        fallbackText = `Thank you for your question regarding "${query}". You can file this directly in the "File Citizen Complaint" tab, select your Administrative Ward (${activeWard || 'e.g. Ward 3'}), and our auto-routing engine will dispatch it to the right department immediately!`;
      }

      const botMsg: Message = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: fallbackText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMsg]);
    } finally {
      setLoading(false);
    }
  };

  const QUICK_QUESTIONS = [
    'How do I file multiple issues together?',
    'What is the SLA for broken street lights?',
    'How is water contamination handled?',
    'Where do I find my administrative ward?',
  ];

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {/* Chat Window */}
      {isOpen ? (
        <div className="w-[360px] sm:w-[400px] h-[520px] bg-white rounded-2xl shadow-2xl border border-stone-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white p-3.5 flex items-center justify-between shadow-xs">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-sm tracking-wide flex items-center gap-1.5">
                  Citizen AI Assistant
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                </h3>
                <p className="text-[11px] text-amber-100 font-medium">
                  24/7 Civic Governance Virtual Officer
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-1">
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-md text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                title="Minimize"
              >
                <Minimize2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-md text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Context Bar */}
          <div className="bg-amber-50 px-3 py-1.5 border-b border-amber-100 text-[11px] text-amber-900 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-600" />
              Language: <strong className="uppercase">{language}</strong>
            </span>
            {activeWard && (
              <span className="text-[11px] text-amber-700 font-medium">
                Active Ward: <strong>{activeWard}</strong>
              </span>
            )}
          </div>

          {/* Message History */}
          <div className="flex-1 overflow-y-auto p-3.5 space-y-3 bg-stone-50/50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.sender === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed shadow-2xs ${
                    msg.sender === 'user'
                      ? 'bg-amber-600 text-white rounded-br-xs'
                      : 'bg-white border border-stone-200 text-stone-800 rounded-bl-xs whitespace-pre-wrap'
                  }`}
                >
                  {msg.text}
                </div>
                <span className="text-[10px] text-stone-400 mt-1 px-1">
                  {msg.timestamp}
                </span>
              </div>
            ))}

            {loading && (
              <div className="flex items-center space-x-2 text-xs text-stone-500 bg-white border border-stone-200 rounded-xl px-3 py-2 w-fit">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-600" />
                <span>Citizen AI is reviewing civic norms...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick suggestions chips */}
          <div className="p-2 bg-white border-t border-stone-100 flex gap-1.5 overflow-x-auto no-scrollbar">
            {QUICK_QUESTIONS.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q)}
                className="whitespace-nowrap px-2.5 py-1 rounded-full text-[10px] bg-stone-100 text-stone-700 hover:bg-amber-100 hover:text-amber-800 transition-colors border border-stone-200 shrink-0"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <div className="p-2.5 bg-white border-t border-stone-200 flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSend();
              }}
              placeholder="Ask about complaints, wards, or SLA..."
              className="flex-1 bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-800 focus:outline-hidden focus:ring-1 focus:ring-amber-500 focus:bg-white"
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || loading}
              className="p-2 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:opacity-40 text-white shadow-xs transition-colors"
              title="Send"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* Floating Button on bottom-right corner */
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-2.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 border-2 border-white/80 active:scale-95"
          id="citizen-ai-assistant-btn"
          aria-label="Open Citizen AI Assistant"
        >
          <div className="relative">
            <Bot className="w-5 h-5 text-white" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border border-white animate-pulse" />
          </div>
          <span className="text-xs font-bold tracking-wide">
            Citizen AI Assistant
          </span>
        </button>
      )}
    </div>
  );
};
