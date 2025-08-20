/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import ContactWidget from "../components/ContactWidget";
import Filter from "../components/Filter";
import ProductsList from "../components/ProductsList";
import MainLayout from "../components/layout/MainLayout";

const content = css`
  display: flex;
  flex-direction: row;
`;

function ShoppingList() {
  return (
    <MainLayout>
      <AppContainer>
        <MainContent className="container">
          <ContactWidget />
          <div css={content}>
            <Filter onFilterChange={(filters) => console.log(filters)} />
            <ProductsList />
          </div>
        </MainContent>
      </AppContainer>
    </MainLayout>
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
