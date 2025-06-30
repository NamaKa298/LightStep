import Band from "../../components/Band";
import BestSales from "../../components/BestSales";
import ContactWidget from "../../components/ContactWidget";
import HomeCategoriesPictures from "../../components/HomeCategoriesPictures";
import InfiniteBrandsSlider from "../../components/InfiniteBrandsSlider";
import Footer from "../../components/layout/Footer";
import NavBar from "../../components/NavBar";
import ServicesBanner from "../../components/ServicesBanner";
/** @jsxImportSource @emotion/react */
import styled from "@emotion/styled";

function Home() {
  return (
    <AppContainer>
      <Band />
      <MainContent className="container">
        <NavBar />
        <HomeCategoriesPictures />
        <BestSales />
        <InfiniteBrandsSlider />
        <ContactWidget />
        <ServicesBanner />
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

export default Home;
