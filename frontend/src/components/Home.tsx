import Band from "./Band";
import InfiniteBrandsSlider from "./InfiniteBrandsSlider";
import NavBar from "./NavBar";
import ProductsList from "./ProductsList";

function Home() {
  return (
    <>
      <Band />
      <NavBar />
      <div className="container">
        <ProductsList />
        <InfiniteBrandsSlider />
      </div>
    </>
  );
}

export default Home;
