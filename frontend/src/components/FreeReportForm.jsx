import { useState } from "react";
import { ArrowRight, Mail, Building2, MapPin, Globe, Loader2, Check, Gift, X } from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const FreeReportForm = ({ onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    business_name: "",
    email: "",
    website: "",
    location: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Create free lead
      const response = await fetch(`${BACKEND_URL}/api/free-leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error("Failed to submit. Please try again.");
      }

      // Track conversion event
      if (window.gtag) {
        window.gtag('event', 'free_report_signup', {
          method: 'email'
        });
      }
      if (window.fbq) {
        window.fbq('track', 'Lead', { content_name: 'Free Report' });
      }

      setIsSubmitted(true);

    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
      setIsSubmitting(false);
    }
  };

  const inputClasses = "w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all";
  const labelClasses = "block text-sm font-medium text-zinc-400 mb-2";

  // Success state
  if (isSubmitted) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" data-testid="free-report-success">
        <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl w-full max-w-md p-8 text-center relative">
          {/* Close button */}
          <button 
            onClick={onCancel}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-zinc-400 hover:text-white transition-colors"
            data-testid="close-success-btn"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-emerald-500" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">Check Your Email!</h2>
          <p className="text-zinc-400 mb-6">
            Your free AI visibility snapshot is on its way to <span className="text-white font-medium">{formData.email}</span>
          </p>
          <p className="text-sm text-zinc-500 mb-6">
            It may take a few minutes to arrive. Check your spam folder if you don't see it.
          </p>
          <button
            onClick={onCancel}
            className="w-full bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-6 rounded-xl transition-all"
          >
            Got It
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" data-testid="free-report-form-modal">
      <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl w-full max-w-md relative pt-10">

{/* Header */}
<div className="bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 px-6 py-5 flex items-center justify-between rounded-t-2xl border-b border-white/10">

  {/* LEFT SIDE */}
  <div className="flex items-center gap-3">
    <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center">
      <Gift className="w-5 h-5 text-emerald-400" />
    </div>
    <div>
      <h2 className="text-white font-semibold">Free AI Visibility Report</h2>
      <p className="text-sm text-zinc-400">Instant snapshot</p>
    </div>
  </div>

  {/* RIGHT SIDE CLOSE BUTTON */}
  <button 
    onClick={onCancel}
    className="w-10 h-10 flex items-center justify-center rounded-full bg-white text-black hover:bg-gray-200 shadow-lg"
  >
    ✕
  </button>

</div>
        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Business Name */}
          <div>
            <label className={labelClasses}>
              <Building2 className="w-4 h-4 inline mr-2" />
              Business Name *
            </label>
            <input
              type="text"
              name="business_name"
              value={formData.business_name}
              onChange={handleChange}
              required
              placeholder="e.g., Smith's HVAC Services"
              className={inputClasses}
              data-testid="free-input-business-name"
            />
          </div>

          {/* Website */}
          <div>
            <label className={labelClasses}>
              <Globe className="w-4 h-4 inline mr-2" />
              Website *
            </label>
            <input
              type="url"
              name="website"
              value={formData.website}
              onChange={handleChange}
              required
              placeholder="https://yourwebsite.com"
              className={inputClasses}
              data-testid="free-input-website"
            />
          </div>

          {/* Email */}
          <div>
            <label className={labelClasses}>
              <Mail className="w-4 h-4 inline mr-2" />
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="you@yourbusiness.com"
              className={inputClasses}
              data-testid="free-input-email"
            />
          </div>

          {/* Location */}
          <div>
            <label className={labelClasses}>
              <MapPin className="w-4 h-4 inline mr-2" />
              Location (City, State) *
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              placeholder="e.g., Phoenix, AZ"
              className={inputClasses}
              data-testid="free-input-location"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-400 text-sm" data-testid="free-form-error">
              {error}
            </div>
          )}

          {/* What you get */}
          <div className="bg-white/5 rounded-xl p-4">
            <p className="text-sm font-medium text-white mb-2">Your free snapshot includes:</p>
            <ul className="text-sm text-zinc-400 space-y-1">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" /> Basic AI visibility score
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" /> Top 3 visibility gaps
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" /> Estimated revenue loss
              </li>
            </ul>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            data-testid="submit-free-form-btn"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                Send My Free Snapshot
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>

          <p className="text-xs text-center text-zinc-600">
            No credit card required • Delivered via email
          </p>
        </form>
      </div>
    </div>
  );
};

export default FreeReportForm;
