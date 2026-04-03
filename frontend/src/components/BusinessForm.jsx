import { useState } from "react";
import { ArrowRight, Building2, Globe, MapPin, User, Mail, Phone, Briefcase, Loader2, Check, X } from "lucide-react";



const BusinessForm = ({ onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    business_name: "",
    website: "",
    location: "",
    owner_name: "",
    email: "",
    phone: "",
    business_type: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const businessTypes = [
    "HVAC & Heating",
    "Plumbing",
    "Dental Practice",
    "Law Firm",
    "Med Spa / Aesthetics",
    "Roofing",
    "Electrical",
    "Landscaping",
    "Auto Repair",
    "Restaurant / Food Service",
    "Real Estate",
    "Accounting / CPA",
    "Chiropractic",
    "Veterinary",
    "Home Services",
    "Other"
  ];

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
      let website = formData.website?.trim();
      if (!website) {
    throw new Error("Website is required");
  }

  // Auto-fix missing https
  if (!website.startsWith("http")) {
    website = "https://" + website;
  }
// Submit to Web3Forms
const response = await fetch("https://api.web3forms.com/submit", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    access_key: "d144a58c-919a-42a5-aced-0dc8a92fc3e9", // 🔥 replace this
    business_name: formData.business_name,
    website: website,
    location: formData.location,
    owner_name: formData.owner_name,
    email: formData.email,
    phone: formData.phone,
    business_type: formData.business_type
  })
});

const result = await response.json();

if (!result.success) {
  throw new Error("Failed to submit business details");
}

// Track conversion
if (window.gtag) {
  window.gtag('event', 'begin_checkout', {
    currency: 'USD',
    value: 199
  });
}
if (window.fbq) {
  window.fbq('track', 'InitiateCheckout', { value: 199, currency: 'USD' });
}

// Redirect to Dodo payment
const redirectUrl = encodeURIComponent("https://citacy.com/success");

window.location.href = `https://checkout.dodopayments.com/buy/pdt_0Nbpq9wUkTs7uNmcVtzrq?quantity=1&email=${formData.email}&redirect_url=${redirectUrl}`;

    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
      setIsSubmitting(false);
    }
  };

  const inputClasses = "w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all";
  const labelClasses = "block text-sm font-medium text-zinc-400 mb-2";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" data-testid="business-form-modal">
      <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto relative">
        {/* Header */}
        <div className="sticky top-0 bg-[#0A0A0A] border-b border-white/10 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">Get Your AI Visibility Report</h2>
            <p className="text-sm text-zinc-500">Tell us about your business</p>
          </div>
          <button 
            onClick={onCancel}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-zinc-400 hover:text-white transition-colors"
            data-testid="close-form-btn"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
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
              data-testid="input-business-name"
            />
          </div>

          {/* Website */}
          <div>
            <label className={labelClasses}>
              <Globe className="w-4 h-4 inline mr-2" />
              Website *
            </label>
            <input
              type="text"
              name="website"
              value={formData.website}
              onChange={handleChange}
              required
              placeholder="example.com or https://example.com"
              className={inputClasses}
              data-testid="input-website"
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
              data-testid="input-location"
            />
          </div>

          {/* Business Type */}
          <div>
            <label className={labelClasses}>
              <Briefcase className="w-4 h-4 inline mr-2" />
              Business Type *
            </label>
            <select
              name="business_type"
              value={formData.business_type}
              onChange={handleChange}
              required
              className={inputClasses}
              data-testid="input-business-type"
            >
              <option value="">Select your industry</option>
              {businessTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Owner Name */}
          <div>
            <label className={labelClasses}>
              <User className="w-4 h-4 inline mr-2" />
              Your Name *
            </label>
            <input
              type="text"
              name="owner_name"
              value={formData.owner_name}
              onChange={handleChange}
              required
              placeholder="e.g., John Smith"
              className={inputClasses}
              data-testid="input-owner-name"
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
              data-testid="input-email"
            />
          </div>

          {/* Phone */}
          <div>
            <label className={labelClasses}>
              <Phone className="w-4 h-4 inline mr-2" />
              Phone *
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              placeholder="(555) 123-4567"
              className={inputClasses}
              data-testid="input-phone"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-400 text-sm" data-testid="form-error">
              {error}
            </div>
          )}

          {/* Price Summary */}
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4">
            <div className="flex justify-between items-center">
              <span className="text-zinc-400">AI Visibility Report</span>
              <span className="text-2xl font-bold text-emerald-400">$199</span>
            </div>
            <p className="text-xs text-zinc-500 mt-2">One-time payment • Delivered in 24-48 hours</p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            data-testid="submit-form-btn"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                Continue to Payment
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>

          <p className="text-xs text-center text-zinc-600">
            100% secure payment • Money-back guarantee
          </p>
        </form>
      </div>
    </div>
  );
};

export default BusinessForm;
