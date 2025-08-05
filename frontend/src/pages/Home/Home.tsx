import Band from "../../components/Band";
import BestSales from "../../components/BestSales";
import ContactWidget from "../../components/ContactWidget";
import HomeCategoriesPictures from "../../components/HomeCategoriesPictures";
import InfiniteBrandsSlider from "../../components/InfiniteBrandsSlider";
import Footer from "../../components/layout/Footer";
import NavBar from "../../components/NavBar";
import ProductsList from "../../components/ProductsList";
import ServicesBanner from "../../components/ServicesBanner";
import AddBanner from "./AddBanner";

function App() {
  return (
    <>
      <Band />
      <div className="container">
        <NavBar />
        <AddBanner />
        <HomeCategoriesPictures />
        <BestSales />
        <ProductsList />
        <InfiniteBrandsSlider />
        <ContactWidget />
        <ServicesBanner />
      </div>
      <Footer />
    </>
  );
}

export default App;
