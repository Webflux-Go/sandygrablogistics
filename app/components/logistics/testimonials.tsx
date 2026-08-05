"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, Play } from "lucide-react";
import Reveal from "../motion/reveal";

// TODO(sandygrabs): replace `name` and `caption` with the real customer details for each clip —
// these are deliberately generic rather than invented, since these are real people on camera.
//
// Hosted on Vimeo, so the ~35MB of source video never ships with the site and Vimeo handles
// transcoding, adaptive quality and the poster frame. `id` is the numeric video id from the
// embed URL. The query string suppresses Vimeo's own title/byline/portrait chrome so the player
// is just the video.
const TESTIMONIALS = [
  {
    id: "1215711701", // VID-20260729-WA0021 — 43s
    name: "Customer Testimonial",
    caption: "On sourcing and delivery with Sandygrabs",
  },
  {
    id: "1215711699", // VID-20260729-WA0022 — 118s
    name: "Customer Testimonial",
    caption: "On sourcing and delivery with Sandygrabs",
  },
  {
    id: "1215711702", // VID-20260729-WA0020 — 129s
    name: "Customer Testimonial",
    caption: "On sourcing and delivery with Sandygrabs",
  },
];

const PLAYER_PARAMS =
  "title=0&byline=0&portrait=0&badge=0&autopause=0&player_id=0&app_id=58479";

export default function Testimonials() {
  const [index, setIndex] = useState(0);
  const active = TESTIMONIALS[index];

  const goPrev = () =>
    setIndex((i) => (i - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  const goNext = () => setIndex((i) => (i + 1) % TESTIMONIALS.length);

  return (
    <section id="testimonials" className="px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <Reveal className="flex items-center justify-between gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-600">
              In Their Words
            </p>
            <h2 className="mt-3 text-3xl font-medium leading-tight tracking-tight text-neutral-900 sm:text-4xl">
              Why Businesses Trust Sandygrabs for Their Freight
            </h2>
          </div>

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
        </Reveal>

        <div className="mt-12 flex flex-col items-center">
          {/* Vimeo reports all three as portrait (240x426) — one was shot landscape but carries
              a rotation flag, and the transcode resolves it upright. */}
          <div className="aspect-[9/16] w-full max-w-sm overflow-hidden rounded-4xl bg-neutral-950">
            {/* Only the active clip is mounted, so the other two are never requested, and the
                `key` forces a remount on switch — which is what stops the previous clip's audio
                instead of leaving it playing behind the new one. */}
            <iframe
              key={active.id}
              src={`https://player.vimeo.com/video/${active.id}?${PLAYER_PARAMS}`}
              title={`${active.name} — ${active.caption}`}
              allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
              loading="lazy"
              className="h-full w-full border-0"
            />
          </div>

          <div className="mt-6 flex flex-col items-center gap-1 text-center">
            <p className="text-sm font-semibold text-neutral-900">
              {active.name}
            </p>
            <p className="text-sm text-neutral-500">{active.caption}</p>
          </div>

          <div className="mt-6 flex items-center gap-2">
            {TESTIMONIALS.map((testimonial, i) => (
              <button
                key={testimonial.id}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Play testimonial ${i + 1}`}
                aria-current={i === index}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                  i === index
                    ? "bg-gold-500 text-neutral-950"
                    : "bg-neutral-100 text-neutral-500 hover:bg-gold-50 hover:text-gold-700"
                }`}
              >
                <Play size={11} />
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
