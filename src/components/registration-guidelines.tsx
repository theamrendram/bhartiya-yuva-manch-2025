import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Users, Hotel, Phone, UserCog, Mail } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import React from "react";

interface Contact {
  name: string;
  phone?: string;
  role?: string;
}

interface ContactGroup {
  title: string;
  icon: React.ReactNode;
  contacts: Contact[];
}

const contactGroups: ContactGroup[] = [
  {
    title: "Mentors",
    icon: <UserCog className="h-5 w-5" />,
    contacts: [
      {
        name: " Ms. Diksha Jain",
        role: "Assistant Professor, Indraprastha College for Women, University of Delhi",
      },

      {
        name: "Ajay Ramani",
        role: "Software Engineer, Lyxel & Flamingo",
      },

      {
        name: "Ms. Saumya Aggarwal",
        role: "Associate Data Analyst, Professor, Aiprus Software Pvt. Lmt.",
      },
    ],
  },
  {
    title: "IEEE BVICAM Student Representatives ",
    icon: <Mail className="h-5 w-5" />,
    contacts: [
      {
        name: "Nidhi Gupta",
        phone: "+91-9211506201",
        role: " IEEE BVICAM SB Chair",
      },
      {
        name: "Rohit Rawat",
        phone: "+91-9897683764",
        role: "IEEE BVICAM CS Chapter Chair",
      },
    ],
  },
  {
    title: "Student Coordinators",
    icon: <Users className="h-5 w-5" />,
    contacts: [
      {
        name: "Mahak Bansal",
        phone: "+91-8368403246",
        role: "Student Coordinator",
      },
      {
        name: "Ananya Jain",
        phone: "+91-8586078543",
        role: "Student Coordinator",
      },
      {
        name: "Kumar Amrendram",
        phone: "+91-9625854106",
        role: "Student Coordinator",
      },
    ],
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};
export default function RegistrationGuidelines() {
  return (
    <section
      className="container mx-auto px-4 py-8 md:px-6 lg:px-8"
      id="guidelines"
    >
      <h1 className="text-primary my-4 text-center text-4xl font-bold">
        Registration Guidelines
      </h1>

      <div className="grid gap-6 text-lg md:grid-cols-2">
        {/* Registration Rules */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Users className="h-5 w-5" />
              Registration Rules
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <ul className="text-muted-foreground list-inside list-disc space-y-2">
              <li>Registration Per Person only</li>
              <li>Registration is non-transferable and non-refundable</li>
            </ul>
          </CardContent>
        </Card>

        {/* Event Registration */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <CalendarDays className="h-5 w-5" />
              Event Registration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <ul className="text-muted-foreground list-inside list-disc space-y-2">
              <li className="text-red-500">
               Last Date of Registration: 16th July 2025
               <span className="text-red-500 font-bold px-4">*Registrations closed*</span>
              </li>
              <li>
                Workshop seats will be allocated on a first-come, first-served
                basis , Maximum participants: 30
              </li>
              <li>
                Certificate will be provided to all the summer school attendees
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Accommodation Details
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Hotel className="h-5 w-5" />
              Accommodation Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Accommodation is available on a shared basis</li>
              <li>Check-in date: 8 February 2025</li>
              <li>Check-out date: 9 February 2025</li>
              <li>
                Additional accommodation days can be requested in advance at an
                extra cost of ₹1250 per day
              </li>
              <li>
                Food and refreshments are included in ticket price and for all
                participants
              </li>
            </ul>
          </CardContent>
        </Card> */}
      </div>

      {/* Registration Fees */}
      <Card className="mt-6 text-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            Registration Fees
          </CardTitle>
          <CardDescription className="text-lg"></CardDescription>
        </CardHeader>
        <CardContent>
          <Table className="mt-4 md:text-md">
          <TableHeader>
              <TableRow>
                <TableHead>Membership Type</TableHead>
                <TableHead>Registration Fees{' '} 
                    {/* <span style = {{color: 'red'}}>
                        *exclusive of Accommodation
                    </span>
                     */}
                    </TableHead> 
           {/* <TableHead>
                 With Accommodation{' '}
              
              <span style={{ color: 'red' }}>*Including Congress Registration Fees</span>
                </TableHead>  */}
           </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>IEEE Member / IEEE CS Member</TableCell>
                <TableCell>₹1700</TableCell> 
           </TableRow>

          
              {/* <TableRow>
                <TableCell>IEEE CS Member</TableCell>
                <TableCell>₹1700</TableCell> 
          </TableRow> */}
            </TableBody>
          </Table>

          <p  className="mt-4 text-base text-red-500">
            <strong>Accommodation:</strong><br/>
          All the out-stationed participants shall be provided dormitory accommodation, on shared bases, absolutely free, inside the Campus, during the entire duration of the Summer School.
          However, participants, who want Hotel Accommodation, may directly book the Hotel on payment basis, details of which is given here under:-
          </p>
        </CardContent>
      </Card>

      {/* Nearby Accommodations */}
      <Card className="mt-6 text-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            Nearby Accommodations
          </CardTitle>
          {/* <CardDescription className="text-sm text-red-500">
            The participants will be responsible for bearing the cost of their
            accommodation.*
          </CardDescription> */}
        </CardHeader>
        <CardContent>
          <Table className="md:text-md mt-4">
            <TableHeader>
              <TableRow>
                <TableHead>Hotel Name</TableHead>
                <TableHead>Distance from Venue</TableHead>
                <TableHead>Room Charges (per night) *without taxes</TableHead>
                <TableHead>Contact</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Hotel Swathi</TableCell>
                <TableCell>300 m from BVICAM</TableCell>
                <TableCell>Standard Room: Without Breakfast: Rs. 1800</TableCell>
                <TableCell>
                  {" "}
                  <p className="mt-2 text-sm text-neutral-400">
                    Avneesh:{" "}
                    <a
                      href="tel:+919560217756"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      +919560217756
                    </a>
                  </p>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Hotel Golden Saffron By Qotel</TableCell>
                <TableCell>1.8 km from BVICAM</TableCell>
                <TableCell>Standard Room: Without Breakfast: Rs 3000</TableCell>
                <TableCell>
                  {" "}
                  <p className="mt-2 text-sm text-neutral-400">
                    Priya:{" "}
                    <a
                      href="tel:+919311414031"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      +919311414031
                    </a>
                  </p>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Swift Inn</TableCell>
                <TableCell>3.8 km from BVICAM</TableCell>
                <TableCell>
                  {" "}
                  Standard Room: With Breakfast: Rs. 2500
                  <br />
                  Standard Room: Without Breakfast: Rs. 2000
                </TableCell>
                <TableCell>
                  {" "}
                  <p className="mt-2 text-sm text-neutral-400">
                    Vijay:{" "}
                    <a
                      href="tel:+919810158766"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      +919810158766
                    </a>
                  </p>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>

          {/* <div className="bg-Red-100 mt-4 rounded-lg p-4">
            <p className="text-lg text-red-700">
              <span className="text-lg font-bold">Note: </span> In the event of
              an extreme emergency, you may contact us for last minute
              arrangements for accommodations.
            </p>
            <p className="mt-2 text-sm text-neutral-400">
              Mukul Bhardwaj:{" "}
              <a
                href="tel:+9195361728127"
                className="text-blue-600 hover:text-blue-800"
              >
                +9195361728127
              </a>
            </p>
          </div> */}
        </CardContent>
      </Card>

      {/* Contact Information */}
      <div className="space-y-6 py-12" id = "contact">
        {contactGroups.map((group, idx) => (
          <div key={group.title}>
            <div className="mb-6 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500">
                {group.icon}
              </div>
              <h2 className="text-2xl font-semibold">{group.title}</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {group.contacts.map((contact) => (
                <Card
                  key={contact.name}
                  className="group border-0 bg-white/5 transition-all hover:bg-white/10"
                >
                  <CardContent className="p-3">
                    <div className="space-y-1">
                      <div>
                        <h3 className="text-lg font-medium">{contact.name}</h3>
                        <p className="text-sm text-gray-400">{contact.role}</p>
                      </div>
                      {contact.phone && (
                        <a
                          href={`tel:${contact.phone}`}
                          className="inline-flex items-center gap-2 text-sm text-blue-400 transition-colors hover:text-blue-300"
                        >
                          <Phone className="h-4 w-4" />
                          {contact.phone}
                        </a>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
