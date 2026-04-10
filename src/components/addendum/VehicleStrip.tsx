interface VehicleStripProps {
  vehicle: { ymm: string; stock: string; vin: string; date: string };
  onChange: (v: { ymm: string; stock: string; vin: string; date: string }) => void;
  inkSaving?: boolean;
}

const fields = [
  { label: "Year / Make / Model", key: "ymm" as const, placeholder: "e.g. 2026 Honda CR-V EX-L" },
  { label: "Stock #", key: "stock" as const, placeholder: "e.g. H12345" },
  { label: "VIN", key: "vin" as const, placeholder: "e.g. 1HGCV1F3XRA000000" },
  { label: "Date", key: "date" as const, placeholder: "e.g. 04/04/2026" },
];

const VehicleStrip = ({ vehicle, onChange, inkSaving }: VehicleStripProps) => (
  <div className={`grid grid-cols-4 gap-2 px-3 py-2 text-[9px] ${inkSaving ? "bg-card" : "bg-blue/10"}`}>
    {fields.map((f) => (
      <div key={f.key}>
        <span className="font-semibold text-muted-foreground uppercase tracking-wider">{f.label}</span>
        <input
          value={vehicle[f.key]}
          onChange={(e) => onChange({ ...vehicle, [f.key]: e.target.value })}
          placeholder={f.placeholder}
          className="w-full border-b-[1.5px] border-border-custom bg-transparent text-xs text-foreground outline-none placeholder:text-muted-foreground/50 min-h-[20px] py-0.5"
        />
      </div>
    ))}
    <div className="col-span-4 flex justify-end">
      <span className="inline-block mt-1 text-[8px] font-bold bg-teal text-primary-foreground px-2 py-0.5 rounded-sm tracking-widest">
        FTC
        <br />
        Compliant
        <br />
        Label
      </span>
    </div>
  </div>
);

export default VehicleStrip;
