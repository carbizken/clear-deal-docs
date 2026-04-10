import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import SignaturePad from "@/components/addendum/SignaturePad";
import { toast } from "sonner";

interface ProductSnapshot {
  id: string;
  name: string;
  subtitle: string | null;
  warranty: string | null;
  badge_type: string;
  price: number;
  price_label: string | null;
  disclosure: string | null;
}

const MobileSigning = () => {
  const { token } = useParams<{ token: string }>();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [addendum, setAddendum] = useState<any>(null);
  const [error, setError] = useState("");

  const [initials, setInitials] = useState<Record<string, string>>({});
  const [optionalSelections, setOptionalSelections] = useState<Record<string, string>>({});
  const [customerName, setCustomerName] = useState("");
  const [customerSig, setCustomerSig] = useState({ data: "", type: "draw" as "draw" | "type" });
  const [bulkInitials, setBulkInitials] = useState("");

  useEffect(() => {
    if (!token) return;
    loadAddendum();
  }, [token]);

  const loadAddendum = async () => {
    const { data, error } = await supabase.rpc("get_addendum_by_token", { _token: token });
    if (error || !data || data.length === 0) {
      setError("Invalid or expired signing link.");
      setLoading(false);
      return;
    }
    const doc = data[0];
    if (doc.status === "signed") {
      setError("This addendum has already been signed.");
      setLoading(false);
      return;
    }
    setAddendum(doc);
    setInitials((doc.initials as Record<string, string>) || {});
    setOptionalSelections((doc.optional_selections as Record<string, string>) || {});
    setLoading(false);
  };

  const products: ProductSnapshot[] = addendum?.products_snapshot || [];
  const installed = products.filter((p) => p.badge_type === "installed");
  const optional = products.filter((p) => p.badge_type === "optional");

  const handleFillAll = () => {
    if (!bulkInitials.trim()) return;
    const filled: Record<string, string> = {};
    products.forEach((p) => { filled[p.id] = bulkInitials.toUpperCase(); });
    setInitials(filled);
  };

  const handleSubmit = async () => {
    const missingInitials = products.filter((p) => !initials[p.id]?.trim());
    if (missingInitials.length > 0) {
      toast.error(`Please initial all ${missingInitials.length} product(s).`);
      return;
    }
    const missingSelections = optional.filter((p) => !optionalSelections[p.id]);
    if (missingSelections.length > 0) {
      toast.error(`Please accept or decline all optional products.`);
      return;
    }
    if (!customerSig.data) {
      toast.error("Please provide your signature.");
      return;
    }

    setSubmitting(true);
    const { error } = await supabase
      .from("addendums")
      .update({
        initials: initials as any,
        optional_selections: optionalSelections as any,
        customer_name: customerName || null,
        customer_signature_data: customerSig.data,
        customer_signature_type: customerSig.type,
        customer_signed_at: new Date().toISOString(),
        status: "signed",
      } as any)
      .eq("signing_token", token!);

    setSubmitting(false);
    if (error) {
      toast.error("Failed to submit. Please try again.");
      console.error(error);
    } else {
      setSubmitted(true);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground animate-pulse">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <div className="text-center">
          <div className="text-4xl mb-4">⚠️</div>
          <h1 className="text-xl font-bold text-foreground mb-2">Cannot Open</h1>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <div className="text-center">
          <div className="text-5xl mb-4">✅</div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Thank You!</h1>
          <p className="text-muted-foreground">Your signature has been recorded. You may close this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-lg mx-auto space-y-6">
        {/* Header */}
        <div className="bg-card rounded-xl p-5 shadow-sm">
          <h1 className="text-xl font-bold font-barlow-condensed text-foreground">Dealer Addendum — Sign & Initial</h1>
          {addendum.vehicle_ymm && <p className="text-sm font-semibold text-foreground mt-1">{addendum.vehicle_ymm}</p>}
          {addendum.vehicle_vin && <p className="text-xs text-muted-foreground">VIN: {addendum.vehicle_vin}</p>}
        </div>

        {/* Fill All Initials */}
        <div className="bg-card rounded-xl p-5 shadow-sm">
          <p className="text-xs font-semibold text-muted-foreground mb-2">Quick Fill — Your Initials</p>
          <div className="flex gap-2">
            <input
              value={bulkInitials}
              onChange={(e) => setBulkInitials(e.target.value.toUpperCase())}
              placeholder="e.g. JD"
              className="flex-1 h-12 border-2 border-border rounded-lg px-4 text-lg font-bold text-center uppercase bg-background text-foreground placeholder:text-muted-foreground/40"
            />
            <button onClick={handleFillAll} className="px-5 h-12 bg-teal text-primary-foreground rounded-lg font-bold text-sm">
              Fill All
            </button>
          </div>
        </div>

        {/* Products */}
        <div className="bg-card rounded-xl p-5 shadow-sm space-y-4">
          <h2 className="text-sm font-bold font-barlow-condensed text-foreground">Products & Acknowledgment</h2>

          {installed.map((p) => (
            <div key={p.id} className="border border-border rounded-lg p-3 space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold bg-navy text-primary-foreground px-1.5 py-0.5 rounded">Pre-Installed</span>
                  <p className="text-sm font-semibold text-foreground mt-1">{p.name}</p>
                  {p.warranty && <p className="text-[10px] text-muted-foreground">{p.warranty}</p>}
                </div>
                <p className="text-sm font-bold text-foreground">${p.price.toFixed(2)}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-semibold text-muted-foreground">INITIALS:</span>
                <input
                  value={initials[p.id] || ""}
                  onChange={(e) => setInitials((prev) => ({ ...prev, [p.id]: e.target.value.toUpperCase() }))}
                  placeholder="____"
                  className={`w-20 h-10 border-2 rounded-lg px-2 text-base font-bold text-center uppercase bg-background text-foreground ${initials[p.id]?.trim() ? "border-teal" : "border-action"}`}
                />
              </div>
            </div>
          ))}

          {optional.length > 0 && (
            <div className="border-t border-border pt-3">
              <p className="text-xs font-bold text-muted-foreground mb-2">▼ Optional Items — Accept or Decline</p>
            </div>
          )}

          {optional.map((p) => (
            <div key={p.id} className="border border-border rounded-lg p-3 space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold bg-gold text-navy px-1.5 py-0.5 rounded">Optional</span>
                  <p className="text-sm font-semibold text-foreground mt-1">{p.name}</p>
                </div>
                <p className="text-sm font-bold text-foreground">${p.price.toFixed(2)}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setOptionalSelections((prev) => ({ ...prev, [p.id]: "accept" }))}
                  className={`flex-1 h-10 rounded-lg text-sm font-bold border-2 ${optionalSelections[p.id] === "accept" ? "border-teal bg-teal text-primary-foreground" : "border-border text-foreground"}`}
                >
                  ✓ Accept
                </button>
                <button
                  onClick={() => setOptionalSelections((prev) => ({ ...prev, [p.id]: "decline" }))}
                  className={`flex-1 h-10 rounded-lg text-sm font-bold border-2 ${optionalSelections[p.id] === "decline" ? "border-destructive bg-destructive text-primary-foreground" : "border-border text-foreground"}`}
                >
                  ✗ Decline
                </button>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-semibold text-muted-foreground">INITIALS:</span>
                <input
                  value={initials[p.id] || ""}
                  onChange={(e) => setInitials((prev) => ({ ...prev, [p.id]: e.target.value.toUpperCase() }))}
                  placeholder="____"
                  className={`w-20 h-10 border-2 rounded-lg px-2 text-base font-bold text-center uppercase bg-background text-foreground ${initials[p.id]?.trim() ? "border-teal" : "border-action"}`}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Signature */}
        <div className="bg-card rounded-xl p-5 shadow-sm space-y-4">
          <h2 className="text-sm font-bold font-barlow-condensed text-foreground">Your Signature</h2>
          <input
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="Full name (printed)"
            className="w-full h-12 border-2 border-border rounded-lg px-4 text-base bg-background text-foreground placeholder:text-muted-foreground/40"
          />
          <SignaturePad
            label="Customer Signature"
            subtitle="Sign above to acknowledge receipt"
            onChange={(data, type) => setCustomerSig({ data, type })}
          />
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full h-14 bg-teal text-primary-foreground rounded-xl font-bold text-lg disabled:opacity-50"
        >
          {submitting ? "Submitting..." : "✅ Submit Signature"}
        </button>
      </div>
    </div>
  );
};

export default MobileSigning;
