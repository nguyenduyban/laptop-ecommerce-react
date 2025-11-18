import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getComments, postComment } from "../API/Comment";
import { getProductById } from "../API/ProductAPI";
import { getProductByCategories } from "../API/Categories";

import { formatPrice } from "../utils/format";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import Swal from "sweetalert2";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const ProductDetail = () => {
  const { masp } = useParams();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const { user } = useAuth();

  // 🟦 Dữ liệu bình luận
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loadingComments, setLoadingComments] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const prod = await getProductById(masp);
        setProduct(prod);

        if (prod?.danhmuc_id) {
          const rel = await getProductByCategories(prod.danhmuc_id);
          setRelated(rel.filter((item) => item.masp !== prod.masp));
        }

        const data = await getComments(masp);
        setComments(data);
      } catch (error) {
        console.error("Lỗi khi tải chi tiết sản phẩm:", error);
      } finally {
        setLoadingComments(false);
      }
    };
    fetchData();
  }, [masp]);

  if (!product)
    return (
      <p className="text-center mt-5 text-secondary fw-semibold">
        Đang tải sản phẩm...
      </p>
    );

  // 🛒 Thêm giỏ hàng
  const handleAddToCart = () => {
    addToCart(product);
    Swal.fire({
      icon: "success",
      title: "Đã thêm vào giỏ hàng!",
      timer: 1200,
      showConfirmButton: false,
    });
  };

  // 💬 Gửi bình luận
  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!user) {
      Swal.fire("Bạn cần đăng nhập để bình luận!", "", "warning");
      return;
    }
    if (newComment.trim() === "") return;

    try {
      const comment = await postComment({
        user_id: user.id,
        sanpham_id: masp,
        noidung: newComment,
      });
      setComments([comment, ...comments]);
      setNewComment("");
    } catch (error) {
      Swal.fire("Lỗi!", "Không thể gửi bình luận.", "error");
    }
  };

  return (
    <div className="detail-page py-5">
      <div className="container">
        {/* Thông tin sản phẩm */}
        <div className="row bg-white rounded-4 p-4 shadow-sm border">
          <div className="col-md-6 text-center">
            <img
              src={`https://ecommerce-laravel.up.railway.app/storage/img/${product.anhdaidien}`}
              alt={product.tensp}
              className="img-fluid rounded-4 main-image mb-3"
              style={{ maxHeight: "400px", objectFit: "cover" }}
            />
          </div>

          <div className="col-md-6 ps-md-5">
            <h3 className="fw-bold text-dark mb-3">{product.tensp}</h3>
            <h4 className="text-primary fw-bold mb-2">
              {formatPrice(product.giamoi)}
            </h4>

            {product.giacu && (
              <p className="text-muted text-decoration-line-through">
                {formatPrice(product.giacu)}
              </p>
            )}

            <p className="text-secondary small mb-4">
              {product.mota?.substring(0, 120) || "Sản phẩm chất lượng cao."}
            </p>

            <div className="d-flex gap-3">
              <button
                onClick={handleAddToCart}
                className="btn btn-outline-primary fw-semibold px-4 rounded-pill"
              >
                <i className="bi bi-cart-plus me-2"></i>Thêm vào giỏ hàng
              </button>
              <button
                className="btn btn-primary fw-semibold px-4 rounded-pill"
                onClick={() => navigate("/checkout")}
              >
                Mua ngay
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-5 bg-white rounded-4 p-4 shadow-sm border">
          <ul className="nav nav-tabs mb-4" id="productTab">
            <li className="nav-item">
              <button
                className="nav-link active fw-semibold"
                data-bs-toggle="tab"
                data-bs-target="#desc"
              >
                Mô tả chi tiết
              </button>
            </li>
            <li className="nav-item">
              <button
                className="nav-link fw-semibold"
                data-bs-toggle="tab"
                data-bs-target="#review"
              >
                Bình luận
              </button>
            </li>
          </ul>

          <div className="tab-content">
            <div className="tab-pane fade show active" id="desc">
              <p className="text-secondary">{product.mota}</p>
            </div>

            {/* 💬 Bình luận */}
            <div className="tab-pane fade" id="review">
              <h5 className="fw-bold mb-3 text-dark">Bình luận</h5>
              {loadingComments ? (
                <p className="text-muted">Đang tải bình luận...</p>
              ) : (
                <>
                  {/* Form nhập bình luận */}
                  <form
                    onSubmit={handleSubmitComment}
                    className="p-3 rounded-3 border bg-light mb-4 shadow-sm"
                  >
                    <textarea
                      className="form-control mb-3 border-0 shadow-sm"
                      rows="3"
                      placeholder="Hãy chia sẻ cảm nhận của bạn..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                    ></textarea>
                    <div className="text-end">
                      <button
                        type="submit"
                        className="btn btn-primary px-4 rounded-pill fw-semibold"
                      >
                        Gửi bình luận
                      </button>
                    </div>
                  </form>

                  {/* Danh sách bình luận */}
                  {comments.length === 0 ? (
                    <p className="text-muted">Chưa có bình luận nào.</p>
                  ) : (
                    <ul className="list-group border-0">
                      {comments.map((c) => (
                        <li
                          key={c.id}
                          className="list-group-item border-0 border-bottom py-3"
                        >
                          <div className="d-flex align-items-start">
                            <div className="me-3">
                              <i className="bi bi-person-circle fs-3 text-primary"></i>
                            </div>
                            <div>
                              <h6 className="fw-semibold mb-1 text-dark">
                                {c.user?.fullname || "Người dùng"}
                              </h6>
                              <p className="mb-1 text-secondary">{c.noidung}</p>
                              <small className="text-muted">
                                {new Date(c.created_at).toLocaleString("vi-VN")}
                              </small>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
        {/*  SẢN PHẨM LIÊN QUAN */}
        {related.length > 0 && (
          <div className="mt-5 bg-white rounded-4 p-4 shadow-sm border">
            <h4 className="fw-bold mb-3 text-dark">Sản phẩm liên quan</h4>

            <div
              id="relatedCarousel"
              className="carousel slide"
              data-bs-ride="carousel"
            >
              <div className="carousel-inner">
                {Array.from({ length: Math.ceil(related.length / 3) }).map(
                  (_, slideIndex) => (
                    <div
                      key={slideIndex}
                      className={`carousel-item ${
                        slideIndex === 0 ? "active" : ""
                      }`}
                    >
                      <div className="row g-3">
                        {related
                          .slice(slideIndex * 3, slideIndex * 3 + 3)
                          .map((item) => (
                            <div className="col-md-4 col-12" key={item.masp}>
                              <div className="card h-100 shadow-sm border-0 rounded-4 p-2">
                                <img
                                  src={`https://ecommerce-laravel.up.railway.app/storage/img/${item.anhdaidien}`}
                                  className="card-img-top rounded-4"
                                  style={{
                                    height: "220px",
                                    objectFit: "cover",
                                  }}
                                />

                                <div className="card-body text-center">
                                  <h6 className="fw-bold text-dark">
                                    {item.tensp.length > 40
                                      ? item.tensp.substring(0, 40) + "..."
                                      : item.tensp}
                                  </h6>

                                  <p className="text-primary fw-semibold mb-2">
                                    {formatPrice(item.giamoi)}
                                  </p>

                                  <button
                                    className="btn btn-outline-primary rounded-pill px-3"
                                    onClick={() =>
                                      navigate(`/product/${item.masp}`)
                                    }
                                  >
                                    Xem chi tiết
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  )
                )}
              </div>

              {/* Nút chuyển slide */}
              <button
                className="carousel-control-prev"
                type="button"
                data-bs-target="#relatedCarousel"
                data-bs-slide="prev"
              >
                <span className="carousel-control-prev-icon"></span>
              </button>

              <button
                className="carousel-control-next"
                type="button"
                data-bs-target="#relatedCarousel"
                data-bs-slide="next"
              >
                <span className="carousel-control-next-icon"></span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* CSS */}
      <style>{`
        body {
          background-color: #f8f9fa;
        }
        .detail-page {
          background-color: #f8f9fa;
          min-height: 100vh;
        }
        .nav-tabs .nav-link.active {
          color: #0d6efd;
          border-bottom: 3px solid #0d6efd;
          background: transparent;
        }
        .nav-tabs .nav-link {
          color: #555;
          border: none;
        }
        .nav-tabs .nav-link:hover {
          color: #0d6efd;
        }
        textarea:focus {
          box-shadow: 0 0 0 0.15rem rgba(13,110,253,0.25);
        }
      `}</style>
    </div>
  );
};

export default ProductDetail;
