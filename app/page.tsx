import Hero from "@/components/Hero";
import TrustBar from "@/components/TrustBar";
import CategoryGrid from "@/components/CategoryGrid";
import ProductGrid from "@/components/ProductGrid";
import StatsSection from "@/components/StatsSection";
import ProcessSection from "@/components/ProcessSection";

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustBar />
      <CategoryGrid />
      <ProductGrid />
      <StatsSection />
      <ProcessSection />
    </>
  );
}