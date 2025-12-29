
const Hero = () => {
  return (
    <section
      className="
        relative w-full px-6 overflow-hidden
      "
    >
      {/* subtle grain background */}
      <div
        className="
          pointer-events-none absolute inset-0
          dark:opacity-20
        "
      />

      <div className="relative max-w-7xl mx-auto pt-28 pb-24 font-mulish">
        {/* HERO CONTENT */}
        <div className="flex flex-col items-center text-center">
          {/* TOP PILL */}
          <div className=" inline-flex items-center gap-2 px-4 py-2 rounded-full border backdrop-blur-sm bg-linear-to-r from-blue-100/40 to-purple-100/40 border-blue-300/50 dark:from-blue-500/10 dark:to-purple-500/10 dark:border-blue-800/50 ">
            {" "}
            <span className=" text-sm bg-linear-to-r bg-clip-text text-transparent from-blue-700 to-purple-700 dark:from-blue-400 dark:to-purple-400 ">
              {" "}
              Trusted by 100,000+ investors{" "}
            </span>{" "}
          </div>

          {/* HEADING */}
          <h1
            className="
              text-4xl sm:text-5xl md:text-6xl mt-5
              font-semibold tracking-tight leading-tight
              text-gray-900 dark:text-white
            "
          >
            Self-serve & <span className="text-blue-600">transparent</span>
            <br />
            method for investing together
          </h1>

          {/* SUBTEXT */}
          <p
            className="
              mt-6 max-w-3xl
              text-base sm:text-lg
              text-gray-600 dark:text-gray-400
            "
          >
            Whether it’s pooling resources with family, rallying friends, or
            collaborating with like-minded individuals, our platform fosters a
            sense of community and purpose.
          </p>

          {/* CTA BUTTONS */}
          <div className="mt-10 flex flex-row gap-4">
            <button
              className="
                px-6 py-3 rounded-xl
                bg-blue-600 text-white
                hover:bg-blue-700
                dark:bg-blue-700 dark:hover:bg-blue-700
                transition
              "
            >
              Get App for Mobile
            </button>

            <button
              className="
                px-6 py-3 rounded-xl
                bg-white dark:bg-gray-900
                border border-gray-300 dark:border-gray-700
                text-gray-900 dark:text-white
                hover:border-gray-500
                transition
              "
            >
              Open Dashboard
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
