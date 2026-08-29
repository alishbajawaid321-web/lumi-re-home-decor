import { useState, type FormEvent } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { PageHeader } from "@/components/site/Section";
import { btnPrimary, inputBase, labelBase } from "@/lib/ui";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact & FAQ — Lumière Home" },
      {
        name: "description",
        content:
          "Message the Lumière Home studio about styling, orders or delivery across Pakistan, or read our frequently asked questions.",
      },
      { property: "og:title", content: "Contact & FAQ — Lumière Home" },
      { property: "og:description", content: "Talk to our Karachi studio about your space." },
    ],
  }),
  component: ContactPage,
});

const DEFAULT_SUBJECT = "Styling advice";
const SUBJECTS = [
  "Styling advice",
  "Order or delivery",
  "Returns",
  "Bulk & corporate gifting",
  "Something else",
];

const FAQS = [
  {
    q: "How long does delivery take?",
    a: "Karachi, Lahore and Islamabad usually receive orders in 2–3 working days. Other cities take 3–5 working days.",
  },
  {
    q: "What does delivery cost?",
    a: "A flat ₨250 nationwide, and free on every order above ₨10,000.",
  },
  {
    q: "Can I pay cash on delivery?",
    a: "Yes. Cash on delivery, bank transfer and card are all available at checkout.",
  },
  {
    q: "Do you accept returns?",
    a: "Unused pieces can be returned within 7 days in their original packaging. Personalised items are final sale.",
  },
  {
    q: "Do you sell furniture?",
    a: "No — Lumière Home is decor only: art, lighting, textiles, candles, vases and handmade objects.",
  },
];

type Fields = { name: string; email: string; phone: string; subject: string; message: string };
type Errors = Partial<Record<keyof Fields, string>>;

function ContactPage() {
  const [fields, setFields] = useState<Fields>({
    name: "",
    email: "",
    phone: "",
    subject: DEFAULT_SUBJECT,
    message: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);

  const set = (key: keyof Fields, value: string) => {
    setFields((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const next: Errors = {};
    if (!fields.name.trim()) next.name = "Please enter your name.";
    if (!fields.email.trim()) next.email = "Please enter your email address.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(fields.email))
      next.email = "Please enter a valid email address.";
    if (!fields.phone.trim()) next.phone = "Please enter your phone number.";
    else if (!/^(\+92|0)?3\d{2}[\s-]?\d{7}$/.test(fields.phone.replace(/\s|-/g, "")))
      next.phone = "Enter a valid Pakistani mobile number, e.g. 0301 2345678.";
    if (!fields.subject) next.subject = "Please choose a subject.";
    if (fields.message.trim().length < 10)
      next.message = "Please tell us a little more (at least 10 characters).";

    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setSent(true);
    setFields({ name: "", email: "", phone: "", subject: DEFAULT_SUBJECT, message: "" });
  };

  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Talk to the studio."
        description="Styling questions, order updates or a room you can't quite solve — we answer within two working days."
      />

      <section className="shell grid gap-12 py-16 md:py-24 lg:grid-cols-[1fr_20rem]">
        <div>
          {sent ? (
            <div
              role="status"
              className="border border-gold bg-cream p-10 text-center"
            >
              <h2 className="font-display text-3xl">Thank you. Your message has been received.</h2>
              <p className="mt-3 text-sm text-muted-foreground">
                Our studio will reply within two working days.
              </p>
              <button type="button" onClick={() => setSent(false)} className={btnPrimary + " mt-8"}>
                SEND ANOTHER MESSAGE
              </button>
            </div>
          ) : (
            <form onSubmit={submit} noValidate className="max-w-2xl space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <Field
                  id="c-name"
                  label="Name"
                  value={fields.name}
                  onChange={(v) => set("name", v)}
                  error={errors.name}
                  autoComplete="name"
                />
                <Field
                  id="c-email"
                  label="Email"
                  type="email"
                  value={fields.email}
                  onChange={(v) => set("email", v)}
                  error={errors.email}
                  autoComplete="email"
                />
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field
                  id="c-phone"
                  label="Phone"
                  type="tel"
                  placeholder="0301 2345678"
                  value={fields.phone}
                  onChange={(v) => set("phone", v)}
                  error={errors.phone}
                  autoComplete="tel"
                />
                <div>
                  <label htmlFor="c-subject" className={labelBase}>
                    Subject
                  </label>
                  <select
                    id="c-subject"
                    value={fields.subject}
                    onChange={(e) => set("subject", e.target.value)}
                    className={inputBase}
                  >
                    {SUBJECTS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label htmlFor="c-message" className={labelBase}>
                  Message
                </label>
                <textarea
                  id="c-message"
                  rows={6}
                  value={fields.message}
                  onChange={(e) => set("message", e.target.value)}
                  aria-invalid={!!errors.message}
                  className={cn(inputBase, "resize-y", errors.message && "border-burgundy")}
                />
                {errors.message ? (
                  <p role="alert" className="mt-2 text-xs text-burgundy">
                    {errors.message}
                  </p>
                ) : null}
              </div>
              <button type="submit" className={btnPrimary}>
                SEND MESSAGE
              </button>
            </form>
          )}
        </div>

        <aside className="space-y-6 text-sm">
          <Info icon={<MapPin width={16} height={16} />} title="Studio">
            14-C, Khayaban-e-Bukhari
            <br />
            DHA Phase 6, Karachi
          </Info>
          <Info icon={<Phone width={16} height={16} />} title="Phone">
            <a href="tel:+922135840000" className="hover:text-gold">
              +92 21 3584 0000
            </a>
          </Info>
          <Info icon={<Mail width={16} height={16} />} title="Email">
            <a href="mailto:studio@lumierehome.pk" className="hover:text-gold">
              studio@lumierehome.pk
            </a>
          </Info>
          <Info icon={<Clock width={16} height={16} />} title="Hours">
            Mon–Sat, 11am – 8pm PKT
          </Info>
        </aside>
      </section>

      <section id="faq" className="shell scroll-mt-28 border-t border-border py-16 md:py-24">
        <h2 className="font-display text-4xl">Frequently asked</h2>
        <div className="mt-10 max-w-3xl divide-y divide-border border-y border-border">
          {FAQS.map((f) => (
            <details key={f.q} className="group py-5">
              <summary className="cursor-pointer list-none font-display text-xl marker:hidden">
                {f.q}
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
            </details>
          ))}
        </div>
      </section>
    </>
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
        className={cn(inputBase, error && "border-burgundy")}
      />
      {error ? (
        <p role="alert" className="mt-2 text-xs text-burgundy">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function Info({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border border-border p-5">
      <p className="eyebrow flex items-center gap-2 text-muted-foreground">
        <span className="text-gold">{icon}</span>
        {title}
      </p>
      <p className="mt-2 leading-relaxed">{children}</p>
    </div>
  );
}
