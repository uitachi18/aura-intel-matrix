"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, ShieldAlert, Play, Pause, ChevronRight, Share2, Search, Info } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface NewsItem {
  id: number;
  title: string;
  source: string;
  url: string;
  image: string;
  summary: string;
}

interface FactCheckResult {
  truth_score: number;
  verdict: string;
  summary: string;
  receipts: { source: string; status: string }[];
}

export default function Home() {
  const [country, setCountry] = useState<string>("us");
  const [news, setNews] = useState<NewsItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [factCheck, setFactCheck] = useState<FactCheckResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const fetchNews = async (selectedCountry: string) => {
      try {
        const res = await fetch(`http://localhost:8001/trending?country=${selectedCountry}`);
        const data = await res.json();
        setNews(data);
        setCurrentIndex(0);
        setFactCheck(null);
        if (isPlaying) {
          audioRef.current?.pause();
          setIsPlaying(false);
        }
      } catch (e) {
        console.error("Failed to fetch news", e);
      }
    };

    fetchNews(country);
    audioRef.current = new Audio();
    audioRef.current.onended = () => setIsPlaying(false);
  }, [country, isPlaying]);

  const checkFacts = async () => {
    if (!news[currentIndex]) return;
    setLoading(true);
    setFactCheck(null);
    try {
      const res = await fetch("http://localhost:8001/fact-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: news[currentIndex].url,
          headline: news[currentIndex].title,
        }),
      });
      const data = await res.json();
      setFactCheck(data);
    } catch (e) {
      console.error("Fact check failed", e);
    } finally {
      setLoading(false);
    }
  };

  const nextStory = () => {
    setCurrentIndex((prev) => (prev + 1) % news.length);
    setFactCheck(null);
    if (isPlaying) {
        audioRef.current?.pause();
        setIsPlaying(false);
    }
  };

  const toggleAudio = async () => {
    if (isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    } else {
      const currentNews = news[currentIndex];
      if (!currentNews && !factCheck) return;
      
      setIsPlaying(true);
      
      const payload = {
        headline: currentNews?.title || "",
        summary: currentNews?.summary || "",
        fact_check_verdict: factCheck ? factCheck.verdict : null,
        fact_check_score: factCheck ? factCheck.truth_score : null,
        fact_check_summary: factCheck ? factCheck.summary : null,
      };

      try {
        const res = await fetch("http://localhost:8001/generate-audio", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        if (audioRef.current) {
          audioRef.current.src = url;
          audioRef.current.play();
        }
      } catch (e) {
        console.error("TTS failed", e);
        setIsPlaying(false);
      }
    }
  };

  return (
    <main className="min-h-screen bg-cyber-bg cyber-grid-bg relative text-white overflow-hidden p-6 md:p-12">
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyber-blue opacity-10 blur-[140px] rounded-full animate-pulse-slow object-none pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyber-pink opacity-10 blur-[140px] rounded-full animate-pulse-slow object-none pointer-events-none" style={{ animationDelay: '2s' }} />

      {/* Futuristic Header */}
      <nav className="flex justify-between items-center mb-12 relative z-50">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-black/40 border-2 border-cyber-blue flex items-center justify-center neon-blue-glow shadow-[0_0_15px_rgba(0,243,255,0.3)]">
            <ShieldCheck className="text-cyber-blue w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-widest uppercase text-glow-blue flex items-center gap-2">
              <span className="text-white/40 font-normal">{'<'}</span>AURACHECK <span className="text-cyber-pink text-glow-pink">AI</span><span className="text-white/40 font-normal">{'>'}</span>
            </h1>
            <p className="text-cyber-blue/60 text-xs tracking-[0.3em] font-medium uppercase mt-1">{'>'} GLOBAL_INTEL_MATRIX</p>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="flex bg-cyber-blue/5 border border-cyber-blue/30 p-1">
            {['us', 'gb', 'ca', 'in'].map((c) => (
              <button
                key={c}
                onClick={() => setCountry(c)}
                className={cn(
                  "px-3 py-1 text-xs font-bold uppercase tracking-widest transition-all border border-transparent",
                  country === c ? "bg-cyber-blue text-black shadow-[0_0_10px_rgba(0,243,255,0.4)]" : "text-white/40 hover:text-cyber-blue hover:border-cyber-blue/30 hover:bg-black/20"
                )}
              >
                [{c}]
              </button>
            ))}
          </div>
          <button className="p-3 glass rounded-none border border-cyber-blue/30 hover:bg-cyber-blue/10 hover:border-cyber-blue text-white/50 hover:text-cyber-blue transition-all">
            <Search className="w-5 h-5" />
          </button>
          <div className="px-4 py-2 glass rounded-none flex items-center gap-3 border border-cyber-blue/50 bg-cyber-blue/10">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyber-blue opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-cyber-blue shadow-[0_0_8px_#00f3ff]"></span>
            </span>
            <span className="text-xs font-bold tracking-widest uppercase text-cyber-blue">Live Sync</span>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch relative z-40">
        {/* Left: Immersive News Card */}
        <div className="lg:col-span-7 h-full">
          <AnimatePresence mode="wait">
            {news.length > 0 && (
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.4, type: "spring", bounce: 0.4 }}
                className="glass border-l-4 border-l-cyber-blue relative h-full min-h-[500px] flex flex-col justify-end overflow-hidden group"
              >
                {/* Image Background */}
                <div className="absolute inset-0 z-0">
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050510] via-[#050510]/80 to-transparent z-10" />
                  <motion.img 
                    src={news[currentIndex].image} 
                    className="w-full h-full object-cover opacity-50"
                    alt="News Background"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  />
                </div>
                
                <div className="relative z-20 p-8 space-y-6">
                  <div className="flex justify-between items-center">
                    <span className="bg-cyber-blue/10 border-l border-b border-cyber-blue text-cyber-blue px-3 py-1 text-xs font-bold uppercase tracking-widest shadow-[0_0_10px_rgba(0,243,255,0.2)]">
                      [{news[currentIndex].source}]
                    </span>
                    <span className="text-white/40 text-xs font-bold font-mono tracking-widest">
                      FILE_ID:{news[currentIndex].id.toString().padStart(4, '0')}
                    </span>
                  </div>
                  
                  <h2 className="text-4xl md:text-5xl font-black leading-tight tracking-tight text-white drop-shadow-2xl">
                    {news[currentIndex].title}
                  </h2>
                  <p className="text-cyber-blue/80 text-lg leading-relaxed max-w-2xl font-medium border-l-2 border-cyber-blue/50 pl-4 bg-black/40 py-2">
                    {'>'} {news[currentIndex].summary}
                  </p>
                
                  <div className="flex gap-4 pt-4 mt-auto">
                    <button 
                      onClick={checkFacts}
                      disabled={loading}
                      className="flex-1 bg-cyber-blue text-[#050510] px-8 py-4 font-black tracking-widest uppercase text-sm hover:bg-white hover:shadow-[0_0_30px_rgba(0,243,255,0.6)] transition-all active:scale-95 disabled:opacity-50 disabled:hover:bg-cyber-blue disabled:hover:shadow-none overflow-hidden relative group border-2 border-transparent hover:border-cyber-blue"
                    >
                      <div className="absolute inset-0 w-full h-full bg-white/20 -skew-x-[45deg] -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                      {loading ? "DECRYPTING_TRUTH..." : "INITIATE_FACT_CHECK"}
                    </button>
                    <button 
                      onClick={nextStory}
                      className="w-14 h-14 flex items-center justify-center glass border border-cyber-blue/50 hover:bg-cyber-blue/20 transition-all text-cyber-blue"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        {/* Right: Fact Check & Audio Panel */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <AnimatePresence>
            {factCheck ? (
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                className="glass p-8 relative overflow-hidden flex-1 group"
              >
                {/* Decorative Tech Lines */}
                <div className="absolute top-0 right-8 w-[1px] h-16 bg-gradient-to-b from-transparent via-cyber-blue to-transparent opacity-50" />
                <div className="absolute bottom-0 left-8 w-16 h-[1px] bg-gradient-to-r from-transparent via-cyber-blue to-transparent opacity-50" />

                <div className="flex justify-between items-start mb-8 border-b border-white/10 pb-6">
                  <div>
                    <h3 className="text-cyber-blue/60 uppercase tracking-widest text-xs font-bold mb-2">{'>'} ANALYSIS_VERDICT</h3>
                    <div className="flex items-center gap-3">
                      <ShieldCheck className={cn("w-8 h-8", factCheck.verdict === "True" ? "text-cyber-blue" : "text-cyber-red")} />
                      <span className={cn(
                        "text-3xl font-black uppercase tracking-widest",
                        factCheck.verdict === "True" ? "text-glow-blue text-white" : "text-glow-pink text-white"
                      )}>
                        [{factCheck.verdict}]
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <h3 className="text-white/40 uppercase tracking-widest text-xs font-bold mb-2">VALIDITY_SCORE {'<'}</h3>
                    <div className="flex items-baseline justify-end gap-1">
                      <span className="text-5xl font-black tracking-widest text-white drop-shadow-lg">
                        {factCheck.truth_score}
                      </span>
                      <span className="text-xl font-black text-cyber-blue">%</span>
                    </div>
                  </div>
                </div>

                <div className="mb-8 relative border border-cyber-blue/20 bg-cyber-blue/5 p-4">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-cyber-blue/50" />
                  <p className="text-sm text-cyber-blue/90 font-medium leading-relaxed pl-2 font-mono">
                    {'>'} {factCheck.summary}
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-white/50 uppercase tracking-widest text-xs font-bold flex items-center gap-2">
                       <Search className="w-3 h-3" /> SOURCES_XREF
                    </h4>
                  </div>
                  {factCheck.receipts.map((r, i) => (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      key={i} 
                      className="flex justify-between items-center p-3 rounded-lg bg-[#050510]/60 border border-white/5 hover:border-cyber-blue/30 transition-colors"
                    >
                      <span className="text-white/80 font-medium text-sm">{r.source}</span>
                      <span className="text-cyber-blue text-[10px] font-black uppercase tracking-widest px-2 py-1 bg-cyber-blue/10 rounded-md">
                        {r.status}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ) : (
              <div className="glass p-8 flex-1 flex flex-col items-center justify-center text-center opacity-40 border-dashed border-2 border-cyber-blue/30">
                 <div className="w-20 h-20 border-2 border-cyber-blue/50 flex items-center justify-center mb-6 neon-blue-glow relative transform rotate-45">
                    <div className="absolute inset-0 border border-cyber-blue animate-[spin_4s_linear_infinite]" />
                    <ShieldAlert className="w-8 h-8 text-cyber-blue transform -rotate-45" />
                 </div>
                <h3 className="text-lg font-bold uppercase tracking-widest text-cyber-blue mb-2">AWAITING_TARGET</h3>
                <p className="text-xs text-white/50 max-w-[200px]">Select a datastream to initiate deep-scan protocol.</p>
              </div>
            )}
          </AnimatePresence>
          {/* Premium Audio Player Component */}
          <div className="glass p-5 flex items-center gap-5 mt-auto border-t-2 border-t-cyber-blue">
            <button 
              onClick={toggleAudio}
              className="w-14 h-14 bg-cyber-blue flex items-center justify-center shadow-[0_0_20px_rgba(0,243,255,0.4)] hover:scale-105 hover:bg-white transition-all group rounded-none"
            >
              {isPlaying ? <Pause className="w-5 h-5 text-black" /> : <Play className="w-5 h-5 ml-1 text-black" />}
            </button>
            <div className="flex-1">
              <h4 className="text-sm font-black tracking-widest uppercase text-white drop-shadow-md mb-1 flex items-center gap-2">
                AURA_NARRATOR/AI <span className="bg-cyber-pink/20 text-cyber-pink text-[9px] px-2 py-0.5 border border-cyber-pink/30">ONLINE</span>
              </h4>
              <p className="text-xs text-white/50 font-medium">{isPlaying ? "Synthesizing vocal datastream..." : "Podcast module ready"}</p>
            </div>
            <div className="flex gap-1.5 items-center h-8 px-4 bg-black/30 border border-cyber-blue/20">
              {[1, 2, 3, 4, 5].map((i) => (
                <motion.div
                  key={i}
                  animate={isPlaying ? { height: ["20%", "100%", "20%"] } : { height: "20%" }}
                  transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.1, ease: "easeInOut" }}
                  className="w-1.5 bg-cyber-blue shadow-[0_0_8px_rgba(0,243,255,0.5)] rounded-none"
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-12 text-center text-cyber-blue/40 text-[10px] uppercase tracking-[0.3em] font-bold bg-black/50 py-4 border-t border-cyber-blue/20 relative z-50">
        {`// ENGINEERED_FOR_TRUTH // V2.0_CORE // (C) 2026 AURACHECK`}
      </footer>
    </main>
  );
}
