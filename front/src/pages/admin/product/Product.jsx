// src/pages/admin/ListProduct.jsx
import { useEffect, useState } from "react";
import axiosInstance from "../../../utils/axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

// Lucide icons
import { Layers, Trash2, Plus, Package, Calendar, Pencil } from "lucide-react";

const ListProduct = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  const fetchProducts = async () => {
    const res = await axiosInstance.get("/api/product");
    setProducts(res.data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Xác nhận xoá",
      text: "Bạn có chắc chắn muốn xoá?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Xoá",
      cancelButtonText: "Hủy",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    });

    if (confirm.isConfirmed) {
      try {
        await axiosInstance.delete(`api/product/${id}`);
        toast.success("Xoá sản phẩm thành công");
        fetchProducts();
      } catch (err) {
        console.error("Lỗi khi xoá sản phẩm:", err);
        toast.error("Xoá thất bại!");
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f5f2] p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#8B5E3C]">
            Danh sách sản phẩm
          </h1>

          <p className="text-gray-500 mt-1">
            Quản lý toàn bộ sản phẩm trong cửa hàng
          </p>
        </div>

        <button
          onClick={() => navigate("/admin/product/add")}
          className="bg-[#8B5E3C] hover:bg-[#72492d] text-white px-5 py-3 rounded-xl flex items-center gap-2 transition shadow-md"
        >
          <Plus size={18} />
          Thêm sản phẩm
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-[#faf7f4]">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                Ảnh
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                Tên sản phẩm
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                Ngày tạo
              </th>

              <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.length === 0 && (
              <tr>
                <td colSpan={4} className="py-16">
                  <div className="flex flex-col items-center">
                    <Package size={55} className="text-gray-300" />

                    <h3 className="mt-4 text-lg font-semibold text-gray-700">
                      Chưa có sản phẩm
                    </h3>

                    <p className="text-gray-500">
                      Nhấn "Thêm sản phẩm" để bắt đầu.
                    </p>
                  </div>
                </td>
              </tr>
            )}
            {products.map((pro) => (
              <tr
                key={pro.sku}
                onClick={() => navigate(`/admin/product/${pro.sku}`)}
                className="border-b last:border-0 hover:bg-[#faf7f4] transition cursor-pointer"
              >
                <td className="px-6 py-4">
                  <img
                    src={pro.thumbnail || "/default.png"}
                    alt={pro.name}
                    className="w-20 h-20 rounded-xl object-cover border border-gray-200 shadow-sm"
                  />
                </td>
                <td className="px-6 py-4">
                  <div>
                    <h3 className="font-semibold text-gray-800">{pro.name}</h3>

                    <p className="text-sm text-gray-400">ID: {pro.id}</p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar size={16} />

                    {new Date(pro.createdAt).toLocaleDateString("vi-VN")}
                  </div>
                </td>

                <td className="px-6 py-4 text-center">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/admin/product/${pro.sku}`);
                      }}
                      className="bg-amber-100 hover:bg-amber-200 text-[#8B5E3C] p-2 rounded-lg transition"
                    >
                      <Pencil size={18} />
                    </button>

                    {/* <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/admin/product/variant/${pro.sku}`);
                      }}
                      className="bg-green-100 hover:bg-green-200 text-green-700 p-2 rounded-lg transition"
                    >
                      <Layers size={18} />
                    </button> */}

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(pro.sku);
                      }}
                      className="bg-red-100 hover:bg-red-200 text-red-600 p-2 rounded-lg transition"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListProduct;
