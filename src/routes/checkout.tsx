import { useState, type FormEvent } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { img } from "@/lib/images";
import { PK_CITIES, finalPrice, formatPKR } from "@/lib/products";
import {
  cartTotals,
  clearCart,
  detailedCart,
  makeOrderNumber,
  saveAddress,
  saveOrder,
  saveProfile,
  useCart,
  useProfile,
  type Order,
} from "@/lib/store";
import { EmptyState } from "@/components/site/EmptyState";
import { btnOutline, btnPrimary, inputBase, labelBase } from "@/lib/ui";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — Lumière Home" },
      { name: "description", content: "Complete your Lumière Home order securely." },
      { property: "og:title", content: "Checkout — Lumière Home" },
      { property: "og:description", content: "Cash on delivery, bank transfer or card." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CheckoutPage,
});

const PAYMENTS = [
  { value: "Cash on Delivery", hint: "Pay the courier when your order arrives." },
  { value: "Bank Transfer", hint: "Transfer details are emailed after you order." },
  { value: "Card Payment", hint: "Demo only — no real payment is processed." },
];

const STEPS = ["Information", "Delivery", "Payment"];

type Fields = {
  name: string;
  email: string;
  phone: string;
  street: string;
  area: string;
  city: string;
  postalCode: string;
  payment: string;
};

type Errors = Partial<Record<keyof Fields, string>>;

function validate(step: number, f: Fields): Errors {
  const e: Errors = {};
  if (step === 0) {
    if (!f.name.trim()) e.name = "Please enter your full name.";
    else if (f.name.trim().length < 3) e.name = "Name looks too short.";
    if (!f.email.trim()) e.email = "Please enter your email address.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email))
      e.email = "Please enter a valid email address.";
    if (!f.phone.trim()) e.phone = "Please enter your phone number.";
    else if (!/^(\+92|0)?3\d{2}[\s-]?\d{7}$/.test(f.phone.replace(/\s|-/g, "")))
      e.phone = "Enter a valid Pakistani mobile number, e.g. 0301 2345678.";
  }
  if (step === 1) {
    if (!f.street.trim()) e.street = "Please enter your street address.";
    if (!f.area.trim()) e.area = "Please enter your area or neighbourhood.";
    if (!f.city.trim()) e.city = "Please select a city.";
    if (!/^\d{5}$/.test(f.postalCode.trim())) e.postalCode = "Postal code must be 5 digits.";
  }
  if (step === 2 && !f.payment) e.payment = "Please choose a payment method.";
  return e;
}

