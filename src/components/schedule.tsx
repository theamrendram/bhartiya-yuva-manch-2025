import React from "react";
import { BackgroundBeams } from "./ui/background-beams";

const scheduleData = [
  [
    { 
      time: "10:00 am - 11:00 am", 
      sessions: [
        { name: "Inauguration", speaker: "", designation: "" },
        { name: "Session 3: Data Science, Engineering, Management, and Governance: Emerging Professions Driving National Growth through Innovative Analytics Applications in India", speaker: "Prof. Dr. K. Subramanian", designation: "Chair, IEEE CS DS Chapter | IEEE DVP Speaker" },
        { name: "From Perceptrons to Transformers: A Deep Dive into Predictive Modeling", speaker: "Dr. Sivakumar Perumal", designation: "Professor at Sasi Institute of Technology & Engineering" },
         { name: "Session 1: Advanced Data Collection and Analytics for Smart Agriculture, Aquaculture, and Environmental Systems", speaker: "Mohamed. Rawidean Mohd. Kassim", designation: "Regional Coordinator, Region R10 IEEE | IEEE DVP Speaker" },
        { name: "Project Presentations", speaker: "", designation: "" }
      ] 
    },
    { 
      time: "11:00 am - 11:15 am", 
      sessions: [
        { name: "Tea and Networking", speaker: "", designation: "" },
        { name: "Tea and Networking", speaker: "", designation: "" },
        { name: "Tea and Networking", speaker: "", designation: "" },
        { name: "Tea and Networking", speaker: "", designation: "" },
        { name: "Tea and Networking", speaker: "", designation: "" }
      ] 
    },
    { 
      time: "11:15 am – 1:00 pm", 
      sessions: [
         { name: "Session 6: R for Decision Support Systems: Real-World Case Studies and Methodologies", speaker: "Prof. Amlan Chakrabarti", designation: "Professor, Calcutta University | IEEE DVP Speaker" },
        { name: "Session 4: Introduction to Data Science for Decision-Making", speaker: "Ms. Saumya Aggarwal", designation: "Associate Data Analyst, Aiprus Software Pvt. Lmt. Gurugram" },
        { name: "Session 7: Machine Learning for Predictive Analytics", speaker: "Ms. Diksha Jain", designation: "Assistant Professor, University of Delhi, Delhi" },
        { name: "Session 9: Data Visualization for Storytelling", speaker: "Ms. Diksha Jain", designation: "Assistant Professor, University of Delhi, Delhi" },
        { name: "Project Presentations", speaker: "", designation: "" }
      ] 
    },
    { 
      time: "1:00 pm – 2:00 pm", 
      sessions: [
        { name: "Lunch", speaker: "", designation: "" },
        { name: "Lunch", speaker: "", designation: "" },
        { name: "Lunch", speaker: "", designation: "" },
        { name: "Lunch", speaker: "", designation: "" },
        { name: "Lunch", speaker: "", designation: "" }
      ] 
    },
    { 
      time: "2:00 pm - 4:00 pm", 
      sessions: [
        { name: "Session 2: Natural Language Processing for Text Analysis", speaker: "Mr. Ajay Ramani", designation: "Software Engineer, Lyxel & Flamingo, Gurugram" },
        { name: "Session 5: Hands on training session on Time Series Analysis and Forecasting", speaker: "Ms. Saumya Aggarwal", designation: "Associate Data Analyst, Aiprus Software Pvt. Lmt. Gurugram" },
        { name: "Session 8: Hands on training session on Machine Learning for Predictive Analytics", speaker: "Ms. Diksha Jain", designation: "Assistant Professor, University of Delhi, Delhi" },
        { name: "Session 10: Hands on training session on Data Visualization for Storytelling", speaker: "Ms. Diksha Jain", designation: "Assistant Professor, University of Delhi, Delhi" },
        { name: "Valedictory", speaker: "", designation: "" }
      ] 
    },
    { 
      time: "4:00 pm - 4:15 pm", 
      sessions: [
        { name: "High Tea", speaker: "", designation: "" },
        { name: "High Tea", speaker: "", designation: "" },
        { name: "High Tea", speaker: "", designation: "" },
        { name: "High Tea", speaker: "", designation: "" },
        { name: "High Tea", speaker: "", designation: "" }
      ] 
    },
  ],
];

const days = [
  { day: "Day 1", date: "28th July 2025" },
  { day: "Day 2", date: "29th July 2025" },
  { day: "Day 3", date: "30th July 2025" },
  { day: "Day 4", date: "31st July 2025" },
  { day: "Day 5", date: "1st August 2025" },
];

