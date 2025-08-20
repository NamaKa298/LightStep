import type { ReactNode } from "react";
import { useAuthDrawerStore } from "../../stores/useAuthDrawerStore";
import Band from "../Band";
import DrawerAuth from "../DrawerAuth";
import Footer from "../Footer";
import Navbar from "../Navbar";

type MainLayoutProps = {
  children: ReactNode;
  withContainer?: boolean;
};

export default function MainLayout({ children, withContainer = false }: MainLayoutProps) {
  const { open, mode, setOpen, setMode } = useAuthDrawerStore();

  return (
    <>
      <Band />
      <div className="container">
        <Navbar />
      </div>
      <main className={withContainer ? "container" : ""}>{children}</main>
      <Footer />
      <DrawerAuth
        open={open}
        onClose={() => setOpen(false)}
        onSuccess={(user) => {
          console.log("Utilisateur connecté :", user);
          setOpen(false);
        }}
        mode={mode}
        setMode={setMode}
      />
    </>
  );
}
