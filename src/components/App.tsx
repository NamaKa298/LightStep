import Band from "./Band";
import BestSales from "./BestSales";
import ContactWidget from "./ContactWidget";
import Footer from "./Footer";
import HomeCategoriesPictures from "./HomeCategoriesPictures";
import InfiniteBrandsSlider from "./InfiniteBrandsSlider";
import NavBar from "./NavBar";
import ServicesBanner from "./ServicesBanner";

function App() {
  return (
    <>
      <Band />
      <div className="container">
        <NavBar />
        <HomeCategoriesPictures />
        <BestSales />
        <InfiniteBrandsSlider />
        <ContactWidget />
        <ServicesBanner />
      </div>
      <Footer />
    </>
  );
}

export default App;
