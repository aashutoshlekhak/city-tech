import { Outlet } from "react-router-dom";
import { Nav } from "../components/Navbar/Nav";
import { Footer } from "../components/Footer/Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Layout.css";

export const Layout = () => {
  return (
    <>
      <div className="app">
        <Nav />
        <Outlet />
        <Footer />
      </div>

      {/* This toast container is used to show response of the api as a notification at the top right of the page */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        pauseOnHover
        theme="light"
        transition:Bounce
      />
    </>
  );
};
