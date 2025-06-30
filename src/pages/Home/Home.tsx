import Band from "../../components/Band";
import BestSales from "../../components/BestSales";
import ContactWidget from "../../components/ContactWidget";
import Footer from "../../components/Footer";
import HomeCategoriesPictures from "../../components/HomeCategoriesPictures";
import InfiniteBrandsSlider from "../../components/InfiniteBrandsSlider";
import NavBar from "../../components/NavBar";
import ProductsList from "../../components/ProductsList";
import ServicesBanner from "../../components/ServicesBanner";

function App() {
  return (
    <>
      <Band />
      <div className="container">
        <NavBar />
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
