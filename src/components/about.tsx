'use client';
import React from "react";
import { FaUsers, FaGraduationCap } from "react-icons/fa";
import { Container } from "./container";
import { motion } from "motion/react";
import { easeOut } from "framer-motion";

const cardTransition = { duration: 0.7, ease: easeOut };

const About = () => {
  return (
    <section
      id="about"
      className="relative py-16 bg-white dark:bg-gray-950 transition-colors duration-300"
    >
      {/* Purple Gradient Element */}
      <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[80vw] h-[50vh] bg-gradient-to-br from-purple-300 via-purple-200 to-transparent opacity-30 blur-3xl pointer-events-none z-0" />

      <h2 className="relative z-10 text-4xl md:text-5xl font-extrabold mb-10 text-center text-gray-900 dark:text-white tracking-tight">
        About
      </h2>

      <Container>
        <div className="relative z-10 flex flex-col gap-8 md:gap-12 items-stretch text-left">
          <motion.article
            className="bg-gray-100 dark:bg-gray-800 rounded-xl shadow-md p-6 sm:p-8 transition-transform hover:scale-[1.02] focus-within:ring-2 focus-within:ring-pink-400 outline-none"
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ ...cardTransition, delay: 0.15 }}
            tabIndex={0}
            aria-label="About the Summer School Card"
          >
            <p className="text-sm sm:text-base text-gray-800 dark:text-gray-300 leading-relaxed">
              The 2025 Bhartiya Yuva Manch on
              &ldquo;Bhartiya Yuva Manch 2025&rdquo; is a prestigious five-day program hosted by
              Applications&rdquo; is a prestigious five-day program hosted by
              Bharati Vidyapeeth&rsquo;s Institute of Computer Applications and
              Management (BVICAM), New Delhi.
              <br />
              <br />
              This Bhartiya Yuva Manch is designed to immerse participants in the core
              concepts, advanced methodologies, and latest research trends in
              Data Science, with a special focus on its applications in
              effective decision-making. The program features a balanced blend
              of expert lectures&mdash;including sessions by Distinguished
              Visiting Professors (DVPs)&mdash;interactive discussions, hands-on
              exercises, and collaborative group activities.
              <br />
              <br />
              Participants will explore a diverse range of topics, such as
              Introduction to Data Science for Decision-Making, Machine Learning
              for Predictive Analytics, Data Visualization for Storytelling,
              Time Series Analysis and Forecasting, Deep Learning for
              Classification and Regression, and Natural Language Processing for
              Text Analysis. The summer school aims to create a vibrant and
              collaborative environment where students, researchers, and
              industry professionals can deepen their understanding, share
              innovative ideas, and build professional networks that foster
              ongoing research and development in the dynamic field of data
              science.
            </p>
          </motion.article>
        </div>
      </Container>
    </section>
  );
};

export { About };
