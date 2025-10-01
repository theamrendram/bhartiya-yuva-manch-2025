import { MapPinIcon, PhoneIcon, ClockIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function VenuePage() {
  return (
    <section className="px-4 md:px-16 py-20 transition-colors duration-300" id="venue">
      <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
        Venue
      </h2>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Info Card */}
        <div className="rounded-2xl border shadow-md p-6 backdrop-blur-lg bg-white/80 dark:bg-white/10 text-black dark:text-white border-gray-200 dark:border-white/20">
          <h3 className="text-2xl font-semibold mb-4">BVICAM, Delhi</h3>
          <div className="space-y-4 text-sm">
            <p className="flex items-center">
              <MapPinIcon className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
              A-4 Block, Paschim Vihar, New Delhi, Delhi 110063
            </p>
            <p className="flex items-center">
              <PhoneIcon className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
              +91 11-2525-0000
            </p>
            <div>
              <h4 className="font-semibold mb-2 flex items-center text-black dark:text-white">
                <ClockIcon className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
                Transportation:
              </h4>
              <ul className="list-disc list-inside ml-6 space-y-1 text-gray-700 dark:text-zinc-300">
                <li>2 minutes from Paschim Vihar Metro Station</li>
                <li>30 minutes from New Delhi Railway Station</li>
                <li>45 minutes from IGI Airport</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Map Card */}
        <div className="rounded-2xl overflow-hidden shadow-md border border-gray-200 dark:border-white/20 backdrop-blur-lg">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3500.472684945167!2d77.11066807588715!3d28.675503682127356!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d038b9232e7cd%3A0x34ebc68df4428491!2sBharati%20Vidyapeeth&#39;s%20Institute%20of%20Computer%20Applications%20and%20Management%20(BVICAM)!5e0!3m2!1sen!2sin!4v1736261991558!5m2!1sen!2sin"
            width="100%"
            height="300"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>

      {/* CTA */}
      <div className="mt-12 text-center">
        <Button
          size="lg"
          className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 text-white font-semibold hover:brightness-110 transition">
          <Link href="https://maps.app.goo.gl/Y54oYnkPHmuttKKX9" target="_blank">
            Get Directions
          </Link>
        </Button>
      </div>
    </section>
  );
}
