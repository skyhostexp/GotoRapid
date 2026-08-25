import React, { useState } from 'react';
import { 
  X, 
  Send, 
  Headphones, 
  MessageSquare, 
  ShieldCheck, 
  Zap, 
  Phone, 
  HelpCircle,
  ExternalLink
} from 'lucide-react';
import { FAQS } from '../data/faqs';

interface LiveSupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  time: string;
}

export const LiveSupportModal: React.FC<LiveSupportModalProps> = ({
  isOpen,
  onClose
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'bot',
      text: 'Hello! Welcome to GoToRapid 24/7 Concierge Support. How can we assist you today with Bank Accounts, Crypto Exchanges, SMM, or 5-Star Reviews?',
      time: 'Just now'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [activeTab, setActiveTab] = useState<'chat' | 'faqs'>('chat');

  if (!isOpen) return null;

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: inputText,
      time: 'Just now'
    };

    setMessages((prev) => [...prev, userMsg]);
    const query = inputText.toLowerCase();
    setInputText('');

    // Generate responsive bot answer based on keywords
    setTimeout(() => {
      let botReply = "Thank you for reaching out! Our dispatch team monitors orders 24/7. You can also message our senior technical operator on Telegram: @Go2Rapid for immediate assistance.";

      if (query.includes('bank') || query.includes('wise') || query.includes('revolut') || query.includes('mercury') || query.includes('stripe')) {
        botReply = "All bank accounts (Wise, Revolut, Mercury US, Stripe) include full original KYC IDs, proof of address, 2FA recovery seeds, and pre-configured Dolphin{anty} / AdsPower residential proxy profiles. Delivery takes ~15 minutes.";
      } else if (query.includes('crypto') || query.includes('binance') || query.includes('bybit') || query.includes('kraken')) {
        botReply = "Our crypto exchange accounts are Level 2/Plus KYC verified with $1M-$2M daily withdrawal limits. You receive full ownership of the primary email and Google 2FA secret strings.";
      } else if (query.includes('smm') || query.includes('follower') || query.includes('instagram') || query.includes('tiktok') || query.includes('twitter')) {
        botReply = "We provide both aged high-trust accounts (2012-2020 with OGE) and automated SMM growth services. All follower/growth packages come with a 365-day non-drop auto-refill warranty.";
      } else if (query.includes('review') || query.includes('trustpilot') || query.includes('google')) {
        botReply = "Our reviews are posted from established Google Local Guides (Level 4-8) and verified Trustpilot buyer accounts using geo-targeted residential IPs. We pace delivery 1-2 reviews/day with a 60-90 day replacement warranty.";
      } else if (query.includes('warranty') || query.includes('replacement') || query.includes('safe')) {
        botReply = "Every purchase has a 30 to 90-day escrow replacement warranty. If an account encounters any security lock under our standard warmup guidelines, we replace it immediately.";
      }

      const replyMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: botReply,
        time: 'Just now'
      };
      setMessages((prev) => [...prev, replyMsg]);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        id="live-support-modal"
        className="relative w-full max-w-xl h-[600px] max-h-[90vh] flex flex-col rounded-3xl bg-[#0c1220] border border-slate-700/80 shadow-2xl overflow-hidden text-slate-100"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="relative">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Headphones className="w-5 h-5" />
              </div>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 absolute -top-0.5 -right-0.5 border-2 border-[#0c1220] animate-pulse"></span>
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">GoToRapid 24/7 Concierge Support</h3>
              <span className="text-[11px] text-emerald-400 font-medium flex items-center">
                ● Live Senior Support Operators Online
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Links Bar */}
        <div className="px-6 py-2.5 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between text-xs">
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab('chat')}
              className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
                activeTab === 'chat' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              Live Chat
            </button>
            <button
              onClick={() => setActiveTab('faqs')}
              className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
                activeTab === 'faqs' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              Instant FAQs
            </button>
          </div>

          <a
            href="https://t.me/Go2Rapid"
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-400 hover:text-cyan-300 font-bold flex items-center space-x-1"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Telegram @Go2Rapid</span>
          </a>
        </div>

        {/* Tab Content */}
        {activeTab === 'chat' ? (
          <div className="flex-1 flex flex-col justify-between overflow-hidden">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-5 space-y-3.5">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[82%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-emerald-600 text-white rounded-br-none shadow-md'
                        : 'bg-slate-900/90 text-slate-200 border border-slate-800 rounded-bl-none'
                    }`}
                  >
                    {msg.text}
                    <span className="text-[10px] opacity-60 block mt-1 text-right">
                      {msg.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-800 bg-slate-900/90 flex gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ask about delivery speed, bank KYC, crypto limits..."
                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center space-x-1.5 transition cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send</span>
              </button>
            </form>
          </div>
        ) : (
          /* FAQs Tab */
          <div className="flex-1 overflow-y-auto p-5 space-y-3">
            {FAQS.map((faq) => (
              <div key={faq.id} className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1.5">
                <h4 className="text-xs font-bold text-emerald-400">
                  {faq.question}
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
