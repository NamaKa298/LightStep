import Band from "./Band";
import InfiniteSlider from "./InfiniteSlider";
import NavBar from "./NavBar";
import ProductsList from "./ProductsList";

function App() {
  return (
    <>
      <Band />
      <NavBar />
      <div className="container">
        <InfiniteSlider />
        <ProductsList />
      </div>
    </>
  );
}

export default App;
