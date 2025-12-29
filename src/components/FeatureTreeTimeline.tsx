import { useRef, useState } from "react";
import {
  motion,
  useScroll,
  useMotionValueEvent,
  useReducedMotion,
} from "framer-motion";

/* ---------------- DATA ---------------- */

const features = [
  {
    id: 1,
    title: "Various Assets",
    desc: "Analyse mutual funds across categories and diversify your investments intelligently.",
    img: "/dark_hero.png",
  },
  {
    id: 2,
    title: "Market Analysis",
    desc: "Get deep insights with real-time data, returns comparison and risk metrics.",
    img: "/dark_hero.png",
  },
  {
    id: 3,
    title: "Enhanced Tools",
    desc: "Use calculators, SIP planners and performance trackers in one place.",
    img: "/dark_hero.png",
  },
];

export default function FeatureTreeTimeline() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start center", "end center"],
  });

  const total = features.length;

  /* SCROLL → ACTIVE CARD (STRICT RANGE) */
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const idx = Math.floor(v * total);
    setActiveIndex(idx >= 0 && idx < total ? idx : null);
  });

  return (
    <section
      ref={sectionRef}
      className="
        relative w-full px-6 py-24 mt-10
        scroll-smooth
      "
    >
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white">
            Save time. Get{" "}
            <span className="text-blue-600 dark:text-blue-400">
              higher return
            </span>.
            <br />
            Multiply wealth.
          </h2>
        </div>

        {/* TREE */}
        <div className="relative">

          {/* SCROLL-FILLED LINE (ALL DEVICES) */}
          <motion.div
            className="
              absolute top-0 w-[3px] origin-top
              left-4 md:left-1/2
              bg-blue-500 dark:bg-blue-400
            "
            style={{
              height: "100%",
              scaleY: scrollYProgress,
              transform: "translateX(-50%)",
            }}
          />

          {/* GLOW TRAIL */}
          {!reduceMotion && (
            <motion.div
              className="
                absolute top-0 w-[10px]
                left-3 md:left-1/2
                bg-blue-400/40 blur-xl
              "
              style={{
                height: "100%",
                scaleY: scrollYProgress,
                transform: "translateX(-50%)",
              }}
            />
          )}

          <div className="space-y-32 md:space-y-24 snap-y snap-mandatory">
            {features.map((feature, index) => (
              <FeatureRow
                key={feature.id}
                feature={feature}
                index={index}
                isActive={activeIndex === index}
                reduceMotion={reduceMotion}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- ROW ---------------- */

function FeatureRow({ feature, index, isActive, reduceMotion }: any) {
  const isLeft = index % 2 === 0;

  return (
    <div className="relative snap-center">

      {/* NODE (ALL DEVICES) */}
      <motion.div
        className="
          absolute left-3 md:left-143
          h-3 w-3 rounded-full
        "
        style={{ transform: "translateX(-50%)" }}
        animate={{
          scale: isActive ? 1.5 : 1,
          backgroundColor: isActive ? "#2563eb" : "#9ca3af",
        }}
        transition={{ duration: reduceMotion ? 0 : 0.25 }}
      />

      {/* DESKTOP */}
      <div className="hidden md:grid grid-cols-[1fr_auto_1fr] items-start">

        {isLeft ? (
          <Card feature={feature} isActive={isActive} align="right" />
        ) : (
          <div />
        )}

        <div />

        {!isLeft ? (
          <Card feature={feature} isActive={isActive} align="left" />
        ) : (
          <div />
        )}
      </div>

      {/* MOBILE / TABLET */}
      <div className="md:hidden pl-10">
        <MobileCard feature={feature} isActive={isActive} />
      </div>
    </div>
  );
}

/* ---------------- CARD ---------------- */

function Card({ feature, isActive, align }: any) {
  return (
    <div className={`flex ${align === "right" ? "justify-end pr-12" : "pl-12"}`}>
      <motion.div
        className="
          w-[550px] rounded-2xl p-6
          bg-white dark:bg-gray-900
          border border-gray-200 dark:border-gray-800
          shadow-sm
        "
        animate={{
          opacity: isActive ? 1 : 0.2,
          scale: isActive ? 1 : 0.95,
        }}
        transition={{ duration: 0.35 }}
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {feature.title}
        </h3>

        <motion.div
          animate={{
            opacity: isActive ? 1 : 0,
            y: isActive ? 0 : -12,
          }}
          transition={{ duration: 0.35 }}
        >
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
            {feature.desc}
          </p>

          <img
            src={feature.img}
            alt={feature.title}
            width={300}
            height={160}
            className="rounded-lg mt-2"
          />
        </motion.div>
      </motion.div>
    </div>
  );
}

/* ---------------- MOBILE CARD ---------------- */

function MobileCard({ feature, isActive }: any) {
  return (
    <motion.div
      className="
        rounded-xl p-4
        bg-white dark:bg-gray-900
        border border-gray-200 dark:border-gray-800
        shadow-sm
      "
      animate={{
        opacity: isActive ? 1 : 0.25,
        scale: isActive ? 1 : 0.96,
      }}
      transition={{ duration: 0.3 }}
    >
      <h3 className="text-base font-semibold text-gray-900 dark:text-white">
        {feature.title}
      </h3>

      <motion.div
        animate={{
          opacity: isActive ? 1 : 0,
          y: isActive ? 0 : -10,
        }}
        transition={{ duration: 0.3 }}
      >
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">
          {feature.desc}
        </p>

        <img
          src={feature.img}
          alt={feature.title}
          width={260}
          height={160}
          className="rounded-lg mt-3"
        />
      </motion.div>
    </motion.div>
  );
}
