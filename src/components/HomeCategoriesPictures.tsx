/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import CasualCategory from "../assets/Categories_pictures/casual_category.webp";
import GymCategory from "../assets/Categories_pictures/gym_category.webp";
import RunningCategory from "../assets/Categories_pictures/running_category.webp";
import TrailCategory from "../assets/Categories_pictures/trail_category.webp";

const Container = styled.div`
  display: flex;
  gap: 30px;
  height: auto;
  width: 100%;
  margin: 20px 0;
`;

const CategoriePicture = css`
  flex: 1;
  width: 100%;
  height: 25vw; /* Ajuste la hauteur selon le ratio souhaité */
  object-fit: cover;
  filter: grayscale(100%);
  transition: filter 0.5s cubic-bezier(0.22, 1, 0.36, 1);
  transform: translateZ(0); /* Active l'accélération GPU */
  backface-visibility: hidden; /* Optimise le rendu */
  border-radius: 2px;

  &:hover {
    filter: grayscale(0%);
    cursor: pointer;
  }
`;

const CategorieContainer = styled.div`
  position: relative;
  flex: 1;
  width: 100%;
  height: 25vw;
  display: flex;
`;

const CategorieBanner = css`
  font-family: "Montserra", sans-serif;
  font-style: italic;
  font-size: 32px;
  font-weight: 1000;
  text-transform: uppercase;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 6px 0;
  background: #d9d9d97a;
  color: #000000;
  text-align: center;
  letter-spacing: 1px;
  z-index: 2;
  border-radius: 2px;
`;

function HomeCategoriesPictures() {
  return (
    <Container>
      <CategorieContainer>
        <img css={CategoriePicture} src={RunningCategory} alt="Catégorie Running" />
        <div css={CategorieBanner}>Running</div>
      </CategorieContainer>
      <CategorieContainer>
        <img css={CategoriePicture} src={GymCategory} alt="Catégorie Gym" />
        <div css={CategorieBanner}>Gym</div>
      </CategorieContainer>
      <CategorieContainer>
        <img css={CategoriePicture} src={TrailCategory} alt="Catégorie Trail" />
        <div css={CategorieBanner}>Trail</div>
      </CategorieContainer>
      <CategorieContainer>
        <img css={CategoriePicture} src={CasualCategory} alt="Catégorie Casual" />
        <div css={CategorieBanner}>Casual</div>
      </CategorieContainer>
    </Container>
  );
}

export default HomeCategoriesPictures;
