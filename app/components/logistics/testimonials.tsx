"use client";

import Image from "next/image";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Quote } from "lucide-react";

const TESTIMONIALS = [
  {
    quote:
      "As a business owner, reliability is everything. Sandygrabs has been our trusted logistics partner for years, making sure our shipments arrive on time and in perfect condition. Their attention to detail truly sets them apart.",
    name: "Amara Johnson",
    role: "CEO, TechGear Solutions",
    avatar:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&q=80&auto=format&fit=crop&crop=faces",
  },
  {
    quote:
      "We switched to Sandygrabs for our cross-border shipments and never looked back. Clear communication, fair pricing, and shipments that consistently arrive when promised.",
    name: "Daniel Okafor",
    role: "Operations Lead, Northline Retail",
    avatar:
      "https://images.unsplash.com/photo-1614786269829-d24616faf56d?w=200&q=80&auto=format&fit=crop&crop=faces",
  },
  {
    quote:
      "Their warehousing and customs clearance team took a huge operational burden off our plate. Sandygrabs feels like an extension of our own supply chain team.",
    name: "Priya Natarajan",
    role: "Founder, Loop Home Goods",
    avatar:
      "https://images.unsplash.com/photo-1611432579402-7037e3e2c1e4?w=200&q=80&auto=format&fit=crop&crop=faces",
  },
];

export default function Testimonials() {
  const [index, setIndex] = useState(0);
  const testimonial = TESTIMONIALS[index];

  const goPrev = () =>
    setIndex((i) => (i - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  const goNext = () => setIndex((i) => (i + 1) % TESTIMONIALS.length);

  return (
    <section id="testimonials" className="px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between gap-6">
          <h2 className="text-3xl font-medium leading-tight tracking-tight text-neutral-900 sm:text-4xl">
            Why Businesses Trust Sandygrabs for Their Freight
          </h2>

          <div className="flex shrink-0 gap-2">
            <button
              type="button"
              onClick={goPrev}
              aria-label="Previous testimonial"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-neutral-200 text-neutral-900 transition-colors hover:border-gold-500 hover:bg-gold-50 hover:text-gold-700"
            >
              <ArrowLeft size={18} />
            </button>
            <button
              type="button"
              onClick={goNext}
              aria-label="Next testimonial"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-neutral-200 text-neutral-900 transition-colors hover:border-gold-500 hover:bg-gold-50 hover:text-gold-700"
            >
              <ArrowRight size={18} />
            </button>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-8 rounded-4xl border border-neutral-200 p-8 sm:p-12 md:flex-row md:items-start">
          <Quote
            size={40}
            strokeWidth={1.5}
            className="shrink-0 text-gold-400"
          />
          <div>
            <p className="text-xl leading-relaxed text-neutral-800 sm:text-2xl">
              &ldquo;{testimonial.quote}&rdquo;
            </p>
            <div className="mt-8 flex items-center gap-4">
              <Image
                src={testimonial.avatar}
                alt={testimonial.name}
                width={48}
                height={48}
                className="h-12 w-12 rounded-full object-cover"
              />
              <div>
                <p className="text-sm font-semibold text-neutral-900">
                  {testimonial.name}
                </p>
                <p className="text-sm text-neutral-500">{testimonial.role}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
