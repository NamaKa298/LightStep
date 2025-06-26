import Band from "./Band";
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
      </div>
      <Footer />
    </>
  );
}

export default App;
