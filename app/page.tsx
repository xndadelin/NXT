import Image from "next/image";
import { HeroSection } from "./components/ui/HeroSection";

export default function Home() {
  return (
    <div
      style={{ 
        display: "flex", 
        flexDirection: "column", 
        alignItems: "center", 
        justifyContent: "center", 
        minHeight: "100vh",
      }}
    >
      <HeroSection />
    </div>
  );
}
