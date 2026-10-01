import HomeHeader from "@/components/home/HomeHeader";
import Hero from "@/components/home/Hero";
import HomeSearch from "@/components/home/HomeSearch";
import FeaturedPets from "@/components/home/FeaturedPets";
import HowItWorks from "@/components/home/HowItWorks";
import LostFound from "@/components/home/LostFound";
import FinalCta from "@/components/home/FinalCta";
import HomeFooter from "@/components/home/HomeFooter";

export default function Home() {
  return (
    <div className="min-h-svh bg-background">
      <HomeHeader />
      <main>
        <Hero />
        <HomeSearch />
        <FeaturedPets />
        <HowItWorks />
        <LostFound />
        <FinalCta />
      </main>
      <HomeFooter />
    </div>
  );
}
