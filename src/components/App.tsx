import Band from "./Band";
import InfiniteBrandsSlider from "./InfiniteBrandsSlider";
import NavBar from "./NavBar";
import HomeCategoriesPictures from "./HomeCategoriesPictures";

function App() {
  return (
    <>
      <Band />
      <NavBar />
      <div className="container">
        <HomeCategoriesPictures />
        <InfiniteBrandsSlider />
      </div>
    </>
  );
}

export default App;
