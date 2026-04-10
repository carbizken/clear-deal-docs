import { useState } from "react";

interface VehicleInput {
  year: string;
  make: string;
  model: string;
  trim: string;
  mileage: string;
  color: string;
  condition: string;
  bodyStyle: string;
  engine: string;
  transmission: string;
  driveType: string;
  fuelType: string;
  price: string;
}

// AI vehicle description generator
// In production, this calls Claude API via Supabase Edge Function
// For now, generates a structured template-based description
export const useAiDescription = () => {
  const [generating, setGenerating] = useState(false);

  const generate = async (vehicle: Partial<VehicleInput>): Promise<string> => {
    setGenerating(true);

    // Template-based generation (swap for Claude API in production)
    const desc = buildDescription(vehicle);

    // Simulate slight delay for UX
    await new Promise(r => setTimeout(r, 500));
    setGenerating(false);
    return desc;
  };

  return { generate, generating };
};

function buildDescription(v: Partial<VehicleInput>): string {
  const parts: string[] = [];
  const ymm = [v.year, v.make, v.model, v.trim].filter(Boolean).join(" ");

  if (v.condition === "New" || v.condition === "new") {
    parts.push(`Brand new ${ymm}${v.color ? ` in ${v.color}` : ""}.`);
  } else {
    parts.push(`${v.condition === "cpo" ? "Certified Pre-Owned" : "Pre-owned"} ${ymm}${v.color ? ` in ${v.color}` : ""}.`);
  }

  if (v.mileage && parseInt(v.mileage) > 0) {
    const mi = parseInt(v.mileage).toLocaleString();
    parts.push(`Only ${mi} miles.`);
  }

  const specs: string[] = [];
  if (v.engine) specs.push(v.engine);
  if (v.transmission) specs.push(v.transmission);
  if (v.driveType) specs.push(v.driveType);
  if (v.fuelType && v.fuelType.toLowerCase() !== "gasoline") specs.push(v.fuelType);
  if (specs.length > 0) parts.push(`Equipped with ${specs.join(", ")}.`);

  if (v.bodyStyle) parts.push(`${v.bodyStyle} body style.`);

  if (v.price && parseFloat(v.price) > 0) {
    parts.push(`Priced at $${parseFloat(v.price).toLocaleString()}.`);
  }

  parts.push("Contact us today for a test drive and to learn about our dealer-installed accessories and protection packages included with this vehicle.");

  return parts.join(" ");
}
