/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { FaChevronRight } from "react-icons/fa";
import Cross_separator from "../assets/images/CrossSection.svg";

function BestSales() {
  return (
    <BestSalesSection>
      <div css={CrossSeparator}>
        <SectionTitle>Meilleures Ventes</SectionTitle>
        <img src={Cross_separator} alt="" />
      </div>
      <Separator />
      <CtaButton>
        Je découvre <FaChevronRight style={{ marginLeft: "0.5em", verticalAlign: "middle" }} />
      </CtaButton>
    </BestSalesSection>
  );
}

/* ---------------------- Style avec Emotion ---------------------- */

const BestSalesSection = styled.section`
  margin: 5rem auto;
`;

const SectionTitle = styled.h1`
  color: #004e36;
  font-family: "Montserra", sans-serif;
  font-size: 24px;
  margin-top: 2em;
`;

const CrossSeparator = css`
  display: flex;
  align-items: end;
  justify-content: space-between;
  width: 100%;
`;
const Separator = styled.hr`
  background-color: #004e36;
  height: 3px;
  margin: 0.8em 0;
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

export default BestSales;
