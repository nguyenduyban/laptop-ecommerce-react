// src/pages/AdminKho.jsx
import React, { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import { getAllKho, nhapKho } from "../API/Kho";

const numberVN = (n) => (Number(n) || 0).toLocaleString("vi-VN");

const AdminKho = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [pendingQty, setPendingQty] = useState({});

  // ⭐ Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    fetchKho();
  }, []);

  const fetchKho = async () => {
    setLoading(true);
    try {
      const data = await getAllKho();
      setRows(Array.isArray(data.data) ? data.data : data);
    } catch (e) {
      Swal.fire("Lỗi", "Không thể tải dữ liệu kho", "error");
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) => {
      const name = r?.sanpham?.tensp?.toLowerCase() || "";
      const idStr = String(r?.sanpham?.masp || r?.id_sanpham || "");
      return name.includes(q) || idStr.includes(q);
    });
  }, [rows, search]);

  // ⭐ Pagination logic
  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filtered.slice(start, start + rowsPerPage);
  }, [filtered, currentPage, rowsPerPage]);

  const totalPages = Math.ceil(filtered.length / rowsPerPage);

  const stats = useMemo(() => {
    const totalTon = filtered.reduce(
      (s, r) => s + (Number(r.soluong_ton) || 0),
      0
    );
    const totalDaBan = filtered.reduce(
      (s, r) => s + (Number(r.soluong_daban) || 0),
      0
    );
    return { totalTon, totalDaBan };
  }, [filtered]);

  const handleNhap = async (row) => {
    const id_sanpham = row.id_sanpham ?? row.sanpham?.masp;
    const qty = Number(pendingQty[id_sanpham] || 0);

    if (!id_sanpham) {
      Swal.fire("Lỗi", "Thiếu id_sanpham", "error");
      return;
    }
    if (!qty || qty <= 0) {
      Swal.fire("Cảnh báo", "Nhập số lượng > 0", "warning");
      return;
    }

    try {
      await nhapKho({ id_sanpham, soluong_nhap: qty });
      Swal.fire("Thành công", `Đã nhập thêm ${qty} sản phẩm`, "success");

      setPendingQty((prev) => ({ ...prev, [id_sanpham]: "" }));
      await fetchKho();
    } catch (e) {
      const message =
        e?.response?.data?.error ||
        e?.response?.data?.message ||
        "Không thể nhập kho";
      Swal.fire("Lỗi", message, "error");
    }
  };

  return (
    <div className="container py-5">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h3 className="fw-bold mb-3">
          <i className="fa-solid fa-warehouse text-primary me-2" />
          Quản lý kho
        </h3>

        {/* Controls */}
        <div className="row g-3 align-items-center mb-4">
          <div className="col-md-5">
            <input
              className="form-control rounded-pill"
              placeholder="Tìm theo tên sản phẩm hoặc mã SP…"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1); // reset khi search
              }}
            />
          </div>
          <div className="col-md-7 text-md-end">
            <span className="badge bg-info me-2">
              Tổng tồn: <b>{numberVN(stats.totalTon)}</b>
            </span>
            <span className="badge bg-success">
              Đã bán: <b>{numberVN(stats.totalDaBan)}</b>
            </span>
          </div>
        </div>

        {/* Table */}
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th>Sản phẩm</th>
                <th className="text-center">Nhập</th>
                <th className="text-end">Tồn</th>
                <th className="text-end">Đã bán</th>
                <th className="text-center">Thao tác</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-5">
                    Đang tải…
                  </td>
                </tr>
              ) : paginatedRows.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-4">
                    Không có dữ liệu.
                  </td>
                </tr>
              ) : (
                paginatedRows.map((r, idx) => {
                  const idSP = r.id_sanpham ?? r.sanpham?.masp;
                  return (
                    <tr key={r.id ?? idSP ?? idx}>
                      <td>{(currentPage - 1) * rowsPerPage + idx + 1}</td>

                      <td style={{ minWidth: 280 }}>
                        <div className="d-flex align-items-center gap-2">
                          {r.sanpham?.anhdaidien ? (
                            <img
                              src={`https://ecommerce-laravel.up.railway.app/storage/img/${r.sanpham.anhdaidien}`}
                              alt={r.sanpham?.tensp || ""}
                              width="50"
                              height="50"
                              style={{ objectFit: "cover", borderRadius: 6 }}
                              onError={(e) =>
                                (e.currentTarget.style.display = "none")
                              }
                            />
                          ) : null}

                          <div>
                            <div className="fw-semibold">
                              {r.sanpham?.tensp || "Sản phẩm"}
                            </div>
                            <small className="text-muted">Mã SP: {idSP}</small>
                          </div>
                        </div>
                      </td>

                      <td className="text-center" style={{ maxWidth: 160 }}>
                        <input
                          type="number"
                          min="1"
                          className="form-control form-control-sm"
                          style={{ width: 110 }}
                          placeholder="Số lượng"
                          value={pendingQty[idSP] ?? ""}
                          onChange={(e) =>
                            setPendingQty((p) => ({
                              ...p,
                              [idSP]: e.target.value,
                            }))
                          }
                        />
                      </td>

                      <td className="text-end">{numberVN(r.soluong_ton)}</td>
                      <td className="text-end">{numberVN(r.soluong_daban)}</td>

                      <td className="text-center">
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() => handleNhap(r)}
                        >
                          <i className="fa-solid fa-plus me-1" />
                          Nhập kho
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* ⭐ Pagination */}
        {totalPages > 1 && (
          <div className="d-flex justify-content-center mt-4">
            <button
              className="btn btn-outline-primary me-2"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              ◀ Trang trước
            </button>

            <span className="px-3 py-2 border rounded">
              Trang {currentPage} / {totalPages}
            </span>

            <button
              className="btn btn-outline-primary ms-2"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              Trang sau ▶
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default AdminKho;
