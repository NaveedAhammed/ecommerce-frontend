import {
	Navigate,
	RouterProvider,
	createBrowserRouter,
} from "react-router-dom";
import AppLayout from "./AppLayout";
import ProtectedLayout from "./ProtectedLayout";
import PersistLogin from "./components/PersistLogin";
import { lazy } from "react";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";

const Home = lazy(() => import("./pages/Home"));
const Details = lazy(() => import("./pages/Details"));
const Profile = lazy(() => import("./pages/Profile"));
const Products = lazy(() => import("./pages/Products"));
const Wishlist = lazy(() => import("./pages/Wishlist"));
const Orders = lazy(() => import("./pages/Orders"));
const Cart = lazy(() => import("./pages/Cart"));
const Info = lazy(() => import("./pages/Info"));
const ManageAddresses = lazy(() => import("./pages/ManageAddresses"));
const Checkout = lazy(() => import("./pages/Checkout"));

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
						path: "product/:id",
						element: <Details />,
					},
					{
						path: "products",
						element: <Products />,
					},
					{
						element: <ProtectedLayout />,
						children: [
							{
								path: "cart",
								element: <Cart />,
							},
							{
								path: "checkout",
								element: <Checkout />,
							},
							{
								path: "myProfile",
								element: <Profile />,
								children: [
									{
										index: true,
										element: <Navigate to="info" replace />,
									},
									{
										path: "info",
										element: <Info />,
									},
									{
										path: "wishlist",
										element: <Wishlist />,
									},
									{
										path: "orders",
										element: <Orders />,
									},
									{
										path: "addresses",
										element: <ManageAddresses />,
									},
								],
							},
						],
					},
				],
			},
			{
				path: "login",
				element: <Login />,
			},
			{
				path: "register",
				element: <Register />,
			},
			{
				path: "forgotPassword",
				element: <ForgotPassword />,
			},
			{
				path: "password/reset/:token",
				element: <ResetPassword />,
			},
		],
	},
]);

const App = () => {
	return <RouterProvider router={router} />;
};

export default App;
