/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import NewsLetterForm from "./NewsLetterForm";

//Import des React icons
import { FaFacebookSquare, FaInstagramSquare } from "react-icons/fa";
import LightStepLogo from "../assets/LightStep_logo.webp";

//Import des Logos
import EntrepriseFrançaise_logo from "../assets/footer_logos/entreprise_française.webp";
import Master_logo from "../assets/footer_logos/master-ico.webp";
import Payment_logo from "../assets/footer_logos/modes_de_paiement.webp";
import Paypal_logo from "../assets/footer_logos/paypal-ico.webp";
import Visa_logo from "../assets/footer_logos/visa-ico.webp";

/* ---------------------- Composant TypeScript ---------------------- */

function Footer() {
  return (
    <FooterSection>
      <FooterContainer>
        <BrandContainer>
          <div css={LogoAndText}>
            <img css={LogoStyle} src={LightStepLogo} alt="Logo LightStep" />
            <div css={LogoTextBlock}>
              LightStep <p css={LogoSlogan}>Free to move!</p>
            </div>
          </div>
          <SocialNetworks>
            <FaFacebookSquare size={36} />
            <FaInstagramSquare size={36} />
          </SocialNetworks>
        </BrandContainer>
        <div>
          <ul>
            <li css={ColumnTitle}>Customer Service</li>
            <li css={ColumnList}>Contact Us</li>
            <li css={ColumnList}>Payments</li>
            <li css={ColumnList}>Shipping & Returns</li>
            <li css={ColumnList}>Guarantee</li>
            <li css={ColumnList}>Retailers</li>
          </ul>
        </div>
        <div>
          <ul>
            <li css={ColumnTitle}>About Us</li>
            <li css={ColumnList}>The Story of LightStep</li>
            <li css={ColumnList}>LightStep World</li>
            <li css={ColumnList}>Size Guide for Women</li>
            <li css={ColumnList}>Size Guide for Men</li>
          </ul>
        </div>
        <div>
          <ul>
            <li css={ColumnTitle}>Subscribe</li>
            <li css={ColumnList}>Join our community to receive updates!</li>
          </ul>
          <NewsLetterForm />
        </div>
      </FooterContainer>
      <FooterLogos>
        <img css={FooterLogosImg} src={Visa_logo} alt="" />
        <img css={FooterLogosImg} src={Master_logo} alt="" />
        <img css={FooterLogosImg} src={Paypal_logo} alt="" />
        <img css={FooterLogosImg} src={Payment_logo} alt="" />
        <img css={[FooterLogosImg, ColorLogo]} src={EntrepriseFrançaise_logo} alt="" />
      </FooterLogos>
      <CopyrightBanner>
        <p css={CopyrightSigle}>© 2025 LIGHTSTEP</p>
        <div css={FooterLinks}>General Terms | Privacy Policy | Cookie Policy | Imprint</div>
      </CopyrightBanner>
    </FooterSection>
  );
}

/* ---------------------- Style avec Emotion ---------------------- */

const FooterSection = styled.section`
  /* Apparence */
  border-top: 1px solid #00000045;
  background-color: #ececec;
`;

const FooterContainer = styled.div`
  /* Dimensions */
  padding: 2vw var(--global-margin);
  /* Positionnement */
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  /* Typographie */
  font-size: 16px;
`;

const LogoStyle = css`
  height: 50px;
  width: auto;
  margin-right: 15px;
`;

const BrandContainer = styled.div`
  /* Positionnement */
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const LogoAndText = css`
  display: flex;
  align-items: center;
  text-align: center;
`;

const LogoTextBlock = css`
  /* Typographie */
  font-size: 20px;
  font-family: "Calligraffitti", sans-serif;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 10px;
`;

const LogoSlogan = css`
  /* Typographie */
  font-size: 10px;
  font-weight: 100;
  font-family: "Montserra", sans-serif;
`;

const SocialNetworks = styled.div`
  display: flex;
  gap: 1em;
  margin-top: 2em;

  & > svg {
    cursor: pointer;
    transition: color 0.2s;
  }

  & > svg:hover {
    color: #004e37d6;
  }
`;

const ColumnTitle = css`
  /* Dimensions */
  margin-bottom: 1rem;
  /* Typographie */
  font-size: 16px;
  font-weight: 400;
`;

const ColumnList = css`
  /* Typographie */
  font-size: 16px;
  line-height: 30px;
  font-weight: 100;
  &:hover {
    color: #004e36;
    cursor: pointer;
    text-decoration: underline;
  }
`;

const FooterLogos = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  align-items: center;
  padding-bottom: 1rem;
`;

const FooterLogosImg = css`
  height: 30px;
  width: auto;
  vertical-align: middle;
  border-radius: 4px;
  filter: grayscale(100%);
`;

const ColorLogo = css`
  filter: grayscale(50%);
`;

const CopyrightBanner = styled.div`
  position: relative;
  padding: 0.5rem 0.5rem;
  /* margin: 0 2rem; */
  font-size: 12px;
  font-weight: 400;
  font-family: "Montserrat", sans-serif;
  display: flex;
  justify-content: center;
  text-align: center;
  color: #00000097;
  border-top: 1px solid #adadad78;
  background-color: #0000004c;
  color: #fff;
`;

const CopyrightSigle = css`
  flex: 1;
  text-align: left;
`;

const FooterLinks = css`
  position: absolute;
  text-align: center;
`;

export default Footer;
