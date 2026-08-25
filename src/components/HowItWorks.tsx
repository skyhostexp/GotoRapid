import React from 'react';
import { ShoppingBag, Coins, KeyRound, ShieldAlert, ArrowRight, Zap } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Select Asset or Growth Service',
      desc: 'Choose from verified Bank Accounts (Wise, Revolut), Crypto Exchanges (Binance, Bybit), Aged SMM Accounts (IG, X, TikTok), or customized Reviews Packages.',
      icon: ShoppingBag
    },
    {
      num: '02',
      title: 'Crypto Escrow Checkout',
      desc: 'Pay securely with USDT (TRC-20 / BEP-20), Bitcoin, Ethereum, Solana, or TON. Your payment is held in 24-hour smart escrow until you inspect your vault.',
      icon: Coins
    },
    {
      num: '03',
      title: 'Encrypted Vault Handover',
      desc: 'Within 5-15 minutes, receive your private master decryption key. Download complete login credentials, KYC IDs, 2FA seeds, and browser session profiles.',
      icon: KeyRound
    },
    {
      num: '04',
      title: 'Scale with Warranty Protection',
      desc: 'Follow our included 48-Hour Warmup Protocol. Enjoy full 30 to 90-day replacement warranty backed by our 24/7 Telegram & WhatsApp support team.',
      icon: ShieldAlert
    }
  ];

  return (
    <section className="py-14 border-b border-slate-800/80 bg-[#090d16]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold mb-3">
            <Zap className="w-3.5 h-3.5" />
            <span>Seamless 4-Step Process</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight font-['Outfit']">
            How gotorapid.com Delivers In 15 Mins
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-2">
            Automated dispatch, anti-detect packaging, and zero-friction onboarding.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 relative">
          {steps.map((step, idx) => {
            const IconComp = step.icon;
            return (
              <div
                key={idx}
                className="relative rounded-2xl bg-slate-900/80 border border-slate-800 p-5 flex flex-col justify-between hover:border-emerald-500/40 transition duration-200"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-black font-mono text-emerald-400/80">
                      {step.num}
                    </span>
                    <div className="p-2 rounded-xl bg-slate-800 border border-slate-700 text-emerald-400">
                      <IconComp className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="text-sm font-bold text-white mb-1.5">
                    {step.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                  <span>Step {idx + 1} of 4</span>
                  {idx < 3 && <span className="text-emerald-500 font-bold hidden lg:inline">Next →</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
