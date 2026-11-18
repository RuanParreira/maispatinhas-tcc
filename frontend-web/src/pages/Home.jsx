import { useEffect, useState } from "react";
import { homeIntents } from "@/lib/homeIntents";
import { fetchMunicipalities } from "@/lib/municipalities";
import HomeHeader from "@/components/home/HomeHeader";
import Hero from "@/components/home/Hero";
import HomeSearch from "@/components/home/HomeSearch";
import FeaturedPets from "@/components/home/FeaturedPets";
import HowItWorks from "@/components/home/HowItWorks";
import LostFound from "@/components/home/LostFound";
import FinalCta from "@/components/home/FinalCta";
import HomeFooter from "@/components/home/HomeFooter";

export default function Home() {
  const [intent, setIntent] = useState(homeIntents[0]);
  const [city, setCity] = useState("");
  const [municipalities, setMunicipalities] = useState(null);

  useEffect(() => {
    fetchMunicipalities()
      .then(setMunicipalities)
      .catch(() => setMunicipalities([]));
  }, []);

  const cityName = municipalities?.find(
    (municipality) => municipality.ibge_code === city,
  )?.name;

  return (
    <div className="min-h-svh bg-background">
      <HomeHeader />
      <main>
        <Hero />
        <HomeSearch
          intent={intent}
          onIntentChange={setIntent}
          city={city}
          onCityChange={setCity}
          municipalities={municipalities}
        />
        <FeaturedPets intent={intent} city={city} cityName={cityName} />
        <HowItWorks />
        <LostFound />
        <FinalCta />
      </main>
      <HomeFooter />
    </div>
  );
}
