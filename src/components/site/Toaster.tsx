import { useToasts } from "@/lib/store";
import { Check } from "lucide-react";

export function Toaster() {
  const toasts = useToasts();
  return (
    <div
      className="pointer-events-none fixed bottom-5 left-1/2 z-[70] flex w-[min(92vw,26rem)] -translate-x-1/2 flex-col gap-2"
      role="status"
      aria-live="polite"
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          className="lum-reveal is-visible flex items-center gap-3 border border-border bg-espresso px-4 py-3 text-sm text-ivory shadow-lg"
        >
          {t.tone === "success" && (
            <Check width={16} height={16} className="text-gold" aria-hidden="true" />
          )}
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  );
}
