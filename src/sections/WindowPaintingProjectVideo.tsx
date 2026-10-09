import { Link } from 'react-router-dom';

export function WindowPaintingProjectVideo() {
  return (
    <section className="section-pad bg-slate-50" aria-labelledby="window-project-video-title">
      <div className="container-base">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8 max-w-3xl">
            <p className="eyebrow-orange">Aito työprojekti</p>
            <h2 id="window-project-video-title" className="mt-3 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              Ikkunoiden maalaus vaihe vaiheelta
            </h2>
            <p className="mt-4 text-lg leading-8 text-slate-600">
              Katso lyhyestä työmaavideosta, miten ikkunoiden kunnostus etenee vanhan pinnan poistosta ja pohjatöistä korjaukseen sekä viimeistelymaalaukseen. Palvelemme Vantaalla, Helsingissä, Espoossa ja muualla Uudellamaalla.
            </p>
          </div>

          <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,420px)_1fr]">
            <div className="overflow-hidden rounded-3xl bg-slate-950 shadow-lift">
              <video
                className="aspect-[9/16] w-full object-cover"
                controls
                playsInline
                preload="metadata"
                aria-label="Ikkunoiden maalausprojekti – pohjatyöt, korjaus ja maalaus"
              >
                <source src="/videos/window-painting/maalausmultivari-window-project-1min.mp4" type="video/mp4" />
                Selaimesi ei tue HTML5-videota.
              </video>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-slate-900">Huolelliset pohjatyöt näkyvät lopputuloksessa</h3>
              <p className="mt-4 leading-7 text-slate-600">
                Ikkunoiden maalaus ei ole vain uuden maalikerroksen lisäämistä. Kulunut pinta puhdistetaan ja valmistellaan, vauriot korjataan ja pinta viimeistellään tarkoitukseen sopivalla maalilla.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link className="btn-primary" to="/yhteystiedot">Pyydä arvio</Link>
                <Link className="btn-secondary" to="/projektit">Katso projekteja</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
