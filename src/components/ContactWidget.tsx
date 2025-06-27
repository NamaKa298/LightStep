/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import axios from "axios";
import React, { useState } from "react";
import { HiChatBubbleLeftRight } from "react-icons/hi2";
interface FormData {
  name: string;
  email: string;
  message: string;
}

const ContactWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(null);

  const toggleWidget = () => setIsOpen(!isOpen);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Remplacez cette URL par votre endpoint API
      await axios.post("/api/contact", formData);
      setSubmitStatus("success");
      setFormData({ name: "", email: "", message: "" });
      // Fermer le widget après 3 secondes
      setTimeout(() => setIsOpen(false), 3000);
    } catch (error) {
      console.error("Erreur lors de l'envoi du formulaire:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div css={widgetContainerStyle}>
      {isOpen && (
        <div css={formContainerStyle}>
          <h3 css={formTitleStyle}>Contactez-nous</h3>

          {submitStatus === "success" ? (
            <div css={successMessageStyle}>Merci pour votre message! Nous vous répondrons bientôt.</div>
          ) : submitStatus === "error" ? (
            <div css={errorMessageStyle}>Une erreur est survenue. Veuillez réessayer plus tard.</div>
          ) : (
            <form onSubmit={handleSubmit} css={formStyle}>
              <div css={inputGroupStyle}>
                <label htmlFor="name">Nom</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  css={inputStyle}
                  placeholder="Nom"
                />
              </div>

              <div css={inputGroupStyle}>
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  css={inputStyle}
                  placeholder="email"
                />
              </div>

              <div css={inputGroupStyle}>
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={4}
                  css={textareaStyle}
                  placeholder="Message"
                />
              </div>

              <button type="submit" disabled={isSubmitting} css={submitButtonStyle}>
                {isSubmitting ? "Envoi en cours..." : "Envoyer"}
              </button>
            </form>
          )}
        </div>
      )}

      <button onClick={toggleWidget} css={toggleButtonStyle}>
        {isOpen ? "×" : <HiChatBubbleLeftRight size={36} />}
      </button>
    </div>
  );
};

// Styles avec Emotion
const widgetContainerStyle = css`
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
`;

const toggleButtonStyle = css`
  background-color: #007753;
  color: #f5f5f5;
  border: none;
  border-radius: 40%;
  width: 60px;
  height: 60px;
  font-size: 16px;
  cursor: pointer;
  box-shadow: 0 0 6px #004e36;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background-color: #004e36;
    transform: scale(1.05);
  }
`;

const formContainerStyle = css`
  background: #f7f7f7;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  padding: 20px;
  width: 300px;
  margin-bottom: 15px;
  animation: slide-up 0.3s ease;
  font-family: "Montserra", sans-serif;

  @keyframes slide-up {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const formTitleStyle = css`
  margin-top: 0;
  margin-bottom: 20px;
  color: #333;
  font-size: 18px;
`;

const formStyle = css`
  display: flex;
  flex-direction: column;
  gap: 15px;
  font-size: 13px;
`;

const inputGroupStyle = css`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const inputStyle = css`
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  &::placeholder {
    color: #adadadcf;
    font-size: 13px;
  }

  &:focus {
    outline: none;
    border-color: #004e36;
  }
`;

const textareaStyle = css`
  ${inputStyle};
  resize: vertical;
`;

const submitButtonStyle = css`
  background-color: #004e36;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #004e36;
  }

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const successMessageStyle = css`
  color: #28a745;
  padding: 10px;
  background-color: #f8f9fa;
  border-radius: 4px;
  text-align: center;
`;

const errorMessageStyle = css`
  color: #dc3545;
  padding: 10px;
  background-color: #f8f9fa;
  border-radius: 4px;
  text-align: center;
`;

export default ContactWidget;
