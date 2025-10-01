"use client";
import Image from "next/image";
import { motion } from "motion/react";
import { useState } from "react";

interface GalleryItem {
  id: number;
  src: string;
  alt: string;
  size: "small" | "medium" | "large";
}

const galleryItems: GalleryItem[] = [
  {
    id: 1,
    src: "/gallery/sb.jpeg",
    alt: "Gallery-1",
    size: "large",
  },
  {
    id: 2,
    src: "/gallery/atal-fdp-2.jpeg",
    alt: "Gallery-2",
    size: "medium",
  },
  {
    id: 3,
    src: "/gallery/DSC09925.jpg",
    alt: "Gallery-3",
    size: "small",
  },
  {
    id: 4,
    src: "/gallery/hi.jpeg",
    alt: "Atal FDP",
    size: "medium",
  },
  {
    id: 5,
    src: "/gallery/audi.jpeg",
    alt: "Session",
    size: "large",
  },
  {
    id: 6,
    src: "/gallery/p3.jpeg",
    alt: "Atal FDP 2",
    size: "small",
  },
  {
    id: 7,
    src: "/gallery/p2.jpeg",
    alt: "Session 1",
    size: "small",
  },
  {
    id: 8,
    src: "/gallery/ieee.jpeg",
    alt: "Delphi",
    size: "small",
  },
];

export default function GallerySection() {
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  const getSizeClasses = (size: string) => {
    switch (size) {
      case "small":
        return "col-span-1 row-span-1";
      case "medium":
        return "col-span-1 row-span-2";
      case "large":
        return "col-span-2 row-span-2";
      default:
        return "col-span-1 row-span-1";
    }
  };

  return (
    <section id="gallery" className="py-16 md:py-24 bg-neutral-900 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[60vh] bg-gradient-to-tr from-purple-700/20 via-blue-500/15 to-pink-400/20 blur-3xl opacity-60 animate-pulse-slow" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            Our Team Gallery
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Meet the brilliant minds behind the IEEE Computer Society Summer School 2025
          </p>
        </motion.div>

        {/* Bento Grid Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[200px]">
          {galleryItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ 
                duration: 0.5, 
                delay: index * 0.1,
                ease: "easeOut"
              }}
              viewport={{ once: true }}
              whileHover={{ 
                scale: 1.02,
                transition: { duration: 0.2 }
              }}
              className={`group relative overflow-hidden rounded-2xl bg-black/20 backdrop-blur-sm border border-white/10 cursor-pointer ${getSizeClasses(item.size)}`}
              onClick={() => setSelectedItem(item)}
            >
              {/* Image */}
              <div className="relative w-full h-full">
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                
                {/* Simple overlay with content at bottom */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

              </div>
            </motion.div>
          ))}
        </div>

        {/* Modal for selected item */}
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedItem(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative max-w-2xl w-full bg-neutral-900 rounded-2xl overflow-hidden border border-white/20"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative h-80 md:h-96">
                <Image
                  src={selectedItem.src}
                  alt={selectedItem.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <motion.button
                  onClick={() => setSelectedItem(null)}
                  className="absolute top-4 right-4 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </section>
  );
} 