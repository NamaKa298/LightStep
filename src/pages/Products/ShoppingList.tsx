import Band from "../../components/Band";
import ContactWidget from "../../components/ContactWidget";
import Footer from "../../components/layout/Footer";
import NavBar from "../../components/NavBar";
import Filter from "../../components/Filter";
/** @jsxImportSource @emotion/react */
import styled from "@emotion/styled";

function ShoppingList() {
  return (
    <AppContainer>
      <Band />
      <MainContent className="container">
        <NavBar />
        <ContactWidget />
        <Filter />
      </MainContent>
      <Footer />
    </AppContainer>
  );
}

const AppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const MainContent = styled.main`
  flex: 1;
`;

export default ShoppingList;
