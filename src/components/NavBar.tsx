/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { BsBookmarkFill } from "react-icons/bs";
import { FaBasketShopping } from "react-icons/fa6";
import { IoPersonSharp } from "react-icons/io5";
import logo from "../assets/LightStep_logo.webp";

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
    text-underline-offset: 0.7vw;
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
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px 0px;
`;

const navBarLogo = css`
  width: 102.18px;
  height: 96px;
`;

const dropDownNavbarLinks = css`
  font-family: "Montserra", sans-serif;
  position: absolute;
  width: 100vw;
  display: none;
  flex-direction: row;
  font-size: 16px;
  font-weight: 400;
  justify-content: space-between;
  padding: 1vw var(--global-margin);
  background-color: #ffff;
  z-index: 1000;
  top: calc(100% - 20px);
  left: calc(-1 * var(--global-margin));

  &::before {
    content: "";
    position: absolute;
    top: -20px;
    left: 0;
    width: 100%;
    height: 20px;
    background: transparent;
  }
`;
const dropdownWrapper = css`
  position: static;
  &:hover > div {
    display: flex;
  }
  &:hover > a,
  & > div:hover + a {
    color: #004e36;
    text-decoration: underline;
    text-underline-offset: 1vw;
    text-decoration-thickness: 5px;
  }
`;
const dropDownCategoriesTitle = css`
  font-weight: 600;
  font-size: 20px;
  padding: 1vw 0;
  background-color: #ffff;
`;

const dropDownCategories = css`
  background-color: #ffff;
`;

const dropDownUnorderList = css`
  list-style: none;
`;

const navBarSelection = css`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  position: relative;
`;

const dropDownList = css`
  background-color: #ffff;
  padding: 0.3vw 0;
  a {
    background-color: #ffff;
    text-decoration: none;
    color: black;
    &:hover {
      color: #004e36;
    }
  }
`;

const brandColumns = css`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const brandColumn = css`
  display: flex;
  flex-direction: column;
  padding-left: 5vw;
  background-color: #ffff;
`;

