import Link from "next/link";
import featured from "@/public/assets/featured.webp";
import Image from "next/image";

const FeaturedCollection = () => {
  return (
    <section className="py-16 px-4 lg:px-0">
      <div className="container mx-auto flex flex-col-reverse lg:flex-row items-center bg-green-50 rounded-3xl">
        {/* Left Content */}
        <div className="lg-1/2 p-8 text-center lg:text-left">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">
            Comfort and Style
          </h2>
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Apparel made for you everyday life
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            Discover high-quality, comfortable clothing that effortlessly blends
            fashion and <br />
            function. Designed to make you look and feel great every day.
          </p>
          <Link
            href="/collection/all"
            className="bg-black text-white px-6 py-3 rounded-lg text-lg hover:bg-gray-800 cursor-pointer    "
          >
            Shop Now
          </Link>
        </div>

        {/* Righ Content */}
        <div className="lg:w-1/2">
          <Image
            src={featured}
            alt="Featured Collection"
            className="w-full h-full object-cover lg:roundtr-3xl lg:roundedbr-3xl"
            priority
          />
        </div>
      </div>
    </section>
  );
};

export default FeaturedCollection;
