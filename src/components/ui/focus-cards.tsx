"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";

type Card = {
  title: string;
  src: string;
  designation?: string;
};

export const Card = React.memo(
  ({
    card,
    index,
    hovered,
    setHovered,
  }: {
    card: Card;
    index: number;
    hovered: number | null;
    setHovered: React.Dispatch<React.SetStateAction<number | null>>;
  }) => (
    <div
      onMouseEnter={() => setHovered(index)}
      onMouseLeave={() => setHovered(null)}
      className={cn(
        "rounded-xl overflow-hidden transition-all duration-300 ease-out shadow-md flex flex-col bg-white/80 dark:bg-white/10 dark:bg-opacity-60 p-2",
        hovered !== null && hovered !== index && "scale-[0.98] opacity-80"
      )}
    >
      {/* Image Section */}
      <div className="relative w-full aspect-square">
        <img
          src={card.src}
          alt={card.title}
          className="object-cover absolute inset-0 w-full h-full rounded-t-xl"
        />
      </div>

      {/* Text Section */}
      <div className="w-full px-4 py-3 bg-[#ddf9f9] rounded-b-xl border-t border-gray-200">
        <div className="text-md md:text-lg font-semibold text-black">
          {card.title}
        </div>
        {card.designation && (
          <div className="text-sm md:text-base text-gray-600">
            {card.designation}
          </div>
        )}
      </div>
    </div>
  )
);

Card.displayName = "Card";

export function FocusCards({ cards }: { cards: Card[] }) {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl mx-auto md:px-8 w-full">
      {cards.map((card, index) => (
        <Card
          key={card.title}
          card={card}
          index={index}
          hovered={hovered}
          setHovered={setHovered}
        />
      ))}
    </div>
  );
}
