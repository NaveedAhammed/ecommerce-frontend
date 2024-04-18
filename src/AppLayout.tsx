import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import Loader from "./components/Loader";
import Header from "./components/Header";
import Footer from "./components/Footer";

const AdminLayout = () => {
	return (
		<div className="w-full h-full min-h-[100vh] flex flex-col">
			<Header />
			<main className="w-full max-w-[1400px] mx-auto h-full flex-1 overflow-hidden ssm:relative py-2 md:px-4 px-2 xxxlg:px-0">
				<Suspense
					fallback={
						<Loader
							width="3rem"
							height="3rem"
							color="black"
							className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]"
						/>
					}
				>
					<Outlet />
				</Suspense>
			</main>
			<Footer />
		</div>
	);
};

export default AdminLayout;
