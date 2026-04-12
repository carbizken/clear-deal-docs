import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface VehicleInput {
  year?: string;
  make?: string;
  model?: string;
  trim?: string;
  mileage?: string;
  color?: string;
  condition?: string;
  bodyStyle?: string;
  engine?: string;
  transmission?: string;
  driveType?: string;
  fuelType?: string;
  price?: string;
}

export const useAiDescription = () => {
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = async (vehicle: VehicleInput): Promise<string> => {
    setGenerating(true);
    setError(null);

    try {
      // Call Supabase Edge Function (holds API key securely)
      const { data, error: fnError } = await supabase.functions.invoke("ai-description", {
        body: { vehicle },
      });

      if (fnError) throw new Error(fnError.message);
      if (!data?.success) throw new Error(data?.error || "Failed to generate description");

      setGenerating(false);
      return data.description;
    } catch (err: any) {
      // Fallback to template if edge function unavailable
      console.warn("AI description edge function unavailable, using template:", err.message);
      setError(null); // Don't show error for fallback
      setGenerating(false);
      return buildTemplate(vehicle);
    }
  };

  return { generate, generating, error };
};

// Template fallback when edge function is unavailable
function buildTemplate(v: VehicleInput): string {
  const parts: string[] = [];
  const ymm = [v.year, v.make, v.model, v.trim].filter(Boolean).join(" ");

  if (v.condition === "New" || v.condition === "new") {
    parts.push(`Brand new ${ymm}${v.color ? ` in ${v.color}` : ""}.`);
  } else {
    parts.push(`${v.condition === "cpo" ? "Certified Pre-Owned" : "Pre-owned"} ${ymm}${v.color ? ` in ${v.color}` : ""}.`);
  }

  if (v.mileage && parseInt(v.mileage) > 0) {
    parts.push(`Only ${parseInt(v.mileage).toLocaleString()} miles.`);
  }

  const specs: string[] = [];
  if (v.engine) specs.push(v.engine);
  if (v.transmission) specs.push(v.transmission);
  if (v.driveType) specs.push(v.driveType);
  if (specs.length > 0) parts.push(`Equipped with ${specs.join(", ")}.`);

  parts.push("Contact us today for a test drive and to learn about our dealer-installed accessories and protection packages.");

  return parts.join(" ");
}
