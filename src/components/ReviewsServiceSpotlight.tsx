import React, { useState } from 'react';
import { 
  Star, 
  ShieldCheck, 
  MapPin, 
  Smartphone, 
  CheckCircle2, 
  ArrowRight,
  TrendingUp,
  Sparkles,
  Award
} from 'lucide-react';
import { ProductCategory } from '../types';

interface ReviewsServiceSpotlightProps {
  onExploreReviews: () => void;
}

export const ReviewsServiceSpotlight: React.FC<ReviewsServiceSpotlightProps> = ({
  onExploreReviews
}) => {
  const [reputationScore, setReputationScore] = useState<number>(4.8);

  return (
    <section className="py-14 border-b border-slate-800/80 bg-gradient-to-b from-[#0b101c] via-[#0d1627] to-[#0b101c]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Text & Value Proposition */}
          <div className="lg:col-span-6 space-y-5">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>Reviews Service & Reputation Defense</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight font-['Outfit']">
              Dominate Trustpilot & Google Maps with <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-300 to-yellow-400">
                Verified 5-Star Reputation Seeding
              </span>
            </h2>

            <p className="text-sm text-slate-300 leading-relaxed">
              Don't let rogue negative reviews destroy customer conversions. Our agency delivers authentic, sticky 5-Star reviews written by native copywriters and high-tier Google Local Guides using geo-targeted residential IP check-ins.
            </p>

            <div className="space-y-3 pt-1">
              <div className="flex items-start space-x-3 text-xs text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Trustpilot Verified Buyer Badges:</strong> Every review passes fraud filters with valid invoice identifiers.</span>
              </div>
              <div className="flex items-start space-x-3 text-xs text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Google Local Guides Level 4-8:</strong> Mobile GPS coordinates matching your storefront or regional service radius.</span>
              </div>
              <div className="flex items-start space-x-3 text-xs text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Custom Drip Pacing:</strong> 1-2 reviews per day to mirror natural organic customer feedback curves.</span>
              </div>
              <div className="flex items-start space-x-3 text-xs text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>60-90 Day Free Replacement:</strong> If any review drops, our system re-posts an upgraded replacement automatically.</span>
              </div>
            </div>

            <div className="pt-3">
              <button
                id="spotlight-reviews-cta-btn"
                onClick={onExploreReviews}
                className="px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 text-xs sm:text-sm font-extrabold shadow-lg shadow-amber-500/20 flex items-center space-x-2 transition cursor-pointer"
              >
                <span>Browse Reviews Packages</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Interactive TrustScore Impact Visualizer */}
          <div className="lg:col-span-6">
            <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 shadow-2xl space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <Award className="w-5 h-5 text-amber-400" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    Interactive Conversion Multiplier
                  </span>
                </div>
                <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  Live Simulation
                </span>
              </div>

              {/* Trustpilot Mock Card */}
              <div className="p-4 rounded-2xl bg-[#090e18] border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 rounded bg-[#00b67a] flex items-center justify-center font-black text-white text-xs">
                      ★
                    </div>
                    <span className="text-xs font-bold text-white">Trustpilot Score</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-400">Excellent</span>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <div key={s} className="w-6 h-6 bg-[#00b67a] flex items-center justify-center text-white text-xs font-bold rounded-sm">
                        ★
                      </div>
                    ))}
                  </div>
                  <span className="text-2xl font-black text-white font-mono">{reputationScore.toFixed(1)}</span>
                  <span className="text-xs text-slate-400">/ 5.0 (420+ Reviews)</span>
                </div>
              </div>

              {/* Slider for simulated score */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Target Reputation Score:</span>
                  <span className="text-amber-300 font-bold font-mono">{reputationScore.toFixed(1)} Stars</span>
                </div>
                <input
                  type="range"
                  min="3.0"
                  max="5.0"
                  step="0.1"
                  value={reputationScore}
                  onChange={(e) => setReputationScore(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
                />
              </div>

              {/* Impact stats grid */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                  <span className="text-[11px] text-slate-400 block font-medium">Customer Conversion Rate</span>
                  <div className="flex items-center space-x-1 mt-1 text-emerald-400 font-black text-lg font-mono">
                    <TrendingUp className="w-4 h-4" />
                    <span>+{Math.round((reputationScore - 2.5) * 48)}% Lift</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                  <span className="text-[11px] text-slate-400 block font-medium">Google Local 3-Pack SEO</span>
                  <div className="flex items-center space-x-1 mt-1 text-cyan-400 font-black text-lg font-mono">
                    <MapPin className="w-4 h-4" />
                    <span>Top 3 Ranking</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
