import Band from "./Band";
import InfiniteSlider from "./InfiniteSlider";
import NavBar from "./NavBar";

function App() {
  return (
    <>
      <Band />
      <div className="container">
        <NavBar />
        <InfiniteSlider />
      </div>
    </>
  );
}

export default App;
