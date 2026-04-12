import { useState, useRef } from "react";
import { useDealerSettings } from "@/contexts/DealerSettingsContext";
import { useTenant } from "@/contexts/TenantContext";
import { useVinDecode } from "@/hooks/useVinDecode";
import { useAuth } from "@/contexts/AuthContext";
import { useAudit } from "@/contexts/AuditContext";
import { useProducts } from "@/hooks/useProducts";
import { useAiDescription } from "@/hooks/useAiDescription";
import { useGpsTracking } from "@/hooks/useGpsTracking";
import { useZebraPrint } from "@/hooks/useZebraPrint";
import { toast } from "sonner";
import { QRCodeSVG } from "qrcode.react";
import { Printer, Download, Car, Fuel, Gauge, Cog, Sparkles, MapPin, Tag } from "lucide-react";

const UsedCarSticker = () => {
  const { settings } = useDealerSettings();
  const { currentStore, tenant } = useTenant();
  const { decode, decoding } = useVinDecode();
  const { user } = useAuth();
  const { log } = useAudit();
  const { data: products } = useProducts();
  const { generate: generateAiDesc, generating: aiGenerating } = useAiDescription();
  const { pinLocation, tracking: gpsTracking } = useGpsTracking();
  const { printLabel, printing: zebraPrinting } = useZebraPrint();
  const cardRef = useRef<HTMLDivElement>(null);
  const [generating, setGenerating] = useState(false);

  const [vehicle, setVehicle] = useState({
    vin: "", year: "", make: "", model: "", trim: "",
    stock: "", mileage: "", color: "", interiorColor: "",
    engine: "", transmission: "", drivetrain: "", fuelType: "",
    mpgCity: "", mpgHwy: "", doors: "", bodyStyle: "",
    marketValue: "", description: "",
  });

  const [decoded, setDecoded] = useState(false);
  const [equipment, setEquipment] = useState<string[]>([]);

  const dealerName = currentStore?.name || settings.dealer_name || "Your Dealership";
  const dealerLogo = currentStore?.logo_url || settings.dealer_logo_url || tenant?.logo_url || "";
  const dealerPhone = currentStore?.phone || "";
  const dealerTagline = currentStore?.tagline || settings.dealer_tagline || "";

  const installed = products?.filter(p => p.badge_type === "installed") || [];
  const optional = products?.filter(p => p.badge_type === "optional") || [];
  const installedTotal = installed.reduce((s, p) => s + p.price, 0);
  const optionalTotal = optional.reduce((s, p) => s + p.price, 0);
  const marketVal = parseFloat(vehicle.marketValue) || 0;

  const signingUrl = vehicle.vin ? `${window.location.origin}/vehicle/${vehicle.vin}` : "";

  const handleVinDecode = async () => {
    if (vehicle.vin.length !== 17) return;
    const result = await decode(vehicle.vin);
    if (result) {
      setVehicle(prev => ({
        ...prev,
        year: result.year, make: result.make, model: result.model,
        trim: result.trim, bodyStyle: result.bodyStyle,
        drivetrain: result.driveType, fuelType: result.fuelType,
        engine: result.engineDescription,
      }));
      setEquipment(prev => prev.length ? prev : [
        result.bodyStyle, result.driveType, result.fuelType, result.engineDescription,
      ].filter(Boolean));
      setDecoded(true);
      toast.success(`${result.year} ${result.make} ${result.model}`);
      setTimeout(() => setDecoded(false), 3000);
    }
  };

  const handlePrint = () => {
    window.print();
    if (user) log({ store_id: currentStore?.id || "", user_id: user.id, action: "addendum_printed", entity_type: "used_car_sticker", entity_id: vehicle.vin, details: { ymm: `${vehicle.year} ${vehicle.make} ${vehicle.model}` } });
  };

  const handlePdf = async () => {
    if (!cardRef.current) return;
    setGenerating(true);
    try {
      const { default: html2canvas } = await import("html2canvas-pro");
      const { default: jsPDF } = await import("jspdf");
      const canvas = await html2canvas(cardRef.current, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL("image/jpeg", 0.95);
      const w = 8.5;
      const h = (canvas.height / canvas.width) * w;
      const pdf = new jsPDF({ unit: "in", format: [w, h], orientation: "portrait" });
      pdf.addImage(imgData, "JPEG", 0, 0, w, h);
      pdf.save(`Used-Car-Sticker-${vehicle.vin || "draft"}.pdf`);
    } catch { toast.error("PDF failed"); } finally { setGenerating(false); }
  };

  return (
    <div className="p-4 lg:p-6 max-w-[1400px] mx-auto space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight font-display text-foreground">Used Car Window Sticker</h1>
          <p className="text-xs text-muted-foreground mt-1">Informational equipment showcase sticker for the vehicle window. NOT the FTC Buyers Guide.</p>
        </div>
        <div className="flex gap-2 no-print">
          <button onClick={handlePrint} className="inline-flex items-center gap-1.5 h-9 px-3 rounded-md border border-border text-sm font-medium hover:bg-muted"><Printer className="w-3.5 h-3.5" /> Print</button>
          <button onClick={handlePdf} disabled={generating} className="inline-flex items-center gap-1.5 h-9 px-3 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 disabled:opacity-50"><Download className="w-3.5 h-3.5" /> {generating ? "..." : "PDF"}</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Config panel */}
        <div className="lg:col-span-2 space-y-4 no-print">
          <ConfigCard title="Vehicle">
            <div className="space-y-2">
              <div className="flex gap-2">
                <input value={vehicle.vin} onChange={e => setVehicle({ ...vehicle, vin: e.target.value.toUpperCase() })} placeholder="VIN (17 chars)" className="flex-1 h-9 px-3 rounded-md border border-border bg-background text-sm font-mono outline-none" />
                <button onClick={handleVinDecode} disabled={decoding || vehicle.vin.length !== 17} className={`h-9 px-3 rounded-md text-xs font-medium text-white disabled:opacity-40 ${decoded ? "bg-teal" : "bg-primary"}`}>{decoding ? "..." : decoded ? "Done" : "Decode"}</button>
              </div>
              <div className="grid grid-cols-4 gap-2">
                <input value={vehicle.year} onChange={e => setVehicle({ ...vehicle, year: e.target.value })} placeholder="Year" className="h-9 px-3 rounded-md border border-border bg-background text-sm outline-none" />
                <input value={vehicle.make} onChange={e => setVehicle({ ...vehicle, make: e.target.value })} placeholder="Make" className="h-9 px-3 rounded-md border border-border bg-background text-sm outline-none" />
                <input value={vehicle.model} onChange={e => setVehicle({ ...vehicle, model: e.target.value })} placeholder="Model" className="h-9 px-3 rounded-md border border-border bg-background text-sm outline-none" />
                <input value={vehicle.trim} onChange={e => setVehicle({ ...vehicle, trim: e.target.value })} placeholder="Trim" className="h-9 px-3 rounded-md border border-border bg-background text-sm outline-none" />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <input value={vehicle.stock} onChange={e => setVehicle({ ...vehicle, stock: e.target.value })} placeholder="Stock #" className="h-9 px-3 rounded-md border border-border bg-background text-sm outline-none" />
                <input value={vehicle.mileage} onChange={e => setVehicle({ ...vehicle, mileage: e.target.value })} placeholder="Mileage" className="h-9 px-3 rounded-md border border-border bg-background text-sm outline-none" />
                <input value={vehicle.color} onChange={e => setVehicle({ ...vehicle, color: e.target.value })} placeholder="Ext. Color" className="h-9 px-3 rounded-md border border-border bg-background text-sm outline-none" />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <input value={vehicle.engine} onChange={e => setVehicle({ ...vehicle, engine: e.target.value })} placeholder="Engine" className="h-9 px-3 rounded-md border border-border bg-background text-sm outline-none" />
                <input value={vehicle.transmission} onChange={e => setVehicle({ ...vehicle, transmission: e.target.value })} placeholder="Transmission" className="h-9 px-3 rounded-md border border-border bg-background text-sm outline-none" />
                <input value={vehicle.drivetrain} onChange={e => setVehicle({ ...vehicle, drivetrain: e.target.value })} placeholder="Drivetrain" className="h-9 px-3 rounded-md border border-border bg-background text-sm outline-none" />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <input value={vehicle.mpgCity} onChange={e => setVehicle({ ...vehicle, mpgCity: e.target.value })} placeholder="MPG City" className="h-9 px-3 rounded-md border border-border bg-background text-sm outline-none" />
                <input value={vehicle.mpgHwy} onChange={e => setVehicle({ ...vehicle, mpgHwy: e.target.value })} placeholder="MPG Hwy" className="h-9 px-3 rounded-md border border-border bg-background text-sm outline-none" />
                <input value={vehicle.marketValue} onChange={e => setVehicle({ ...vehicle, marketValue: e.target.value })} placeholder="Market Value $" className="h-9 px-3 rounded-md border border-border bg-background text-sm outline-none" />
              </div>
            </div>
          </ConfigCard>
          <ConfigCard title="Equipment (one per line)">
            <textarea
              value={equipment.join("\n")}
              onChange={e => setEquipment(e.target.value.split("\n"))}
              placeholder={"Backup Camera\nBluetooth\nAlloy Wheels\nKeyless Entry"}
              rows={6}
              className="w-full px-3 py-2 rounded-md border border-border bg-background text-sm outline-none resize-y"
            />
          </ConfigCard>
          <ConfigCard title="Description">
            <textarea
              value={vehicle.description}
              onChange={e => setVehicle({ ...vehicle, description: e.target.value })}
              placeholder="Clean one-owner vehicle with full service history..."
              rows={3}
              className="w-full px-3 py-2 rounded-md border border-border bg-background text-sm outline-none resize-y"
            />
            <button
              onClick={async () => {
                const desc = await generateAiDesc(vehicle);
                if (desc) setVehicle(prev => ({ ...prev, description: desc }));
              }}
              disabled={aiGenerating}
              className="mt-2 inline-flex items-center gap-1.5 h-8 px-3 rounded-md bg-purple-600 text-white text-xs font-medium hover:opacity-90 disabled:opacity-40"
            >
              <Sparkles className="w-3 h-3" />
              {aiGenerating ? "Writing..." : "AI Generate Description"}
            </button>
          </ConfigCard>

          {/* Quick actions */}
          <ConfigCard title="Quick Actions">
            <div className="space-y-2">
              <button
                onClick={async () => {
                  if (!vehicle.vin || !user) return;
                  const loc = await pinLocation(vehicle.vin, user.id);
                  if (loc) toast.success(`GPS pinned: ${loc.lat.toFixed(4)}, ${loc.lng.toFixed(4)}`);
                  else toast.error("Could not get GPS location");
                }}
                disabled={gpsTracking || !vehicle.vin}
                className="w-full inline-flex items-center gap-1.5 h-9 px-3 rounded-md border border-border text-xs font-medium hover:bg-muted disabled:opacity-40"
              >
                <MapPin className="w-3.5 h-3.5" />
                {gpsTracking ? "Pinning..." : "Pin GPS Location"}
              </button>
              <button
                onClick={async () => {
                  if (!vehicle.vin || !vehicle.stock) { toast.error("VIN and Stock # required"); return; }
                  const ymm = `${vehicle.year} ${vehicle.make} ${vehicle.model}`.trim();
                  await printLabel({ vin: vehicle.vin, stockNumber: vehicle.stock, ymm, labelType: "stock_number" });
                  toast.success("Stock label queued for Zebra printer");
                }}
                disabled={zebraPrinting || !vehicle.stock}
                className="w-full inline-flex items-center gap-1.5 h-9 px-3 rounded-md border border-border text-xs font-medium hover:bg-muted disabled:opacity-40"
              >
                <Tag className="w-3.5 h-3.5" />
                {zebraPrinting ? "Printing..." : "Print Zebra Stock Label"}
              </button>
            </div>
          </ConfigCard>
        </div>

        {/* Live sticker preview */}
        <div className="lg:col-span-3">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-2 no-print">Live Preview</p>
          <div ref={cardRef} className="bg-white rounded-lg border-2 border-foreground overflow-hidden shadow-premium-lg mx-auto" style={{ maxWidth: "600px" }}>
            {/* Header with dealer branding */}
            <div className="bg-primary text-primary-foreground px-5 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {dealerLogo && <div className="bg-white rounded p-1.5"><img src={dealerLogo} alt="" className="h-8 object-contain" /></div>}
                  <div>
                    <p className="text-base font-bold tracking-tight">{dealerName}</p>
                    {dealerTagline && <p className="text-[10px] text-primary-foreground/70">{dealerTagline}</p>}
                    {dealerPhone && <p className="text-[10px] text-primary-foreground/70">{dealerPhone}</p>}
                  </div>
                </div>
                <span className="text-[10px] font-bold bg-amber-400 text-amber-950 px-2 py-1 rounded">PRE-OWNED</span>
              </div>
            </div>

            {/* Vehicle title */}
            <div className="px-5 py-3 border-b-2 border-foreground">
              <p className="text-xl font-bold tracking-tight text-foreground">
                {vehicle.year} {vehicle.make} {vehicle.model} {vehicle.trim}
              </p>
              <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                <span className="font-mono">{vehicle.vin || "VIN pending"}</span>
                {vehicle.stock && <span>Stock: {vehicle.stock}</span>}
              </div>
            </div>

            {/* Key specs row */}
            <div className="grid grid-cols-4 gap-0 border-b border-foreground">
              <SpecCell icon={Gauge} label="Mileage" value={vehicle.mileage ? `${parseInt(vehicle.mileage).toLocaleString()} mi` : "—"} />
              <SpecCell icon={Car} label="Exterior" value={vehicle.color || "—"} />
              <SpecCell icon={Cog} label="Drivetrain" value={vehicle.drivetrain || "—"} />
              <SpecCell icon={Fuel} label="MPG" value={vehicle.mpgCity && vehicle.mpgHwy ? `${vehicle.mpgCity} city / ${vehicle.mpgHwy} hwy` : "—"} />
            </div>

            {/* Engine / Trans */}
            <div className="grid grid-cols-2 gap-0 border-b border-foreground text-xs">
              <div className="px-4 py-2 border-r border-foreground">
                <p className="text-[9px] font-bold text-muted-foreground uppercase">Engine</p>
                <p className="text-foreground font-medium">{vehicle.engine || "—"}</p>
              </div>
              <div className="px-4 py-2">
                <p className="text-[9px] font-bold text-muted-foreground uppercase">Transmission</p>
                <p className="text-foreground font-medium">{vehicle.transmission || "—"}</p>
              </div>
            </div>

            {/* Equipment list */}
            {equipment.filter(Boolean).length > 0 && (
              <div className="px-5 py-3 border-b border-foreground">
                <p className="text-[10px] font-bold text-foreground uppercase tracking-wider mb-2">Standard & Optional Equipment</p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-0.5">
                  {equipment.filter(Boolean).map((item, i) => (
                    <p key={i} className="text-[10px] text-foreground flex items-center gap-1">
                      <span className="text-teal">•</span> {item.trim()}
                    </p>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            {vehicle.description && (
              <div className="px-5 py-3 border-b border-foreground">
                <p className="text-[10px] text-muted-foreground leading-relaxed">{vehicle.description}</p>
              </div>
            )}

            {/* Dealer accessories — installed */}
            {installed.length > 0 && (
              <div className="px-5 py-3 border-b border-foreground">
                <p className="text-[10px] font-bold text-blue-700 uppercase tracking-wider mb-1">Dealer-Installed Accessories (Included in Price)</p>
                {installed.map(p => (
                  <div key={p.id} className="flex justify-between text-[10px] py-0.5">
                    <span className="text-foreground">{p.name}</span>
                    <span className="font-semibold text-foreground tabular-nums">${p.price.toFixed(2)}</span>
                  </div>
                ))}
                <div className="flex justify-between text-xs font-bold pt-1 mt-1 border-t border-border">
                  <span>Installed Total</span>
                  <span className="tabular-nums">${installedTotal.toFixed(2)}</span>
                </div>
              </div>
            )}

            {/* Dealer accessories — optional */}
            {optional.length > 0 && (
              <div className="px-5 py-3 border-b border-foreground">
                <p className="text-[10px] font-bold text-amber-700 uppercase tracking-wider mb-1">Optional Accessories (Customer May Accept or Decline)</p>
                {optional.map(p => (
                  <div key={p.id} className="flex justify-between text-[10px] py-0.5">
                    <span className="text-foreground">{p.name}</span>
                    <span className="font-semibold text-foreground tabular-nums">${p.price.toFixed(2)}</span>
                  </div>
                ))}
                <div className="flex justify-between text-xs font-bold pt-1 mt-1 border-t border-border">
                  <span>Optional Total (if accepted)</span>
                  <span className="tabular-nums">${optionalTotal.toFixed(2)}</span>
                </div>
              </div>
            )}

            {/* Pricing summary */}
            <div className="px-5 py-3 bg-muted/30">
              {marketVal > 0 && (
                <div className="flex justify-between text-xs text-foreground mb-1">
                  <span>Market Value</span>
                  <span className="font-semibold tabular-nums">${marketVal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
              )}
              {installedTotal > 0 && (
                <div className="flex justify-between text-xs text-foreground mb-1">
                  <span>Installed Accessories</span>
                  <span className="font-semibold tabular-nums">${installedTotal.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-extrabold text-foreground pt-1 mt-1 border-t-2 border-foreground">
                <span>TOTAL PRICE</span>
                <span className="tabular-nums">${(marketVal + installedTotal).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
              {optionalTotal > 0 && (
                <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                  <span>With all optional accepted</span>
                  <span className="tabular-nums">${(marketVal + installedTotal + optionalTotal).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
              )}
            </div>

            {/* QR + disclaimers */}
            <div className="px-5 py-3 flex items-center justify-between border-t border-foreground">
              <div className="flex-1 min-w-0">
                <p className="text-[8px] font-bold text-foreground">Scan for full details & sign-off</p>
                <p className="text-[7px] text-muted-foreground mt-0.5">This sticker is NOT the FTC Buyers Guide. See the Buyers Guide displayed separately on this vehicle for warranty information.</p>
              </div>
              {signingUrl && <QRCodeSVG value={signingUrl} size={56} className="flex-shrink-0 ml-3" />}
            </div>

            {/* Footer */}
            <div className="text-center py-1.5 border-t border-foreground bg-primary text-primary-foreground">
              <p className="text-[8px] font-semibold">{dealerName}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ConfigCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="bg-card rounded-xl border border-border shadow-premium p-4">
    <h3 className="text-sm font-semibold text-foreground mb-3">{title}</h3>
    {children}
  </div>
);

const SpecCell = ({ icon: Icon, label, value }: { icon: typeof Car; label: string; value: string }) => (
  <div className="px-3 py-2 border-r border-foreground last:border-0 text-center">
    <Icon className="w-3.5 h-3.5 mx-auto text-muted-foreground mb-0.5" />
    <p className="text-[8px] font-bold text-muted-foreground uppercase">{label}</p>
    <p className="text-[10px] font-semibold text-foreground">{value}</p>
  </div>
);

export default UsedCarSticker;
