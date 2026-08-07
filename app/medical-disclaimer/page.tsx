import { LegalPage, LegalSection, LegalText, LegalList, LegalContactBox } from "@/components/LegalPage";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Medical & Research-Use Disclaimer",
  description: "The intended use of research peptides and cosmetic products sold by Purity Peptides.",
  path: "/medical-disclaimer",
});

export default function MedicalDisclaimerPage() {
  return (
    <LegalPage
      title="Medical &amp; Research-Use"
      accent="Disclaimer"
      updated="[Month] [Day], 2026"
      crossLinks={[
        { label: "Terms of Service", href: "/terms" },
        { label: "Return Policy", href: "/return-policy" },
      ]}
    >
      <LegalText>
        This page describes the intended use of products sold on puritypeptides.com and important limitations you
        should understand before purchasing. It forms part of our Terms of Service.
      </LegalText>

      <LegalSection number={1} title="Research Use Only">
        <LegalText>
          Products labeled &quot;research use only&quot; (RUO) on this site are sold exclusively for laboratory,
          educational, and research purposes. They are not drugs, dietary supplements, or foods under applicable
          law, and are not intended for human or veterinary consumption, injection, diagnosis, treatment, cure, or
          prevention of any disease or condition.
        </LegalText>
      </LegalSection>

      <LegalSection number={2} title="Not Medical Advice">
        <LegalText>
          Educational content on this site, including our Learn section, blog, and product pages, is provided for
          general informational purposes only. It is not medical advice and should not replace consultation with a
          licensed physician or other qualified healthcare provider. Always seek professional advice before making
          decisions related to your health.
        </LegalText>
      </LegalSection>

      <LegalSection number={3} title="Regulatory Status">
        <LegalText>
          Statements made on this website have not been evaluated by the U.S. Food and Drug Administration or any
          other regulatory authority. Many peptides discussed on this site are not approved for human therapeutic
          use in most jurisdictions, and legal status can vary by country and by specific compound.
        </LegalText>
      </LegalSection>

      <LegalSection number={4} title="Cosmetic Products">
        <LegalText>
          Products in our Skincare category are formulated and sold as cosmetics for topical use and are not
          subject to the research-use restrictions above. They are not intended to diagnose, treat, cure, or
          prevent any disease.
        </LegalText>
      </LegalSection>

      <LegalSection number={5} title="Buyer Responsibility and Eligibility">
        <LegalText>By purchasing from Purity Peptides, you confirm that:</LegalText>
        <LegalList
          items={[
            "You are at least 18 years old",
            "You understand the research-use intent of the products described above",
            "You are legally permitted to purchase and possess these products in your jurisdiction",
            "You will not use them for any purpose other than laboratory or educational research, unless a specific product is explicitly labeled otherwise",
          ]}
        />
      </LegalSection>

      <LegalSection number={6} title="Contact Us">
        <LegalText>Questions about the intended use of a specific product can be sent to:</LegalText>
        <LegalContactBox>
          <p className="text-sm font-semibold text-ink">Purity Peptides Support</p>
          <p className="text-sm text-gray-600">Email: [support@puritypeptides.com]</p>
        </LegalContactBox>
      </LegalSection>
    </LegalPage>
  );
}