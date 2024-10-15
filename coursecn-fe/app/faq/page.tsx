"use client";

import { useState } from "react";
import Heading from "../utils/Heading";
import Header from "../components/Header";
import Footer from "../components/Footer";
import FAQ from "../components/FAQ/FAQ";

type FAQPageProps = {};

const FAQPage: React.FC<FAQPageProps> = (props) => {
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(4);
  const [route, setRoute] = useState("Login");

  return (
    <div className="min-h-screen">
      <Heading
        title="Câu hỏi thường gặp - coursecn"
        description="web description"
        keywords="coursecn"
      />
      <Header
        open={open}
        setOpen={setOpen}
        activeItem={activeItem}
        setRoute={setRoute}
        route={route}
      />
      <br />
      <FAQ />
      <Footer />
    </div>
  );
};

export default FAQPage;
