// components/TeamCard.tsx
import Image from "next/image";
import { memo } from "react";
import { TeamMember } from "@/types/TeamMember";

type TeamCardProps = Pick<TeamMember, "image" | "name" | "designation">;

function TeamCard({ image, name, designation }: TeamCardProps) {
  return (
    <div className="text-cente my-5 flex h-full flex-col items-center rounded-xl bg-white p-8 shadow-lg transition-all duration-300 ease-in-out hover:scale-105 dark:border dark:border-gray-700 dark:bg-gray-800">
      <div className="relative mb-4 h-32 w-32">
        <Image
          src={image}
          alt={`Profile picture of ${name}`}
          fill
          className="rounded-full border-4 border-gray-200 object-cover dark:border-gray-600" // Changed: Image border
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
        {name}
      </h3>{" "}
      {/* Changed: Name text */}
      <p className="mt-1 text-gray-500 dark:text-gray-400">
        {designation}
      </p>{" "}
      {/* Changed: Designation text */}
    </div>
  );
}

export default memo(TeamCard);
