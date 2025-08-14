/** @jsxImportSource @emotion/react */
import Band from "../../components/Band";
import ContactWidget from "../../components/ContactWidget";
import Footer from "../../components/layout/Footer";
import NavBar from "../../components/NavBar";
import ProductsList from "../../components/ProductsList";
import Filter from "../../components/Filter";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { useState } from "react";

const content = css`
  display: flex;
  flex-direction: row;
`;

function ShoppingList() {
  const [currentFilters, setCurrentFilters] = useState({
    brands: [] as string[],
    genders: [] as string[],
    sizes: [] as number[],
    minPrice: "",
    maxPrice: "",
    ground_types: [] as string[],
    uses: [] as string[],
    stabilities: [] as string[],
    dropMin: "",
    dropMax: "",
    weightMin: "",
    weightMax: "",
    colors: [] as string[],
  });

  const handleFilterChange = (filters: typeof currentFilters) => {
    setCurrentFilters(filters);
  };

  return (
    <AppContainer>
      <Band />
      <MainContent className="container">
        <NavBar />
        <ContactWidget />
        <div css={content}>
          <Filter onFilterChange={handleFilterChange} />
          <ProductsList filters={currentFilters} />
        </div>
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
