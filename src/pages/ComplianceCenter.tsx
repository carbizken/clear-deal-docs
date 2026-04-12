import { useTenant } from "@/contexts/TenantContext";
import { useDealerSettings } from "@/contexts/DealerSettingsContext";
import { getStateCompliance, FEDERAL_DISCLOSURES, FTC_BUYERS_GUIDE_SYSTEMS } from "@/data/stateCompliance";
import Logo from "@/components/brand/Logo";
import { ShieldCheck, FileText, Scale, Building2, AlertTriangle, CheckCircle2, BookOpen, Gavel, Users, Globe } from "lucide-react";

const ComplianceCenter = () => {
  const { currentStore, tenant } = useTenant();
  const { settings } = useDealerSettings();
  const dealerState = currentStore?.state || settings.doc_fee_state || "";
  const compliance = getStateCompliance(dealerState);
  const storeName = currentStore?.name || settings.dealer_name || "Your Dealership";

  return (
    <div className="p-4 lg:p-6 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <ShieldCheck className="w-5 h-5 text-blue-600" />
          <h1 className="text-2xl font-semibold tracking-tight font-display text-foreground">Compliance Knowledge Center</h1>
        </div>
        <p className="text-sm text-muted-foreground max-w-2xl">
          This guide explains every disclosure, requirement, and best practice built into your addendum platform.
          Every dealer employee should read and understand these requirements. They are not optional — they are the law.
        </p>
      </div>

      {/* Your state */}
      {dealerState && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <Building2 className="w-4 h-4 text-blue-700" />
            <h2 className="text-sm font-semibold text-blue-900">Your Dealership: {storeName}</h2>
          </div>
          <p className="text-xs text-blue-800">
            State: <strong>{compliance.stateName || dealerState}</strong> · Doc fee terminology: <strong>{compliance.docFeeTerminology}</strong>
            {compliance.docFeeMaxCap !== null && <> · Max cap: <strong>${compliance.docFeeMaxCap}</strong></>}
            {compliance.carsActState && <> · <span className="text-amber-700 font-bold">California CARS Act applies (SB 766, eff. Oct 1, 2026)</span></>}
          </p>
        </div>
      )}

      {/* Section 1: Why compliance matters */}
      <Section icon={Scale} title="Why This Matters" id="why">
        <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
          <p>In 2024-2026, the Federal Trade Commission and state Attorneys General have aggressively enforced consumer protection laws against auto dealers. Settlements have reached <strong>$78 million</strong> (Maryland, April 2026), <strong>$20 million</strong> (Illinois, December 2024), and <strong>$2.6 million</strong> (Arizona, August 2024) — all for deceptive add-on and pricing practices.</p>
          <p>This platform is built to protect your dealership by ensuring every sticker, every addendum, and every customer interaction complies with federal and state law. Every disclosure you see on your addendums is there for a legal reason.</p>
          <p>Our goal: <strong>No dealer using this platform should ever face an FTC enforcement action or state AG investigation for their addendum practices.</strong></p>
        </div>
      </Section>

      {/* Section 2: The two documents */}
      <Section icon={FileText} title="Understanding Your Documents" id="documents">
        <div className="grid md:grid-cols-2 gap-4">
          <Card title="Window Sticker (On the Vehicle)" color="blue">
            <ul className="space-y-1.5 text-xs text-muted-foreground">
              <li><Check /> Goes on the actual vehicle window</li>
              <li><Check /> Shows dealer logo, vehicle info, equipment, pricing</li>
              <li><Check /> Informational only — no signatures needed</li>
              <li><Check /> Contains a QR code linking to the legal addendum</li>
              <li><Check /> Does NOT contain full FTC disclosures</li>
              <li><Check /> Customer can review it at their own pace on the lot</li>
            </ul>
          </Card>
          <Card title="Legal Addendum (At the Desk)" color="emerald">
            <ul className="space-y-1.5 text-xs text-muted-foreground">
              <li><Check /> The compliance document — this is what protects you legally</li>
              <li><Check /> Full FTC and state disclosures</li>
              <li><Check /> Customer must initial EVERY product</li>
              <li><Check /> Customer must accept or decline EVERY optional item</li>
              <li><Check /> Requires customer + employee signatures</li>
              <li><Check /> Timestamped, audit-logged, immutable record</li>
              <li><Check /> Financing impact disclosure (cost over loan life)</li>
              <li><Check /> Window sticker matching acknowledgment</li>
            </ul>
          </Card>
        </div>
      </Section>

      {/* Section 3: Federal requirements */}
      <Section icon={Globe} title="Federal Requirements" id="federal">
        <SubSection title="FTC Used Car Rule (16 CFR § 455)">
          <p className="text-xs text-muted-foreground mb-3">Applies to any dealer selling 5+ used vehicles in 12 months. Requires a Buyers Guide on every used vehicle.</p>
          <div className="space-y-2">
            <Requirement req="Buyers Guide must be displayed on every used vehicle" status="built" />
            <Requirement req="Must show: year, make, model, VIN, mileage at time of sale" status="built" />
            <Requirement req="Must disclose warranty status: As-Is, Implied, or Warranty" status="built" />
            <Requirement req="Must list covered systems if warranty offered" status="built" />
            <Requirement req='Must state "Spoken promises are difficult to enforce"' status="built" />
            <Requirement req='Must state "Ask to have this vehicle inspected by your mechanic"' status="built" />
            <Requirement req="Minimum size: 11 inches × 7¼ inches" status="built" />
            <Requirement req="100% black ink on white stock" status="built" />
            <Requirement req="No logos or symbols allowed on the Buyers Guide" status="built" />
            <Requirement req="Fine: $16,000 per violation" status="info" />
          </div>
        </SubSection>

        <SubSection title="Monroney Act (New Cars)">
          <p className="text-xs text-muted-foreground mb-3">The factory window sticker must remain on the vehicle until sold. Federal law prohibits dealers from removing or modifying it. Our addendum is a SEPARATE document.</p>
          <div className="space-y-2">
            <Requirement req="Factory Monroney sticker must not be removed or modified" status="built" />
            <Requirement req="Dealer addendum clearly labeled as separate from factory sticker" status="built" />
            <Requirement req="Dealer accessories itemized separately with pricing" status="built" />
          </div>
        </SubSection>

        <SubSection title="Express, Informed Consent">
          <p className="text-xs text-muted-foreground mb-3">Before charging for ANY add-on, the customer must give clear consent after seeing what it costs — including over the life of the loan.</p>
          <div className="space-y-2">
            <Requirement req="Customer must initial each product" status="built" />
            <Requirement req="Customer must accept or decline each optional product" status="built" />
            <Requirement req="Financing impact shown (cost over 48/60/72 month terms)" status="built" />
            <Requirement req="Products clearly marked as installed vs. optional" status="built" />
            <Requirement req="No product may be charged without affirmative consent" status="built" />
          </div>
        </SubSection>
      </Section>

      {/* Section 4: State requirements */}
      {dealerState && (
        <Section icon={Building2} title={`${compliance.stateName || dealerState} State Requirements`} id="state">
          {compliance.docFeeDisclosures.length > 0 && (
            <SubSection title={`${compliance.docFeeTerminology} Disclosures`}>
              <div className="space-y-2">
                {compliance.docFeeDisclosures.map((d, i) => (
                  <Requirement key={i} req={d} status="built" />
                ))}
              </div>
            </SubSection>
          )}

          {compliance.carsActState && (
            <SubSection title="California CARS Act (SB 766)">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-3">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-amber-800 font-medium">Effective October 1, 2026. This is the most comprehensive state-level auto dealer disclosure law in the country.</p>
                </div>
              </div>
              <div className="space-y-2">
                <Requirement req="12-point bold type headings on disclosures" status="built" />
                <Requirement req="10-point bold body text on disclosures" status="built" />
                <Requirement req="Disclosures circumscribed by a line above signature" status="built" />
                <Requirement req="Multi-language: Spanish, Chinese, Tagalog, Vietnamese, Korean" status="built" />
                <Requirement req="10-day post-sale window for optional add-on purchases" status="built" />
                <Requirement req="Prohibition on no-benefit add-ons (nitrogen < 95%, etc.)" status="built" />
                <Requirement req="2-year minimum record retention" status="built" />
              </div>
            </SubSection>
          )}
        </Section>
      )}

      {/* Section 5: Best practices */}
      <Section icon={BookOpen} title="Best Practices" id="best-practices">
        <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
          <BestPractice num="01" title="Never surprise the customer">
            Every product and every charge should be visible on the window sticker BEFORE the customer sits down.
            The addendum signing should confirm what they already saw — not introduce new items.
          </BestPractice>
          <BestPractice num="02" title="Always explain the difference between installed and optional">
            Pre-installed items cannot be removed. Optional items can be declined with zero impact on the deal.
            Make this crystal clear every time.
          </BestPractice>
          <BestPractice num="03" title="Never pressure on optional products">
            The FTC and state AGs are specifically targeting dealers who make customers feel they must accept optional products.
            "Declining will not affect your financing" is not just a disclosure — it must be true.
          </BestPractice>
          <BestPractice num="04" title="Keep every record">
            Every addendum, every signature, every timestamp. This platform retains everything automatically.
            If an AG or the FTC comes asking, your records are ready.
          </BestPractice>
          <BestPractice num="05" title="Have your attorney review your disclosures">
            This platform provides industry-standard FTC-compliant disclosures. But YOUR attorney should review them
            for your specific state and business. You can customize any disclosure through the admin panel.
          </BestPractice>
        </div>
      </Section>

      {/* Section 6: Dealer legal sign-off */}
      <Section icon={Gavel} title="Dealer Legal Adoption Agreement" id="legal">
        <div className="bg-card rounded-xl border-2 border-foreground p-6 space-y-4">
          <p className="text-xs text-muted-foreground leading-relaxed">
            By using this platform, the dealership ("<strong>{storeName}</strong>") acknowledges the following:
          </p>

          <div className="space-y-3 text-xs text-foreground leading-relaxed">
            <p><strong>1. OPPORTUNITY FOR LEGAL REVIEW.</strong> The dealership has been given the opportunity to have its legal counsel review all disclosure language, addendum verbiage, and compliance templates provided by this platform before adoption and use.</p>

            <p><strong>2. CUSTOMIZATION RIGHTS.</strong> The dealership may request modifications to any disclosure language, addendum wording, or compliance template at any time. Requested changes will be reviewed and implemented by the platform provider in a reasonable timeframe.</p>

            <p><strong>3. ADOPTION OF DISCLOSURES.</strong> If the dealership proceeds without requesting changes, the dealership voluntarily adopts all standard disclosure language, addendum templates, and compliance verbiage as its own. The dealership represents that it is satisfied with the content and accuracy of these materials for its jurisdiction and business operations.</p>

            <p><strong>4. DUAL SIGNATURE RECOMMENDATION.</strong> We strongly recommend that both the dealership principal AND the dealership's legal counsel sign this adoption agreement. However, if only the dealership principal signs, the principal acknowledges that they were given the opportunity to involve legal counsel and chose to proceed independently.</p>

            <p><strong>5. DISCLAIMER OF LIABILITY.</strong> This platform provides disclosure language and compliance templates based on industry best practices and current federal and state law research. However, the platform provider is NOT a law firm and does NOT provide legal advice. The dealership assumes full responsibility for ensuring its disclosures comply with all applicable laws in its operating jurisdiction(s). The dealership's own legal counsel is the appropriate party to confirm compliance. The platform provider shall not be held liable for any regulatory action, fine, or penalty resulting from the dealership's use of these templates if the dealership chose not to have them reviewed by its own legal counsel.</p>

            <p><strong>6. STATE-SPECIFIC COMPLIANCE.</strong> The disclosure templates have been configured for the state of <strong>{compliance.stateName || "your state"}</strong> based on our research of current state requirements. State laws change. The dealership is responsible for notifying the platform provider of any changes in state requirements that may affect their disclosures.</p>

            <p><strong>7. RECORD RETENTION.</strong> All signed addendums, customer interactions, and compliance records are retained for a minimum of {compliance.recordRetentionYears} years in accordance with applicable federal and state record retention requirements.</p>
          </div>

          <div className="border-t-2 border-foreground pt-4 mt-4 space-y-4">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">Dealership Principal</p>
                <div className="border-b-2 border-foreground h-10 mb-1" />
                <p className="text-[9px] text-muted-foreground">Signature</p>
                <div className="border-b border-border-custom h-6 mt-2 mb-1" />
                <p className="text-[9px] text-muted-foreground">Printed Name & Title</p>
                <div className="border-b border-border-custom h-6 mt-2 mb-1" />
                <p className="text-[9px] text-muted-foreground">Date</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">Dealership Legal Counsel (Recommended)</p>
                <div className="border-b-2 border-foreground h-10 mb-1" />
                <p className="text-[9px] text-muted-foreground">Signature</p>
                <div className="border-b border-border-custom h-6 mt-2 mb-1" />
                <p className="text-[9px] text-muted-foreground">Printed Name & Firm</p>
                <div className="border-b border-border-custom h-6 mt-2 mb-1" />
                <p className="text-[9px] text-muted-foreground">Date</p>
              </div>
            </div>
            <p className="text-[8px] text-muted-foreground italic">
              If only the dealership principal signs above, the principal acknowledges that they were given
              the full opportunity to have legal counsel review all disclosure language and compliance templates,
              and they chose to proceed without such review. The dealership adopts all standard disclosures as its own.
            </p>
          </div>
        </div>
      </Section>

      {/* Footer */}
      <div className="text-center py-8 border-t border-border">
        <Logo variant="full" size={28} />
        <p className="text-xs text-muted-foreground mt-3">
          This compliance guide is provided for educational purposes. It does not constitute legal advice.
          Always consult with your dealership's legal counsel for jurisdiction-specific guidance.
        </p>
        <p className="text-[10px] text-muted-foreground mt-2">
          Last updated: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
        </p>
      </div>
    </div>
  );
};

