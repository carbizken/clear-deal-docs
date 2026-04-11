import { useState } from "react";

interface SmsResult {
  success: boolean;
  message: string;
}

// Twilio-ready SMS hook. In production, this calls a Supabase Edge Function
// that forwards to Twilio. For now, it logs the intent and stores for later.
export const useSmsDelivery = () => {
  const [sending, setSending] = useState(false);
  const [lastResult, setLastResult] = useState<SmsResult | null>(null);

  const sendSigningLink = async (phone: string, signingUrl: string, vehicleInfo: string): Promise<SmsResult> => {
    setSending(true);

    const cleaned = phone.replace(/\D/g, "");
    if (cleaned.length < 10) {
      const result = { success: false, message: "Invalid phone number" };
      setLastResult(result);
      setSending(false);
      return result;
    }

    // Store the SMS request for when Twilio is connected
    const smsQueue = JSON.parse(localStorage.getItem("sms_queue") || "[]");
    smsQueue.push({
      id: crypto.randomUUID(),
      to: cleaned,
      body: `You have a dealer addendum to review and sign for: ${vehicleInfo}. Sign here: ${signingUrl}`,
      signing_url: signingUrl,
      vehicle: vehicleInfo,
      status: "queued",
      created_at: new Date().toISOString(),
    });
    localStorage.setItem("sms_queue", JSON.stringify(smsQueue));

    // In production, this would call:
    // const { data, error } = await supabase.functions.invoke('send-sms', {
    //   body: { to: cleaned, body: message }
    // });

    setSending(false);
    const result = { success: true, message: `SMS queued for ${formatPhone(cleaned)}. Connect Twilio to send.` };
    setLastResult(result);
    return result;
  };

  return { sendSigningLink, sending, lastResult };
};

function formatPhone(digits: string): string {
  if (digits.length === 10) return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  if (digits.length === 11 && digits[0] === "1") return `+1 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
  return digits;
}
