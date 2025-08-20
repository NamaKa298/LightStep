import type { ReactNode } from "react";
import { useState } from "react";
import Band from "../Band";
import DrawerAuth from "../DrawerAuth";
import Footer from "../Footer";
import Navbar from "../Navbar";

type MainLayoutProps = {
  children: ReactNode;
  withContainer?: boolean;
};

export default function MainLayout({ children, withContainer = false }: MainLayoutProps) {
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");

  return (
    <>
      <Band
        onAuthClick={(mode) => {
          setAuthMode(mode);
          setAuthOpen(true);
        }}
      />
      <div className="container">
        <Navbar />
      </div>
      <main className={withContainer ? "container" : ""}>{children}</main>
      <Footer />
      <DrawerAuth
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        onSuccess={(user) => {
          console.log("Utilisateur connecté :", user);
          setAuthOpen(false);
        }}
        defaultMode={authMode}
      />
    </>
  );
}
