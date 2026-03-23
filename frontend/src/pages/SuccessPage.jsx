import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Check, ArrowRight, Mail, Clock, FileText } from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const SuccessPage = () => {
  const [searchParams] = useSearchParams();
  const [isConfirming, setIsConfirming] = useState(true);
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const confirmPayment = async () => {
      const leadId = searchParams.get("lead_id");
      const sessionId = searchParams.get("session_id");

      if (!leadId || !sessionId) {
        setError("Invalid payment session");
        setIsConfirming(false);
        return;
      }

      try {
        const response = await fetch(
          `${BACKEND_URL}/api/payments/confirm?lead_id=${leadId}&session_id=${sessionId}`,
          { method: "POST" }
        );

        if (!response.ok) {
          throw new Error("Failed to confirm payment");
        }

        // Track conversion
        if (window.gtag) {
          window.gtag('event', 'purchase', {
            transaction_id: sessionId,
            value: 199,
            currency: 'USD',
            items: [{ item_name: 'AI Visibility Report', price: 199 }]
          });
        }
        if (window.fbq) {
          window.fbq('track', 'Purchase', { value: 199, currency: 'USD' });
        }

        setConfirmed(true);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsConfirming(false);
      }
    };

    confirmPayment();
  }, [searchParams]);

  if (isConfirming) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-zinc-400">Confirming your payment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4">
        <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">⚠️</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Something went wrong</h1>
          <p className="text-zinc-400 mb-6">{error}</p>
          <Link 
            to="/"
            className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold py-3 px-6 rounded-full transition-all"
          >
            Return Home
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4" data-testid="success-page">
      <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-8 max-w-lg text-center">
        {/* Success Icon */}
        <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6 animate-scale-in">
          <Check className="w-10 h-10 text-emerald-500" />
        </div>

        <h1 className="text-3xl font-bold text-white mb-3">Payment Successful!</h1>
        <p className="text-zinc-400 mb-8">
          Thank you for your purchase. Your AI Visibility Report is being prepared.
        </p>

        {/* What happens next */}
        <div className="bg-[#121212] rounded-xl p-6 mb-8 text-left">
          <h3 className="font-semibold text-white mb-4">What happens next:</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-emerald-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Mail className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <p className="text-white font-medium">Confirmation Email Sent</p>
                <p className="text-sm text-zinc-500">Check your inbox for order details</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-cyan-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Clock className="w-4 h-4 text-cyan-400" />
              </div>
              <div>
                <p className="text-white font-medium">Report in 24-48 Hours</p>
                <p className="text-sm text-zinc-500">Our team is analyzing your AI visibility</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-amber-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <FileText className="w-4 h-4 text-amber-400" />
              </div>
              <div>
                <p className="text-white font-medium">Detailed Report Delivered</p>
                <p className="text-sm text-zinc-500">With actionable fixes you can implement</p>
              </div>
            </div>
          </div>
        </div>

        <Link 
          to="/"
          className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors"
        >
          <ArrowRight className="w-4 h-4 rotate-180" />
          Return to Homepage
        </Link>
      </div>
    </div>
  );
};

export default SuccessPage;
