const items = [
  { label: "COA on every batch", icon: "/trust-coa.png" },
  { label: "Cold-chain shipping", icon: "/trust-coldchain.png" },
  { label: "24hr dispatch", icon: "/trust-dispatch.png" },
  { label: "Ships to 12+ countries", icon: "/trust-shipping.png" },
];

export default function TrustBar() {
  return (
    <section className="border-y border-gray-100 py-6">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-4 px-6 text-sm font-medium text-gray-600 md:grid-cols-4">
        {items.map((item) => (
          <div key={item.label} className="flex items-center gap-2">
            <img src={item.icon} alt="" className="h-4 w-4 object-contain" />
            {item.label}
          </div>
        ))}
      </div>
    </section>
  );
}