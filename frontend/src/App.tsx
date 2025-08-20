import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home.tsx";
import ShoppingList from "./pages/ShoppingList.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/ShoppingList",
    element: <ShoppingList />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
