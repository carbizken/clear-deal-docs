import { useNavigate } from "react-router-dom";
import Logo from "@/components/brand/Logo";
import {
  ArrowRight,
  ShieldCheck,
  Zap,
  BarChart3,
  Sparkles,
  Scan,
  FileText,
  Signature,
  Check,
  AlertTriangle,
  XCircle,
  DollarSign,
  Scale,
  QrCode,
  ClipboardCheck,
  TrendingUp,
} from "lucide-react";

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-background">
      {/* ─────────── Top Nav Bar ─────────── */}
      <nav className="sticky top-0 z-40 topbar-navy text-white border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 h-14 flex items-center justify-between">
          <Logo variant="full" inverted size={28} />
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/login")}
              className="text-sm font-medium text-white/70 hover:text-white transition-colors"
            >
              Sign in
            </button>
            <button
              onClick={() => navigate("/onboarding")}
              className="inline-flex items-center gap-1.5 h-9 px-4 rounded-md bg-white text-slate-950 text-sm font-semibold hover:bg-white/90"
            >
              Get Started
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </nav>

      {/* ─────────── Hero: The Problem ─────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white py-24 px-6 lg:px-8">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-red-500/10 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-blue-500/15 blur-3xl" />

        <div className="relative max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-red-500/10 backdrop-blur-sm border border-red-500/20 rounded-full px-4 py-1.5 text-xs font-semibold text-red-300 mb-8">
            <AlertTriangle className="w-3.5 h-3.5" />
            The problem every dealer faces
          </div>

          <h1 className="text-5xl lg:text-7xl font-black tracking-tighter leading-none">
            Your stickers are
            <br />
            <span className="text-red-400">costing you money.</span>
          </h1>

          <p className="text-lg lg:text-xl text-white/50 mt-8 max-w-3xl mx-auto leading-relaxed">
            Handwritten window stickers. Missing FTC Buyers Guides. No K-208 on file.
            Customers walking because the deal jacket is scattered across three desks.
            Sound familiar?
          </p>
        </div>
      </section>

      {/* ─────────── Pain Points ─────────── */}
      <section className="py-20 px-6 lg:px-8 bg-muted/30 border-b border-border">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[11px] font-bold uppercase tracking-widest text-red-500">What's broken</p>
            <h2 className="text-3xl lg:text-4xl font-black tracking-tighter mt-2">
              Dealers lose deals every day because of this
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            <PainCard
              icon={XCircle}
              title="No compliance trail"
              body="FTC fines start at $50,120 per violation. If your Buyers Guide isn't on file, you're exposed."
            />
            <PainCard
              icon={Scale}
              title="State forms missing"
              body="CT K-208 inspections, CA CARS Act disclosures — if they're not attached to the deal file, the deal isn't compliant."
            />
            <PainCard
              icon={DollarSign}
              title="Leaving money on the lot"
              body="No addendum means no disclosure of accessories. Customers don't know what's installed, so you can't charge for it."
            />
            <PainCard
              icon={AlertTriangle}
              title="Paper signatures get lost"
              body="Deal jackets with missing signatures get kicked back from the bank. That's a funded deal delayed by days."
            />
            <PainCard
              icon={XCircle}
              title="No digital deal file"
              body="When the auditor walks in, you're digging through filing cabinets. Every missing document is a potential fine."
            />
            <PainCard
              icon={AlertTriangle}
              title="F&I bottleneck"
              body="Finance managers waste 20 minutes per deal chasing signatures, printing forms, and assembling paperwork."
            />
          </div>
        </div>
      </section>

      {/* ─────────── The Solution ─────────── */}
      <section className="relative py-24 px-6 lg:px-8 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-blue-500/15 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl" />

        <div className="relative max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 backdrop-blur-sm border border-emerald-500/20 rounded-full px-4 py-1.5 text-xs font-semibold text-emerald-300 mb-8">
            <Check className="w-3.5 h-3.5" />
            The solution
          </div>

          <h2 className="text-5xl lg:text-7xl font-black tracking-tighter leading-none">
            One scan.
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-blue-300 to-cyan-300 bg-clip-text text-transparent">
              Complete deal file.
            </span>
          </h2>

          <p className="text-lg text-white/50 mt-8 max-w-3xl mx-auto leading-relaxed">
            AutoLabels.io creates a VIN-specific deal file the moment you add a car to inventory.
            FTC Buyers Guide, K-208 inspection, window stickers, and a QR code for digital signing —
            all attached automatically. When the car sells, scan the QR and the customer signs right there.
          </p>
        </div>
      </section>

      {/* ─────────── How It Works ─────────── */}
      <section className="py-24 px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[11px] font-bold uppercase tracking-widest text-blue-600">How it works</p>
            <h2 className="text-3xl lg:text-4xl font-black tracking-tighter mt-2">
              Four steps. Zero paper.
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            <StepCard
              num="01"
              icon={Scan}
              title="Scan VIN"
              body="Scan the barcode or type the VIN. We decode year, make, model, trim, and factory equipment in under a second."
            />
            <StepCard
              num="02"
              icon={ClipboardCheck}
              title="Auto-attach docs"
              body="FTC Buyers Guide and state-required forms (K-208 in CT) are automatically attached to the vehicle's deal file."
            />
            <StepCard
              num="03"
              icon={QrCode}
              title="Generate QR"
              body="A unique QR code is generated for each vehicle. Print it on the sticker or the deal jacket."
            />
            <StepCard
              num="04"
              icon={Signature}
              title="Scan & sign"
              body="When the car sells, scan the QR. Customer, co-buyer, and dealer sign digitally. Deal file is complete."
            />
          </div>
        </div>
      </section>

      {/* ─────────── Features ─────────── */}
      <section className="py-24 px-6 lg:px-8 bg-muted/30 border-y border-border">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[11px] font-bold uppercase tracking-widest text-blue-600">Built for compliance</p>
            <h2 className="text-3xl lg:text-4xl font-black tracking-tighter mt-2">
              Everything you need. Nothing you don't.
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            <Feature icon={ShieldCheck} title="FTC compliant" body="As-Is, Implied, or Warranty Buyers Guides generated automatically in English and Spanish." />
            <Feature icon={Scale} title="State forms" body="CT K-208 inspection, CA CARS Act disclosures, and state-specific doc fee compliance built in." />
            <Feature icon={Zap} title="VIN decode" body="NHTSA database decode in under a second. Full factory equipment list and base MSRP." />
            <Feature icon={Signature} title="Digital signing" body="Customer and co-buyer sign on their phone via QR. Dealer countersigns. Timestamped audit trail." />
            <Feature icon={FileText} title="Deal file per VIN" body="Every vehicle gets a permanent file with all stickers, compliance docs, and signatures attached." />
            <Feature icon={BarChart3} title="Live dashboard" body="See which cars are stickered, pending, signed, or delivered. Product acceptance rates and revenue." />
          </div>
        </div>
      </section>

      {/* ─────────── CTA ─────────── */}
      <section className="py-24 px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-slate-950 to-blue-950 rounded-3xl px-8 lg:px-16 py-20 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-blue-500/20 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-emerald-500/15 blur-3xl" />

          <div className="relative">
            <Logo variant="full" inverted size={36} className="justify-center mb-8" />
            <h2 className="text-4xl lg:text-5xl font-black tracking-tighter leading-none">
              Stop losing deals
              <br />
              to paperwork.
            </h2>
            <p className="text-lg text-white/50 mt-6">
              Set up in 5 minutes. No credit card required. Cancel anytime.
            </p>
            <div className="mt-8 flex items-center justify-center gap-3 flex-wrap">
              <button
                onClick={() => navigate("/onboarding")}
                className="inline-flex items-center gap-2 h-12 px-6 rounded-md bg-white text-slate-950 text-sm font-semibold hover:bg-white/90 transition-colors"
              >
                Start free trial
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => navigate("/dashboard")}
                className="inline-flex items-center gap-2 h-12 px-6 rounded-md border border-white/20 bg-white/5 text-white text-sm font-semibold hover:bg-white/10 transition-colors"
              >
                See a demo
              </button>
            </div>
            <div className="mt-8 flex items-center justify-center gap-6 text-xs text-white/40 flex-wrap">
              <span className="flex items-center gap-1.5">
                <Check className="w-3 h-3 text-emerald-400" />
                FTC compliant
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-3 h-3 text-emerald-400" />
                CARS Act ready
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-3 h-3 text-emerald-400" />
                Digital signatures
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────── Footer ─────────── */}
      <footer className="border-t border-border py-10 px-6 lg:px-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <Logo variant="full" size={24} />
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} AutoLabels.io · Clear. Compliant. Consistent.
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <button onClick={() => navigate("/login")} className="hover:text-foreground">Sign in</button>
          </div>
        </div>
      </footer>
    </div>
  );
};

