import { ShieldCheck, AlertTriangle } from "lucide-react";
import { useDealerSettings } from "@/contexts/DealerSettingsContext";
import { useTenant } from "@/contexts/TenantContext";
import {
  getStateCompliance,
  getAddendumDisclosures,
  FEDERAL_DISCLOSURES,
} from "@/data/stateCompliance";

interface DisclosuresProps {
  inkSaving?: boolean;
}

const Disclosures = ({ inkSaving }: DisclosuresProps) => {
  const { settings } = useDealerSettings();
  const { currentStore } = useTenant();

  // Get the dealer's state from store config or doc_fee_state setting
  const dealerState = currentStore?.state || settings.doc_fee_state || "";
  const compliance = getStateCompliance(dealerState);
  const stateDisclosures = getAddendumDisclosures(dealerState);

  // Font size enforcement for CA CARS Act
  const headingClass = compliance.requiresBoldType
    ? "text-[12px] font-bold"
    : "text-[10px] font-bold";
  const bodyClass = compliance.requiresBoldType
    ? "text-[10px] font-bold leading-[1.45]"
    : "text-[7px] leading-[1.45]";

  return (
    <div className={`px-3 py-2 rounded space-y-2 ${inkSaving ? "bg-card" : "bg-light"}`}>
      {/* Section header */}
      <div className="flex items-center gap-1.5">
        <ShieldCheck className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
        <p className={`${headingClass} text-foreground`}>
          Required Disclosures & Consumer Rights
        </p>
      </div>

      {/* California CARS Act warning banner */}
      {compliance.carsActState && (
        <div className="bg-amber-50 border border-amber-200 rounded px-2 py-1.5 flex items-start gap-1.5">
          <AlertTriangle className="w-3 h-3 text-amber-600 mt-0.5 flex-shrink-0" />
          <p className="text-[8px] text-amber-800 font-semibold leading-tight">
            CALIFORNIA CARS ACT (SB 766) — This addendum complies with California disclosure
            requirements effective October 1, 2026. Headings are in 12-point bold type and body
            text in 10-point bold type as required. {compliance.requiredLanguages.length > 0 &&
              `Available in: English, ${compliance.requiredLanguages.map(l => ({
                es: "Spanish", zh: "Chinese", tl: "Tagalog", vi: "Vietnamese", ko: "Korean",
              }[l] || l)).join(", ")}.`
            }
          </p>
        </div>
      )}

      {/* Master acknowledgment — ALWAYS first */}
      <div className={compliance.requiresBoldType
        ? "border-2 border-foreground rounded p-2"
        : ""
      }>
        <p className={`${bodyClass} text-muted-foreground`}>
          <strong>ADDENDUM & WINDOW STICKER ACKNOWLEDGMENT:</strong> By signing
          this addendum, the consumer acknowledges and agrees that: (1) this
          addendum accurately reflects and corresponds to the window sticker
          affixed to this vehicle; (2) the consumer has been given adequate time
          and opportunity to review both the window sticker on the vehicle and this
          addendum in full; (3) the products, pricing, and terms listed on this
          addendum match those displayed on the vehicle's window sticker; and (4)
          the consumer's initials and signature below constitute acceptance of the
          products and pricing as disclosed on both documents. Any discrepancy
          between the window sticker and this addendum should be reported to
          dealership management prior to signing.
        </p>
      </div>

      {/* Pre-installed items disclosure */}
      <p className={`${bodyClass} text-muted-foreground`}>
        <strong>PRE-INSTALLED / NON-REMOVABLE ITEMS:</strong> Products marked as
        pre-installed have been physically applied to or permanently installed on
        this vehicle prior to the date of sale. Because these products cannot be
        removed without damage to the vehicle, their costs are included in the
        dealer's asking price for this vehicle. By signing below, the consumer
        acknowledges that these items are present on the vehicle and that their
        costs are reflected in the agreed-upon selling price.
      </p>

      {/* State-specific add-on disclosures (federal + state merged) */}
      {stateDisclosures.map((disclosure, i) => (
        <p key={i} className={`${bodyClass} text-muted-foreground`}>
          {disclosure}
        </p>
      ))}

      {/* 10-day post-sale window notice (CA) */}
      {compliance.postSalePurchaseWindowDays > 0 && (
        <p className={`${bodyClass} text-muted-foreground`}>
          <strong>POST-SALE PURCHASE WINDOW:</strong> Under {compliance.stateName} law,
          you have up to {compliance.postSalePurchaseWindowDays} days after the date
          of sale to purchase any optional add-on product or service listed on this
          addendum. Contact the dealership within this window if you wish to add any
          previously declined products.
        </p>
      )}

      {/* Sales contract integration clause (FTC required) */}
      <div className={`mt-1 pt-1 border-t border-border-custom/50 ${
        compliance.requiresBoldType ? "border-2 border-foreground rounded p-2" : ""
      }`}>
        <p className={`${bodyClass} text-muted-foreground`}>
          <strong>SALES CONTRACT NOTICE:</strong> {compliance.salesContractClause}
        </p>
      </div>

      {/* State-specific doc fee disclosures */}
      {compliance.docFeeDisclosures.length > 0 && (
        <p className={`${bodyClass} text-muted-foreground`}>
          <strong>{compliance.docFeeTerminology.toUpperCase()} NOTICE ({compliance.stateCode}):</strong>{" "}
          {compliance.docFeeDisclosures.join(" ")}
        </p>
      )}

      {/* Record retention notice */}
      <p className={`text-[6px] text-muted-foreground/70 mt-1`}>
        This document and all associated signing records will be retained for a minimum
        of {compliance.recordRetentionYears} years in compliance with applicable federal
        and {compliance.stateName || "state"} record retention requirements.
      </p>
    </div>
  );
};

export default Disclosures;
