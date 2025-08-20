/** @jsxImportSource @emotion/react */
import { css, keyframes } from "@emotion/react";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";

// ---------- SCHEMAS ----------
const loginSchema = z.object({
  email: z.email("E-mail invalide"),
  password: z.string().min(8, "Mot de passe trop court"),
});

const signupSchema = loginSchema.extend({
  name: z.string().min(2, "Nom requis"),
  accept: z.boolean().refine((val) => val === true, {
    message: "Tu dois accepter les conditions",
  }),
});

// ---------- TYPES ----------
type FormData = {
  email: string;
  password: string;
  name?: string;
  accept?: boolean;
};

export type DrawerAuthProps = {
  open: boolean;
  onClose: () => void;
  onSuccess?: (user: unknown) => void;
  mode: "login" | "signup";
  setMode: (mode: "login" | "signup") => void;
  triggerRef?: React.RefObject<HTMLElement | null>;
};

export default function DrawerAuth({ open, onClose, onSuccess, mode, setMode }: DrawerAuthProps) {
  const [closing, setClosing] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null); // pour restaurer le focus

  // ---------- HOOK FORM ----------
  const schema = mode === "login" ? loginSchema : signupSchema;
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
      accept: false,
    },
  });

  // Reset quand on ouvre ou quand le mode change
  useEffect(() => {
    if (open) {
      setClosing(false);
      setServerError(null);
      reset({ email: "", password: "", name: "", accept: false });

      // focus sur le 1er champ
      setTimeout(() => {
        panelRef.current?.querySelector<HTMLInputElement>("input")?.focus();
      }, 50);
    }
  }, [open, mode, reset]);

  // ---------- SCROLL LOCK ----------
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // ---------- GESTION FERMETURE ----------
  const handleClose = useCallback(() => {
    setClosing(true);
    setTimeout(() => {
      onClose();
      triggerRef.current?.focus(); // restore focus à l’élément déclencheur
    }, 250);
  }, [onClose]);

  // ---------- ESCAPE + FOCUS TRAP ----------
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        handleClose();
      }
      if (e.key === "Tab" && panelRef.current) {
        const focusables = panelRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])');
        const focusArray = Array.from(focusables);
        if (focusArray.length === 0) return;

        const first = focusArray[0];
        const last = focusArray[focusArray.length - 1];
        const active = document.activeElement;

        if (!e.shiftKey && active === last) {
          e.preventDefault();
          first.focus();
        } else if (e.shiftKey && active === first) {
          e.preventDefault();
          last.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, handleClose]);

  // ---------- SUBMIT ----------
  async function onSubmit(values: FormData) {
    try {
      setServerError(null);
      const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/register";

      const { data: user } = await axios.post(endpoint, values, {
        withCredentials: true,
      });

      onSuccess?.(user);
      handleClose();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const msg = (err.response?.data as { message?: string })?.message || "Une erreur est survenue";
        setServerError(msg);
      } else {
        setServerError("Erreur inattendue");
      }
    }
  }

  if (!open) return null;

  return createPortal(
    <div ref={overlayRef} css={styles.overlay} onMouseDown={(e) => e.target === overlayRef.current && handleClose()}>
      <div ref={panelRef} css={styles.drawer(closing)} role="dialog" aria-modal="true">
        <header css={styles.header}>
          <div css={styles.headerTop}>
            <button aria-label="Fermer" css={styles.closeBtn} onClick={handleClose}>
              ×
            </button>
          </div>
          <h2 css={styles.title}>Log In or Create Account</h2>
          <p css={styles.smallMuted}>Saisis ton adresse e-mail et ton mot de passe pour nous rejoindre ou te connecter.</p>
        </header>

        <div css={styles.segment}>
          <button css={styles.tabBtn(mode === "login")} onClick={() => setMode("login")}>
            LOG IN
          </button>
          <button css={styles.tabBtn(mode === "signup")} onClick={() => setMode("signup")}>
            I’M NEW HERE
          </button>
        </div>

        <section css={styles.body}>
          <form onSubmit={handleSubmit(onSubmit)}>
            {mode === "signup" && (
              <div css={styles.field}>
                <label css={styles.label} htmlFor="name">
                  Nom complet
                </label>
                <input css={styles.input} id="name" type="text" placeholder="Prénom et nom" autoComplete="name" {...register("name")} />
                {errors.name && <div css={styles.error}>{errors.name.message}</div>}
              </div>
            )}

            <div css={styles.field}>
              <label css={styles.label} htmlFor="email">
                E-mail
              </label>
              <input css={styles.input} id="email" type="email" placeholder="Adresse e-mail" autoComplete="email" {...register("email")} />
              {errors.email && <div css={styles.error}>{errors.email.message}</div>}
            </div>

            <div css={styles.field}>
              <label css={styles.label} htmlFor="password">
                Password
              </label>
              <input
                css={styles.input}
                id="password"
                type="password"
                placeholder={mode === "signup" ? "Mot de passe (8+ caractères)" : "Mot de passe"}
                autoComplete={mode === "signup" ? "new-password" : "current-password"}
                {...register("password")}
              />
              {errors.password && <div css={styles.error}>{errors.password.message}</div>}
            </div>

            {mode === "signup" && (
              <label css={styles.checkboxRow}>
                <input type="checkbox" {...register("accept")} />
                <span>
                  J’accepte les <a href="/terms">Conditions d’utilisation</a> et la <a href="/privacy">Politique de confidentialité</a>.
                </span>
                {errors.accept && <div css={styles.error}>{errors.accept.message}</div>}
              </label>
            )}

            {serverError && <div css={styles.error}>{serverError}</div>}

            <div css={styles.footer}>
              <button css={styles.primaryBtn} disabled={isSubmitting}>
                {isSubmitting ? <span css={styles.spinner} /> : mode === "login" ? "Log In" : "Create Account"}
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>,
    document.body
  );
}

const overlayFadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const drawerSlideIn = keyframes`
  from { transform: translateX(100%); }
  to { transform: translateX(0%); }
`;

const drawerSlideOut = keyframes`
  from { transform: translateX(0%); }
  to { transform: translateX(100%); }
`;

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

const styles = {
  overlay: css`
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    animation: ${overlayFadeIn} 200ms ease-out;
    display: flex;
    justify-content: flex-end;
    z-index: 50;
  `,
  drawer: (closing: boolean) => css`
    width: min(480px, 95vw);
    height: 100vh;
    background: #fff;
    box-shadow: -6px 0 24px rgba(0, 0, 0, 0.15);
    animation: ${closing ? drawerSlideOut : drawerSlideIn} 260ms cubic-bezier(0.2, 0.8, 0.2, 1);
    display: flex;
    flex-direction: column;
  `,
  header: css`
    display: flex;
    flex-direction: column;
    padding: 24px;
  `,
  headerTop: css`
    width: 100%;
    display: flex;
    justify-content: flex-end;
  `,
  title: css`
    font-weight: 400;
    font-size: 32px;
    line-height: 1.3;
    margin: 70px 0 40px;
  `,
  closeBtn: css`
    position: absolute;
    top: 4px;
    right: 16px;
    appearance: none;
    border: none;
    background: transparent;
    font-size: 64px;
    line-height: 1;
    cursor: pointer;
    color: #c2c2c2ff;
  `,
  segment: css`
    display: grid;
    grid-template-columns: 1fr 1fr;
    margin: 0 24px 12px;
    border-bottom: 3px solid #ddd;
  `,
  tabBtn: (active: boolean) => css`
    appearance: none;
    border: none;
    background: transparent;
    padding: 14px 0;
    font-size: 14px;
    font-weight: 600;
    text-transform: uppercase;
    border-bottom: 3px solid ${active ? "#000" : "transparent"};
    color: ${active ? "#000" : "#888"};
    cursor: pointer;
    margin-bottom: -3px;
  `,
  body: css`
    flex: 1;
    overflow-y: auto;
    padding: 32px 24px 24px; /* ↑ un padding-top plus grand */
    display: flex;
    flex-direction: column;
    gap: 16px;
  `,
  smallMuted: css`
    font-size: 18px;
    color: #313131ff;
    margin-bottom: 60px;
  `,
  field: css`
    display: flex;
    flex-direction: column;
    margin-bottom: 16px;
  `,
  label: css`
    font-size: 13px;
    font-weight: 500;
    color: #444;
    margin-bottom: 4px;
  `,
  input: css`
    width: 100%;
    height: 46px;
    border: 1px solid #ccc;
    border-radius: 6px;
    padding: 0 12px;
    font-size: 15px;
    background: #f8f8f8;
    &::placeholder {
      color: #9aa0a6;
      opacity: 1;
    }
    &:focus {
      border-color: #000;
      outline: none;
    }
  `,
  hintRow: css`
    display: flex;
    justify-content: flex-end;
    margin-top: -4px;
    margin-bottom: 16px;
  `,
  linkBtn: css`
    background: transparent;
    border: none;
    color: #444;
    text-decoration: underline;
    cursor: pointer;
    font-size: 13px;
  `,
  footer: css`
    padding: 60px 0;
  `,
  primaryBtn: css`
    width: 100%;
    height: 52px;
    border: none;
    background: #484848;
    color: #fff;
    border-radius: 8px;
    font-weight: 700;
    font-size: 22px;
    cursor: pointer;
    &:hover {
      background: #1f1f1f;
    }
  `,

  checkboxRow: css`
    display: flex;
    align-items: flex-start;
    gap: 8px;
    margin: 12px 0 16px;
    font-size: 13px;
    line-height: 1.4;
    color: #444;

    input {
      margin-top: 3px;
    }

    a {
      color: #000;
      text-decoration: underline;
    }
  `,
  error: css`
    background: #ffecec;
    color: #b00020;
    font-size: 14px;
    padding: 10px 12px;
    border-radius: 6px;
    margin: 12px 0;
    border: 1px solid #f5c2c2;
  `,
  spinner: css`
    width: 20px;
    height: 20px;
    border: 2px solid rgba(255, 255, 255, 0.6);
    border-top-color: #fff;
    border-radius: 50%;
    animation: ${spin} 0.6s linear infinite;
    margin: auto; /* centre dans le bouton */
    display: block;
  `,
};
