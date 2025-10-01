"use client";

import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BackgroundLines } from "./ui/background-lines";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqData = [
  {
    id: "1",
    question: "What is the Region 10 CS Summer School 2025 about?",
    answer:
      'The Summer School focuses on "Data Science for Decision-Making: Methodologies and Applications". It offers a deep dive into modern data science tools and techniques, emphasizing how they support effective decision-making across domains.',
  },
  {
    id: "2",
    question: "Who can attend this summer school?",
    answer:
      "Registered Fulltime Students and preference will be given to 3rd year and final year students. IEEE and IEEE Computer Society members",
  },
  {
    id: "3",
    question: "What topics will be covered during the five-day program?",
    answer: [
      "Introduction to Data Science for Decision-Making",
      "Machine Learning for Predictive Analytics",
      "Data Visualization for Storytelling",
      "Time Series Analysis and Forecasting",
      "Deep Learning for Classification and Regression",
      "Natural Language Processing for Text Analysis",
    ],
  },
  {
    id: "4",
    question: "Will I receive a certificate after completion?",
    answer:
      "Yes, all participants who attend the full program and complete required activities will receive an IEEE Summer School Participation Certificate.",
  },
  {
    id: "5",
    question: "How can I register for the program?",
    answer:
      "Registration details, including the form and fee structure, will be available on the official IEEE BVICAM Summer School 2025 website.",
  },
  {
    id: "6",
    question: "Will I need to bring my own laptop?",
    answer:
      "Yes, for hands-on sessions, it's highly recommended that participants bring their personal laptops with required software pre-installed (details will be shared post-registration).",
  },
];

export default function FAQ() {
  return (
    <section className="relative bg-background w-full py-12 md:py-24 lg:py-10 overflow-hidden" id="faq">
      <BackgroundLines className="absolute inset-0 z-0">
        <></>
      </BackgroundLines>

      <div className="relative z-10 container mx-auto px-4 md:px-6">
        <div className="grid items-start gap-12 lg:grid-cols-2">

          <div className="space-y-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500">
              <div className="h-8 w-8 rounded-lg bg-white opacity-90"></div>
            </div>
            <div className="space-y-4">
              <h2 className="text-foreground text-3xl font-bold tracking-tight md:text-4xl">
                Frequently asked questions
              </h2>
              <Button
                variant="ghost"
                className="text-muted-foreground hover:text-foreground h-auto p-0 font-normal"
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                Still need help? Contact us: summer-school@bvicam.in
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <Accordion
              type="single"
              collapsible
              defaultValue="1"
              className="space-y-4"
            >
              {faqData.map((faq) => (
                <AccordionItem
                  key={faq.id}
                  value={faq.id}
                  className="border-border bg-card rounded-lg border px-6 py-2"
                >
                  <AccordionTrigger className="text-foreground py-4 text-left font-medium hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pt-0 pb-4">
                    {Array.isArray(faq.answer) ? (
                      <ul className="list-inside list-disc space-y-1">
                        {faq.answer.map((point, index) => (
                          <li key={index}>{point}</li>
                        ))}
                      </ul>
                    ) : (
                      <p>{faq.answer}</p>
                    )}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
}
