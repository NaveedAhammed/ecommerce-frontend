import { RouterProvider, createBrowserRouter } from "react-router-dom";
import AppLayout from "./AppLayout";
import ProtectedLayout from "./ProtectedLayout";
import PersistLogin from "./components/PersistLogin";
import { lazy } from "react";
import Login from "./pages/Login";

const Home = lazy(() => import("./pages/Home"));
const Details = lazy(() => import("./pages/Details"));
const Profile = lazy(() => import("./pages/Profile"));
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
						path: "/product/:id",
						element: <Details />,
					},
					{
						path: "/products",
						element: <Products />,
					},
					{
						element: <ProtectedLayout />,
						children: [
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
							{
								path: "/myProfile",
								element: <Profile />,
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
