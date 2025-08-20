/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

type BandProps = {
  onAuthClick: (mode: "login" | "signup") => void;
};

export default function Band({ onAuthClick }: BandProps) {
  return (
    <div css={band}>
      <div css={bandText}>Livraison gratuite partout en france à partir de 120€ d'achat</div>
      <ul css={bandUnorderListSelect}>
        <li css={bandSelect}>
          <a css={bandLinks} onClick={() => onAuthClick("login")}>
            Se connecter
          </a>
        </li>
        <li css={bandSelect}>
          <a css={bandLinks} onClick={() => onAuthClick("signup")}>
            S'inscrire
          </a>
        </li>
      </ul>
    </div>
  );
}

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
  margin-left: var(--global-margin);
  background-color: #2b6a62;
`;

const bandSelect = css`
  background-color: #2b6a62;
`;

const bandLinks = css`
  color: white;
  text-decoration: none;
  background-color: #2b6a62;
  cursor: pointer;
`;

const bandUnorderListSelect = css`
  background-color: #2b6a62;
  display: flex;
  gap: 16px;
  list-style: none;
  margin-right: var(--global-margin);
`;
