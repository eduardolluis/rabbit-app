import heroImg from "@/public/assets/rabbit-hero.webp";
import Image from "next/image";
import Link from "next/link";

const Hero = () => {
  return (
    <section className="relative">
      <Image
        src={heroImg}
        alt="rabbit"
        className="w-full h-[400px] md:h-[600px] lg:h-[700px] object-cover py-5 px-1"
        priority
      />

      <div className="absolute inset-0  bg-opacity-5   flex items-center justify-center">
        <div className="text-center text-white p-6">
          <h1 className="text-4xl md:text-9xl font-bold tracking-tighter uppercase mb-4">
            Vacation <br /> Ready
          </h1>
          <p className="text-sm tracking-tighter md:text-lg mb-6">
            Explore our vacation-ready outfis with fast world-wide shipping
          </p>
          <Link
            href="/collection/all"
            className="bg-white text-gray-950 px-6 py-2 rounded-sm text-lg  hover:opacity-70 "
          >
            Shop Now
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;