// ── Sub-components ──

const PainCard = ({ icon: Icon, title, body }: { icon: typeof XCircle; title: string; body: string }) => (
  <div className="bg-card rounded-2xl border border-red-200/50 dark:border-red-900/30 p-6 hover:shadow-md transition-shadow">
    <div className="w-10 h-10 rounded-lg bg-red-50 dark:bg-red-950/30 flex items-center justify-center mb-4">
      <Icon className="w-5 h-5 text-red-500" />
    </div>
    <h3 className="text-base font-bold text-foreground">{title}</h3>
    <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{body}</p>
  </div>
);

const StepCard = ({ num, icon: Icon, title, body }: { num: string; icon: typeof Scan; title: string; body: string }) => (
  <div className="bg-card rounded-2xl border border-border shadow-sm p-6 hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between mb-4">
      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
        <Icon className="w-5 h-5 text-white" />
      </div>
      <p className="text-xs font-bold text-blue-600 tabular-nums">{num}</p>
    </div>
    <h3 className="text-xl font-bold tracking-tight text-foreground">{title}</h3>
    <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{body}</p>
  </div>
);

const Feature = ({ icon: Icon, title, body }: { icon: typeof Scan; title: string; body: string }) => (
  <div className="bg-card rounded-xl border border-border p-6">
    <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center mb-4">
      <Icon className="w-4 h-4 text-blue-600" />
    </div>
    <h3 className="text-base font-semibold text-foreground">{title}</h3>
    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{body}</p>
  </div>
);

export default About;
