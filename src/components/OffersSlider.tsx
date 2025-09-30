import React, { useState, useEffect } from 'react';

interface Offer {
  id: number;
  title: string;
  description: string;
  discount?: string;
  image?: any;
  valid_until?: string;
}

interface OffersSliderProps {
  offers: Offer[];
}

const convertToDataUrl = (imageData: any): string | null => {
  if (!imageData) return null;
  if (typeof imageData === 'string' && imageData.startsWith('data:image')) {
    return imageData;
  }
  if (imageData.type === 'Buffer' && Array.isArray(imageData.data)) {
    const uint8Array = new Uint8Array(imageData.data);
    const base64 = uint8ArrayToBase64(uint8Array);
    return `data:image/jpeg;base64,${base64}`;
  }
  return null;
};

const uint8ArrayToBase64 = (bytes: Uint8Array): string => {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
};

const OffersSlider: React.FC<OffersSliderProps> = ({ offers }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying || offers.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % offers.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, offers.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + offers.length) % offers.length);
    setIsAutoPlaying(false);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % offers.length);
    setIsAutoPlaying(false);
  };

  if (!offers || offers.length === 0) {
    return null;
  }

  return (
    <div className="relative w-full bg-gradient-to-r from-orange-500 to-red-500 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Slider Container */}
        <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden shadow-2xl">
          {/* Slides */}
          <div
            className="flex transition-transform duration-500 ease-out h-full"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {offers.map((offer, index) => {
              const imageUrl = convertToDataUrl(offer.image);
              
              return (
                <div
                  key={offer.id || index}
                  className="min-w-full h-full relative flex items-center"
                >
                  {/* Background Image */}
                  {imageUrl ? (
                    <div className="absolute inset-0">
                      <img
                        src={imageUrl}
                        alt={offer.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30"></div>
                    </div>
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-600 to-red-600"></div>
                  )}

                  {/* Content */}
                  <div className="relative z-10 w-full px-8 md:px-16">
                    <div className="max-w-2xl">
                      {offer.discount && (
                        <div className="inline-block bg-yellow-400 text-gray-900 font-bold px-4 py-2 rounded-full mb-4 text-sm md:text-base">
                          {offer.discount}
                        </div>
                      )}
                      
                      <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
                        {offer.title}
                      </h2>
                      
                      <p className="text-lg md:text-xl text-white/90 mb-6 drop-shadow">
                        {offer.description}
                      </p>
                      
                      {offer.valid_until && (
                        <p className="text-sm text-white/80">
                          Valid until: {new Date(offer.valid_until).toLocaleDateString()}
                        </p>
                      )}
                      
                      <button className="mt-4 bg-white text-orange-600 font-semibold px-8 py-3 rounded-full hover:bg-orange-50 transition-colors shadow-lg">
                        Order Now
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Navigation Arrows */}
          {offers.length > 1 && (
            <>
              <button
                onClick={goToPrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full transition-all z-20"
                aria-label="Previous slide"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <button
                onClick={goToNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full transition-all z-20"
                aria-label="Next slide"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          {/* Dots Indicator */}
          {offers.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
              {offers.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`h-2 rounded-full transition-all ${
                    index === currentIndex
                      ? 'w-8 bg-white'
                      : 'w-2 bg-white/50 hover:bg-white/75'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Offer Counter */}
        <div className="text-center mt-4">
          <p className="text-white text-sm font-medium">
            {currentIndex + 1} / {offers.length} Special Offers
          </p>
        </div>
      </div>
    </div>
  );
};

export default OffersSlider;