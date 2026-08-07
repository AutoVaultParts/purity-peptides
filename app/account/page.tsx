import Link from "next/link";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Account",
  description: "Purity Peptides customer accounts.",
  path: "/account",
  noIndex: true,
});

export default function AccountPage() {
  return (
    <section className="mx-auto max-w-lg px-6 py-24 text-center">
      <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-sky-bg">
        <img src="/icon-account.png" alt="" className="h-6 w-6 object-contain" />
      </div>
      <h1 className="mb-3 font-display text-2xl font-medium text-ink">Accounts are coming soon</h1>
      <p className="mb-8 text-sm leading-relaxed text-gray-600">
        Customer accounts and order history are on the way. For now, every order can be placed as a guest, and your
        order confirmation page has everything you need to track it.
      </p>
      <Link href="/shop" className="rounded-full bg-ink px-7 py-3.5 text-sm font-semibold text-white hover:bg-sky">
        Continue shopping
      </Link>
    </section>
  );
}