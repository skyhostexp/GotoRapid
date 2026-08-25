import React from 'react';
import { Star, ShieldCheck, CheckCircle2, MessageSquare, Quote } from 'lucide-react';
import { TESTIMONIALS } from '../data/testimonials';

export const TestimonialsSection: React.FC = () => {
  return (
    <section className="py-14 border-b border-slate-800/80 bg-slate-950/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold mb-3">
            <Star className="w-3.5 h-3.5 fill-emerald-400" />
            <span>Verified Customer Reviews & Feedback</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight font-['Outfit']">
            Trusted by 4,500+ Operators & Agencies Worldwide
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-2">
            Real feedback from founders scaling on gotorapid.com with verified fintech, crypto, and reputation assets.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.id}
              className="rounded-2xl bg-[#0c1220] border border-slate-800 p-5 flex flex-col justify-between hover:border-slate-700 transition shadow-lg"
            >
              <div>
                {/* Rating & Verified Badge */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex space-x-1">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    ))}
                  </div>

                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center space-x-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Verified Buyer</span>
                  </span>
                </div>

                {/* Content */}
                <p className="text-xs text-slate-300 leading-relaxed italic">
                  "{t.content}"
                </p>
              </div>

              {/* Author Footer */}
              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center space-x-3">
                <img
                  src={t.avatar}
                  alt={t.clientName}
                  className="w-9 h-9 rounded-full object-cover border border-emerald-500/30"
                />
                <div>
                  <h4 className="text-xs font-bold text-white">{t.clientName}</h4>
                  <p className="text-[10px] text-slate-400 line-clamp-1">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
