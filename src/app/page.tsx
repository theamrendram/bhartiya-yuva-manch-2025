import HeroSection from "@/components/hero";
import RegistrationGuidelines from "@/components/registration-guidelines";
import { About } from "@/components/about";
import { Schedule } from "@/components/schedule";
import Speakers from "@/components/Speakers";
import VenuePage from "@/components/Venue";
import FAQ from "@/components/faq";
import GallerySection from "@/components/gallery";
import Footer from "@/components/footer";
import Prizes from "@/components/prizes";

export default function HomePage() {
  return (
    <>
      <HeroSection/>
      <Prizes/>
      <About />
      <GallerySection />
      <Speakers/>
      <RegistrationGuidelines/>
      <Schedule/>
      <FAQ/>
      <VenuePage/>
      <Footer/>
    </>
  );
}
