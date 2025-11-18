import React, { useState, useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import "../components/css/dashboard.css";

import AdminProducts from "./adminproduct";
import ChuyenMucManager from "./admintopic";
import AdminDanhMuc from "./admincategories";
import AdminHang from "./adminhang";
import AdminDonHang from "./admindonhang";
import ChatAdmin from "./adminchat";
import AdminKho from "./adminkho";
import AdminAccount from "./adminAccount";
import AdminComment from "./admincomments";

const Adminpage = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const barChartRef = useRef(null);
  const pieChartRef = useRef(null);
  const barChartInstance = useRef(null);
  const pieChartInstance = useRef(null);

  // Mock data động
  const [stats, setStats] = useState({
    revenue: 0,
    products: 0,
    orders: 0,
    users: 0,
  });

  useEffect(() => {
    // Animate stats
    const targets = {
      revenue: 125000000,
      products: 342,
      orders: 89,
      users: 1204,
    };
    const duration = 2000;
    const steps = 60;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      setStats({
        revenue: Math.floor(targets.revenue * progress),
        products: Math.floor(targets.products * progress),
        orders: Math.floor(targets.orders * progress),
        users: Math.floor(targets.users * progress),
      });
      if (currentStep >= steps) clearInterval(timer);
    }, duration / steps);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (activeTab !== "dashboard") return;

    const ctxBar = barChartRef.current?.getContext("2d");
    const ctxPie = pieChartRef.current?.getContext("2d");
    if (!ctxBar || !ctxPie) return;

    barChartInstance.current?.destroy();
    pieChartInstance.current?.destroy();

    // Doanh thu tuần
    barChartInstance.current = new Chart(ctxBar, {
      type: "bar",
      data: {
        labels: ["T2", "T3", "T4", "T5", "T6", "T7", "CN"],
        datasets: [
          {
            label: "Doanh thu (triệu ₫)",
            data: [12, 19, 15, 25, 18, 22, 30],
            backgroundColor: "rgba(0, 123, 255, 0.8)",
            borderColor: "#007bff",
            borderWidth: 1,
            borderRadius: 10,
            borderSkipped: false,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: "rgba(0,0,0,0.8)",
            cornerRadius: 8,
          },
        },
        scales: {
          y: { beginAtZero: true, grid: { display: false } },
          x: { grid: { display: false } },
        },
      },
    });

    // Nguồn truy cập
    pieChartInstance.current = new Chart(ctxPie, {
      type: "doughnut",
      data: {
        labels: ["Website", "Facebook", "Zalo", "Google"],
        datasets: [
          {
            data: [45, 25, 20, 10],
            backgroundColor: ["#007bff", "#17a2b8", "#20c997", "#ffc107"],
            borderWidth: 4,
            borderColor: "#fff",
            hoverBorderWidth: 6,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "bottom",
            labels: { padding: 20, font: { size: 12 } },
          },
        },
        cutout: "70%",
      },
    });

    return () => {
      barChartInstance.current?.destroy();
      pieChartInstance.current?.destroy();
    };
  }, [activeTab]);

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="fade-in">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4 className="fw-bold text-primary mb-0">
                <i className="fa-solid fa-chart-line me-2"></i>
                Dashboard Tổng Quan
              </h4>
              <span className="text-muted small">
                Cập nhật: {new Date().toLocaleString("vi-VN")}
              </span>
            </div>

            {/* Stats Cards */}
            <div className="row g-4 mb-5">
              {[
                {
                  icon: "fa-sack-dollar",
                  label: "Doanh thu",
                  value: stats.revenue.toLocaleString("vi-VN") + "đ",
                  color: "success",
                },
                {
                  icon: "fa-box",
                  label: "Sản phẩm",
                  value: stats.products,
                  color: "primary",
                },
                {
                  icon: "fa-shopping-cart",
                  label: "Đơn hàng",
                  value: stats.orders,
                  color: "warning",
                },
                {
                  icon: "fa-users",
                  label: "Khách hàng",
                  value: stats.users,
                  color: "info",
                },
              ].map((item, i) => (
                <div className="col-lg-3 col-md-6" key={i}>
                  <div
                    className={`card border-0 shadow-sm h-100 bg-gradient text-white bg-${item.color}`}
                  >
                    <div className="card-body d-flex align-items-center">
                      <div className="flex-grow-1">
                        <h5 className="mb-1">{item.value}</h5>
                        <p className="mb-0 small opacity-75">{item.label}</p>
                      </div>
                      <i
                        className={`fa-solid ${item.icon} fa-2x opacity-50`}
                      ></i>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Charts */}
            <div className="row g-4">
              <div className="col-lg-8">
                <div className="card border-0 shadow-sm rounded-4 h-100">
                  <div className="card-body">
                    <h6 className="fw-bold text-primary mb-3">
                      <i className="fa-solid fa-chart-column me-2"></i>
                      Doanh thu tuần này
                    </h6>
                    <div style={{ height: "300px" }}>
                      <canvas ref={barChartRef}></canvas>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-4">
                <div className="card border-0 shadow-sm rounded-4 h-100">
                  <div className="card-body">
                    <h6 className="fw-bold text-primary mb-3">
                      <i className="fa-solid fa-pie-chart me-2"></i>
                      Nguồn truy cập
                    </h6>
                    <div style={{ height: "300px" }}>
                      <canvas ref={pieChartRef}></canvas>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case "taikhoan":
        return <AdminAccount />;
      case "binhluan":
        return <AdminComment />;
      case "hang":
        return <AdminHang />;
      case "chuyenmuc":
        return <ChuyenMucManager />;
      case "danhmuc":
        return <AdminDanhMuc />;
      case "sanpham":
        return <AdminProducts />;
      case "donhang":
        return <AdminDonHang />;
      case "chat":
        return <ChatAdmin />;
      case "kho":
        return <AdminKho />;
      default:
        return <p className="text-muted">Chọn chức năng ở thanh bên trái.</p>;
    }
  };

  return (
    <div className="d-flex bg-light" style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <aside
        className={`d-flex flex-column p-3 shadow-lg bg-white border-end position-sticky top-0 transition-all ${
          sidebarOpen ? "w-270" : "w-70"
        }`}
        style={{
          minHeight: "100vh",
          zIndex: 10,
          transition: "width 0.3s ease",
        }}
      >
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4
            className={`fw-bold text-primary mb-0 ${!sidebarOpen && "d-none"}`}
          >
            <i className="fa-solid fa-gear me-2"></i> Admin
          </h4>
          <button
            className="btn btn-sm btn-outline-secondary"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <i
              className={`fa-solid ${
                sidebarOpen ? "fa-chevron-left" : "fa-chevron-right"
              }`}
            ></i>
          </button>
        </div>

        <nav className="nav flex-column flex-grow-1">
          {[
            { id: "dashboard", icon: "fa-house", label: "Dashboard" },
            { id: "taikhoan", icon: "fa-house", label: "Quản lý Account" },
            { id: "binhluan", icon: "fa-house", label: "Quản lý Comments" },
            { id: "hang", icon: "fa-layer-group", label: "Quản lý Hãng" },
            { id: "chuyenmuc", icon: "fa-icons", label: "Quản lý Chuyên mục" },
            { id: "danhmuc", icon: "fa-folder", label: "Quản lý Danh mục" },
            { id: "sanpham", icon: "fa-box", label: "Quản lý Sản phẩm" },
            { id: "donhang", icon: "fa-box", label: "Quản lý Đơn hàng" },
            { id: "chat", icon: "fa-box", label: "Quản lý chat" },
            { id: "kho", icon: "fa-box", label: "Quản lý kho" },
          ].map((tab) => (
            <button
              key={tab.id}
              className={`nav-item btn text-start mb-2 py-2 px-3 rounded-3 fw-semibold w-100 d-flex align-items-center ${
                activeTab === tab.id
                  ? "btn-primary text-white shadow-sm"
                  : "btn-outline-primary bg-white text-primary border-0"
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              <i
                className={`fa-solid ${tab.icon} me-2 ${
                  !sidebarOpen && "me-0"
                }`}
              ></i>
              <span className={sidebarOpen ? "" : "d-none"}>{tab.label}</span>
            </button>
          ))}
        </nav>

        <div className="mt-auto p-3 text-center text-muted small">
          <i className="fa-solid fa-circle-info me-1"></i>
          <span className={sidebarOpen ? "" : "d-none"}>v1.0.0</span>
        </div>
      </aside>

      {/* Main Content */}
      <main
        className="flex-grow-1 p-4 position-relative overflow-auto"
        style={{
          background: "linear-gradient(135deg, #f5f7ff 0%, #e3eeff 100%)",
          transition: "all 0.4s ease-in-out",
        }}
      >
        <div className="fade-in">{renderContent()}</div>
      </main>
    </div>
  );
};

export default Adminpage;
