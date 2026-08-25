import React from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Cpu, 
  RefreshCw, 
  CheckCircle, 
  Key, 
  Layers, 
  FileCheck2 
} from 'lucide-react';

export const SafetyGuarantees: React.FC = () => {
  const pillars = [
    {
      icon: Cpu,
      title: 'Anti-Detect Browser Integration',
      badge: 'Zero Hardware Flags',
      desc: 'All accounts are created and initialized on isolated canvas fingerprints. We export ready-to-import profile packages for Dolphin{anty}, AdsPower, and GoLogin with matched browser sessions.',
      color: 'from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30'
    },
    {
      icon: RefreshCw,
      title: '30-90 Day Replacement Warranty',
      badge: '100% Escrow Backed',
      desc: 'Encountered a KYC re-verification checkpoint or sudden action block? Our 24/7 technical team provides instant document refreshes or a brand new replacement free of charge.',
      color: 'from-cyan-500/20 to-blue-500/20 text-cyan-400 border-cyan-500/30'
    },
    {
      icon: Layers,
      title: 'Clean Residential Static IPs',
      badge: 'Dedicated Subnets',
      desc: 'Every account is bound to a high-reputation static ISP residential proxy in its home jurisdiction (USA, UK, Germany, etc.), ensuring the highest trust score with compliance systems.',
      color: 'from-purple-500/20 to-indigo-500/20 text-purple-400 border-purple-500/30'
    },
    {
      icon: Lock,
      title: '256-Bit Encrypted Vault Delivery',
      badge: 'Zero-Knowledge Storage',
      desc: 'Credentials, 2FA recovery seeds, and KYC photo bundles are packaged into an encrypted archive accessible only by your unique master order key, automatically purged after 7 days.',
      color: 'from-amber-500/20 to-yellow-500/20 text-amber-400 border-amber-500/30'
    }
  ];

  return (
    <section className="py-14 border-b border-slate-800/80 bg-slate-950/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>GoToRapid Security Standard</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight font-['Outfit']">
            Institutional-Grade Safety & Reliability
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-2">
            Why high-volume agencies, dropshippers, and crypto traders trust gotorapid.com for digital infrastructure.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {pillars.map((p, idx) => {
            const IconComp = p.icon;
            return (
              <div
                key={idx}
                className="relative rounded-2xl bg-[#0c1220] border border-slate-800/90 p-5 flex flex-col justify-between hover:border-slate-700 transition duration-300 shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-2.5 rounded-xl border ${p.color}`}>
                      <IconComp className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                      {p.badge}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white mb-2">
                    {p.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {p.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/70 flex items-center space-x-1.5 text-[11px] text-emerald-400 font-semibold">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Verified Standard Compliant</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
