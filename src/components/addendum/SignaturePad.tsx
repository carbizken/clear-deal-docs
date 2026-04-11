import { useRef, useState, useEffect } from "react";

interface SignaturePadProps {
  label: string;
  subtitle: string;
  value?: string;
  type?: "draw" | "type";
  onChange: (data: string, type: "draw" | "type") => void;
  className?: string;
}

const SignaturePad = ({ label, subtitle, value, type: sigType, onChange, className }: SignaturePadProps) => {
  const [mode, setMode] = useState<"draw" | "type">(sigType || "draw");
  const [typedName, setTypedName] = useState(sigType === "type" ? (value || "") : "");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);

  useEffect(() => {
    if (mode === "draw" && value && canvasRef.current) {
      const img = new Image();
      img.onload = () => {
        const ctx = canvasRef.current?.getContext("2d");
        if (ctx && canvasRef.current) {
          ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
          ctx.drawImage(img, 0, 0);
        }
      };
      img.src = value;
    }
  }, []);

  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    if ("touches" in e) {
      return { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top };
    }
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const startDraw = (e: React.MouseEvent | React.TouchEvent) => {
    isDrawing.current = true;
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx) {
      const { x, y } = getPos(e);
      ctx.beginPath();
      ctx.moveTo(x, y);
    }
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing.current) return;
    // Only prevent default (stops page scroll) when we're actively drawing
    if ("touches" in e) {
      e.preventDefault();
    }
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx) {
      const { x, y } = getPos(e);
      ctx.lineWidth = 3;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.strokeStyle = "#000000";
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  const endDraw = () => {
    isDrawing.current = false;
    if (canvasRef.current) {
      onChange(canvasRef.current.toDataURL(), "draw");
    }
  };

  const clearCanvas = () => {
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx && canvasRef.current) {
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      onChange("", "draw");
    }
  };

  return (
    <div className={`space-y-1 ${className || ""}`}>
      <div className="flex items-center justify-between">
        <span className="text-[9px] font-bold text-foreground">{label}</span>
        <div className="flex gap-1">
          <button
            onClick={() => setMode("draw")}
            className={`text-[8px] px-2 py-0.5 rounded ${mode === "draw" ? "bg-navy text-primary-foreground" : "bg-light text-muted-foreground"}`}
          >
            ✏️ Draw
          </button>
          <button
            onClick={() => setMode("type")}
            className={`text-[8px] px-2 py-0.5 rounded ${mode === "type" ? "bg-navy text-primary-foreground" : "bg-light text-muted-foreground"}`}
          >
            ⌨️ Type
          </button>
        </div>
      </div>
      {mode === "draw" ? (
        <div className="relative">
          <canvas
            ref={canvasRef}
            width={400}
            height={80}
            className="w-full border-b-2 border-border-custom bg-card rounded cursor-crosshair"
            style={{ touchAction: "pan-y" }}
            onMouseDown={startDraw}
            onMouseMove={draw}
            onMouseUp={endDraw}
            onMouseLeave={endDraw}
            onTouchStart={startDraw}
            onTouchMove={draw}
            onTouchEnd={endDraw}
          />
          <button onClick={clearCanvas} className="absolute top-1 right-1 text-[7px] px-1.5 py-0.5 bg-muted rounded text-muted-foreground">
            Clear
          </button>
        </div>
      ) : (
        <input
          value={typedName}
          onChange={(e) => {
            setTypedName(e.target.value);
            onChange(e.target.value, "type");
          }}
          placeholder="Type full name"
          className="w-full border-b-[1.5px] border-border-custom bg-transparent outline-none py-1"
          style={{ fontFamily: "'Brush Script MT', 'Segoe Script', cursive", fontSize: "20px" }}
        />
      )}
      <p className="text-[7px] text-muted-foreground">
        {subtitle}
      </p>
    </div>
  );
};

export default SignaturePad;
