import Band from "./Band";
import HomeCategoriesPictures from "./HomeCategoriesPictures";
import InfiniteBrandsSlider from "./InfiniteBrandsSlider";
import NavBar from "./NavBar";
import Footer from "./Footer";

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
