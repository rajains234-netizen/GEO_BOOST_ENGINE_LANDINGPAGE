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
  AlertTriangle
} from "lucide-react";
import "@/App.css";

// PayPal payment link placeholder - replace with actual link
const PAYPAL_LINK = "#payment";

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

// Hero Section
const HeroSection = () => {
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
          {/* Badge */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-sm text-zinc-400">Limited: 50 reports per week</span>
          </motion.div>

          {/* Main headline */}
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-7xl font-black tracking-tighter leading-[0.95] text-white mb-6"
            style={{ fontFamily: 'Outfit' }}
          >
            AI Won't Recommend You{" "}
            <span className="gradient-text">Unless You Tell It How</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-xl text-zinc-400 max-w-2xl mb-10 leading-relaxed"
          >
            ChatGPT, Google AI, and Bing are replacing traditional search. If your local business isn't optimized for AI recommendations, you're losing customers to competitors who are. Get your personalized AI visibility audit today.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 mb-12"
          >
            <a 
              href={PAYPAL_LINK}
              data-testid="hero-cta-button"
              className="cta-button text-lg justify-center"
            >
              Get My GEO Boost Report – $99 <Zap className="w-5 h-5" />
            </a>
            <a 
              href="#how-it-works"
              data-testid="hero-secondary-button"
              className="secondary-button text-center"
            >
              See How It Works
            </a>
          </motion.div>

          {/* Trust badges */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap items-center gap-4"
          >
            <span className="text-sm text-zinc-500">Covers all major AI platforms:</span>
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

// Problem Agitation Section
const ProblemSection = () => {
  const problems = [
    {
      icon: AlertTriangle,
      title: "Traditional SEO Is Dying",
      description: "Google's AI Overviews now answer 60% of queries without clicks. Your website traffic is evaporating, and traditional SEO won't save you.",
      color: "from-red-500/20 to-orange-500/20"
    },
    {
      icon: TrendingUp,
      title: "AI Search Is the New Reality",
      description: "Over 200 million people use ChatGPT monthly. When someone asks 'best plumber near me,' will AI recommend YOU or your competitor?",
      color: "from-orange-500/20 to-yellow-500/20"
    },
    {
      icon: Target,
      title: "Your Competitors Are Already There",
      description: "Smart local businesses are optimizing for AI NOW. Every day you wait, they're capturing the customers that should be yours.",
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
          <span className="uppercase text-xs tracking-[0.2em] font-bold text-cyan-400 mb-4 block">
            The Visibility Crisis
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tighter text-white mb-6" style={{ fontFamily: 'Outfit' }}>
            If AI Can't Find You,{" "}
            <span className="gradient-text">Neither Can Your Customers</span>
          </h2>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
            The search landscape has fundamentally changed. Here's why your current strategy is failing:
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
                <div className="w-14 h-14 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-6">
                  <problem.icon className="w-7 h-7 text-red-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3" style={{ fontFamily: 'Outfit' }}>
                  {problem.title}
                </h3>
                <p className="text-zinc-400 leading-relaxed">
                  {problem.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
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

// Social Proof Section
const SocialProofSection = () => {
  const testimonials = [
    {
      name: "Mike Reynolds",
      business: "Reynolds HVAC Services",
      location: "Phoenix, AZ",
      quote: "Within 3 weeks of implementing the GEO Boost recommendations, my phone started ringing more. ChatGPT now recommends us when people ask for HVAC help in Phoenix. Game changer.",
      result: "+47% more calls",
      avatar: "https://images.unsplash.com/photo-1758887261865-a2b89c0f7ac5?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA3MDB8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBidXNpbmVzcyUyMG93bmVyJTIwcG9ydHJhaXR8ZW58MHx8fHwxNzc0MjQ4MDQyfDA&ixlib=rb-4.1.0&q=85"
    },
    {
      name: "Dr. Sarah Chen",
      business: "Radiant Med Spa",
      location: "Los Angeles, CA",
      quote: "I was skeptical about another marketing report. But this was different—specific, actionable, and my team implemented everything in a weekend. Now we show up in AI searches consistently.",
      result: "+62% new patient inquiries",
      avatar: "https://images.unsplash.com/photo-1769636930047-4478f12cf430?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA3MDB8MHwxfHNlYXJjaHwyfHxwcm9mZXNzaW9uYWwlMjBidXNpbmVzcyUyMG93bmVyJTIwcG9ydHJhaXR8ZW58MHx8fHwxNzc0MjQ4MDQyfDA&ixlib=rb-4.1.0&q=85"
    },
    {
      name: "Tom Garcia",
      business: "Garcia Plumbing Co.",
      location: "Houston, TX",
      quote: "Best $99 I ever spent on my business. The report showed me exactly why my competitor was getting all the AI referrals. Fixed it in 2 weeks. Now we're the top recommendation.",
      result: "+38% revenue increase",
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
          <span className="uppercase text-xs tracking-[0.2em] font-bold text-cyan-400 mb-4 block">
            Real Results
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tighter text-white mb-6" style={{ fontFamily: 'Outfit' }}>
            Used by <span className="gradient-text">100+ Local Businesses</span>
          </h2>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
            See what business owners like you are saying about GEO Boost Engine
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
              className="testimonial-card"
              data-testid={`testimonial-card-${index}`}
            >
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <p className="text-zinc-300 mb-6 italic leading-relaxed">
                "{testimonial.quote}"
              </p>
              <div className="flex items-center gap-4">
                <img 
                  src={testimonial.avatar} 
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <div className="font-bold text-white" style={{ fontFamily: 'Outfit' }}>{testimonial.name}</div>
                  <div className="text-sm text-zinc-500">{testimonial.business}</div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-white/10">
                <div className="text-cyan-400 font-bold">{testimonial.result}</div>
                <div className="text-xs text-zinc-500">{testimonial.location}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Value Stack Section
const ValueStackSection = () => {
  return (
    <section className="relative py-24 lg:py-32 bg-zinc-950/50" data-testid="value-stack-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <span className="uppercase text-xs tracking-[0.2em] font-bold text-cyan-400 mb-4 block">
            Incredible Value
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tighter text-white mb-6" style={{ fontFamily: 'Outfit' }}>
            What You'd Pay an Agency vs.{" "}
            <span className="gradient-text">What You Pay Today</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Agency pricing */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="feature-card"
          >
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
                  <span className="text-zinc-400">{line.item}</span>
                  <span className="text-zinc-500 line-through">{line.price}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-6 border-t border-white/10">
              <div className="text-zinc-500 text-sm">Agency Total</div>
              <div className="text-3xl font-black text-zinc-400 line-through" style={{ fontFamily: 'Outfit' }}>
                $3,900+
              </div>
            </div>
          </motion.div>

          {/* GEO Boost pricing */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="value-card-glow rounded-2xl p-8 bg-zinc-900"
            data-testid="value-card"
          >
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              <h3 className="text-xl font-bold text-white" style={{ fontFamily: 'Outfit' }}>
                GEO Boost Engine Report
              </h3>
            </div>
            <div className="space-y-4">
              {[
                "Complete AI Visibility Score",
                "Multi-Platform Analysis",
                "Competitor Gap Report",
                "Missed Revenue Calculator",
                "Step-by-Step Action Plan",
                "Priority Implementation Guide"
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-cyan-400 flex-shrink-0" />
                  <span className="text-zinc-300">{item}</span>
                </div>
              ))}
            </div>
            <div className="mt-8 pt-6 border-t border-white/10">
              <div className="text-cyan-400 text-sm font-bold">Your Price Today</div>
              <div className="flex items-baseline gap-3">
                <span className="text-5xl font-black text-white" style={{ fontFamily: 'Outfit' }}>$99</span>
                <span className="text-zinc-500 line-through">$1,000+ value</span>
              </div>
            </div>
            <a 
              href={PAYPAL_LINK}
              data-testid="value-stack-cta-button"
              className="cta-button w-full justify-center mt-6 text-lg"
            >
              Get My Report Now <ArrowRight className="w-5 h-5" />
            </a>
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

// Final CTA Section
const FinalCTASection = () => {
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
          <h2 className="text-3xl sm:text-4xl lg:text-6xl font-black tracking-tighter text-white mb-6" style={{ fontFamily: 'Outfit' }}>
            Stop Being <span className="gradient-text">Invisible to AI</span>
          </h2>

          <p className="text-xl text-zinc-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Your competitors are already optimizing for AI search. Every day you wait is another day of lost customers, lost revenue, and lost market share. Take action now.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <a 
              href={PAYPAL_LINK}
              data-testid="final-cta-button"
              className="cta-button text-xl py-5 px-12"
            >
              Get My GEO Boost Report – $99 <Zap className="w-6 h-6" />
            </a>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-zinc-500">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              30-Day Money-Back Guarantee
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              Instant Digital Delivery
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-cyan-400" />
              Trusted by 100+ Businesses
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
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
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
      </div>
    </footer>
  );
};

// Sticky CTA Component
const StickyCTA = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 800);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className={`sticky-cta ${visible ? 'visible' : ''}`} data-testid="sticky-cta">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-center sm:text-left">
          <div className="text-white font-bold" style={{ fontFamily: 'Outfit' }}>
            Ready to dominate AI search?
          </div>
          <div className="text-sm text-zinc-400">
            Get your personalized report for just $99
          </div>
        </div>
        <a 
          href={PAYPAL_LINK}
          data-testid="sticky-cta-button"
          className="cta-button whitespace-nowrap"
        >
          Get My Report <ArrowRight className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
};

// Main App Component
function App() {
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
