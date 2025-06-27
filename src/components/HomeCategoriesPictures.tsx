/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import CasualCategory from "../assets/Categories_pictures/casual_category.webp";
import GymCategory from "../assets/Categories_pictures/gym_category.webp";
import RunningCategory from "../assets/Categories_pictures/running_category.webp";
import TrailCategory from "../assets/Categories_pictures/trail_category.webp";
import YogaCategory from "../assets/Categories_pictures/yoga_categorie.webp";

// Variables CSS
const CategorieCard = {
  height: "20vw" /* Ajuste la hauteur des Card selon le ratio souhaité */,
};

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
  height: ${CategorieCard.height};
  object-fit: cover;
  filter: grayscale(100%);
  transition: filter 0.5s cubic-bezier(0.22, 1, 0.36, 1);
  transform: translateZ(0); /* Active l'accélération GPU */
  backface-visibility: hidden; /* Optimise le rendu */
  border-radius: 3px;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 2px 0 rgba(0, 0, 0, 0.04);

  &:hover {
    filter: grayscale(0%);
    cursor: pointer;
  }
`;

const CategorieContainer = styled.div`
  position: relative;
  flex: 1;
  width: 100%;
  height: ${CategorieCard.height};
  display: flex;
`;

const CategorieBanner = css`
  font-family: "Montserra", sans-serif;
  font-style: italic;
  font-size: 30px;
  font-weight: 1000;
  text-transform: uppercase;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 3px 0;
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
        <div css={CategorieBanner}>FITNESS</div>
      </CategorieContainer>
      <CategorieContainer>
        <img css={CategoriePicture} src={TrailCategory} alt="Catégorie Trail" />
        <div css={CategorieBanner}>Trail</div>
      </CategorieContainer>
      <CategorieContainer>
        <img css={CategoriePicture} src={CasualCategory} alt="Catégorie Casual" />
        <div css={CategorieBanner}>Casual</div>
      </CategorieContainer>
      <CategorieContainer>
        <img css={CategoriePicture} src={YogaCategory} alt="Catégorie Yoga" />
        <div css={CategorieBanner}>Yoga</div>
      </CategorieContainer>
    </Container>
  );
}

export default HomeCategoriesPictures;
