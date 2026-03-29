import HeroSection from "@/components/sections/OurWork/HeroSection";
import MainContentSection from "@/components/sections/OurWork/MainContentSection";
import OptionalSection from "@/components/sections/OurWork/OptionalSection";
import OptionalMediaSection from "@/components/sections/OurWork/OptionalMediaSection";

export default function OurWorkPage() {
  return (
    <>
      <HeroSection />
      <div className="container">
        <MainContentSection />
        <OptionalSection />
        <OptionalMediaSection />
      </div>
    </>
  );
}
