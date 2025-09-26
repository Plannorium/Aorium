"use client";
import React from "react";
import useEmblaCarousel, { type EmblaOptionsType } from "embla-carousel-react";
import { DotButton, useDotButton } from "../dashboard/EmblaCarouselDotButton";
import {
  PrevButton,
  NextButton,
  usePrevNextButtons,
} from "../dashboard/EmblaCarouselArrowButtons";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import "../carousel.css";

type PropType = {
  options?: EmblaOptionsType;
};

const fetchNews = async () => {
  const { data } = await axios.get("/api/news");
  return data;
};

const MarketNewsWidget: React.FC<PropType> = (props) => {
  const { options } = props;
  const [emblaRef, emblaApi] = useEmblaCarousel(options);

  const { data, error, isLoading } = useQuery({
    queryKey: ["news"],
    queryFn: fetchNews,
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  const { selectedIndex, scrollSnaps, onDotButtonClick } =
    useDotButton(emblaApi);

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  } = usePrevNextButtons(emblaApi);

  if (isLoading) return <div>Loading news...</div>;
  if (error) return <div>Error fetching news.</div>;

  return (
    <div className="embla">
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container">
          {data?.data?.map((article: any, index: number) => (
            <div className="embla__slide" key={index}>
              <div className="bg-neutral-light p-4 rounded-lg shadow-md h-full flex flex-col justify-between">
                <img
                  src={
                    article.image ||
                    "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  }
                  alt={article.title}
                  className="w-full h-32 object-cover rounded-t-lg"
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
                  }}
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2 text-text-dark">
                    {article.title}
                  </h3>
                  <p className="text-sm text-gray-600">{article.source}</p>
                </div>
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-DEFAULT hover:underline mt-4 self-end"
                >
                  Read More
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="embla__controls">
        <div className="embla__buttons">
          <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
          <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
        </div>

        <div className="embla__dots">
          {scrollSnaps.map((_, index) => (
            <DotButton
              key={index}
              onClick={() => onDotButtonClick(index)}
              className={"embla__dot".concat(
                index === selectedIndex ? " embla__dot--selected" : ""
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MarketNewsWidget;
