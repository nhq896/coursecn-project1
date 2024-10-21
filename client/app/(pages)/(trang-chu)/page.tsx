"use client";

import Navbar from "@/app/components/navbar/Navbar";
import Head from "@/app/components/Head";
import Hero from "./Hero";

export default function Home() {
  return (
    <div>
      <Head title="coursecn" description="web desciption" keywords="some key" />
      <Navbar />
      <div className="mt-20">
        <Hero />
      </div>
    </div>
  );
}
