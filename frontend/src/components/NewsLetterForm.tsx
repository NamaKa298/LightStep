/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import styled from "@emotion/styled";

import axios from "axios";
import type { ChangeEvent, FormEvent } from "react";
import { useState } from "react";

const NewsLetterForm = styled.form`
  display: flex;
  gap: 8px;
  width: 100%;
  margin: 1em 0;
`;

const NewsLetterFormInput = css`
  flex-grow: 1;
  padding: 8px 12px;
  border: 1px solid #bbbbbb;
  border-radius: 4px;
  font-size: 14px;
  color: #00000094;

  &:focus {
    background-color: #f8f9fa;
    box-shadow: 0 0 6px #028a61;
    transition: all 0.1s ease;
    outline: 1px solid #004e36;
  }
`;

const NewsLetterFormButton = css`
  padding: 0 12px;
  border-radius: 4px;
  cursor: pointer;
  transition: opacity 0.2s;
  border: 1px solid #00000083;
  color: #000000ae;
`;

function NewsletterForm() {
  const [email, setEmail] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);

    try {
      await axios.post("/api/newsletter", { email });
      setEmail("");
    } catch (error) {
      console.error("Erreur d'inscription:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <NewsLetterForm onSubmit={handleSubmit} className="newsletter-form">
      <input
        css={NewsLetterFormInput}
        type="email"
        value={email}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
        placeholder="Enter your email"
        required
      />
      <button css={NewsLetterFormButton} type="submit" disabled={isLoading}>
        {isLoading ? "..." : "Sign Up"}
      </button>
    </NewsLetterForm>
  );
}

export default NewsletterForm;