function NavBar() {
  return (
    <div css={navBarContainer}>
      <div css={navBarSelection}>
        <img src={logo} css={navBarLogo} alt="Vite logo" />
        <div css={Title1}>LightStep</div>
        <ul css={UnorderedListLinks}>
          <li>
            <a css={navbarLinks} href="#news">
              Nouveautés
            </a>
          </li>
          <li css={dropdownWrapper}>
            <a css={navbarLinks} href="#woman">
              Femme
            </a>
            <div css={dropDownNavbarLinks}>
              <div css={dropDownCategories}>
                <div css={dropDownCategoriesTitle}>Découvrez</div>
                <ul css={dropDownUnorderList}>
                  <li css={dropDownList}>
                    <a href="#">Nos chaussures minimalistes femmes</a>
                  </li>
                  <li css={dropDownList}>
                    <a href="#">Nos chaussures chaussettes</a>
                  </li>
                  <li css={dropDownList}>
                    <a href="#">Nos chaussures minimalistre enfants</a>
                  </li>
                  <li css={dropDownList}>
                    <a href="#">Nouveautés</a>
                  </li>
                  <li css={dropDownList}>
                    <a href="#">Soldes</a>
                  </li>
                </ul>
              </div>
              <div css={dropDownCategories}>
                <div css={dropDownCategoriesTitle}>Par activités</div>
                <ul css={dropDownUnorderList}>
                  <li css={dropDownList}>
                    <a href="#">Running / Athlétisme</a>
                  </li>
                  <li css={dropDownList}>
                    <a href="#">Trail / Outdoor</a>
                  </li>
                  <li css={dropDownList}>
                    <a href="#">Fitness / Crossfit</a>
                  </li>
                  <li css={dropDownList}>
                    <a href="#">Yoga / Pilate / Danse</a>
                  </li>
                  <li css={dropDownList}>
                    <a href="#">Ville</a>
                  </li>
                </ul>
              </div>
              <div css={dropDownCategories}>
                <div
                  css={[
                    dropDownCategoriesTitle,
                    css`
                      padding-left: 5vw;
                    `,
                  ]}
                >
                  Marques
                </div>
                <ul css={dropDownUnorderList}>
                  <div css={brandColumns}>
                    <div css={brandColumn}>
                      <li css={dropDownList}>
                        <a href="#">Vibram FiveFingers</a>
                      </li>
                      <li css={dropDownList}>
                        <a href="#">Altra</a>
                      </li>
                      <li css={dropDownList}>
                        <a href="#">Merell</a>
                      </li>
                      <li css={dropDownList}>
                        <a href="#">Xero Shoes</a>
                      </li>
                      <li css={dropDownList}>
                        <a href="#">Aylla</a>
                      </li>
                    </div>
                    <div css={brandColumn}>
                      <li css={dropDownList}>
                        <a href="#">Gumbies</a>
                      </li>
                      <li css={dropDownList}>
                        <a href="#">Inov-8</a>
                      </li>
                      <li css={dropDownList}>
                        <a href="#">Topo</a>
                      </li>
                      <li css={dropDownList}>
                        <a href="#">Skinners</a>
                      </li>
                      <li css={dropDownList}>
                        <a href="#">Luna Sandals</a>
                      </li>
                    </div>
                  </div>
                </ul>
              </div>
            </div>
          </li>
          <li css={dropdownWrapper}>
            <a css={navbarLinks} href="#man">
              Homme
            </a>
            <div css={dropDownNavbarLinks}>
              <div css={dropDownCategories}>
                <div css={dropDownCategoriesTitle}>Découvrez</div>
                <ul css={dropDownUnorderList}>
                  <li css={dropDownList}>
                    <a href="#">Nos chaussures minimalistes hommes</a>
                  </li>
                  <li css={dropDownList}>
                    <a href="#">Nos chaussures chaussettes</a>
                  </li>
                  <li css={dropDownList}>
                    <a href="#">Nos chaussures minimalistre enfants</a>
                  </li>
                  <li css={dropDownList}>
                    <a href="#">Nouveautés</a>
                  </li>
                  <li css={dropDownList}>
                    <a href="#">Soldes</a>
                  </li>
                </ul>
              </div>
              <div css={dropDownCategories}>
                <div css={dropDownCategoriesTitle}>Par activités</div>
                <ul css={dropDownUnorderList}>
                  <li css={dropDownList}>
                    <a href="#">Running / Athlétisme</a>
                  </li>
                  <li css={dropDownList}>
                    <a href="#">Trail / Outdoor</a>
                  </li>
                  <li css={dropDownList}>
                    <a href="#">Fitness / Crossfit</a>
                  </li>
                  <li css={dropDownList}>
                    <a href="#">Yoga / Pilate / Danse</a>
                  </li>
                  <li css={dropDownList}>
                    <a href="#">Ville</a>
                  </li>
                </ul>
              </div>
              <div css={dropDownCategories}>
                <div
                  css={[
                    dropDownCategoriesTitle,
                    css`
                      padding-left: 5vw;
                    `,
                  ]}
                >
                  Marques
                </div>
                <ul css={dropDownUnorderList}>
                  <div css={brandColumns}>
                    <div css={brandColumn}>
                      <li css={dropDownList}>
                        <a href="#">Vibram FiveFingers</a>
                      </li>
                      <li css={dropDownList}>
                        <a href="#">Altra</a>
                      </li>
                      <li css={dropDownList}>
                        <a href="#">Merell</a>
                      </li>
                      <li css={dropDownList}>
                        <a href="#">Xero Shoes</a>
                      </li>
                      <li css={dropDownList}>
                        <a href="#">Aylla</a>
                      </li>
                    </div>
                    <div css={brandColumn}>
                      <li css={dropDownList}>
                        <a href="#">Gumbies</a>
                      </li>
                      <li css={dropDownList}>
                        <a href="#">Inov-8</a>
                      </li>
                      <li css={dropDownList}>
                        <a href="#">Topo</a>
                      </li>
                      <li css={dropDownList}>
                        <a href="#">Skinners</a>
                      </li>
                      <li css={dropDownList}>
                        <a href="#">Luna Sandals</a>
                      </li>
                    </div>
                  </div>
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
    </div>
  );
}

export default NavBar;
