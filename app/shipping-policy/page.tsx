import { LegalPage, LegalSection, LegalText, LegalList, LegalContactBox } from "@/components/LegalPage";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Shipping Policy",
  description: "Where Purity Peptides ships, delivery times, and how cold-chain packaging works.",
  path: "/shipping-policy",
});

export default function ShippingPolicyPage() {
  return (
    <LegalPage
      title="Shipping"
      accent="Policy"
      updated="[Month] [Day], 2024"
      crossLinks={[
        { label: "Return Policy", href: "/return-policy" },
        { label: "Terms of Service", href: "/terms" },
      ]}
    >
      <LegalText>
        This policy explains where Purity Peptides ships, how long delivery takes, and how we handle temperature-
        sensitive products in transit.
      </LegalText>

      <LegalSection number={1} title="Where We Ship">
        <LegalText>
          We currently ship to the United States, Canada, Mexico, and select countries across South America,
          Europe, and Oceania. The full list of available countries is shown at checkout. If your country is not
          listed, we are not currently able to ship there.
        </LegalText>
      </LegalSection>

      <LegalSection number={2} title="Processing Time">
        <LegalText>
          Orders are processed once payment has been confirmed by our team, which can take anywhere from a few
          minutes to 24 hours depending on the payment method selected. Orders are typically dispatched within 24
          hours of payment confirmation.
        </LegalText>
      </LegalSection>

      <LegalSection number={3} title="Estimated Delivery Times">
        <LegalList
          items={[
            "United States and Canada: 3 to 7 business days",
            "Mexico and South America: 7 to 14 business days",
            "Europe: 6 to 12 business days",
            "Australia and New Zealand: 8 to 16 business days",
          ]}
        />
        <LegalText>
          These are estimates, not guarantees. Customs processing, local courier delays, and other factors outside
          our control can extend delivery times, particularly for international orders.
        </LegalText>
      </LegalSection>

      <LegalSection number={4} title="Customs, Duties, and Taxes">
        <LegalText>
          International orders may be subject to import duties, taxes, or customs fees charged by the destination
          country. These charges are the responsibility of the customer and are not included in the order total or
          shipping cost shown at checkout.
        </LegalText>
      </LegalSection>

      <LegalSection number={5} title="Cold-Chain Packaging">
        <LegalText>
          Research peptides are shipped in insulated packaging with cold-chain handling where the product requires
          it, to help preserve integrity in transit. Skincare and cosmetic items ship in standard packaging.
        </LegalText>
      </LegalSection>

      <LegalSection number={6} title="Order Tracking">
        <LegalText>
          A tracking number is provided by email once your order ships. Tracking updates may take 24 to 48 hours to
          appear after dispatch, depending on the carrier.
        </LegalText>
      </LegalSection>

      <LegalSection number={7} title="Lost or Delayed Shipments">
        <LegalText>
          If your order has not arrived within the estimated delivery window, contact us with your order number and
          we will investigate with the carrier.
        </LegalText>
      </LegalSection>

      <LegalSection number={8} title="Contact Us">
        <LegalContactBox>
          <p className="text-sm font-semibold text-ink">Purity Peptides Support</p>
          <p className="text-sm text-gray-600">
             Email:{" "}
            <a href="mailto:puritypeptidessupport@gmail.com" className="text-sky hover:underline">
              puritypeptidessupport@gmail.com
            </a>
          </p>
          <p className="text-sm text-gray-600">Response time: within 24 hours</p>
        </LegalContactBox>
      </LegalSection>
    </LegalPage>
  );
}