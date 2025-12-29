import FeatureTreeTimeline from "../components/FeatureTreeTimeLine";
import Hero from "../components/Hero";
import Stats from "../components/Stats";
import TopFundsByCategory from "../components/TopFundsByCategory";
//import TopFundsByCategory from "../components/TopFundsByCategory";

export default function Home() {
  return (
    <div className="mb-2 md:mb-2 md:py-2">
      <Hero />
      <Stats />
      <TopFundsByCategory />
      <FeatureTreeTimeline />
    </div>
  );
}
