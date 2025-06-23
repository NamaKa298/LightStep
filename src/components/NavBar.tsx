/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import logo from "../assets/logo.png";
import { FaBasketShopping } from "react-icons/fa6";
import { BsBookmarkFill } from "react-icons/bs";
import { IoPersonSharp } from "react-icons/io5";

const Title1 = css`
  font-family: "Calligraffitti", sans-serif;
  padding: 4px;
  color: black;
  font-size: 48px;
`;

const navbarLinks = css`
  color: black;
  font-weight: 600;
  text-decoration: none;
  &:hover {
    color: #004e36;
    text-decoration: underline;
  }
`;

const iconLinks = css`
  &:hover {
    color: #004e36;
  }
`;

const UnorderedListLinks = css`
  display: flex;
  justify-content: flex-end;
  width: 100%;
  gap: 50px;
  font-family: "Montserra", sans-serif;
  font-size: 22px;
  list-style: none;
`;

const navBarContainer = css`
  display: flex;
  align-items: center;
  padding: 16px 0px;
`;

const navBarLogo = css`
  width: 102.18px;
  height: 96px;
`;

const dropDownNavbarLinks = css`
  display: none;
`;

function NavBar() {
  return (
    <div css={navBarContainer}>
      <img src={logo} css={navBarLogo} alt="Vite logo" />
      <div css={Title1}>LightStep</div>
      <ul css={UnorderedListLinks}>
        <li>
          <a css={navbarLinks} href="#news">
            Nouveautés
          </a>
        </li>
        <li>
          <a css={navbarLinks} href="#woman">
            Femme
          </a>
        </li>
        <li>
          <a css={navbarLinks} href="#man">
            Homme
          </a>
          <div css={dropDownNavbarLinks}>
            <div>
              Découvrez
              <a>Nos chaussures minimalistes hommes</a>
              <a>Nos chaussures chaussettes</a>
              <a>Nos chaussures minimalistre enfants</a>
              <a>Nouveautés</a>
              <a>Soldes</a>
            </div>
            <div>
              Par activités
              <a>Running/Athlétisme</a>
              <a>Trail/Outdoor</a>
              <a>Fitness/Crossfit</a>
              <a>Yoga/Pilate/Danse</a>
              <a>Ville</a>
            </div>
            <div>
              Marques
              <a>Vibram FiveFingers</a>
              <a>Altra</a>
              <a>Merell</a>
              <a>Xero Shoes</a>
              <a>Aylla</a>
              <a>Gumbies</a>
              <a>Inov-8</a>
              <a>Topo</a>
              <a>Skinners</a>
              <a>Luna Sandals</a>
            </div>
          </div>
        </li>
        <li css={iconLinks}>
          <IoPersonSharp />
        </li>
        <li css={iconLinks}>
          <BsBookmarkFill />
        </li>
        <li css={iconLinks}>
          <FaBasketShopping />
        </li>
      </ul>
    </div>
  );
}

export default NavBar;
