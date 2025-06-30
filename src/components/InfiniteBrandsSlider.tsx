/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { FaChevronRight } from "react-icons/fa";
import Cross_separator from "../assets/CrossSection.svg";

// Import des logos
import Altra_logo from "../assets/brands_logo/altra.webp";
import Aylla_logo from "../assets/brands_logo/aylla.webp";
import Gumbies_logo from "../assets/brands_logo/gumbies.webp";
import Inov8_logo from "../assets/brands_logo/inov8.webp";
import LunaSandals_logo from "../assets/brands_logo/luna_sandals.webp";
import Merell_logo from "../assets/brands_logo/merell.webp";
import Skinners_logo from "../assets/brands_logo/skinners.webp";
import TopoAthletic_logo from "../assets/brands_logo/topo_athletic.webp";
import Vibram_logo from "../assets/brands_logo/vibram.webp";
import XeroShoes_logo from "../assets/brands_logo/xero_shoes.webp";

interface Brand {
  id: string;
  name: string;
  logo: string;
}

const brands: Brand[] = [
  { id: "1", name: "Altra", logo: Altra_logo },
  { id: "2", name: "Gumbies", logo: Gumbies_logo },
  { id: "3", name: "Inov-8", logo: Inov8_logo },
  { id: "4", name: "Luna Sandals", logo: LunaSandals_logo },
  { id: "5", name: "Topo Athletic", logo: TopoAthletic_logo },
  { id: "6", name: "Vibram", logo: Vibram_logo },
  { id: "7", name: "Xero Shoes", logo: XeroShoes_logo },
  { id: "8", name: "Aylla", logo: Aylla_logo },
  { id: "9", name: "Skinners", logo: Skinners_logo },
  { id: "10", name: "Merell", logo: Merell_logo },
];

const InfiniteBrandsSlider: React.FC = () => {
  const [isPaused, setIsPaused] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<{
    id: number | null;
    startTime: number;
    progress: number;
  }>({ id: null, startTime: 0, progress: 0 });
  const speed = 0.1;

  const animate = useCallback(
    (timestamp: number) => {
      if (!sliderRef.current) return;

      if (!animationRef.current.startTime) {
        animationRef.current.startTime = timestamp;
      }

      const elapsed = timestamp - animationRef.current.startTime;
      const translateX = (animationRef.current.progress + elapsed * speed) % (sliderRef.current.scrollWidth / 2);

      sliderRef.current.style.transform = `translateX(-${translateX}px)`;
      animationRef.current.id = requestAnimationFrame(animate);
    },
    [speed]
  );

  useEffect(() => {
    // Crée une copie locale de la référence pour le cleanup
    const currentAnimationRef = animationRef.current;

    if (!isPaused) {
      animationRef.current.startTime = 0;
      animationRef.current.id = requestAnimationFrame(animate);
    } else {
      if (sliderRef.current) {
        const style = window.getComputedStyle(sliderRef.current);
        const matrix = new DOMMatrix(style.transform);
        animationRef.current.progress = Math.abs(matrix.m41);
      }
      if (animationRef.current.id) {
        cancelAnimationFrame(animationRef.current.id);
      }
    }

    return () => {
      // Utilise la copie locale dans le cleanup
      if (currentAnimationRef.id) {
        cancelAnimationFrame(currentAnimationRef.id);
      }
    };
  }, [isPaused, animate]);

  return (
    <OurBrandsSection>
      <div css={CrossSeparator}>
        <SectionTitle>Nos Marques</SectionTitle>
        <img src={Cross_separator} alt="" />
      </div>
      <Separator />
      <SliderContainer>
        <Slider ref={sliderRef} onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)}>
          {[...brands, ...brands].map((brand, index) => (
            <Logo key={`${brand.id}-${index}`} src={brand.logo} alt={brand.name} />
          ))}
        </Slider>
      </SliderContainer>
      <CtaButton>
        See all brands <FaChevronRight style={{ marginLeft: "0.5em", verticalAlign: "middle" }} />
      </CtaButton>
    </OurBrandsSection>
  );
};

/* ---------------------- Style avec Emotion ---------------------- */

const OurBrandsSection = styled.section`
  margin: 10rem 0;
`;

const CrossSeparator = css`
  display: flex;
  align-items: end;
  justify-content: space-between;
  width: 100%;
`;

const SectionTitle = styled.h1`
  color: #004e36;
  font-family: "Montserra", sans-serif;
  font-size: 24px;
  margin-top: 2em;
`;

const Separator = styled.hr`
  background-color: #004e36;
  height: 3px;
  margin: 0.8em 0;
`;

const SliderContainer = styled.div`
  overflow: hidden;
  width: 100%;
  position: relative;
  margin: 2rem 0 4rem 0;
  padding: 1rem 0;

  &::before,
  &::after {
    content: "";
    position: absolute;
    top: 0;
    width: 100px;
    height: 100%;
    z-index: 2;
  }

  &::before {
    left: 0;
    background: linear-gradient(to right, #f6f7f1, rgba(255, 255, 255, 0));
  }

  &::after {
    right: 0;
    background: linear-gradient(to left, #f6f7f1, rgba(255, 255, 255, 0));
  }
`;

const Slider = styled.div`
  display: flex;
  width: max-content;
  align-items: center;
`;

const Logo = styled.img`
  margin: 0 40px;
  height: 100%;
  width: auto;
  max-height: 40px;
  object-fit: contain;
  filter: grayscale(100%) opacity(80%);
  transition: all 0.3s ease;

  &:hover {
    filter: grayscale(0%) opacity(100%);
    transform: scale(1.05);
    cursor: pointer;
  }

  @media (max-width: 768px) {
    height: 70px;
    margin: 0 20px;
  }
`;

const CtaButton = styled.button`
  padding: 0.75rem 1.2rem;
  font-size: 18px;
  font-weight: 400;
  margin: 0 auto;
  display: block;
  background-color: #006b4b;
  border: none;
  border-radius: 6px;
  color: #fff;

  &:hover {
    background-color: #004e36;
    box-shadow: 0 0 6px #028a61;
    cursor: pointer;
  }
`;

export default InfiniteBrandsSlider;
