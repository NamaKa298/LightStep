import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home/Home.tsx";
import ShoppingList from "./pages/Products/ShoppingList.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/nouvelle-page",
    element: <ShoppingList />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
