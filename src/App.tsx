import { RouterProvider, createBrowserRouter } from "react-router-dom";
import AppLayout from "./AppLayout";
import ProtectedLayout from "./ProtectedLayout";
import PersistLogin from "./components/PersistLogin";
import { lazy } from "react";
import Login from "./pages/Login";
import Details from "./pages/Details";

const Home = lazy(() => import("./pages/Home"));
const Products = lazy(() => import("./pages/Products"));
const Wishlist = lazy(() => import("./pages/Wishlist"));
const Orders = lazy(() => import("./pages/Orders"));
const Cart = lazy(() => import("./pages/Cart"));

const router = createBrowserRouter([
	{
		element: <PersistLogin />,
		children: [
			{
				element: <AppLayout />,
				children: [
					{
						path: "/",
						element: <Home />,
					},
					{
						element: <ProtectedLayout />,
						children: [
							{
								path: "/product/:id",
								element: <Details />,
							},
							{
								path: "/products",
								element: <Products />,
							},
							{
								path: "/wishlist",
								element: <Wishlist />,
							},
							{
								path: "/orders",
								element: <Orders />,
							},
							{
								path: "/cart",
								element: <Cart />,
							},
						],
					},
				],
			},
			{
				path: "login",
				element: <Login />,
			},
		],
	},
]);

const App = () => {
	return <RouterProvider router={router} />;
};

export default App;
