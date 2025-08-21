/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useRef } from "react";
import api from "../api/api";
import { useAuthDrawerStore } from "../stores/useAuthDrawerStore";
import { useAuthStore } from "../stores/useAuthStore";

export default function Band() {
  const setOpen = useAuthDrawerStore((s) => s.setOpen);
  const setMode = useAuthDrawerStore((s) => s.setMode);
  const user = useAuthStore((s) => s.user);
  const clearAuth = useAuthStore((s) => s.clearAuth);

  const loginBtnRef = useRef<HTMLButtonElement>(null);
  const signupBtnRef = useRef<HTMLButtonElement>(null);

  async function handleLogout() {
    try {
      await api.post("api/auth/logout", {}, { withCredentials: true }); // invalide le refresh côté serveur
    } catch (err) {
      console.error("Erreur logout :", err);
    }
    clearAuth();
  }

  return (
    <div css={band}>
      <div css={bandText}>Livraison gratuite partout en france à partir de 120€ d'achat</div>

      <ul css={bandUnorderListSelect}>
        {!user ? (
          <>
            <li css={bandSelect}>
              <button
                ref={loginBtnRef}
                css={bandLinks}
                onClick={() => {
                  setMode("login");
                  setOpen(true);
                }}
              >
                Se connecter
              </button>
            </li>
            <li css={bandSelect}>
              <button
                ref={signupBtnRef}
                css={bandLinks}
                onClick={() => {
                  setMode("signup");
                  setOpen(true);
                }}
              >
                S'inscrire
              </button>
            </li>
          </>
        ) : (
          <li css={bandSelect}>
            <button css={bandLinks} onClick={handleLogout}>
              Se déconnecter
            </button>
          </li>
        )}
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
  border: none;
`;

const bandUnorderListSelect = css`
  background-color: #2b6a62;
  display: flex;
  gap: 16px;
  list-style: none;
  margin-right: var(--global-margin);
`;
