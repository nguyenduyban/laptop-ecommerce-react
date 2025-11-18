import "./App.css";
import React from "react";
import { Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import Loginpage from "./pages/login";
import Signinpage from "./pages/sign_in";
import Homepage from "./pages/homepage";
import ProductDetail from "./pages/detailproduct";
import "bootstrap/dist/css/bootstrap.min.css";
import Adminpage from "./pages/adminpage";
import ProtectedRoute from "./components/ProtectedRoute";
import ProductPage from "./pages/product";
import UserProfile from "./pages/profile";
import CartPage from "./pages/cart";
import CheckoutPage from "./pages/checkout";
import AccountPage from "./pages/editprofile";
import SearchResults from "./pages/searchresult";
import OrderDetailPage from "./pages/detailorder";
import AdminProducts from "./pages/adminproduct";
import AddProduct from "./pages/addproduct";
import ChuyenMucManager from "./pages/admintopic";
import AdminProductUpdate from "./pages/updateproduct";
import AdminHang from "./pages/adminhang";
import AdminDanhMuc from "./pages/admincategories";
import SuccessPage from "./pages/success";
import Chatbot from "./pages/chatbot";
import AdminDonHang from "./pages/admindonhang";
import { GoogleOAuthProvider } from "@react-oauth/google";
import AdminKho from "./pages/adminkho";
import ChatAdmin from "./pages/adminchat";
import "./echo.js";
import AdminComment from "./pages/admincomments.js";
import AdminAccount from "./pages/adminAccount.js";
import AdminAccountDetail from "./pages/adminaccountdetail.js";

function App() {
  return (
    <>
      <GoogleOAuthProvider clientId="43694407933-4gs09vcbhv2f3rm03j04sqt6r0tmkfh6.apps.googleusercontent.com">
        <AuthProvider>
          <Navbar />
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedLoaiTK={[1]}>
                  <Adminpage />
                </ProtectedRoute>
              }
            />
            <Route path="/admin/product" element={<AdminProducts />} />
            <Route path="/admin/product/add" element={<AddProduct />} />

            <Route
              path="/admin/chat"
              element={
                <ProtectedRoute allowedLoaiTK={[1]}>
                  <ChatAdmin />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/product/edit/:masp"
              element={<AdminProductUpdate />}
            />
            <Route path="/admin/comments" element={<AdminComment />} />
            <Route path="/admin/account" element={<AdminAccount />} />
            <Route path="/admin/account/:id" element={<AdminAccountDetail />} />
            <Route path="/admin/order" element={<AdminDonHang />} />
            <Route path="/admin/kho" element={<AdminKho />} />

            <Route path="/admin/brand" element={<AdminHang />} />
            <Route path="/admin/categories" element={<AdminDanhMuc />} />

            <Route path="/admin/topic" element={<ChuyenMucManager />} />

            <Route
              path="/checkout"
              element={
                <ProtectedRoute allowedLoaiTK={[2]}>
                  <CheckoutPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/detailorder/:id"
              element={
                <ProtectedRoute allowedLoaiTK={[2]}>
                  <OrderDetailPage />
                </ProtectedRoute>
              }
            />
            <Route path="/signin" element={<Signinpage />} />
            <Route path="/product" element={<ProductPage />} />
            <Route path="/login" element={<Loginpage />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/editaccount" element={<AccountPage />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/product/:masp" element={<ProductDetail />} />
            <Route path="/thanh-toan-thanh-cong" element={<SuccessPage />} />
          </Routes>
          <Chatbot />
          <Footer />
        </AuthProvider>
      </GoogleOAuthProvider>
    </>
  );
}

export default App;
