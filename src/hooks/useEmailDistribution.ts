import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type EmailRecipientRole = "finance_manager" | "general_sales_manager" | "general_manager" | "office_manager" | "customer";

export interface EmailRecipient {
  role: EmailRecipientRole;
  name: string;
  email: string;
}

const ROLE_LABELS: Record<EmailRecipientRole, string> = {
  finance_manager: "Finance Manager",
  general_sales_manager: "General Sales Manager",
  general_manager: "General Manager",
  office_manager: "Office Manager",
  customer: "Customer",
};

const RECIPIENTS_KEY = "email_recipients";

export const useEmailDistribution = () => {
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get saved recipients for a store
  const getRecipients = (storeId: string): EmailRecipient[] => {
    try {
      const all = JSON.parse(localStorage.getItem(RECIPIENTS_KEY) || "{}");
      return all[storeId] || [];
    } catch { return []; }
  };

  // Save recipients for a store
  const saveRecipients = (storeId: string, recipients: EmailRecipient[]) => {
    const all = JSON.parse(localStorage.getItem(RECIPIENTS_KEY) || "{}");
    all[storeId] = recipients;
    localStorage.setItem(RECIPIENTS_KEY, JSON.stringify(all));
  };

  // Send signed addendum packet via email
  const sendPacket = async (data: {
    to: string[];
    dealerName: string;
    vehicleYmm: string;
    vehicleVin: string;
    customerName: string;
    signingDate: string;
    pdfBase64?: string;
  }): Promise<boolean> => {
    setSending(true);
    setError(null);

    const html = `
      <div style="font-family: -apple-system, 'Inter', sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #0f1e3c; color: white; padding: 20px; text-align: center;">
          <h2 style="margin: 0; font-size: 18px;">Signed Addendum — ${data.vehicleYmm}</h2>
        </div>
        <div style="padding: 24px; background: #ffffff; border: 1px solid #e5e7eb;">
          <p style="font-size: 14px; color: #374151;">A dealer addendum has been signed and is ready for the deal file.</p>
          <table style="width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 13px;">
            <tr><td style="padding: 8px; border-bottom: 1px solid #e5e7eb; color: #6b7280;">Vehicle</td><td style="padding: 8px; border-bottom: 1px solid #e5e7eb; font-weight: 600;">${data.vehicleYmm}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #e5e7eb; color: #6b7280;">VIN</td><td style="padding: 8px; border-bottom: 1px solid #e5e7eb; font-family: monospace;">${data.vehicleVin}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #e5e7eb; color: #6b7280;">Customer</td><td style="padding: 8px; border-bottom: 1px solid #e5e7eb; font-weight: 600;">${data.customerName}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #e5e7eb; color: #6b7280;">Signed</td><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${data.signingDate}</td></tr>
            <tr><td style="padding: 8px; color: #6b7280;">Dealer</td><td style="padding: 8px; font-weight: 600;">${data.dealerName}</td></tr>
          </table>
          <p style="font-size: 12px; color: #6b7280;">This is an automated notification from your addendum platform. The signed document is attached as a PDF or can be accessed from the Vehicle Files section of your dashboard.</p>
        </div>
        <div style="padding: 12px; text-align: center; font-size: 11px; color: #9ca3af;">
          Powered by Autocurb.io — Where the lot meets the cloud
        </div>
      </div>
    `;

    try {
      const { data: result, error: fnError } = await supabase.functions.invoke("send-email", {
        body: {
          to: data.to,
          subject: `Signed Addendum: ${data.vehicleYmm} — ${data.customerName}`,
          html,
          attachments: data.pdfBase64 ? [{
            filename: `Addendum-${data.vehicleVin}.pdf`,
            content: data.pdfBase64,
          }] : undefined,
        },
      });

      if (fnError) throw new Error(fnError.message);
      if (!result?.success) throw new Error(result?.error || "Email failed");

      setSending(false);
      return true;
    } catch (err: any) {
      setError(err.message);
      setSending(false);
      return false;
    }
  };

  return {
    sendPacket,
    sending,
    error,
    getRecipients,
    saveRecipients,
    ROLE_LABELS,
  };
};
