import { useState, useEffect, useRef } from "react";
import { 
  ArrowRight, 
  Check, 
  ChevronDown, 
  Zap, 
  Search, 
  FileText, 
  Shield, 
  Clock,
  MessageSquare,
  Bot,
  Sparkles,
  TrendingUp,
  Users,
  Target,
  AlertTriangle,
  Star
} from "lucide-react";

const LandingPage = () => {
  const [openFaq, setOpenFaq] = useState(null);
  const [isVisible, setIsVisible] = useState({
    hero: true,
    socialProof: false,
    problem: false,
    solution: false,
    howItWorks: false,
    pricing: false,
    guarantee: false,
    faq: false,
    finalCta: false
  });
  const sectionRefs = useRef({});

  useEffect(() => {
    // Set hero visible immediately
    setIsVisible(prev => ({ ...prev, hero: true }));
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.05, rootMargin: "50px" }
    );

    Object.values(sectionRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToCTA = () => {
    const element = document.getElementById("pricing");
    element?.scrollIntoView({ behavior: "smooth" });
  };

  const faqItems = [
    {
      question: "What exactly is this report?",
      answer: "The AI Visibility Report is a comprehensive audit of how your business appears across AI platforms like ChatGPT, Google AI, Bing Copilot, and Perplexity. We analyze 30+ visibility signals to show you exactly why AI tools may or may not be recommending your business to potential customers."
    },
    {
      question: "How fast do I get my report?",
      answer: "Your personalized AI Visibility Report is delivered within 24-48 hours of purchase. No calls, no waiting around. It's sent directly to your email with a detailed breakdown and actionable fixes."
    },
    {
      question: "Is this relevant for my type of business?",
      answer: "If you're a local business that relies on customers finding you online — HVAC, plumbing, dental, legal, med spa, restaurants, contractors, etc. — this report is built specifically for you. If customers search for services you provide in your area, AI visibility matters."
    },
    {
      question: "Do I need any technical skills to use this?",
      answer: "Absolutely not. The report is written in plain English with step-by-step instructions. You'll understand exactly what to do, or you can hand it to your marketing person or web developer to implement the fixes."
    },
    {
      question: "What's your refund policy?",
      answer: "100% risk-free. If you don't find at least 3 actionable insights in your report, we'll refund you completely. No questions asked. We're confident in the value because we've helped 847+ businesses already."
    }
  ];

  const testimonials = [
    {
      revenue: "+$12,400/month",
      stars: 5,
      before: "I was getting maybe 3-4 calls a week. Competitors were eating my lunch.",
      quote: "Within 3 weeks of implementing the GEO Boost plan, my phone EXPLODED. ChatGPT now recommends us FIRST when people ask for HVAC help in Phoenix. I've had to hire two more technicians.",
      name: "Mike Fernandez",
      role: "Owner, Fernandez HVAC",
      image: "https://images.pexels.com/photos/6077664/pexels-photo-6077664.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=100&w=100"
    },
    {
      revenue: "+$31,000/month",
      stars: 5,
      before: "We spent $4,000/month on Google Ads with declining results.",
      quote: "I was SKEPTICAL — another marketing report? But this was different. Specific. Actionable. My team implemented everything in ONE WEEKEND. Now we're the #1 AI recommendation for med spas in LA.",
      name: "Dr. Sarah Chen",
      role: "Owner, Glow Med Spa",
      image: "https://images.pexels.com/photos/36499769/pexels-photo-36499769.png?auto=compress&cs=tinysrgb&dpr=2&h=100&w=100"
    },
    {
      revenue: "+$8,200/month",
      stars: 4,
      before: "My competitor down the street was stealing all my customers.",
      quote: "Best $199 I ever spent. The report showed me exactly why my competitor was getting recommended instead of me. Fixed it in 2 days. Now I beat him on every AI platform. Top recommendation in my area.",
      name: "Tom Bradley",
      role: "Owner, Bradley Plumbing",
      image: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=100&w=100"
    },
    {
      revenue: "+$22,500/month",
      stars: 5,
      before: "We had zero visibility on any AI platform. Not even mentioned.",
      quote: "Our law firm was completely invisible to AI assistants. Within 6 weeks of following the report, we're now consistently recommended for personal injury cases in Houston. 14 new clients last month alone.",
      name: "Jennifer Martinez",
      role: "Partner, Martinez Law Group",
      image: "https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=100&w=100"
    },
    {
      revenue: "+$6,800/month",
      stars: 5,
      before: "Younger dentists with fancy websites were taking over.",
      quote: "I've been practicing 20 years but was losing patients to newer clinics. The report revealed 12 critical gaps in my AI visibility. Fixed them all. Now Google AI and ChatGPT recommend my practice first.",
      name: "Dr. Robert Kim",
      role: "DDS, Kim Family Dental",
      image: "https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=100&w=100"
    },
    {
      revenue: "+$18,700/month",
      stars: 5,
      before: "Social media marketing wasn't converting. Felt invisible.",
      quote: "This completely changed how I think about online visibility. The AI landscape is DIFFERENT from SEO. The specificity of the fixes was incredible. 23 new roofing contracts in 2 months.",
      name: "David Thompson",
      role: "Owner, Thompson Roofing Co.",
      image: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=100&w=100"
    }
  ];

  const stats = [
    { value: "847", label: "Businesses Audited", color: "text-white" },
    { value: "94%", label: "Saw More Leads", color: "text-emerald-400" },
    { value: "$2.1M", label: "Additional Revenue Generated", color: "text-cyan-400" },
    { value: "4.9/5", label: "Average Rating", color: "text-amber-400" }
  ];

  const valueItems = [
    { name: "Complete AI Visibility Audit", value: "$300" },
    { name: "Competitor Breakdown Analysis", value: "$150" },
    { name: "Custom Fix Plan & Priorities", value: "$200" },
    { name: "30+ AI Signal Checklist", value: "$100" }
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {/* Sticky Header */}
      <header className="sticky-header" data-testid="header">
        <div className="container-custom flex items-center justify-between py-4 px-6">
          <div className="logo-text text-white" data-testid="logo">
            GEO<span className="text-yellow-500">Boost</span>
          </div>
          <button 
            onClick={scrollToCTA}
            className="cta-button text-sm py-2 px-6"
            data-testid="header-cta"
          >
            Get Your Report
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section 
        id="hero" 
        ref={(el) => (sectionRefs.current.hero = el)}
        className="hero-section section relative"
        data-testid="hero-section"
      >
        <div className="bg-shape bg-shape-1"></div>
        <div className="bg-shape bg-shape-2"></div>
        <div className="hero-glow top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2"></div>
        
        <div className="container-custom hero-content">
          <div className="max-w-4xl mx-auto text-center">
            {/* Trust badge */}
            <div 
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 ${isVisible.hero ? 'animate-fade-up' : 'opacity-0'}`}
              data-testid="trust-badge"
            >
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span className="text-sm text-zinc-400">Trusted by 847+ local businesses</span>
            </div>

            {/* Main Headline */}
            <h1 
              className={`text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight ${isVisible.hero ? 'animate-fade-up delay-100' : 'opacity-0'}`}
              data-testid="hero-headline"
            >
              Get Your Business Recommended by{" "}
              <span className="gradient-text-yellow">ChatGPT & Google AI</span>
              {" "}in 48 Hours
            </h1>

            {/* Subheadline */}
            <p 
              className={`text-lg sm:text-xl text-zinc-400 mb-10 max-w-2xl mx-auto leading-relaxed ${isVisible.hero ? 'animate-fade-up delay-200' : 'opacity-0'}`}
              data-testid="hero-subheadline"
            >
              Right now, customers are asking AI tools for recommendations… and your competitors are getting picked — not you. We show you exactly why — and fix it.
            </p>

            {/* CTA Button */}
            <div className={`mb-8 ${isVisible.hero ? 'animate-fade-up delay-300' : 'opacity-0'}`}>
              <button 
                onClick={scrollToCTA}
                className="cta-button text-lg px-10 py-5 animate-pulse-glow"
                data-testid="hero-cta"
              >
                Get My AI Visibility Report – $199
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>

            {/* Trust indicators below CTA */}
            <div 
              className={`flex flex-wrap justify-center gap-6 text-sm text-zinc-500 ${isVisible.hero ? 'animate-fade-up delay-400' : 'opacity-0'}`}
              data-testid="trust-indicators"
            >
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-cyan-400" />
                <span>Delivered in 24-48 hours</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-400" />
                <span>No calls required</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Actionable fixes included</span>
              </div>
            </div>

            {/* AI Platforms */}
            <div className={`mt-12 ${isVisible.hero ? 'animate-fade-up delay-500' : 'opacity-0'}`}>
              <p className="text-xs text-zinc-600 uppercase tracking-widest mb-4">We analyze your visibility on</p>
              <div className="flex flex-wrap justify-center gap-3">
                <span className="platform-badge"><Bot className="w-4 h-4" /> ChatGPT</span>
                <span className="platform-badge"><Search className="w-4 h-4" /> Google AI</span>
                <span className="platform-badge"><Sparkles className="w-4 h-4" /> Perplexity</span>
                <span className="platform-badge"><MessageSquare className="w-4 h-4" /> Bing Copilot</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section 
        id="stats" 
        ref={(el) => (sectionRefs.current.stats = el)}
        className="py-16 md:py-20 bg-[#050505] border-y border-white/5"
        data-testid="stats-section"
      >
        <div className="container-custom px-6">
          <div className={`grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 max-w-5xl mx-auto ${isVisible.hero ? 'animate-fade-up' : 'opacity-0'}`} style={{ animationDelay: '0.6s', animationFillMode: 'both' }}>
            {stats.map((stat, index) => (
              <div key={index} className="text-center" data-testid={`stat-${index}`}>
                <div className={`text-4xl md:text-5xl font-extrabold mb-2 ${stat.color}`} style={{ fontFamily: 'Outfit, sans-serif' }}>
                  {stat.value}
                </div>
                <div className="text-sm text-zinc-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof / Testimonials Section */}
      <section 
        id="socialProof" 
        ref={(el) => (sectionRefs.current.socialProof = el)}
        className="section bg-[#0A0A0A]"
        data-testid="social-proof-section"
      >
        <div className="container-custom">
          <div className={`text-center mb-16 ${isVisible.socialProof ? 'animate-fade-up' : 'opacity-0'}`} style={{ animationFillMode: 'both' }}>
            <span className="text-emerald-400 text-sm font-semibold uppercase tracking-widest">Real Results</span>
            <h2 className="text-3xl sm:text-4xl font-bold mt-4 mb-4" data-testid="social-proof-title">
              What Business Owners Are Saying
            </h2>
            <p className="text-zinc-500 max-w-xl mx-auto">
              Don't take our word for it. Here's what happened after they implemented our AI visibility fixes.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index}
                className={`testimonial-card hover-lift ${isVisible.socialProof ? 'animate-fade-up' : 'opacity-0'}`}
                style={{ animationDelay: `${(index + 1) * 0.08}s`, animationFillMode: 'both' }}
                data-testid={`testimonial-${index}`}
              >
                {/* Header with stars and revenue */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-4 h-4 ${i < testimonial.stars ? 'fill-amber-400 text-amber-400' : 'fill-zinc-700 text-zinc-700'}`} 
                      />
                    ))}
                  </div>
                  <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-emerald-400 text-sm font-semibold">
                    {testimonial.revenue}
                  </span>
                </div>

                {/* Before quote */}
                <p className="text-rose-400/80 text-sm italic mb-4">
                  Before: "{testimonial.before}"
                </p>

                {/* Main testimonial */}
                <p className="text-white/90 leading-relaxed mb-6">"{testimonial.quote}"</p>

                {/* Author */}
                <div className="flex items-center gap-4 pt-4 border-t border-white/10">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold text-sm">{testimonial.name}</p>
                    <p className="text-xs text-zinc-500">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section 
        id="problem" 
        ref={(el) => (sectionRefs.current.problem = el)}
        className="section"
        data-testid="problem-section"
      >
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <div className={`text-center mb-12 ${isVisible.problem ? 'animate-fade-up' : 'opacity-0'}`} style={{ animationFillMode: 'both' }}>
              <span className="text-rose-400 text-sm font-semibold uppercase tracking-widest">The Hidden Problem</span>
              <h2 className="text-3xl sm:text-4xl font-bold mt-4 mb-6" data-testid="problem-title">
                Why You're Invisible in AI Search
              </h2>
              <p className="text-lg text-zinc-400">
                AI tools like ChatGPT, Google AI, and Perplexity are replacing traditional search. They recommend businesses differently — and if you're not optimized for them, you won't appear.
              </p>
            </div>

            <div className={`bento-card mb-8 ${isVisible.problem ? 'animate-fade-up' : 'opacity-0'}`} style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
              <div className="flex items-start gap-4 mb-6">
                <div className="p-3 bg-red-500/10 rounded-xl">
                  <AlertTriangle className="w-6 h-6 text-red-500" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">AI Tools Are Replacing Traditional Search</h3>
                  <p className="text-zinc-400">
                    ChatGPT, Google AI, and Perplexity don't show 10 blue links anymore. They recommend 1-3 businesses directly. If you're not one of them, you simply don't exist to potential customers.
                  </p>
                </div>
              </div>
            </div>

            <div className={`grid sm:grid-cols-3 gap-4 ${isVisible.problem ? 'animate-fade-up' : 'opacity-0'}`} style={{ animationDelay: '0.3s', animationFillMode: 'both' }}>
              <div className="bento-card text-center hover-lift">
                <div className="w-12 h-12 mx-auto mb-4 bg-blue-500/10 rounded-xl flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-blue-500" />
                </div>
                <h4 className="font-semibold mb-2">Mentions Across the Web</h4>
                <p className="text-sm text-zinc-500">AI tools scan mentions, reviews, and citations to decide who gets recommended.</p>
              </div>
              <div className="bento-card text-center hover-lift">
                <div className="w-12 h-12 mx-auto mb-4 bg-purple-500/10 rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-purple-500" />
                </div>
                <h4 className="font-semibold mb-2">Authority Signals</h4>
                <p className="text-sm text-zinc-500">Your digital footprint determines if AI sees you as trustworthy enough to recommend.</p>
              </div>
              <div className="bento-card text-center hover-lift">
                <div className="w-12 h-12 mx-auto mb-4 bg-green-500/10 rounded-xl flex items-center justify-center">
                  <Target className="w-6 h-6 text-green-500" />
                </div>
                <h4 className="font-semibold mb-2">Trust Consistency</h4>
                <p className="text-sm text-zinc-500">Inconsistent info across platforms tanks your AI visibility score immediately.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section 
        id="solution" 
        ref={(el) => (sectionRefs.current.solution = el)}
        className="section bg-[#0A0A0A]"
        data-testid="solution-section"
      >
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <div className={`mb-12 ${isVisible.solution ? 'animate-fade-up' : 'opacity-0'}`} style={{ animationFillMode: 'both' }}>
              <span className="text-cyan-400 text-sm font-semibold uppercase tracking-widest">The Solution</span>
              <h2 className="text-3xl sm:text-4xl font-bold mt-4 mb-6" data-testid="solution-title">
                What This Report Does
              </h2>
              <p className="text-lg text-zinc-400">
                We audit your entire digital presence against what AI platforms actually care about.
              </p>
            </div>

            <div className={`grid sm:grid-cols-2 gap-6 text-left ${isVisible.solution ? 'animate-fade-up' : 'opacity-0'}`} style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
              <div className="bento-card hover-lift">
                <div className="flex items-center gap-3 mb-3">
                  <div className="check-icon"><Check className="w-4 h-4 text-white" /></div>
                  <h4 className="font-semibold">Analyze 30+ AI Visibility Signals</h4>
                </div>
                <p className="text-zinc-500 pl-10">We scan everything AI platforms use to decide who to recommend.</p>
              </div>
              <div className="bento-card hover-lift">
                <div className="flex items-center gap-3 mb-3">
                  <div className="check-icon"><Check className="w-4 h-4 text-white" /></div>
                  <h4 className="font-semibold">Show Missing Visibility Gaps</h4>
                </div>
                <p className="text-zinc-500 pl-10">Discover the specific reasons why AI isn't picking your business.</p>
              </div>
              <div className="bento-card hover-lift">
                <div className="flex items-center gap-3 mb-3">
                  <div className="check-icon"><Check className="w-4 h-4 text-white" /></div>
                  <h4 className="font-semibold">Show Why Competitors Win</h4>
                </div>
                <p className="text-zinc-500 pl-10">Side-by-side comparison showing what they're doing that you're not.</p>
              </div>
              <div className="bento-card hover-lift">
                <div className="flex items-center gap-3 mb-3">
                  <div className="check-icon"><Check className="w-4 h-4 text-white" /></div>
                  <h4 className="font-semibold">Provide Exact Fixes</h4>
                </div>
                <p className="text-zinc-500 pl-10">Prioritized action items you can implement immediately.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section 
        id="howItWorks" 
        ref={(el) => (sectionRefs.current.howItWorks = el)}
        className="section"
        data-testid="how-it-works-section"
      >
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <div className={`text-center mb-16 ${isVisible.howItWorks ? 'animate-fade-up' : 'opacity-0'}`} style={{ animationFillMode: 'both' }}>
              <span className="text-violet-400 text-sm font-semibold uppercase tracking-widest">Simple Process</span>
              <h2 className="text-3xl sm:text-4xl font-bold mt-4" data-testid="how-it-works-title">
                How It Works
              </h2>
            </div>

            <div className="space-y-8 relative">
              {[
                {
                  step: "1",
                  title: "Enter Your Business Details",
                  description: "Tell us your business name, location, and website. Takes less than 2 minutes."
                },
                {
                  step: "2",
                  title: "We Analyze AI Visibility",
                  description: "Our system scans ChatGPT, Google AI, Perplexity, and more to see how you appear."
                },
                {
                  step: "3",
                  title: "Receive Report + Fixes in 48 Hours",
                  description: "Get your personalized report with exact steps to improve your AI recommendations."
                }
              ].map((item, index) => (
                <div 
                  key={index}
                  className={`flex gap-6 items-start ${isVisible.howItWorks ? 'animate-slide-left' : 'opacity-0'}`}
                  style={{ animationDelay: `${(index + 1) * 0.15}s`, animationFillMode: 'both' }}
                  data-testid={`step-${index + 1}`}
                >
                  <div className="step-badge">{item.step}</div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                    <p className="text-zinc-400">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Value Stack / Pricing Section */}
      <section 
        id="pricing" 
        ref={(el) => (sectionRefs.current.pricing = el)}
        className="section bg-[#0A0A0A]"
        data-testid="pricing-section"
      >
        <div className="container-custom">
          <div className="max-w-2xl mx-auto">
            <div className={`text-center mb-12 ${isVisible.pricing ? 'animate-fade-up' : 'opacity-0'}`} style={{ animationFillMode: 'both' }}>
              <span className="text-emerald-400 text-sm font-semibold uppercase tracking-widest">Pricing</span>
              <h2 className="text-3xl sm:text-4xl font-bold mt-4" data-testid="pricing-title">
                What You Get ($199)
              </h2>
            </div>

            <div className={`pricing-card bento-card border-emerald-500/30 ${isVisible.pricing ? 'animate-scale-in' : 'opacity-0'}`} style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
              <div className="space-y-4 mb-8">
                {valueItems.map((item, index) => (
                  <div key={index} className="value-item" data-testid={`value-item-${index}`}>
                    <div className="check-icon"><Check className="w-4 h-4 text-white" /></div>
                    <span className="flex-1 font-medium">{item.name}</span>
                    <span className="text-zinc-500 original-price">{item.value}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-white/10 pt-6 mb-8">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-zinc-400">Total Value</span>
                  <span className="text-xl font-bold original-price">$750+</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Today's Price</span>
                  <span className="text-4xl font-extrabold text-emerald-400">$199</span>
                </div>
              </div>

              <button 
                className="cta-button w-full text-lg py-5 animate-pulse-glow"
                data-testid="pricing-cta"
              >
                Get My AI Visibility Report – $199
                <ArrowRight className="w-5 h-5" />
              </button>

              <div className="flex flex-wrap justify-center gap-4 mt-6 text-sm text-zinc-500">
                <span className="flex items-center gap-2">
                  <Clock className="w-4 h-4" /> 24-48 hour delivery
                </span>
                <span className="flex items-center gap-2">
                  <Shield className="w-4 h-4" /> 100% money-back guarantee
                </span>
              </div>
            </div>

            {/* Urgency Banner */}
            <div className={`urgency-banner mt-8 text-center ${isVisible.pricing ? 'animate-fade-up' : 'opacity-0'}`} style={{ animationDelay: '0.4s', animationFillMode: 'both' }} data-testid="urgency-banner">
              <p className="flex items-center justify-center gap-2 text-amber-400 font-semibold">
                <AlertTriangle className="w-5 h-5" />
                Only 10 reports generated per day to maintain quality
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Risk Reversal Section */}
      <section 
        id="guarantee" 
        ref={(el) => (sectionRefs.current.guarantee = el)}
        className="section"
        data-testid="guarantee-section"
      >
        <div className="container-custom">
          <div className="max-w-2xl mx-auto">
            <div className={`guarantee-badge text-center ${isVisible.guarantee ? 'animate-scale-in' : 'opacity-0'}`} style={{ animationFillMode: 'both' }}>
              <div className="w-16 h-16 mx-auto mb-4 bg-green-500/20 rounded-full flex items-center justify-center">
                <Shield className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="text-2xl font-bold mb-3" data-testid="guarantee-title">100% Risk-Free</h3>
              <p className="text-zinc-400 leading-relaxed">
                If you don't find at least 3 actionable insights in your report, we'll refund you completely. No questions asked. We're confident in the value because we've helped 847+ businesses already.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section 
        id="faq" 
        ref={(el) => (sectionRefs.current.faq = el)}
        className="section bg-[#0A0A0A]"
        data-testid="faq-section"
      >
        <div className="container-custom">
          <div className="max-w-2xl mx-auto">
            <div className={`text-center mb-12 ${isVisible.faq ? 'animate-fade-up' : 'opacity-0'}`} style={{ animationFillMode: 'both' }}>
              <span className="text-zinc-400 text-sm font-semibold uppercase tracking-widest">FAQ</span>
              <h2 className="text-3xl sm:text-4xl font-bold mt-4" data-testid="faq-title">
                Common Questions
              </h2>
            </div>

            <div className={`space-y-0 ${isVisible.faq ? 'animate-fade-up' : 'opacity-0'}`} style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
              {faqItems.map((item, index) => (
                <div key={index} className="faq-item" data-testid={`faq-${index}`}>
                  <button
                    className="faq-question w-full text-left"
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    aria-expanded={openFaq === index}
                  >
                    <span>{item.question}</span>
                    <ChevronDown 
                      className={`w-5 h-5 text-zinc-500 transition-transform duration-300 ${openFaq === index ? 'rotate-180' : ''}`} 
                    />
                  </button>
                  {openFaq === index && (
                    <div className="faq-answer animate-fade-in">{item.answer}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section 
        id="finalCta" 
        ref={(el) => (sectionRefs.current.finalCta = el)}
        className="section"
        data-testid="final-cta-section"
      >
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <div className={`${isVisible.finalCta ? 'animate-fade-up' : 'opacity-0'}`} style={{ animationFillMode: 'both' }}>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6" data-testid="final-cta-title">
                Stop Losing Customers to AI Recommendations
              </h2>
              <p className="text-lg text-zinc-400 mb-10 max-w-xl mx-auto">
                Every day you wait, your competitors get stronger in AI search. Get the insights you need to take back your visibility.
              </p>
              <button 
                className="cta-button text-lg px-10 py-5 animate-pulse-glow"
                data-testid="final-cta-button"
              >
                Get My AI Visibility Report – $199
                <ArrowRight className="w-5 h-5" />
              </button>
              <p className="text-sm text-zinc-600 mt-6">
                Join 127+ businesses who've improved their AI visibility
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/10" data-testid="footer">
        <div className="container-custom text-center">
          <div className="logo-text text-white mb-4">
            GEO<span className="text-yellow-500">Boost</span>
          </div>
          <p className="text-sm text-zinc-600">
            © 2026 GEO Boost Engine. All rights reserved.
          </p>
        </div>
      </footer>

      {/* Mobile Sticky CTA */}
      <div className="mobile-sticky-cta md:hidden" data-testid="mobile-sticky-cta">
        <button 
          onClick={scrollToCTA}
          className="cta-button w-full py-4"
        >
          Get My Report – $199
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