function CheckoutPage() {
  const lines = useCart();
  const details = detailedCart(lines);
  const totals = cartTotals(details);
  const profile = useProfile();
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<Errors>({});
  const [placing, setPlacing] = useState(false);
  const [fields, setFields] = useState<Fields>({
    name: profile.name,
    email: profile.email,
    phone: profile.phone,
    street: "",
    area: "",
    city: profile.city || "Karachi",
    postalCode: "",
    payment: "Cash on Delivery",
  });

  const set = (key: keyof Fields, value: string) => {
    setFields((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  if (details.length === 0 && !placing) {
    return (
      <div className="shell py-20">
        <EmptyState
          title="There's nothing to check out yet."
          as="h1"
          description="Add a few pieces to your cart and we'll take it from there."
          actionLabel="EXPLORE DECOR"
          actionTo="/shop"
        />
      </div>
    );
  }

  const next = (e: FormEvent) => {
    e.preventDefault();
    const found = validate(step, fields);
    setErrors(found);
    if (Object.keys(found).length > 0) return;
    if (step < 2) {
      setStep(step + 1);
      return;
    }
    placeOrder();
  };

  const placeOrder = () => {
    const allErrors = { ...validate(0, fields), ...validate(1, fields), ...validate(2, fields) };
    if (Object.keys(allErrors).length > 0) {
      setErrors(allErrors);
      setStep(allErrors.name || allErrors.email || allErrors.phone ? 0 : 1);
      return;
    }
    setPlacing(true);
    const estimated = new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toLocaleDateString("en-PK", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
    const order: Order = {
      number: makeOrderNumber(),
      placedAt: new Date().toISOString(),
      items: details.map((d) => ({
        id: d.product.id,
        name: d.product.name,
        qty: d.qty,
        price: finalPrice(d.product),
      })),
      subtotal: totals.subtotal,
      delivery: totals.delivery,
      discount: totals.discount,
      total: totals.total,
      customer: { name: fields.name, email: fields.email, phone: fields.phone },
      address: {
        label: "Home",
        street: fields.street,
        area: fields.area,
        city: fields.city,
        postalCode: fields.postalCode,
      },
      payment: fields.payment,
      estimatedDelivery: `Arriving around ${estimated}`,
    };

    saveOrder(order);
    saveProfile({
      name: fields.name,
      email: fields.email,
      phone: fields.phone,
      city: fields.city,
      signedIn: true,
    });
    saveAddress(order.address);
    clearCart();
    void navigate({ to: "/order-success", search: { order: order.number } });
  };

  return (
    <div className="shell py-16 md:py-24">
      <h1 className="font-display text-5xl">Checkout</h1>

      <ol className="mt-8 flex flex-wrap items-center gap-4 text-xs">
        {STEPS.map((label, i) => (
          <li key={label} className="flex items-center gap-3">
            <span
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded-full border text-[0.7rem]",
                i < step
                  ? "border-gold bg-gold text-espresso"
                  : i === step
                    ? "border-espresso bg-espresso text-ivory"
                    : "border-border text-muted-foreground",
              )}
            >
              {i < step ? <Check width={13} height={13} aria-hidden="true" /> : i + 1}
            </span>
            <span
              className={cn(
                "uppercase tracking-[0.18em]",
                i === step ? "text-foreground" : "text-muted-foreground",
              )}
            >
              {label}
            </span>
            {i < STEPS.length - 1 && (
              <span className="hidden h-px w-10 bg-border sm:block" aria-hidden="true" />
            )}
          </li>
        ))}
      </ol>

      <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_22rem]">
        <form onSubmit={next} noValidate className="min-w-0">
          {step === 0 && (
            <fieldset className="space-y-5">
              <legend className="font-display text-2xl">Customer information</legend>
              <Field
                id="name"
                label="Full name"
                value={fields.name}
                onChange={(v) => set("name", v)}
                error={errors.name}
                autoComplete="name"
              />
              <Field
                id="email"
                label="Email"
                type="email"
                value={fields.email}
                onChange={(v) => set("email", v)}
                error={errors.email}
                autoComplete="email"
              />
              <Field
                id="phone"
                label="Phone"
                type="tel"
                placeholder="0301 2345678"
                value={fields.phone}
                onChange={(v) => set("phone", v)}
                error={errors.phone}
                autoComplete="tel"
              />
            </fieldset>
          )}

          {step === 1 && (
            <fieldset className="space-y-5">
              <legend className="font-display text-2xl">Delivery address</legend>
              <Field
                id="street"
                label="Street address"
                value={fields.street}
                onChange={(v) => set("street", v)}
                error={errors.street}
                autoComplete="street-address"
              />
              <Field
                id="area"
                label="Area"
                placeholder="DHA Phase 6"
                value={fields.area}
                onChange={(v) => set("area", v)}
                error={errors.area}
              />
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="city" className={labelBase}>
                    City
                  </label>
                  <select
                    id="city"
                    value={fields.city}
                    onChange={(e) => set("city", e.target.value)}
                    className={inputBase}
                  >
                    {PK_CITIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  {errors.city ? <ErrorText>{errors.city}</ErrorText> : null}
                </div>
                <Field
                  id="postalCode"
                  label="Postal code"
                  placeholder="75500"
                  value={fields.postalCode}
                  onChange={(v) => set("postalCode", v)}
                  error={errors.postalCode}
                  autoComplete="postal-code"
                />
              </div>
            </fieldset>
          )}

          {step === 2 && (
            <fieldset className="space-y-4">
              <legend className="font-display text-2xl">Payment method</legend>
              {PAYMENTS.map((p) => (
                <label
                  key={p.value}
                  className={cn(
                    "flex cursor-pointer items-start gap-4 border p-5 transition-colors",
                    fields.payment === p.value ? "border-espresso bg-cream" : "border-border",
                  )}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={p.value}
                    checked={fields.payment === p.value}
                    onChange={(e) => set("payment", e.target.value)}
                    className="mt-1 h-4 w-4 accent-[oklch(0.28_0.03_50)]"
                  />
                  <span>
                    <span className="block text-sm font-medium">{p.value}</span>
                    <span className="mt-1 block text-xs text-muted-foreground">{p.hint}</span>
                  </span>
                </label>
              ))}
              {errors.payment ? <ErrorText>{errors.payment}</ErrorText> : null}
              <p className="text-xs text-muted-foreground">
                This is a portfolio demonstration — no real payment is processed.
              </p>
            </fieldset>
          )}

          <div className="mt-10 flex flex-wrap gap-3">
            {step > 0 && (
              <button type="button" onClick={() => setStep(step - 1)} className={btnOutline}>
                BACK
              </button>
            )}
            <button type="submit" className={btnPrimary} disabled={placing}>
              {step === 2 ? "PLACE ORDER" : "CONTINUE"}
            </button>
            <Link to="/cart" className="self-center text-xs underline underline-offset-4">
              Edit cart
            </Link>
          </div>
        </form>

        <aside className="h-fit border border-border bg-cream p-7 lg:sticky lg:top-28">
          <h2 className="eyebrow text-muted-foreground">Your order</h2>
          <ul className="mt-5 space-y-4">
            {details.map(({ product, qty, lineTotal }) => (
              <li key={product.id} className="flex gap-3">
                <img
                  src={img(product.imageKey)}
                  alt={product.name}
                  loading="lazy"
                  width={64}
                  height={80}
                  className="h-20 w-16 flex-none object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-display text-base">{product.name}</p>
                  <p className="text-xs text-muted-foreground">Qty {qty}</p>
                </div>
                <p className="text-sm">{formatPKR(lineTotal)}</p>
              </li>
            ))}
          </ul>
          <dl className="mt-6 space-y-2 border-t border-border pt-5 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Subtotal</dt>
              <dd>{formatPKR(totals.subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Delivery</dt>
              <dd>{totals.delivery === 0 ? "FREE" : formatPKR(totals.delivery)}</dd>
            </div>
            <div className="flex items-baseline justify-between border-t border-border pt-3">
              <dt className="eyebrow">Total</dt>
              <dd className="font-display text-2xl">{formatPKR(totals.total)}</dd>
            </div>
          </dl>
        </aside>
      </div>
    </div>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  error,
  type = "text",
  placeholder,
  autoComplete,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string | undefined;
  type?: string | undefined;
  placeholder?: string | undefined;
  autoComplete?: string | undefined;
}) {
  return (
    <div>
      <label htmlFor={id} className={labelBase}>
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        placeholder={placeholder}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className={cn(inputBase, error && "border-burgundy")}
      />
      {error ? <ErrorText id={`${id}-error`}>{error}</ErrorText> : null}
    </div>
  );
}

function ErrorText({ children, id }: { children: React.ReactNode; id?: string | undefined }) {
  return (
    <p id={id} role="alert" className="mt-2 text-xs text-burgundy">
      {children}
    </p>
  );
}
