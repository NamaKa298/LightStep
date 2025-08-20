import AddBanner from "../components/AddBanner";
import BestSales from "../components/BestSales";
import ContactWidget from "../components/ContactWidget";
import HomeCategoriesPictures from "../components/HomeCategoriesPictures";
import InfiniteBrandsSlider from "../components/InfiniteBrandsSlider";
import MainLayout from "../components/layout/MainLayout"; // <-- importe ton layout
import ServicesBanner from "../components/ServicesBanner";

function HomePage() {
  return (
    <MainLayout withContainer>
      <main>
        <AddBanner />
        <HomeCategoriesPictures />
        <BestSales />
        <InfiniteBrandsSlider />
        <ContactWidget />
        <ServicesBanner />
      </main>
    </MainLayout>
  );
}

export default HomePage;
