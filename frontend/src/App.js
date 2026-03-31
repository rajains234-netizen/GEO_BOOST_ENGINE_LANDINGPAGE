import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, 
  BrainCircuit, 
  TrendingUp, 
  MapPin, 
  Zap, 
  Crosshair,
  Plus,
  Minus,
  Star,
  CheckCircle2,
  ArrowRight,
  MessageSquare,
  Search,
  Mic,
  ShieldCheck,
  Clock,
  Users,
  FileText,
  Target,
  BarChart3,
  AlertTriangle,
  XCircle,
  DollarSign,
  PhoneOff,
  TrendingDown,
  Eye,
  Timer
} from "lucide-react";
import "@/App.css";

// PayPal payment link placeholder - replace with actual link
const PAYPAL_LINK = "#payment";

// Countdown timer hook
const useCountdown = () => {
  const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 47, seconds: 33 });
  
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);
  
  return timeLeft;
};

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

// Header Component
const Header = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "glass-header py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center">
            <MapPin className="w-5 h-5 text-black" />
          </div>
          <span className="font-bold text-xl text-white tracking-tight" style={{ fontFamily: 'Outfit' }}>
            GEO Boost
          </span>
        </div>
        <a 
          href={PAYPAL_LINK}
          data-testid="header-cta-button"
          className="cta-button text-sm py-2 px-5"
        >
          Get My Report <ArrowRight className="w-4 h-4" />
        </a>
      </div>
    </header>
  );
};

