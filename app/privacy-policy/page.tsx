import { LegalPage, LegalSection, LegalText, LegalList, LegalContactBox } from "@/components/LegalPage";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Privacy Policy",
  description: "How Purity Peptides collects, uses, and protects your personal information.",
  path: "/privacy-policy",
});

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      title="Privacy"
      accent="Policy"
      updated="[Month] [Day], 2024"
      crossLinks={[
        { label: "Return Policy", href: "/return-policy" },
        { label: "Terms of Service", href: "/terms" },
      ]}
    >
      <LegalText>
        Purity Peptides (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your
        personal information. This Privacy Policy explains what information we collect, how we use it, and what
        rights you have. By using puritypeptides.com, you agree to the terms of this policy.
      </LegalText>

      <LegalSection number={1} title="Information We Collect">
        <LegalText>When you place an order or create an account, we collect the following:</LegalText>
        <LegalList
          items={[
            "Full name and email address",
            "Shipping address, including city, state, ZIP code, and country",
            "Phone number, if provided",
            "Payment method selected (we do not store full card numbers)",
            "Order history and items purchased",
            "Messages sent through our contact form",
          ]}
        />
      </LegalSection>

      <LegalSection number={2} title="How We Use Your Information">
        <LegalText>We use the information we collect to:</LegalText>
        <LegalList
          items={[
            "Process and fulfill your orders",
            "Send order confirmations and payment status updates",
            "Respond to inquiries and support requests",
            "Improve our website, catalog, and educational content",
            "Comply with legal and regulatory obligations",
          ]}
        />
        <LegalText>We do not sell, rent, or trade your personal information to third parties for marketing purposes.</LegalText>
      </LegalSection>

      <LegalSection number={3} title="How We Store Your Information">
        <LegalText>
          Your data is stored securely using Supabase, a cloud database provider. Data is encrypted in transit
          using SSL and at rest using industry-standard encryption. We retain order data for up to 7 years for tax
          and accounting purposes.
        </LegalText>
        <LegalText>
          We take reasonable technical and organizational measures to protect your personal information against
          unauthorized access, alteration, disclosure, or destruction.
        </LegalText>
      </LegalSection>

      <LegalSection number={4} title="Cookies and Tracking">
        <LegalText>
          Purity Peptides uses minimal cookies necessary for the site to function, including session cookies that
          keep your cart and sign-in state active. We may use analytics tools to understand how visitors use our
          site; this data is anonymized and does not identify you personally. You can disable cookies in your
          browser settings at any time.
        </LegalText>
      </LegalSection>

      <LegalSection number={5} title="Sharing Your Information">
        <LegalText>We only share your information with third parties when necessary to fulfill your order or comply with the law:</LegalText>
        <LegalList
          items={[
            "Shipping carriers who need your address to deliver your order",
            "Payment confirmation is handled directly by our team, not an automated processor",
            "Legal authorities, if required by law",
          ]}
        />
      </LegalSection>

      <LegalSection number={6} title="Your Rights">
        <LegalText>Depending on where you are located, including the European Economic Area and United Kingdom, you have the right to:</LegalText>
        <LegalList
          items={[
            "Access the personal information we hold about you",
            "Request correction of inaccurate information",
            "Request deletion of your personal data",
            "Withdraw consent for marketing communications at any time",
            "Lodge a complaint with your local data protection authority",
          ]}
        />
        <LegalText>To exercise any of these rights, contact us at [privacy@puritypeptides.com]. We will respond within 30 days.</LegalText>
      </LegalSection>

      <LegalSection number={7} title="Age Requirement and Children's Privacy">
        <LegalText>
          Purity Peptides sells research-use and cosmetic products intended only for adults. Our site is not
          directed at anyone under 18, and we do not knowingly collect personal information from anyone under 18.
          If you believe a minor has provided us with personal information, contact us and we will delete it
          immediately.
        </LegalText>
      </LegalSection>

      <LegalSection number={8} title="Changes to This Policy">
        <LegalText>
          We may update this Privacy Policy from time to time. Material changes will be reflected by updating the
          date at the top of this page. We encourage you to review this policy periodically.
        </LegalText>
      </LegalSection>

      <LegalSection number={9} title="Contact Us">
        <LegalText>Questions about this policy or how we handle your personal information can be sent to:</LegalText>
        <LegalContactBox>
           <p className="text-sm font-semibold text-ink">Purity Peptides Support</p>
          <p className="text-sm text-gray-600">
              Email:{" "}
            <a href="mailto:puritypeptidessupport@gmail.com" className="text-sky hover:underline">
              puritypeptidessupport@gmail.com
            </a>
          </p>
          <p className="text-sm text-gray-600">Website: www.puritypeptides.com</p>
        </LegalContactBox>
      </LegalSection>
    </LegalPage>
  );
}