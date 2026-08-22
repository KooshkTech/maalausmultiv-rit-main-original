import type { ReactNode } from 'react';
import { Reveal } from './Reveal';

type SectionHeadingProps = {
  eyebrow?: string;
  eyebrowOrange?: boolean;
  title: ReactNode;
  description?: ReactNode;
  align?: 'left' | 'center';
  className?: string;
};

export function SectionHeading({
  eyebrow,
  eyebrowOrange = false,
  title,
  description,
  align = 'center',
  className = '',
}: SectionHeadingProps) {
  return (
    <Reveal
      className={`flex flex-col gap-4 ${
        align === 'center' ? 'items-center text-center' : 'items-start text-left'
      } ${className}`}
    >
      {eyebrow && (
        <span className={eyebrowOrange ? 'eyebrow-orange' : 'eyebrow'}>
          {eyebrow}
        </span>
      )}
      <h2 className="max-w-3xl text-3xl font-bold leading-tight text-navy-900 sm:text-4xl lg:text-5xl">
        {title}
      </h2>
      {description && (
        <p className="max-w-2xl text-base leading-relaxed text-navy-600 sm:text-lg">
          {description}
        </p>
      )}
    </Reveal>
  );
}
