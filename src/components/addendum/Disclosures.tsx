interface DisclosuresProps {
  inkSaving?: boolean;
}

const disclosures = [
  { text: <><strong>PRE-INSTALLED / NON-REMOVABLE ITEMS:</strong> Products marked as pre-installed have been physically applied to or permanently installed on this vehicle prior to the date of sale. Because these products cannot be removed without damage to the vehicle, their costs are included in the dealer's asking price for this vehicle. These products are disclosed here in compliance with applicable federal and state consumer disclosure requirements. By signing below, the consumer acknowledges that these items are present on the vehicle and that their costs are reflected in the agreed-upon selling price.</> },
  { text: <><strong>OPTIONAL ITEMS:</strong> Optional products have not been applied or installed on this vehicle. No consumer is required to purchase any optional item in order to purchase, finance, or take delivery of this vehicle. Declining any optional product will not affect the consumer's ability to obtain financing or alter the terms of any financing offer. The consumer must affirmatively accept or decline each optional product in the selection record above.</> },
  { text: <><strong>NOT MANUFACTURER PRODUCTS:</strong> None of the products, guarantees, warranties, or programs listed on this addendum are products of, administered by, or guaranteed by the vehicle manufacturer. All guarantees and program benefits are solely the obligation of the respective program administrators identified in the program documentation.</> },
  { text: <><strong>FINANCING DISCLOSURE:</strong> If this purchase is being financed, the inclusion of these products in the financed amount will increase the total amount financed, the monthly payment, the total finance charge, and the total amount paid over the life of the loan. Ask your finance manager for a complete itemized disclosure of all amounts financed.</> },
  { text: <><strong>GUARANTEE / WARRANTY DISCLAIMERS:</strong> All guarantee and warranty terms, conditions, and exclusions are defined exclusively in the respective program documentation provided at delivery. No oral representations by dealership personnel shall modify written program terms.</> },
  { text: <><strong>CONNECTICUT CONSUMER PROTECTION:</strong> This addendum is provided pursuant to applicable federal and state consumer protection requirements including the FTC's CARS Rule. Consumers with questions may contact the Connecticut Department of Consumer Protection or the Federal Trade Commission at ftc.gov.</> },
];

const Disclosures = ({ inkSaving }: DisclosuresProps) => (
  <div className={`px-3 py-2 rounded ${inkSaving ? "bg-card" : "bg-light"}`}>
    <p className="text-[10px] font-bold text-foreground mb-1">
      ⚖️ Federal Trade Commission — Required Disclosures & Consumer Rights
    </p>
    <div className="space-y-1">
      {disclosures.map((d, i) => (
        <p key={i} className="text-[7px] leading-[1.4] text-muted-foreground">
          {d.text}
        </p>
      ))}
    </div>
  </div>
);

export default Disclosures;
