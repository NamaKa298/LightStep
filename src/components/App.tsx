import Band from "./Band";
import ContactWidget from "./ContactWidget";
import Footer from "./Footer";
import HomeCategoriesPictures from "./HomeCategoriesPictures";
import InfiniteBrandsSlider from "./InfiniteBrandsSlider";
import NavBar from "./NavBar";

function App() {
  return (
    <>
      <Band />
      <div className="container">
        <NavBar />
        <HomeCategoriesPictures />
        <InfiniteBrandsSlider />
        <ContactWidget />
      </div>
      <Footer />
    </>
  );
}

export default App;
