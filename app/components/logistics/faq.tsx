"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import Reveal from "../motion/reveal";
import { FAQS } from "@/lib/faqs";

export default function Faq() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id="pricing" className="px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <Reveal className="grid gap-6 md:grid-cols-2 md:gap-16">
          <h2 className="text-3xl font-medium leading-tight tracking-tight text-neutral-900 sm:text-4xl">
            Get All the Details About Our Freight Solutions
          </h2>
          <p className="text-sm leading-relaxed text-neutral-500">
            Find answers to the most common questions about our freight
            services and how Sandygrabs can support your logistics needs.
          </p>
        </Reveal>

        <Reveal
          stagger
          className="mt-12 divide-y divide-neutral-200 border-t border-neutral-200"
        >
          {FAQS.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div key={faq.question}>
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? -1 : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 py-6 text-left"
                >
                  <span className="text-base font-medium text-neutral-900">
                    {faq.question}
                  </span>
                  <Plus
                    size={20}
                    className={`shrink-0 text-neutral-500 transition-transform duration-200 ${
                      isOpen ? "rotate-45" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <p className="max-w-2xl pb-6 text-sm leading-relaxed text-neutral-500">
                    {faq.answer}
                  </p>
                )}
              </div>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}
