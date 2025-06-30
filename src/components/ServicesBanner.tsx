/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import styled from "@emotion/styled";

//Import des Logos
import EasyReturn_logo from "../assets/images/Services_logo/EasyReturn.webp";
import FastDelivery_logo from "../assets/images/Services_logo/livraison_rapide.webp";
import Pickup_logo from "../assets/images/Services_logo/point_de_retrait.webp";
import ShoeService_logo from "../assets/images/Services_logo/shoe_service.webp";

/* ---------------------- Composant TypeScript ---------------------- */

function ServicesBanner() {
  return (
    <ServicesContainer>
      <div css={ServicesColumn}>
        <img css={ServicesLogoImg} src={FastDelivery_logo} alt="Fast Delivery" />
        Livraison rapide
      </div>
      <div css={ServicesColumn}>
        <img css={ServicesLogoImg} src={ShoeService_logo} alt="Shoe Service" />
        Shoe Service
      </div>
      <div css={ServicesColumn}>
        <img css={ServicesLogoImg} src={Pickup_logo} alt="Pickup" />
        Point relais Pickup
      </div>
      <div css={ServicesColumn}>
        <img css={ServicesLogoImg} src={EasyReturn_logo} alt="Easy Return" />
        Easy Return
      </div>
    </ServicesContainer>
  );
}

/* ---------------------- Style avec Emotion ---------------------- */

const ServicesContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 3rem 0;
`;

const ServicesColumn = css`
  display: flex;
  flex-direction: column;
  text-align: center;
  font-weight: 1000;

  &:last-child {
    border: none;
  }
`;

const ServicesLogoImg = css`
  opacity: 70%;
  margin-bottom: 1.3rem;
  height: 70px;
  object-fit: contain;
`;

export default ServicesBanner;
