import Band from "./Band";
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
    </>
  );
}

export default App;
