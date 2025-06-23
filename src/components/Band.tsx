/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

const band = css`
  background-color: #2b6a62;
  color: white;
  font-family: "Manuale", sans-serif;
  font-size: 12px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0px;
`;

const bandText = css`
  margin-left: 5vw;
  background-color: #2b6a62;
`;

const bandSelect = css`
  background-color: #2b6a62;
`;

const bandLinks = css`
  color: white;
  text-decoration: none;
  background-color: #2b6a62;
`;

const bandUnorderListSelect = css`
  background-color: #2b6a62;
  display: flex;
  gap: 16px;
  list-style: none;
  margin-right: 5vw;
`;

export default function Band() {
  return (
    <div css={band}>
      <div css={bandText}>
        Livraison gratuite partout en france à partir de 120€ d'achat
      </div>
      <ul css={bandUnorderListSelect}>
        <li css={bandSelect}>
          <a css={bandLinks} href="#connection">
            Se connecter
          </a>
        </li>
        <li css={bandSelect}>
          <a css={bandLinks} href="#identification">
            S'identifier
          </a>
        </li>
      </ul>
    </div>
  );
}
