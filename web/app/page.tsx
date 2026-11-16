import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import Features from "@/components/Features";
import Commands from "@/components/Commands";
import Privacy from "@/components/Privacy";
import Faq from "@/components/Faq";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import CopyCommand from "@/components/CopyCommand";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <HowItWorks />
      <Commands />
      <Features />
      <Privacy />
      <Faq />

      <section className="px-6 py-24">
        <Reveal className="mx-auto max-w-3xl rounded-3xl border border-white/10 bg-gradient-to-b from-emerald-500/10 to-transparent p-10 text-center">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Write your next commit in 3 seconds
          </h2>
          <p className="mt-3 text-zinc-400">
            Free, open source and no sign-up.
          </p>
          <div className="mt-8 flex justify-center">
            <CopyCommand command="npm i -g saycommit" />
          </div>
        </Reveal>
      </section>

      <Footer />
    </main>
  );
}