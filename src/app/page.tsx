import HeroSection from "@/components/hero";
import RegistrationGuidelines from "@/components/registration-guidelines";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";
import { About } from "@/components/about";
import { Schedule } from "@/components/schedule";
import Speakers from "@/components/Speakers";
import VenuePage from "@/components/Venue";
import FAQ from "@/components/faq";
import GallerySection from "@/components/gallery";
import Footer from "@/components/footer";
import Prizes from "@/components/prizes";
import TeamCarousel from "@/components/TeamCarousel";

export default function HomePage() {
  return (
    <>
      <BackgroundBeamsWithCollision>
        <HeroSection />
      </BackgroundBeamsWithCollision>
      {/* <Prizes/> */}
      <About />
      {/* <Speakers/> */}
      <TeamCarousel />
      {/* <RegistrationGuidelines/> */}
      <GallerySection />
      {/* <Schedule/> */}
      <FAQ />
      <VenuePage />
      <Footer />
    </>
  );
}
