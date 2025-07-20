import mensCollectionImage from "@/public/assets/mens-collection.webp";
import womensCollectionImage from "@/public/assets/womens-collection.webp";
import Image from "next/image";
import Link from "next/link";

const GenderCollectionSection = () => {
  return (
    <section className="py-16 px-4 lg:px-0">
      <div className="container mx-auto flex flex-col md:flex-row gap-8">
        {/* WOMENS COLLECTION */}
        <div className="relative flex-1 transition-transform duration-300 cursor-pointer  hover:scale-105">
          <Image
            src={womensCollectionImage}
            alt="womens collection"
            className="w-full h-[700px] object-cover"
          />
          <div className="absolute bottom-8 left-8 bg-white bg-white bg-opacity-90 p-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Women's Collection
            </h2>
            <Link
              href="/collection/all?gender=Women"
              className="text-gray-900 underline"
            >
              Shop Now
            </Link>
          </div>
        </div>

        {/* Mens Collection */}
        <div className="relative flex-1 transition-transform duration-300 cursor-pointer  hover:scale-105">
          <Image
            src={mensCollectionImage}
            alt="Men's collection"
            className="w-full h-[700px] object-cover"
          />
          <div className="absolute bottom-8 left-8 bg-white bg-white bg-opacity-90 p-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Men s Collection
            </h2>
            <Link
              href="/collection/all?gender=Men"
              className="text-gray-900 underline"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GenderCollectionSection;