const Schedule = () => {
  return (
    <section id="schedule" className="relative py-16 bg-gradient-to-br from-blue-50 via-indigo-50 to-white dark:from-neutral-900 dark:via-neutral-950 dark:to-black overflow-hidden">
      <BackgroundBeams className="opacity-30 pointer-events-none" />
      <div className="relative z-10 max-w-7xl mx-auto px-2 sm:px-4">
        <h2 className="text-4xl font-extrabold text-center mb-10 bg-gradient-to-r from-blue-600 via-purple-500 to-pink-400 bg-clip-text text-transparent drop-shadow-lg">
          Programme Schedule
        </h2>
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-0 rounded-xl overflow-hidden shadow-xl bg-white/80 dark:bg-black/40">
            <thead>
              <tr>
                <th className="bg-gradient-to-r from-blue-100 via-indigo-100 to-pink-100 dark:from-blue-900 dark:via-indigo-900 dark:to-pink-900 text-lg font-bold text-indigo-700 dark:text-indigo-200 px-4 py-3 sticky left-0 z-10">Time</th>
                {days.map((d) => (
                  <th key={d.day} className="bg-gradient-to-r from-blue-100 via-indigo-100 to-pink-100 dark:from-blue-900 dark:via-indigo-900 dark:to-pink-900 text-lg font-bold text-indigo-700 dark:text-indigo-200 px-4 py-3 text-center">
                    <div>{d.day}</div>
                    <div className="text-xs text-indigo-400 dark:text-indigo-300 font-medium">{d.date}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {scheduleData[0].map((slot) => (
                <tr key={slot.time} className="border-t border-indigo-100 dark:border-indigo-900">
                  <td className="font-mono text-xs md:text-sm text-gray-600 dark:text-gray-300 px-4 py-3 bg-indigo-50 dark:bg-indigo-950 sticky left-0 z-0">
                    {slot.time}
                  </td>
                  {slot.sessions.map((session, j) => (
                    <td key={session.name + '-' + j} className="px-4 py-3 text-sm text-gray-800 dark:text-gray-100 text-left align-top">
                      <div className="font-semibold text-indigo-700 dark:text-indigo-300">{session.name}</div>
                      {session.speaker && (
                        <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                          <span className="font-medium">{session.speaker}</span>
                        </div>
                      )}
                      {session.designation && (
                        <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                          {session.designation}
                        </div>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Mobile Cards */}
        <div className="flex flex-col gap-8 md:hidden mt-6">
          {days.map((d, dayIdx) => (
            <div key={d.day} className="rounded-xl shadow-xl bg-white/80 dark:bg-black/40 border-2 border-indigo-100 dark:border-indigo-900 backdrop-blur-md">
              <div className="flex flex-col items-center justify-center gap-1 py-4 bg-gradient-to-r from-blue-100 via-indigo-100 to-pink-100 dark:from-blue-900 dark:via-indigo-900 dark:to-pink-900 rounded-t-xl">
                <div className="text-lg font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-400 bg-clip-text text-transparent">{d.day}</div>
                <div className="text-xs text-indigo-400 dark:text-indigo-200 font-medium">{d.date}</div>
              </div>
              <div className="flex flex-col gap-2 p-4">
                {scheduleData[0].map((slot, i) => (
                  <div key={slot.time} className="flex flex-col gap-1 border-b border-indigo-100 dark:border-indigo-900 pb-2 last:border-b-0 last:pb-0">
                    <span className="text-xs font-mono text-gray-500 dark:text-gray-300">{slot.time}</span>
                    <div className="text-sm font-semibold text-gray-800 dark:text-gray-100 text-indigo-700 dark:text-indigo-300">
                      {slot.sessions[dayIdx].name}
                    </div>
                    {slot.sessions[dayIdx].speaker && (
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        <span className="font-medium">{slot.sessions[dayIdx].speaker}</span>
                      </div>
                    )}
                    {slot.sessions[dayIdx].designation && (
                      <div className="text-xs text-gray-500 dark:text-gray-500">
                        {slot.sessions[dayIdx].designation}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <p className="mt-10 text-center text-gray-500 dark:text-gray-400 text-sm">
          *Schedule is subject to change. Please check back for updates.
        </p>
      </div>
    </section>
  );
};

export { Schedule };

// Detailed Session Schedule:
// S. No.
// Proposed Session
// Proposed Speakers
// Topic
// 1.  
// Session 1
// DVP lecture
// Mohamed. Rawidean Mohd. Kassim
// R&D Manager, MIMOS Berhad, Malaysia
 
// 2.  
// Session 2
// Mr. Ajay Ramani
// Software Engineer, Lyxel & Flamingo, Gurugram
// Natural Language Processing for Text Analysis
// 3.  
// Session 3
// DVP lecture
// Prof. Dr. K. Subramanian
// Past Chair, IEEE Delhi Section
 
// 4.  
// Session 4
// Ms. Saumya Aggarwal
// Associate Data Analyst, Professor, Aiprus Software Pvt. Lmt.Gurugram
// Introduction to Data Science for Decision-Making
// 5.  
// Session 5
// Ms. Saumya Aggarwal
// Associate Data Analyst, Professor, Aiprus Software Pvt. Lmt. Gurugram
// Hands on training session on Time Series Analysis and Forecasting
// 6.  
// Session 6
// DVP lecture
// Prof. Amlan Chakrabarti
// A.K Choudhary Schoool of Information and Technology, University of Calcutta, Calcutta
 
// 7.  
// Session 7
// Ms. Diksha Jain
// Assistant Professor, Indraprastha College for Women, University of Delhi, Delhi
// Machine Learning for Predictive Analytics
 
// 8.  
// Session 8
// Ms. Diksha Jain
// Assistant Professor, Indraprastha College for Women, University of Delhi, Delhi
// Hands on training session on Machine Learning for Predictive Analytics
// 9.  
// Session 9
// Ms. Diksha Jain
// Assistant Professor, Indraprastha College for Women, University of Delhi, Delhi
// Data Visualization for Storytelling
// 10.  
// Session 10
// Ms. Diksha Jain
// Assistant Professor, Indraprastha College for Women, University of Delhi, Delhi
// Hands on training session on Data Visualization for Storytelling
