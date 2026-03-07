"use client";

const headlineClasses =
  "font-sans font-bold tracking-tight text-ds-text text-3xl sm:text-4xl lg:text-5xl leading-tight";

type HeroHeadingProps = {
  text: string;
};

export function HeroHeading({ text }: HeroHeadingProps) {
  const trimmed = text.trim();
  const letters = trimmed ? trimmed.split("") : [];

  return (
    <h1 id="hero-heading">
      <span className="ds-hero-headline-in">
        {letters.length === 0 ? (
          <span className={headlineClasses}>{"\u00A0"}</span>
        ) : (
          letters.map((char, index) => (
            <span
              key={index}
              className={`ds-hero-letter-in ${headlineClasses}`}
              style={{ animationDelay: `${Math.min(index * 45, 600)}ms` }}
            >
              {char}
            </span>
          ))
        )}
      </span>
    </h1>
  );
}
