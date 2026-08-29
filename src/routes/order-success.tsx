import { createFileRoute, Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { formatPKR } from "@/lib/products";
import { useOrders } from "@/lib/store";
import { EmptyState } from "@/components/site/EmptyState";
import { btnOutline, btnPrimary } from "@/lib/ui";

export const Route = createFileRoute("/order-success")({
  validateSearch: (search: Record<string, unknown>) => ({
    order: typeof search["order"] === "string" ? (search["order"] as string) : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Order Confirmed — Lumière Home" },
      { name: "description", content: "Your Lumière Home order has been received." },
      { property: "og:title", content: "Order Confirmed — Lumière Home" },
      { property: "og:description", content: "Thank you for shopping with Lumière Home." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: OrderSuccessPage,
});

function OrderSuccessPage() {
  const { order: orderNumber } = Route.useSearch();
  const orders = useOrders();
  const order = orderNumber ? orders.find((o) => o.number === orderNumber) : orders[0];

  if (!order) {
    return (
      <div className="shell py-20">
        <EmptyState
          title="We couldn't find that order."
          as="h1"
          description="Orders placed on this device appear in your account."
          actionLabel="START SHOPPING"
          actionTo="/shop"
        />
      </div>
    );
  }

  return (
    <div className="shell py-16 md:py-24">
      <div className="mx-auto max-w-3xl">
        <div className="flex flex-col items-center text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full border border-gold text-gold">
            <Check width={24} height={24} aria-hidden="true" />
          </span>
          <p className="eyebrow mt-6 text-gold">Order confirmed</p>
          <h1 className="mt-3 font-display text-5xl">Thank you, {order.customer.name}.</h1>
          <p className="mt-3 max-w-md text-sm text-muted-foreground">
            Your order has been received. A confirmation has been sent to {order.customer.email}.
          </p>
          <p className="mt-6 border border-border bg-cream px-6 py-3 font-display text-2xl">
            {order.number}
          </p>
        </div>

        <div className="mt-12 border border-border">
          <ul className="divide-y divide-border">
            {order.items.map((item) => (
              <li key={item.id} className="flex items-center justify-between gap-4 px-6 py-4">
                <span className="min-w-0">
                  <Link
                    to="/product/$id"
                    params={{ id: item.id }}
                    className="block truncate font-display text-lg hover:text-gold"
                  >
                    {item.name}
                  </Link>
                  <span className="text-xs text-muted-foreground">Qty {item.qty}</span>
                </span>
                <span className="text-sm">{formatPKR(item.price * item.qty)}</span>
              </li>
            ))}
          </ul>
          <dl className="space-y-2 border-t border-border bg-cream px-6 py-5 text-sm">
            <Row label="Subtotal" value={formatPKR(order.subtotal)} />
            {order.discount > 0 && <Row label="Discount" value={`− ${formatPKR(order.discount)}`} />}
            <Row
              label="Delivery"
              value={order.delivery === 0 ? "FREE" : formatPKR(order.delivery)}
            />
            <div className="flex items-baseline justify-between border-t border-border pt-3">
              <dt className="eyebrow">Total</dt>
              <dd className="font-display text-xl">{formatPKR(order.total)}</dd>
            </div>
          </dl>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          <Block title="Delivery address">
            {order.address.street}, {order.address.area}
            <br />
            {order.address.city} {order.address.postalCode}
          </Block>
          <Block title="Payment method">{order.payment}</Block>
          <Block title="Estimated delivery">{order.estimatedDelivery}</Block>
        </div>

        <div className="mt-12 flex flex-wrap justify-center gap-3">
          <Link to="/shop" className={btnPrimary}>
            CONTINUE SHOPPING
          </Link>
          <Link to="/account" className={btnOutline}>
            VIEW MY ORDERS
          </Link>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between">
      <dt className="text-muted-foreground">{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border border-border p-5 text-sm">
      <p className="eyebrow mb-2 text-muted-foreground">{title}</p>
      <p className="leading-relaxed">{children}</p>
    </div>
  );
}