// Hero Section - AIDA Framework: Attention + Interest
const HeroSection = () => {
  const timeLeft = useCountdown();
  
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden" data-testid="hero-section">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="orb orb-cyan w-[600px] h-[600px] -top-40 -right-40 animate-pulse-glow" />
        <div className="orb orb-purple w-[400px] h-[400px] bottom-20 left-10 animate-pulse-glow" style={{ animationDelay: '2s' }} />
        <img 
          src="https://images.unsplash.com/photo-1643087241268-171145387a05?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1OTV8MHwxfHNlYXJjaHwzfHxnb29nbGUlMjBtYXBzJTIwcGluJTIwbG9jYWwlMjBidXNpbmVzcyUyMGdsb3dpbmd8ZW58MHx8fHwxNzc0MjQ4MDM1fDA&ixlib=rb-4.1.0&q=85"
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-10 mix-blend-screen"
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="max-w-4xl">
          {/* URGENCY Badge - Countdown Timer */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-3 px-5 py-3 rounded-full bg-red-500/10 border border-red-500/30 mb-6"
          >
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-sm font-bold text-red-400">PRICE GOING UP IN:</span>
            </span>
            <span className="font-mono text-white font-bold">
              {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
            </span>
          </motion.div>

          {/* ATTENTION: Aggressive Headline - Interrupts and Shocks */}
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-7xl font-black tracking-tighter leading-[0.95] text-white mb-4"
            style={{ fontFamily: 'Outfit' }}
          >
            Your Business Is{" "}
            <span className="text-red-500">INVISIBLE</span> to AI
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-6"
            style={{ fontFamily: 'Outfit' }}
          >
            And It's <span className="gradient-text">Costing You Thousands</span> Every Month
          </motion.p>

          {/* INTEREST: Agitate the Problem - Specific Pain */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-zinc-900/60 border border-white/10 rounded-xl p-5 mb-8 max-w-2xl"
          >
            <p className="text-lg text-zinc-300 leading-relaxed">
              <span className="text-white font-bold">Right now, someone is asking ChatGPT:</span> "Who's the best {'{'}your service{'}'} near me?"
            </p>
            <p className="text-xl text-red-400 font-bold mt-2">
              Is AI recommending YOU... or sending that customer to your competitor?
            </p>
          </motion.div>

          {/* Social Proof Micro-stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="flex flex-wrap gap-6 mb-8"
          >
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-cyan-400" />
              <span className="text-zinc-300"><span className="text-white font-bold">847</span> businesses audited</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-400" />
              <span className="text-zinc-300"><span className="text-white font-bold">94%</span> saw more leads</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              <span className="text-zinc-300"><span className="text-white font-bold">4.9/5</span> rating</span>
            </div>
          </motion.div>

          {/* CTA Buttons - Bigger, Bolder, More Urgent */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 mb-6"
          >
            <a 
              href={PAYPAL_LINK}
              data-testid="hero-cta-button"
              className="cta-button-hero text-xl justify-center py-5 px-10"
            >
              <span className="flex flex-col items-center sm:flex-row sm:gap-3">
                <span>YES! Show Me Why I'm Invisible</span>
                <span className="text-sm opacity-80">Just $99 (was $299)</span>
              </span>
              <Zap className="w-6 h-6 ml-2 animate-pulse" />
            </a>
          </motion.div>
          
          {/* Risk Reversal */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="flex flex-wrap items-center gap-4 mb-8"
          >
            <div className="flex items-center gap-2 text-sm text-zinc-400">
              <ShieldCheck className="w-4 h-4 text-green-400" />
              <span>30-Day Money-Back Guarantee</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-zinc-400">
              <Clock className="w-4 h-4 text-cyan-400" />
              <span>Report Delivered in 24-48 Hours</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-zinc-400">
              <Eye className="w-4 h-4 text-purple-400" />
              <span>Only 7 Spots Left Today</span>
            </div>
          </motion.div>

          {/* Platform badges */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap items-center gap-4"
          >
            <span className="text-sm text-zinc-500">We analyze your visibility on:</span>
            <div className="flex flex-wrap gap-3">
              {[
                { icon: MessageSquare, name: "ChatGPT" },
                { icon: Search, name: "Google AI" },
                { icon: BrainCircuit, name: "Bing Copilot" },
                { icon: Mic, name: "Voice AI" }
              ].map((platform, i) => (
                <div key={i} className="platform-badge flex items-center gap-2">
                  <platform.icon className="w-4 h-4 text-cyan-400" />
                  {platform.name}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// Problem Agitation Section - PAS Framework: Problem, Agitate, Solution
const ProblemSection = () => {
  const problems = [
    {
      icon: PhoneOff,
      title: "Your Phone Stopped Ringing",
      description: "Remember when leads came in consistently? Now your competitors are getting those calls. Not because they're better—but because AI recommends THEM, not you.",
      stat: "73% of consumers now ask AI before calling",
      color: "from-red-500/20 to-orange-500/20"
    },
    {
      icon: TrendingDown,
      title: "You're Bleeding Money Daily",
      description: "Every day you're invisible to AI, you're losing $200-$500 in potential revenue. That's $6,000-$15,000 per month walking straight to your competition.",
      stat: "Average loss: $8,400/month",
      color: "from-orange-500/20 to-yellow-500/20"
    },
    {
      icon: XCircle,
      title: "Traditional Marketing Is Dead",
      description: "SEO, Google Ads, Yelp—they're all dying. AI is the new gatekeeper. If you're not optimized for AI, you might as well not exist.",
      stat: "AI search up 400% in 12 months",
      color: "from-yellow-500/20 to-red-500/20"
    }
  ];

  return (
    <section className="relative py-24 lg:py-32" data-testid="problem-section">
      <div className="absolute inset-0">
        <div className="orb orb-red w-[500px] h-[500px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-30" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <span className="uppercase text-xs tracking-[0.2em] font-bold text-red-400 mb-4 block">
            WARNING: This Is Happening Right Now
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tighter text-white mb-6" style={{ fontFamily: 'Outfit' }}>
            While You Read This, Your Competitors Are{" "}
            <span className="text-red-500">Stealing Your Customers</span>
          </h2>
          <p className="text-xl text-zinc-300 max-w-3xl mx-auto">
            This isn't fear-mongering. This is the brutal reality of 2025. The businesses that adapt will thrive. The ones that don't will disappear.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {problems.map((problem, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: index * 0.1 }}
              className="feature-card relative overflow-hidden"
              data-testid={`problem-card-${index}`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${problem.color} opacity-50`} />
              <div className="relative">
                <div className="w-14 h-14 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center mb-6">
                  <problem.icon className="w-7 h-7 text-red-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3" style={{ fontFamily: 'Outfit' }}>
                  {problem.title}
                </h3>
                <p className="text-zinc-400 leading-relaxed mb-4">
                  {problem.description}
                </p>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/20">
                  <AlertTriangle className="w-3 h-3 text-red-400" />
                  <span className="text-xs font-bold text-red-400">{problem.stat}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Emotional Bridge CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mt-16"
        >
          <p className="text-2xl text-white font-bold mb-6" style={{ fontFamily: 'Outfit' }}>
            How much longer can you afford to ignore this?
          </p>
          <a 
            href={PAYPAL_LINK}
            data-testid="problem-section-cta"
            className="cta-button text-lg inline-flex"
          >
            Fix My AI Visibility Now – $99 <ArrowRight className="w-5 h-5" />
          </a>
        </motion.div>
      </div>
    </section>
  );
};

// What Is Section
const WhatIsSection = () => {
  return (
    <section className="relative py-24 lg:py-32 bg-zinc-950/50" data-testid="what-is-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <span className="uppercase text-xs tracking-[0.2em] font-bold text-cyan-400 mb-4 block">
              What Is GEO Boost Engine?
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tighter text-white mb-6" style={{ fontFamily: 'Outfit' }}>
              Your AI Visibility Audit +{" "}
              <span className="gradient-text">Optimization Blueprint</span>
            </h2>
            <p className="text-lg text-zinc-400 mb-8 leading-relaxed">
              GEO Boost Engine analyzes how AI platforms see your business. We scan ChatGPT, Google AI, Bing Copilot, and voice assistants to discover exactly why you're being overlooked—and give you a step-by-step plan to fix it.
            </p>
            <div className="space-y-4">
              {[
                "No technical skills required",
                "Actionable, easy-to-follow recommendations",
                "Personalized for YOUR specific business",
                "Results you can implement in days, not months"
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-cyan-400 flex-shrink-0" />
                  <span className="text-zinc-300">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="relative"
          >
            <div className="glass-card rounded-2xl p-8 lg:p-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center">
                  <BrainCircuit className="w-6 h-6 text-black" />
                </div>
                <div>
                  <div className="text-white font-bold" style={{ fontFamily: 'Outfit' }}>AI Visibility Score</div>
                  <div className="text-sm text-zinc-500">Sample Report Preview</div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
                  <span className="text-zinc-400">ChatGPT Visibility</span>
                  <span className="text-red-400 font-bold">23%</span>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
                  <span className="text-zinc-400">Google AI Overview</span>
                  <span className="text-orange-400 font-bold">41%</span>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
                  <span className="text-zinc-400">Bing Copilot</span>
                  <span className="text-yellow-400 font-bold">18%</span>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
                  <span className="text-zinc-400">Voice Search</span>
                  <span className="text-red-400 font-bold">12%</span>
                </div>
              </div>

              <div className="mt-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                <div className="text-red-400 font-bold text-sm mb-1">Estimated Monthly Loss</div>
                <div className="text-2xl font-black text-white" style={{ fontFamily: 'Outfit' }}>$4,200 - $8,700</div>
                <div className="text-xs text-zinc-500 mt-1">Based on your industry average</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// How It Works Section
const HowItWorksSection = () => {
  const steps = [
    {
      number: "01",
      title: "We Scan Your AI Footprint",
      description: "Our system analyzes how your business appears across ChatGPT, Google AI, Bing Copilot, and voice assistants. We check citations, mentions, and recommendation patterns.",
      icon: Crosshair
    },
    {
      number: "02",
      title: "We Identify Your Visibility Gaps",
      description: "We compare your presence against competitors who ARE getting recommended. You'll see exactly where you're falling short and why AI isn't choosing you.",
      icon: Search
    },
    {
      number: "03",
      title: "We Deliver Your Action Plan",
      description: "Get a personalized blueprint with specific, step-by-step actions to boost your AI visibility. No jargon, no fluff—just clear instructions anyone can follow.",
      icon: FileText
    }
  ];

  return (
    <section id="how-it-works" className="relative py-24 lg:py-32" data-testid="how-it-works-section">
      <div className="absolute inset-0">
        <div className="orb orb-cyan w-[400px] h-[400px] top-0 right-0 opacity-20" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <span className="uppercase text-xs tracking-[0.2em] font-bold text-cyan-400 mb-4 block">
            How It Works
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tighter text-white" style={{ fontFamily: 'Outfit' }}>
            3 Steps to AI Domination
          </h2>
        </motion.div>

        <div className="space-y-8 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: index * 0.15 }}
              className="relative"
              data-testid={`step-card-${index}`}
            >
              <div className="feature-card relative overflow-hidden h-full">
                <span className="step-number">{step.number}</span>
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-400/20 to-purple-500/20 border border-cyan-400/30 flex items-center justify-center mb-6">
                    <step.icon className="w-7 h-7 text-cyan-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3" style={{ fontFamily: 'Outfit' }}>
                    {step.title}
                  </h3>
                  <p className="text-zinc-400 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
              {index < 2 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-[2px] bg-gradient-to-r from-cyan-400/50 to-transparent" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// What You Get Section (Bento Grid)
const WhatYouGetSection = () => {
  const deliverables = [
    {
      title: "Personalized AI Visibility Score",
      description: "Know exactly where you stand across all major AI platforms with our proprietary scoring system.",
      icon: BarChart3,
      span: "md:col-span-8 md:row-span-1"
    },
    {
      title: "Competitor Analysis",
      description: "See who's beating you and why.",
      icon: Users,
      span: "md:col-span-4 md:row-span-1"
    },
    {
      title: "Missed Revenue Calculator",
      description: "Discover how much money you're losing to AI-invisible competitors every month.",
      icon: TrendingUp,
      span: "md:col-span-4 md:row-span-1"
    },
    {
      title: "Step-by-Step Fix Plan",
      description: "Exact actions to take, in priority order. No technical knowledge needed—just follow the checklist.",
      icon: CheckCircle2,
      span: "md:col-span-8 md:row-span-1"
    },
    {
      title: "Platform-Specific Strategies",
      description: "Custom recommendations for ChatGPT, Google AI, Bing Copilot, and voice assistants.",
      icon: Sparkles,
      span: "md:col-span-6 md:row-span-1"
    },
    {
      title: "Instant Digital Delivery",
      description: "Get your report within 24-48 hours.",
      icon: Clock,
      span: "md:col-span-6 md:row-span-1"
    }
  ];

  return (
    <section className="relative py-24 lg:py-32 bg-zinc-950/50" data-testid="what-you-get-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <span className="uppercase text-xs tracking-[0.2em] font-bold text-cyan-400 mb-4 block">
            What's Included
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tighter text-white mb-6" style={{ fontFamily: 'Outfit' }}>
            Everything You Need to{" "}
            <span className="gradient-text">Dominate AI Search</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {deliverables.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: index * 0.1 }}
              className={`feature-card ${item.span}`}
              data-testid={`deliverable-card-${index}`}
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-6 h-6 text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-2" style={{ fontFamily: 'Outfit' }}>
                    {item.title}
                  </h3>
                  <p className="text-zinc-400">
                    {item.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Social Proof Section - Stronger Emotional Testimonials
const SocialProofSection = () => {
  const testimonials = [
    {
      name: "Mike Reynolds",
      business: "Reynolds HVAC Services",
      location: "Phoenix, AZ",
      before: "I was getting maybe 3-4 calls a week. Competitors were eating my lunch.",
      quote: "Within 3 weeks of implementing the GEO Boost plan, my phone EXPLODED. ChatGPT now recommends us FIRST when people ask for HVAC help in Phoenix. I've had to hire two more technicians.",
      result: "+47% more calls",
      revenue: "+$12,400/month",
      avatar: "https://images.unsplash.com/photo-1758887261865-a2b89c0f7ac5?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA3MDB8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBidXNpbmVzcyUyMG93bmVyJTIwcG9ydHJhaXR8ZW58MHx8fHwxNzc0MjQ4MDQyfDA&ixlib=rb-4.1.0&q=85"
    },
    {
      name: "Dr. Sarah Chen",
      business: "Radiant Med Spa",
      location: "Los Angeles, CA",
      before: "We spent $4,000/month on Google Ads with declining results.",
      quote: "I was SKEPTICAL—another marketing report? But this was different. Specific. Actionable. My team implemented everything in ONE WEEKEND. Now we're the #1 AI recommendation for med spas in LA.",
      result: "+62% new patients",
      revenue: "+$31,000/month",
      avatar: "https://images.unsplash.com/photo-1769636930047-4478f12cf430?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA3MDB8MHwxfHNlYXJjaHwyfHxwcm9mZXNzaW9uYWwlMjBidXNpbmVzcyUyMG93bmVyJTIwcG9ydHJhaXR8ZW58MHx8fHwxNzc0MjQ4MDQyfDA&ixlib=rb-4.1.0&q=85"
    },
    {
      name: "Tom Garcia",
      business: "Garcia Plumbing Co.",
      location: "Houston, TX",
      before: "My competitor was always showing up instead of me. I didn't know why.",
      quote: "Best $99 I EVER spent. The report showed me EXACTLY why my competitor was getting all the AI referrals—and how to beat him. Fixed it in 2 weeks. Now I'M the top recommendation.",
      result: "+38% revenue",
      revenue: "+$8,700/month",
      avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face"
    }
  ];

  return (
    <section className="relative py-24 lg:py-32" data-testid="social-proof-section">
      <div className="absolute inset-0">
        <div className="orb orb-purple w-[500px] h-[500px] bottom-0 left-0 opacity-20" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <span className="uppercase text-xs tracking-[0.2em] font-bold text-green-400 mb-4 block">
            Real Business Owners. Real Results.
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tighter text-white mb-6" style={{ fontFamily: 'Outfit' }}>
            They Were <span className="text-red-500">Invisible</span> Too.{" "}
            <span className="gradient-text">Now They're Dominating.</span>
          </h2>
          <p className="text-xl text-zinc-300 max-w-3xl mx-auto">
            847 local businesses have used GEO Boost Engine. Here's what happened when they finally became visible to AI:
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: index * 0.1 }}
              className="testimonial-card relative overflow-hidden"
              data-testid={`testimonial-card-${index}`}
            >
              {/* Revenue badge */}
              <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/30">
                <span className="text-sm font-bold text-green-400">{testimonial.revenue}</span>
              </div>
              
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              
              {/* Before state */}
              <p className="text-sm text-red-400/80 mb-3 italic">
                Before: "{testimonial.before}"
              </p>
              
              <p className="text-zinc-300 mb-6 leading-relaxed">
                "{testimonial.quote}"
              </p>
              <div className="flex items-center gap-4">
                <img 
                  src={testimonial.avatar} 
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-cyan-400/30"
                />
                <div>
                  <div className="font-bold text-white" style={{ fontFamily: 'Outfit' }}>{testimonial.name}</div>
                  <div className="text-sm text-zinc-500">{testimonial.business}</div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
                <div>
                  <div className="text-cyan-400 font-bold">{testimonial.result}</div>
                  <div className="text-xs text-zinc-500">{testimonial.location}</div>
                </div>
                <CheckCircle2 className="w-6 h-6 text-green-400" />
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Social proof bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="mt-12 flex flex-wrap justify-center gap-8 items-center"
        >
          <div className="text-center">
            <div className="text-3xl font-black text-white" style={{ fontFamily: 'Outfit' }}>847</div>
            <div className="text-sm text-zinc-500">Businesses Audited</div>
          </div>
          <div className="h-12 w-px bg-white/10 hidden sm:block" />
          <div className="text-center">
            <div className="text-3xl font-black text-green-400" style={{ fontFamily: 'Outfit' }}>94%</div>
            <div className="text-sm text-zinc-500">Saw More Leads</div>
          </div>
          <div className="h-12 w-px bg-white/10 hidden sm:block" />
          <div className="text-center">
            <div className="text-3xl font-black text-cyan-400" style={{ fontFamily: 'Outfit' }}>$2.1M</div>
            <div className="text-sm text-zinc-500">Additional Revenue Generated</div>
          </div>
          <div className="h-12 w-px bg-white/10 hidden sm:block" />
          <div className="text-center">
            <div className="text-3xl font-black text-yellow-400" style={{ fontFamily: 'Outfit' }}>4.9/5</div>
            <div className="text-sm text-zinc-500">Average Rating</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// Value Stack Section - Anchor High, Reveal Deal
const ValueStackSection = () => {
  const timeLeft = useCountdown();
  
  return (
    <section className="relative py-24 lg:py-32 bg-zinc-950/50" data-testid="value-stack-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <span className="uppercase text-xs tracking-[0.2em] font-bold text-yellow-400 mb-4 block">
            This Is Embarrassingly Cheap
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tighter text-white mb-6" style={{ fontFamily: 'Outfit' }}>
            You Could Pay an Agency $3,900...{" "}
            <span className="gradient-text">Or Get It All for $99</span>
          </h2>
          <p className="text-xl text-zinc-300 max-w-3xl mx-auto">
            We're not an agency. We don't need to justify a $3,000/month retainer. We just want to help you get visible.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Agency pricing - Strike it out */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="feature-card opacity-60 relative"
          >
            <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30">
              <span className="text-xs font-bold text-red-400">DON'T DO THIS</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-6" style={{ fontFamily: 'Outfit' }}>
              Typical Agency Pricing
            </h3>
            <div className="space-y-4">
              {[
                { item: "AI Visibility Audit", price: "$500" },
                { item: "Competitor Analysis", price: "$300" },
                { item: "Strategy Blueprint", price: "$700" },
                { item: "Platform Optimization Guide", price: "$400" },
                { item: "Monthly Retainer", price: "$2,000+" }
              ].map((line, i) => (
                <div key={i} className="flex justify-between items-center py-2 border-b border-white/5">
                  <span className="text-zinc-500 line-through">{line.item}</span>
                  <span className="text-zinc-500 line-through">{line.price}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-6 border-t border-white/10">
              <div className="text-zinc-500 text-sm">Agency Total</div>
              <div className="text-3xl font-black text-red-400 line-through" style={{ fontFamily: 'Outfit' }}>
                $3,900+
              </div>
              <div className="text-sm text-red-400 mt-2">+ Months of waiting</div>
            </div>
          </motion.div>

          {/* GEO Boost pricing - Make it pop */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="value-card-glow rounded-2xl p-8 bg-zinc-900 relative"
            data-testid="value-card"
          >
            {/* Popular badge */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500">
              <span className="text-sm font-bold text-black">BEST VALUE</span>
            </div>
            
            <div className="flex items-center gap-2 mb-6 mt-4">
              <Zap className="w-5 h-5 text-cyan-400" />
              <h3 className="text-xl font-bold text-white" style={{ fontFamily: 'Outfit' }}>
                GEO Boost Engine Report
              </h3>
            </div>
            <div className="space-y-3">
              {[
                { item: "Complete AI Visibility Score", value: "$200" },
                { item: "Multi-Platform Analysis (ChatGPT, Google, Bing)", value: "$300" },
                { item: "Competitor Gap Report", value: "$250" },
                { item: "Missed Revenue Calculator", value: "$150" },
                { item: "Step-by-Step Action Plan", value: "$400" },
                { item: "Priority Implementation Guide", value: "$200" },
                { item: "BONUS: 30-Day Email Support", value: "$500" }
              ].map((line, i) => (
                <div key={i} className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
                    <span className="text-zinc-300 text-sm">{line.item}</span>
                  </div>
                  <span className="text-zinc-500 text-sm line-through">{line.value}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-6 border-t border-cyan-400/30 bg-cyan-400/5 -mx-8 px-8 pb-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-zinc-400 text-sm">Total Value:</span>
                <span className="text-zinc-400 line-through">$2,000</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-cyan-400 text-sm font-bold">Your Price Today:</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black text-white" style={{ fontFamily: 'Outfit' }}>$99</span>
                </div>
              </div>
              <div className="text-center mt-2">
                <span className="text-xs text-yellow-400">Price increases to $299 in {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}</span>
              </div>
            </div>
            <a 
              href={PAYPAL_LINK}
              data-testid="value-stack-cta-button"
              className="cta-button-hero w-full justify-center mt-6 text-lg py-4"
            >
              YES! I Want This Deal <ArrowRight className="w-5 h-5" />
            </a>
            <div className="text-center mt-4 flex items-center justify-center gap-4 text-xs text-zinc-500">
              <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3 text-green-400" /> 30-Day Guarantee</span>
              <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-cyan-400" /> Instant Access</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// Urgency Section
const UrgencySection = () => {
  return (
    <section className="relative py-24 lg:py-32" data-testid="urgency-section">
      <div className="absolute inset-0">
        <div className="orb orb-cyan w-[600px] h-[600px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-30" />
      </div>

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 mb-8">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <span className="text-sm text-red-400">Limited Availability</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tighter text-white mb-6" style={{ fontFamily: 'Outfit' }}>
            The AI Visibility Gap Is{" "}
            <span className="gradient-text">Growing Every Day</span>
          </h2>

          <p className="text-lg text-zinc-400 mb-8 leading-relaxed">
            AI platforms are learning and evolving constantly. The businesses that optimize NOW will cement their positions. Those who wait will find it harder and more expensive to catch up.
          </p>

          <div className="grid sm:grid-cols-3 gap-6 mb-10">
            {[
              { label: "Reports This Week", value: "47/50", subtext: "Only 3 spots left" },
              { label: "Early Adopter Bonus", value: "Included", subtext: "Priority support" },
              { label: "Delivery Time", value: "24-48hrs", subtext: "Instant access" }
            ].map((stat, i) => (
              <div key={i} className="glass-card rounded-xl p-6">
                <div className="text-2xl font-black text-white mb-1" style={{ fontFamily: 'Outfit' }}>{stat.value}</div>
                <div className="text-sm text-zinc-400">{stat.label}</div>
                <div className="text-xs text-cyan-400 mt-1">{stat.subtext}</div>
              </div>
            ))}
          </div>

          <a 
            href={PAYPAL_LINK}
            data-testid="urgency-cta-button"
            className="cta-button text-lg"
          >
            Secure My Report – $99 <Zap className="w-5 h-5" />
          </a>
        </motion.div>
      </div>
    </section>
  );
};

// FAQ Section
const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "What exactly is GEO Boost Engine?",
      answer: "GEO Boost Engine is a comprehensive AI visibility audit for your local business. We analyze how your business appears across ChatGPT, Google AI, Bing Copilot, and voice assistants, then provide a detailed report with specific actions to improve your visibility and get more AI recommendations."
    },
    {
      question: "How fast will I receive my report?",
      answer: "Most reports are delivered within 24-48 hours of purchase. You'll receive an email with a link to download your personalized PDF report. For complex businesses with multiple locations, it may take up to 72 hours."
    },
    {
      question: "Is this relevant for my type of business?",
      answer: "If you're a local business that serves customers in a specific geographic area—HVAC, plumbing, dental, legal, med spa, restaurants, contractors, etc.—this report is perfect for you. Any business that relies on local customers finding them through search can benefit."
    },
    {
      question: "Do I need technical skills to implement the recommendations?",
      answer: "Absolutely not. Our recommendations are written in plain English with step-by-step instructions anyone can follow. If you can use a computer and update your Google Business Profile, you can implement our action plan."
    },
    {
      question: "What's your refund policy?",
      answer: "We offer a 30-day money-back guarantee. If you implement our recommendations and don't see improvement in your AI visibility within 30 days, we'll refund your purchase in full. Simply email us with proof of implementation."
    },
    {
      question: "How is this different from regular SEO?",
      answer: "Traditional SEO focuses on ranking in Google search results. GEO (Generative Engine Optimization) focuses on getting recommended by AI assistants like ChatGPT and Google AI. These are completely different algorithms with different optimization strategies."
    }
  ];

  return (
    <section className="relative py-24 lg:py-32 bg-zinc-950/50" data-testid="faq-section">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <span className="uppercase text-xs tracking-[0.2em] font-bold text-cyan-400 mb-4 block">
            Questions & Answers
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tighter text-white" style={{ fontFamily: 'Outfit' }}>
            Frequently Asked Questions
          </h2>
        </motion.div>

        <div className="space-y-2">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: index * 0.05 }}
              className="faq-item"
              data-testid={`faq-item-${index}`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full py-6 flex items-center justify-between text-left"
                aria-expanded={openIndex === index}
                data-testid={`faq-button-${index}`}
              >
                <span className="text-lg font-medium text-white pr-8" style={{ fontFamily: 'Outfit' }}>
                  {faq.question}
                </span>
                {openIndex === index ? (
                  <Minus className="w-5 h-5 text-cyan-400 flex-shrink-0" />
                ) : (
                  <Plus className="w-5 h-5 text-zinc-400 flex-shrink-0" />
                )}
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <p className="pb-6 text-zinc-400 leading-relaxed">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Final CTA Section - Emotional Close
const FinalCTASection = () => {
  const timeLeft = useCountdown();
  
  return (
    <section className="relative py-24 lg:py-32 overflow-hidden" data-testid="final-cta-section">
      <div className="absolute inset-0">
        <div className="orb orb-cyan w-[800px] h-[800px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-40" />
        <div className="orb orb-purple w-[600px] h-[600px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-30" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Final urgency badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/30 mb-6">
            <Timer className="w-4 h-4 text-red-400 animate-pulse" />
            <span className="text-sm font-bold text-red-400">
              $99 price expires in {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-6xl font-black tracking-tighter text-white mb-6" style={{ fontFamily: 'Outfit' }}>
            You Have Two Choices Right Now
          </h2>

          <div className="grid md:grid-cols-2 gap-6 mb-10 max-w-3xl mx-auto text-left">
            {/* Bad choice */}
            <div className="p-6 rounded-xl bg-red-500/5 border border-red-500/20">
              <div className="flex items-center gap-2 mb-3">
                <XCircle className="w-5 h-5 text-red-400" />
                <span className="font-bold text-red-400">Option A: Do Nothing</span>
              </div>
              <ul className="space-y-2 text-sm text-zinc-400">
                <li>• Keep losing customers to AI-optimized competitors</li>
                <li>• Watch your phone ring less each month</li>
                <li>• Hope things magically get better (they won't)</li>
                <li>• Lose another $5,000-$15,000 this month</li>
              </ul>
            </div>
            
            {/* Good choice */}
            <div className="p-6 rounded-xl bg-green-500/5 border border-green-500/20">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 className="w-5 h-5 text-green-400" />
                <span className="font-bold text-green-400">Option B: Take Action</span>
              </div>
              <ul className="space-y-2 text-sm text-zinc-400">
                <li>• Get your AI visibility report in 24-48 hours</li>
                <li>• Know EXACTLY why you're invisible</li>
                <li>• Follow the step-by-step fix plan</li>
                <li>• Start getting AI referrals within weeks</li>
              </ul>
            </div>
          </div>

          <p className="text-2xl text-white font-bold mb-8" style={{ fontFamily: 'Outfit' }}>
            The choice is obvious. The only question is:{" "}
            <span className="gradient-text">will you act now, or regret it later?</span>
          </p>

          <a 
            href={PAYPAL_LINK}
            data-testid="final-cta-button"
            className="cta-button-hero text-xl py-6 px-14 inline-flex"
          >
            <span className="flex flex-col items-center">
              <span>YES! Show Me Why I'm Invisible – $99</span>
              <span className="text-sm opacity-80 mt-1">Instant access • 30-day guarantee</span>
            </span>
            <Zap className="w-6 h-6 ml-3 animate-pulse" />
          </a>

          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-zinc-500 mt-8">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-green-400" />
              100% Money-Back Guarantee
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              24-48 Hour Delivery
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-400" />
              847 Businesses Can't Be Wrong
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// Footer
const Footer = () => {
  return (
    <footer className="py-8 border-t border-white/5" data-testid="footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top section */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center">
              <MapPin className="w-4 h-4 text-black" />
            </div>
            <span className="font-bold text-white" style={{ fontFamily: 'Outfit' }}>
              GEO Boost Engine
            </span>
          </div>

          <div className="text-sm text-zinc-500">
            © 2025 GEO Boost Engine. All rights reserved.
          </div>
        </div>

        {/* 🔥 NEW: Legal links (CRITICAL for Paddle) */}
        <div className="text-center text-sm text-zinc-400 flex flex-wrap justify-center gap-4">
          <a href="/terms.html" className="hover:text-white">Terms</a>
          <a href="/privacy.html" className="hover:text-white">Privacy</a>
          <a href="/refund.html" className="hover:text-white">Refund</a>
        </div>

        {/* Optional trust line (helps conversion + approval) */}
        <div className="text-center text-xs text-zinc-600 mt-3">
          Secure payments powered by Paddle
        </div>

      </div>
    </footer>
  );
};

// Sticky CTA Component - With Urgency
const StickyCTA = () => {
  const [visible, setVisible] = useState(false);
  const timeLeft = useCountdown();

  useEffect(() => {
    const handleScroll = () => {
      // Only show sticky CTA after scrolling past hero section
      setVisible(window.scrollY > 600);
    };
    // Check initial state
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <div className="sticky-cta visible" data-testid="sticky-cta">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-center sm:text-left flex items-center gap-4">
          <div className="hidden sm:block">
            <div className="text-white font-bold" style={{ fontFamily: 'Outfit' }}>
              Stop losing customers to AI
            </div>
            <div className="text-sm text-zinc-400">
              $99 price expires in <span className="text-red-400 font-mono font-bold">{String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}</span>
            </div>
          </div>
          <div className="sm:hidden text-sm text-red-400 font-mono font-bold">
            Expires: {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
          </div>
        </div>
        <a 
          href={PAYPAL_LINK}
          data-testid="sticky-cta-button"
          className="cta-button whitespace-nowrap animate-pulse-glow-fast"
        >
          Get My Report – $99 <ArrowRight className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
};

// Main App Component
function App() {

  useEffect(() => {
    const removeBadge = () => {
      document.querySelectorAll('div, a, iframe').forEach(el => {
        if (
          el.innerText &&
          el.innerText.toLowerCase().includes('made with emergent')
        ) {
          el.remove();
        }
      });
    };

    removeBadge();
    const interval = setInterval(removeBadge, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#050505]">
      {/* Noise overlay */}
      <div className="noise-overlay" />
      
      {/* Header */}
      <Header />
      
      {/* Main content */}
      <main>
        <HeroSection />
        <ProblemSection />
        <WhatIsSection />
        <HowItWorksSection />
        <WhatYouGetSection />
        <SocialProofSection />
        <ValueStackSection />
        <UrgencySection />
        <FAQSection />
        <FinalCTASection />
      </main>
      
      {/* Footer */}
      <Footer />
      
      {/* Sticky CTA */}
      <StickyCTA />
    </div>
  );
}

export default App;
