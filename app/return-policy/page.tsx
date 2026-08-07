import { LegalPage, LegalSection, LegalText, LegalList, LegalSteps, LegalContactBox } from "@/components/LegalPage";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Return Policy",
  description: "When returns, replacements, and refunds are available for Purity Peptides orders.",
  path: "/return-policy",
});

export default function ReturnPolicyPage() {
  return (
    <LegalPage
      title="Return"
      accent="Policy"
      updated="[Month] [Day], 2024"
      crossLinks={[
        { label: "Privacy Policy", href: "/privacy-policy" },
        { label: "Terms of Service", href: "/terms" },
      ]}
    >
      <LegalText>
        We want you to be confident in what you order from Purity Peptides. This policy explains when returns,
        replacements, or refunds are available. Please read it before placing your order, since research peptides
        carry different rules than standard retail products due to cold-chain handling.
      </LegalText>

      <LegalSection number={1} title="Return Eligibility">
        <LegalText>We accept returns or replacements under the following conditions:</LegalText>
        <LegalList
          dot="success"
          items={[
            "The item received is defective, damaged in transit, or does not match its listed specifications",
            "You received the wrong item compared to what you ordered",
            "The claim is made within 7 days of the delivery date",
            "You have proof of purchase, such as your order number",
          ]}
        />
      </LegalSection>

      <LegalSection number={2} title="Non-Returnable Items">
        <LegalText>The following cannot be returned once shipped:</LegalText>
        <LegalList
          dot="error"
          items={[
            "Research peptides that have left our cold-chain packaging and been received in good condition, due to the impossibility of verifying storage conditions once outside our control",
            "Any product for change-of-mind reasons rather than a defect, damage, or fulfillment error",
            "Opened or used skincare and cosmetic products, unless defective",
            "Products explicitly marked as final sale at the time of purchase",
          ]}
        />
      </LegalSection>

      <LegalSection number={3} title="Damaged or Incorrect Items">
        <LegalText>If your order arrives damaged, incomplete, or different from what you ordered:</LegalText>
        <LegalList
          items={[
            "Take clear photos of the item and its packaging before doing anything else",
            "Contact us within 7 days of delivery with your order number and photos",
            "Do not discard the original packaging until the claim is resolved",
          ]}
        />
      </LegalSection>

      <LegalSection number={4} title="How to Start a Return">
        <LegalSteps
          steps={[
            { step: "01", title: "Contact Us", desc: "Email support with your order number and the reason for your claim. We respond within 24 hours." },
            { step: "02", title: "Claim Review", desc: "Our team reviews your claim and, if approved, provides instructions specific to your situation." },
            { step: "03", title: "Resolution", desc: "Depending on the issue, we send a replacement, issue a refund, or request additional information." },
            { step: "04", title: "Confirmation", desc: "Once resolved, you receive written confirmation of the outcome by email." },
          ]}
        />
      </LegalSection>

      <LegalSection number={5} title="Refund Processing">
        <LegalText>Once a return or claim is approved:</LegalText>
        <LegalList
          items={[
            "Refunds are processed within 5 to 10 business days of approval",
            "Card and PayPal refunds may take an additional 3 to 5 business days to appear, depending on your bank",
            "CashApp, Venmo, Zelle, and Chime refunds are sent directly to you and are typically faster",
          ]}
        />
      </LegalSection>

      <LegalSection number={6} title="Order Cancellations">
        <LegalText>
          Orders can be canceled free of charge before payment has been confirmed by our team. Once payment is
          confirmed and an order enters processing, it may not be possible to cancel, since research peptides are
          often prepared and packed shortly after payment is verified. To request a cancellation, contact us
          immediately with your order number.
        </LegalText>
      </LegalSection>

      <LegalSection number={7} title="Contact Us">
        <LegalContactBox>
          <p className="text-sm font-semibold text-ink">Purity Peptides Support</p>
          <p className="text-sm text-gray-600">Email: [support@puritypeptides.com]</p>
          <p className="text-sm text-gray-600">Response time: within 24 hours</p>
        </LegalContactBox>
      </LegalSection>
    </LegalPage>
  );
}