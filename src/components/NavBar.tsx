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
  display: flex;
  flex-direction: row;
  font-size: 16px;
  font-weight: 400;
`;

const dropDownCategoriesTitle = css`
  font-weight: 600;
  padding: 1vw 0;
  background-color: #ffff;
`;

const dropDownCategories = css``;

const dropDownList = css`
  list-style: none;
  & li {
    padding: 0.3vw 0;
    background-color: #ffff;
  }
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
            <div css={dropDownCategories}>
              <div css={dropDownCategoriesTitle}>Découvrez</div>
              <ul css={dropDownList}>
                <li>
                  <a>Nos chaussures minimalistes hommes</a>
                </li>
                <li>
                  <a>Nos chaussures chaussettes</a>
                </li>
                <li>
                  <a>Nos chaussures minimalistre enfants</a>
                </li>
                <li>
                  <a>Nouveautés</a>
                </li>
                <li>
                  <a>Soldes</a>
                </li>
              </ul>
            </div>
            <div>
              <div css={dropDownCategoriesTitle}>Par activités</div>
              <ul>
                <li>
                  <a>Running/Athlétisme</a>
                </li>
                <li>
                  <a>Trail/Outdoor</a>
                </li>
                <li>
                  <a>Fitness/Crossfit</a>
                </li>
                <li>
                  <a>Yoga/Pilate/Danse</a>
                </li>
                <li>
                  <a>Ville</a>
                </li>
              </ul>
            </div>
            <div>
              <div css={dropDownCategoriesTitle}>Marques</div>

              <ul>
                <li>
                  <a>Vibram FiveFingers</a>
                </li>
                <li>
                  <a>Altra</a>
                </li>
                <li>
                  <a>Merell</a>
                </li>
                <li>
                  <a>Xero Shoes</a>
                </li>
                <li>
                  <a>Aylla</a>
                </li>
                <li>
                  <a>Gumbies</a>
                </li>
                <li>
                  <a>Inov-8</a>
                </li>
                <li>
                  <a>Topo</a>
                </li>
                <li>
                  <a>Skinners</a>
                </li>
                <li>
                  <a>Luna Sandals</a>
                </li>
              </ul>
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
