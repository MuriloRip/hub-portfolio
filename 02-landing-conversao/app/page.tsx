import Link from "next/link";
import { ContactForm } from "@/components/ContactForm";

const services = [
  {
    title: "Landing Pages de Alta Conversao",
    description: "Paginas focadas em captacao de leads com copy, CTA e performance."
  },
  {
    title: "Sistemas Web Sob Medida",
    description: "SaaS e paineis administrativos para operacao de negocios locais."
  },
  {
    title: "Manutencao e Escalabilidade",
    description: "Evolucao continua com analytics, testes e deploy profissional."
  }
];

const faqs = [
  {
    q: "Em quanto tempo um projeto entra no ar?",
    a: "Projetos menores entre 5 e 10 dias. Sistemas maiores entre 3 e 6 semanas."
  },
  {
    q: "Voce entrega com SEO e responsividade?",
    a: "Sim, toda entrega segue boas praticas de SEO basico, mobile first e performance."
  },
  {
    q: "Como funciona o suporte apos entrega?",
    a: "Incluo periodo de ajustes e ofereco plano mensal de manutencao opcional."
  }
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Murilo Fonseca - Freelancer Web",
  areaServed: "Brasil",
  serviceType: ["Desenvolvimento Web", "Landing Pages", "Sistemas SaaS"],
  url: "https://example.com"
};

export default function HomePage() {
  return (
    <main className="overflow-x-hidden">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="relative isolate overflow-hidden bg-gradient-to-br from-ocean via-ocean to-coral text-white">
        <div className="pointer-events-none absolute inset-0 opacity-40 [background:radial-gradient(circle_at_20%_20%,#98c1d9_0%,transparent_35%),radial-gradient(circle_at_80%_0%,#ef8354_0%,transparent_30%)]" />
        <div className="container-custom relative py-24 sm:py-28">
          <div className="max-w-3xl animate-rise">
            <p className="mb-4 inline-flex rounded-full border border-white/40 px-4 py-1 text-xs font-bold uppercase tracking-[0.22em]">
              Desenvolvedor Freelancer
            </p>
            <h1 className="font-display text-4xl font-extrabold leading-tight sm:text-6xl">
              Sites e sistemas que transformam visitas em clientes.
            </h1>
            <p className="mt-5 max-w-2xl text-base text-white/90 sm:text-lg">
              Eu crio experiencias digitais com design moderno, alta performance e foco real em conversao.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="#contato" className="btn-main">
                Quero um projeto
              </Link>
              <Link href="#provas" className="btn-ghost border-white text-white hover:bg-white hover:text-ocean">
                Ver diferenciais
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section id="provas" className="container-custom py-16 sm:py-20">
        <h2 className="section-title">Por que empresas me contratam</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm animate-rise">
            <p className="text-3xl font-extrabold text-ocean">+35%</p>
            <p className="mt-2 text-sm text-slate-600">Media de aumento na geracao de leads em paginas otimizadas.</p>
          </article>
          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm animate-rise [animation-delay:120ms]">
            <p className="text-3xl font-extrabold text-ocean">90+</p>
            <p className="mt-2 text-sm text-slate-600">Pontuacao de performance no Lighthouse em entregas recentes.</p>
          </article>
          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm animate-rise [animation-delay:220ms]">
            <p className="text-3xl font-extrabold text-ocean">100%</p>
            <p className="mt-2 text-sm text-slate-600">Projetos entregues com layout responsivo para desktop e mobile.</p>
          </article>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <div className="container-custom">
          <h2 className="section-title">Servicos principais</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {services.map((service, index) => (
              <article
                key={service.title}
                className="rounded-2xl border border-slate-200 p-6 transition hover:-translate-y-1 hover:shadow-lg"
                style={{ animationDelay: `${index * 120}ms` }}
              >
                <div className="mb-4 h-10 w-10 rounded-full bg-coral/15 text-coral animate-pulseSoft" />
                <h3 className="font-display text-xl font-bold text-ink">{service.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{service.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="container-custom py-16 sm:py-20">
        <h2 className="section-title">Perguntas frequentes</h2>
        <div className="mt-6 space-y-3">
          {faqs.map((faq) => (
            <details key={faq.q} className="rounded-xl border border-slate-200 bg-white p-4">
              <summary className="cursor-pointer font-bold text-ink">{faq.q}</summary>
              <p className="mt-2 text-sm text-slate-600">{faq.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section id="contato" className="bg-gradient-to-b from-mint/30 to-sand py-16 sm:py-20">
        <div className="container-custom grid items-center gap-8 lg:grid-cols-2">
          <div>
            <h2 className="section-title">Vamos criar seu proximo projeto?</h2>
            <p className="mt-3 text-sm text-slate-700 sm:text-base">
              Envie uma mensagem e eu retorno com escopo, prazo e investimento estimado para sua demanda.
            </p>
          </div>
          <ContactForm />
        </div>
      </section>
    </main>
  );
}