// Helper components
const Section = ({ icon: Icon, title, id, children }: { icon: typeof ShieldCheck; title: string; id: string; children: React.ReactNode }) => (
  <section id={id} className="scroll-mt-20">
    <div className="flex items-center gap-2 mb-4">
      <Icon className="w-4 h-4 text-blue-600 flex-shrink-0" />
      <h2 className="text-lg font-semibold tracking-tight text-foreground">{title}</h2>
    </div>
    {children}
  </section>
);

const SubSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="bg-card rounded-xl border border-border shadow-premium p-5 mb-4">
    <h3 className="text-sm font-semibold text-foreground mb-3">{title}</h3>
    {children}
  </div>
);

const Card = ({ title, color, children }: { title: string; color: "blue" | "emerald"; children: React.ReactNode }) => (
  <div className={`rounded-xl border p-5 ${color === "blue" ? "border-blue-200 bg-blue-50/50" : "border-emerald-200 bg-emerald-50/50"}`}>
    <h3 className={`text-sm font-semibold mb-3 ${color === "blue" ? "text-blue-900" : "text-emerald-900"}`}>{title}</h3>
    {children}
  </div>
);

const Check = () => <CheckCircle2 className="w-3 h-3 text-emerald-500 inline-block mr-1.5 -mt-0.5 flex-shrink-0" />;

const Requirement = ({ req, status }: { req: string; status: "built" | "info" }) => (
  <div className="flex items-start gap-2 py-1">
    {status === "built" ? (
      <span className="text-[9px] font-bold bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded mt-0.5 flex-shrink-0">BUILT</span>
    ) : (
      <span className="text-[9px] font-bold bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded mt-0.5 flex-shrink-0">INFO</span>
    )}
    <p className="text-xs text-foreground">{req}</p>
  </div>
);

const BestPractice = ({ num, title, children }: { num: string; title: string; children: React.ReactNode }) => (
  <div className="bg-card rounded-xl border border-border shadow-premium p-5">
    <div className="flex items-start gap-3">
      <span className="text-xs font-bold text-blue-600 tabular-nums flex-shrink-0">{num}</span>
      <div>
        <h4 className="text-sm font-semibold text-foreground">{title}</h4>
        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{children}</p>
      </div>
    </div>
  </div>
);

export default ComplianceCenter;
