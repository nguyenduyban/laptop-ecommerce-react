import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { motion } from "framer-motion";

import { getAccountById } from "../API/Account";
import { getOrdersByUser } from "../API/Checkout";
import { getCommentsByUserAdmin } from "../API/Comment";
const AdminAccountDetail = () => {
  const { id } = useParams();

  const [account, setAccount] = useState(null);
  const [orders, setOrders] = useState([]);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      const acc = await getAccountById(id);
      const ord = await getOrdersByUser(id);
      const cmt = await getCommentsByUserAdmin(id);

      setAccount(acc);
      setOrders(ord);
      setComments(cmt);
    } catch (err) {
      Swal.fire("Lỗi!", "Không thể tải dữ liệu tài khoản", "error");
    }
  };

  if (!account) return <div className="text-center py-5">Đang tải...</div>;

  return (
    <div className="container py-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h3 className="fw-bold mb-4">
          <i className="fa-solid fa-user text-primary me-2"></i>
          Chi tiết tài khoản: {account.username}
        </h3>

        {/* THÔNG TIN TÀI KHOẢN */}
        <div className="card shadow-sm p-3 mb-4">
          <h5 className="fw-bold mb-3">Thông tin cá nhân</h5>
          <p>
            <b>Họ tên:</b> {account.fullname}
          </p>
          <p>
            <b>Email:</b> {account.email}
          </p>
          <p>
            <b>SĐT:</b> {account.sdt}
          </p>
          <p>
            <b>Địa chỉ:</b> {account.diachi}
          </p>
          <p>
            <b>Loại TK:</b>{" "}
            <span
              className={`badge ${
                account.loaiTK === "admin"
                  ? "bg-warning text-dark"
                  : "bg-secondary"
              }`}
            >
              {account.loaiTK}
            </span>
          </p>
        </div>

        {/* ĐƠN HÀNG ĐÃ MUA */}
        <div className="card shadow-sm p-3 mb-4">
          <h5 className="fw-bold mb-3">Đơn hàng đã mua</h5>

          <table className="table table-striped">
            <thead>
              <tr>
                <th>Mã đơn</th>
                <th>Ngày mua</th>
                <th>Tổng tiền</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? (
                orders.map((o) => (
                  <tr key={o.id}>
                    <td>{o.id}</td>
                    <td>{o.created_at}</td>
                    <td>{Number(o.total_price).toLocaleString("vi-VN")}đ</td>
                    <td>
                      <span className="badge bg-info">{o.status}</span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center text-muted py-3">
                    Chưa có đơn hàng
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* BÌNH LUẬN */}
        <div className="card shadow-sm p-3 mb-4">
          <h5 className="fw-bold mb-3">Bình luận của tài khoản</h5>

          {comments.length > 0 ? (
            comments.map((c) => (
              <div key={c.id} className="border-bottom py-2">
                <b>{c.sanpham?.tensp}</b>
                <p className="m-0">{c.noidung}</p>
                <span className="badge bg-info">{c.trangthai}</span>
              </div>
            ))
          ) : (
            <p className="text-muted">Không có bình luận nào</p>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default AdminAccountDetail;
