import { ShieldCheck } from "lucide-react";

interface DisclosuresProps {
  inkSaving?: boolean;
}

const disclosures = [
  {
    text: (
      <>
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
      </>
    ),
  },
  {
    text: (
      <>
        <strong>PRE-INSTALLED / NON-REMOVABLE ITEMS:</strong> Products marked as
        pre-installed have been physically applied to or permanently installed on
        this vehicle prior to the date of sale. Because these products cannot be
        removed without damage to the vehicle, their costs are included in the
        dealer's asking price for this vehicle. These products are disclosed here
        in compliance with applicable federal and state consumer disclosure
        requirements. By signing below, the consumer acknowledges that these
        items are present on the vehicle and that their costs are reflected in
        the agreed-upon selling price.
      </>
    ),
  },
  {
    text: (
      <>
        <strong>OPTIONAL ITEMS:</strong> Optional products have not been applied
        or installed on this vehicle. No consumer is required to purchase any
        optional item in order to purchase, finance, or take delivery of this
        vehicle. Declining any optional product will not affect the consumer's
        ability to obtain financing or alter the terms of any financing offer.
        The consumer must affirmatively accept or decline each optional product
        in the selection record above.
      </>
    ),
  },
  {
    text: (
      <>
        <strong>NOT MANUFACTURER PRODUCTS:</strong> None of the products,
        guarantees, warranties, or programs listed on this addendum are products
        of, administered by, or guaranteed by the vehicle manufacturer. All
        guarantees and program benefits are solely the obligation of the
        respective program administrators identified in the program
        documentation.
      </>
    ),
  },
  {
    text: (
      <>
        <strong>FINANCING DISCLOSURE:</strong> If this purchase is being
        financed, the inclusion of these products in the financed amount will
        increase the total amount financed, the monthly payment, the total
        finance charge, and the total amount paid over the life of the loan. Ask
        your finance manager for a complete itemized disclosure of all amounts
        financed.
      </>
    ),
  },
  {
    text: (
      <>
        <strong>GUARANTEE / WARRANTY DISCLAIMERS:</strong> All guarantee and
        warranty terms, conditions, and exclusions are defined exclusively in the
        respective program documentation provided at delivery. No oral
        representations by dealership personnel shall modify written program
        terms.
      </>
    ),
  },
  {
    text: (
      <>
        <strong>CONSUMER PROTECTION NOTICE:</strong> This addendum is provided
        pursuant to applicable federal and state consumer protection
        requirements. Consumers with questions may contact their state's
        Department of Consumer Protection, the state Attorney General's office,
        or the Federal Trade Commission at ftc.gov.
      </>
    ),
  },
];

const Disclosures = ({ inkSaving }: DisclosuresProps) => (
  <div className={`px-3 py-2 rounded ${inkSaving ? "bg-card" : "bg-light"}`}>
    <div className="flex items-center gap-1.5 mb-1.5">
      <ShieldCheck className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
      <p className="text-[10px] font-bold text-foreground">
        Federal Trade Commission — Required Disclosures & Consumer Rights
      </p>
    </div>
    <div className="space-y-1.5">
      {disclosures.map((d, i) => (
        <p key={i} className="text-[7px] leading-[1.45] text-muted-foreground">
          {d.text}
        </p>
      ))}
    </div>
  </div>
);

export default Disclosures;
