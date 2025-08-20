/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import AddLunaSandals from "../assets/images/addBanner/add-luna-sandals.png";

function AddBanner() {
  return (
    <AddBannerContainer>
      <img css={AddBannerImage} src={AddLunaSandals} alt="banner" />
      <button css={AddBannerButton}>
        <span>Découvrez maintenant</span>
      </button>
      <p css={addSlogan}>
        Crafted for the <br /> minimalist <br /> explorer
      </p>
    </AddBannerContainer>
  );
}

export default AddBanner;

const AddBannerContainer = styled.div`
  margin: 0 calc(var(--global-margin) * -1);
  padding: 0;
  box-sizing: border-box;
  left: 0;
  right: 0;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
  flex: 1;
`;

const AddBannerImage = css`
  width: 100%;
  height: 100%;
  object-fit: cover;
  margin-bottom: 4vh;
`;

const AddBannerButton = css`
  background-color: #ffffff;
  border: none;
  font-size: 24px;
  color: #000000;
  padding: 16px 80px;
  border-radius: 8px;
  position: absolute;
  bottom: 10vh;
  transform: translate(-50%, -50%);
  left: 50%;
  font-weight: 400;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  transition: background 0.2s, color 0.2s, box-shadow 0.2s, transform 0.15s;
  &:hover {
    background-color: #f7f7f7;
    color: #202020;
    transform: translate(-50%, -50%) scale(1.01);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2), inset 0 2px 16px rgba(0, 0, 0, 0.18);
  }
`;

const addSlogan = css`
  position: absolute;
  color: #fff;
  text-transform: uppercase;
  font-weight: 1000;
  font-size: 36px;
  font-style: italic;
  left: 3vw;
  top: 60%;
`;
