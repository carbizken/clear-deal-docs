import { ScrapedVehicle } from "@/hooks/useVehicleUrlScrape";

interface VehicleDetailsBarProps {
  details: Partial<ScrapedVehicle>;
  inkSaving?: boolean;
}

const VehicleDetailsBar = ({ details, inkSaving }: VehicleDetailsBarProps) => {
  const fields: { label: string; value: string }[] = [];

  if (details.condition) fields.push({ label: "Condition", value: details.condition });
  if (details.mileage) fields.push({ label: "Mileage", value: `${Number(details.mileage).toLocaleString()} mi` });
  if (details.color) fields.push({ label: "Ext. Color", value: details.color });
  if (details.interiorColor) fields.push({ label: "Int. Color", value: details.interiorColor });
  if (details.engine) fields.push({ label: "Engine", value: details.engine });
  if (details.transmission) fields.push({ label: "Trans.", value: details.transmission });
  if (details.driveType) fields.push({ label: "Drive", value: details.driveType });
  if (details.fuelType) fields.push({ label: "Fuel", value: details.fuelType });
  if (details.bodyStyle) fields.push({ label: "Body", value: details.bodyStyle });
  if (details.price) fields.push({ label: "Listed Price", value: `$${Number(details.price).toLocaleString()}` });

  if (fields.length === 0) return null;

  return (
    <div className={`px-3 py-1.5 border-b border-border-custom ${inkSaving ? "bg-card" : "bg-teal/5"}`}>
      <div className="flex flex-wrap gap-x-4 gap-y-0.5">
        {fields.map((f) => (
          <div key={f.label} className="flex items-baseline gap-1">
            <span className="text-[7px] font-bold text-muted-foreground uppercase tracking-wider">{f.label}:</span>
            <span className="text-[9px] text-foreground font-semibold">{f.value}</span>
          </div>
        ))}
      </div>
      {details.description && (
        <p className="text-[7px] text-muted-foreground mt-0.5 leading-tight line-clamp-2">{details.description}</p>
      )}
      {details.imageUrl && (
        <div className="mt-1 no-print">
          <img src={details.imageUrl} alt="Vehicle" className="h-16 rounded object-cover" />
        </div>
      )}
      {details.sourceUrl && (
        <p className="text-[6px] text-muted-foreground/50 mt-0.5 no-print">
          Imported from: {details.sourceUrl}
        </p>
      )}
    </div>
  );
};

export default VehicleDetailsBar;
