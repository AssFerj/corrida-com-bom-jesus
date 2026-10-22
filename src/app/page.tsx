import { MotionProvider } from "@/components/MotionProvider";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Marquee } from "@/components/Marquee";
import { Highlights } from "@/components/Highlights";
import { Routes } from "@/components/Routes";
import { Kit } from "@/components/Kit";
import { Schedule } from "@/components/Schedule";
import { Registration } from "@/components/Registration";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <MotionProvider>
      <Header />
      <main className="w-full">
        <Hero />
        <Marquee />
        <Highlights />
        <Routes />
        <Kit />
        <Schedule />
        <Registration />
      </main>
      <Footer />
    </MotionProvider>
  );
}

