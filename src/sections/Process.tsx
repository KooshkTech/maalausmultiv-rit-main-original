import { ClipboardList, Sparkles, Brush, ShieldCheck } from 'lucide-react';
import { SectionHeading } from '@/components/SectionHeading';
import { Reveal } from '@/components/Reveal';
import { processSteps } from '@/data/site';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  clipboard: ClipboardList,
  sparkles: Sparkles,
  brush: Brush,
  shield: ShieldCheck,
};

export function Process() {
  return (
    <section className="section-pad bg-navy-950 text-white">
      <div className="container-base">
        <SectionHeading
          eyebrow="Näin työ etenee"
          eyebrowOrange
          title={<span className="text-white">Selkeä prosessi, yllätyksetön lopputulos</span>}
          description={
            <span className="text-navy-200">
              Neljä vaihetta, joiden aikana tiedät tasan tarkkaan mitä tapahtuu ja milloin.
            </span>
          }
        />

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {processSteps.map((step, i) => {
            const Icon = iconMap[step.icon] ?? ClipboardList;
            return (
              <Reveal key={step.number} delay={i * 100}>
                <div className="group relative h-full rounded-2xl border border-white/10 bg-white/5 p-7 transition-all duration-300 hover:border-orange-400/40 hover:bg-white/10">
                  <span className="font-display text-5xl font-extrabold text-white/10 transition group-hover:text-orange-400/30">
                    {step.number}
                  </span>
                  <div className="mt-4 flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/15 text-orange-400 transition group-hover:bg-orange-500 group-hover:text-white">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-5 font-display text-lg font-bold text-white">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-navy-200">
                    {step.description}
                  </p>
                  {i < processSteps.length - 1 && (
                    <span className="absolute right-6 top-7 hidden text-2xl text-white/20 lg:block">
                      →
                    </span>
                  )}
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
