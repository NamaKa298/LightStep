import Band from "./Band";
import InfiniteSlider from "./InfiniteSlider";
import NavBar from "./NavBar";

function App() {
  return (
    <>
      <Band />
      <NavBar />
      <div className="container">
        <InfiniteSlider />
      </div>
    </>
  );
}

export default App;
