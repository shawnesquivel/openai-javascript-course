import React from "react";
import Image from "next/image";

const ImageCard = ({ src, alt, title }) => (
  <div className="relative rounded-3xl overflow-hidden h-40 drop-shadow">
    <div className="absolute inset-0">
      <Image
        src={src}
        alt={alt}
        fill
        style={{ objectFit: "cover" }}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
      />
    </div>
    <div className="relative z-10 flex flex-col items-end justify-top h-full m-4">
      <h4 className="text-2xl font-bold text-gray-200">{title}</h4>
    </div>
  </div>
);

const Gallery = () => {
  const items = [
    { src: "/assets/images/pdf.png", alt: "PDF GPT", title: "PDF-GPT" },
    { src: "/assets/images/brain.png", alt: "Memory", title: "Memory" },
    { src: "/assets/images/stream.png", alt: "Stream", title: "Stream" },
    { src: "/assets/images/youtube.png", alt: "YT Video", title: "YT Video" },
    {
      src: "/assets/images/wizard.png",
      alt: "Content Wizard",
      title: "Content Wizard",
    },
    { src: "/assets/images/robohr.png", alt: "RoboHR", title: "RoboHR" },
    { src: "/assets/images/tools.png", alt: "Tools", title: "Tools" },
  ];

  return (
    <div className="w-6/12 m-auto flex flex-col gap-4 relative z-1">
      <ImageCard
        src={items[0].src}
        alt={items[0].alt}
        title={items[0].title}
        className="h-28"
      />
      <div className="grid grid-cols-3 gap-4">
        {items.slice(1, 4).map((item, index) => (
          <ImageCard
            key={index}
            src={item.src}
            alt={item.alt}
            title={item.title}
          />
        ))}
      </div>
      <ImageCard src={items[4].src} alt={items[4].alt} title={items[4].title} />
      <div className="grid grid-cols-2 gap-4">
        {items.slice(5).map((item, index) => (
          <ImageCard
            key={index}
            src={item.src}
            alt={item.alt}
            title={item.title}
          />
        ))}
      </div>
    </div>
  );
};

export default Gallery;
