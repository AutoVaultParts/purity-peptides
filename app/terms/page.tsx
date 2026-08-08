import { LegalPage, LegalSection, LegalText, LegalList, LegalContactBox } from "@/components/LegalPage";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Terms of Service",
  description: "Terms and conditions for purchasing research peptides and cosmetic products from Purity Peptides.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of"
      accent="Service"
      updated="[Month] [Day], 2026"
      crossLinks={[
        { label: "Privacy Policy", href: "/privacy-policy" },
        { label: "Return Policy", href: "/return-policy" },
        { label: "Medical Disclaimer", href: "/medical-disclaimer" },
      ]}
    >
      <LegalText>
        These Terms of Service govern your use of puritypeptides.com and any purchase made through it. By accessing
        our website or placing an order, you agree to be bound by these Terms. Please read them carefully.
      </LegalText>

      <LegalSection number={1} title="About Purity Peptides">
        <LegalText>
          Purity Peptides is an online platform specializing in research-use peptides and cosmetic peptide
          formulations, including products for recovery, anti-aging, and skincare research. We source from
          suppliers who provide batch-specific documentation and ship to customers across North America, South
          America, Europe, and Oceania.
        </LegalText>
      </LegalSection>

      <LegalSection number={2} title="Eligibility">
        <LegalText>
          You must be at least 18 years old to place an order on Purity Peptides. By placing an order, you confirm
          that you are 18 or older and that the information you provide is accurate. We reserve the right to
          refuse service to anyone at our discretion.
        </LegalText>
      </LegalSection>

      <LegalSection number={3} title="Product Listings and Accuracy">
        <LegalText>We make every effort to keep our catalog accurate, but:</LegalText>
        <LegalList
          items={[
            "Product images may be illustrative until full white-background photography is completed for a given SKU",
            "Specifications such as molecular formula, weight, and CAS number are provided for informational purposes and sourced from public chemical references",
            "Prices are subject to change without notice, but the price at the time your order is placed is the price you pay",
            "We reserve the right to cancel any order listed at an incorrect price due to a typographical or system error",
          ]}
        />
      </LegalSection>

      <LegalSection number={4} title="Orders and Payment">
        <LegalText>When you place an order on Purity Peptides:</LegalText>
        <LegalList
          items={[
            "A minimum order value of $100 applies before checkout can be completed",
            "Orders of $1,000 or more automatically receive a bulk discount, shown in your cart before you check out",
            "Payment is confirmed manually using the method you select at checkout; your order is held as pending until payment is verified by our team",
            "We reserve the right to cancel orders that cannot be fulfilled due to stock availability or unverifiable payment",
            "PayPal payments must be sent via Friends and Family only; this protects both the buyer and Purity Peptides",
          ]}
        />
      </LegalSection>

      <LegalSection number={5} title="Shipping and Delivery">
        <LegalText>
          We ship to the countries listed at checkout. Estimated delivery times are provided on our Shipping
          Policy page but are not guaranteed. Delays may occur due to customs clearance, carrier issues, or events
          outside our control. Purity Peptides is not liable for delays caused by third-party carriers.
        </LegalText>
      </LegalSection>

      <LegalSection number={6} title="Research-Use Products">
        <LegalText>
          Products labeled research use only (RUO) are sold strictly for laboratory and educational research. They
          are not drugs, dietary supplements, or foods, and are not intended for human or veterinary consumption,
          diagnosis, treatment, cure, or prevention of any disease. Full detail is provided in our Medical &amp;
          Research-Use Disclaimer, which forms part of these Terms.
        </LegalText>
      </LegalSection>

      <LegalSection number={7} title="Quality Assurance and Certificates of Analysis">
        <LegalText>
          Where a product page indicates a Certificate of Analysis (CoA) is available, we source that product from
          a supplier who provides batch-specific purity and identity documentation. If an item you receive does not
          match its listed specifications or CoA, contact us within 7 days of delivery with your order number and
          we will investigate, and replace or refund the affected item once confirmed.
        </LegalText>
      </LegalSection>

      <LegalSection number={8} title="Limitation of Liability">
        <LegalText>
          To the maximum extent permitted by law, Purity Peptides is not liable for any indirect, incidental,
          special, or consequential damages arising from the use of our website or products, including any use of
          research-use products outside their stated intended purpose. Our total liability for any claim will not
          exceed the amount paid for the product in question.
        </LegalText>
      </LegalSection>

      <LegalSection number={9} title="Intellectual Property">
        <LegalText>
          All content on this site, including text, graphics, logos, product descriptions, and educational
          material, is the property of Purity Peptides or its licensors and may not be reproduced or distributed
          without written permission.
        </LegalText>
      </LegalSection>

      <LegalSection number={10} title="Governing Law">
        <LegalText>
          These Terms are governed by the laws of [State/Country of incorporation], without regard to conflict of
          law principles. Disputes arising from these Terms will first be addressed through good-faith negotiation.
        </LegalText>
      </LegalSection>

      <LegalSection number={11} title="Changes to These Terms">
        <LegalText>
          We may update these Terms at any time. Changes are posted on this page with an updated date. Continued
          use of our website after changes are posted constitutes acceptance of the updated Terms.
        </LegalText>
      </LegalSection>

      <LegalSection number={12} title="Contact Us">
        <LegalContactBox>
          <p className="text-sm font-semibold text-ink">Purity Peptides</p>
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