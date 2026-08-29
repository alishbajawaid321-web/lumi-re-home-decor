import { Star } from "lucide-react";

export function Stars({
  rating,
  reviews,
  size = 13,
}: {
  rating: number;
  reviews?: number;
  size?: number;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 align-middle">
      <span className="flex items-center gap-0.5" aria-hidden="true">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            width={size}
            height={size}
            className={
              i <= Math.round(rating) ? "fill-gold text-gold" : "text-border"
            }
            strokeWidth={1.5}
          />
        ))}
      </span>
      <span className="text-xs text-muted-foreground">
        {rating.toFixed(1)}
        {reviews !== undefined ? ` (${reviews})` : ""}
        <span className="sr-only"> out of 5 stars</span>
      </span>
    </span>
  );
}
