import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../utils/axios";
import { Plus, Pencil, Trash2, FolderOpen } from "lucide-react";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

const ListCategory = () => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  const fetchCategories = async () => {
    try {
      const res = await axiosInstance.get("/api/category");
      setCategories(res.data);
    } catch (err) {
      toast.error("Không thể tải danh sách danh mục.");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Xóa danh mục?",
      text: "Thao tác này không thể hoàn tác.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
      confirmButtonColor: "#8B5E3C",
    });

    if (!confirm.isConfirmed) return;

    try {
      await axiosInstance.delete(`/api/category/${id}`);

      toast.success("Xóa danh mục thành công.");

      fetchCategories();
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Không thể xóa danh mục."
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f5f2] p-8">

      {/* Header */}

      <div className="flex items-center justify-between mb-8">

        <div>

          <h1 className="text-3xl font-bold text-gray-800">
            Quản lý danh mục
          </h1>

          <p className="text-gray-500 mt-1">
            Tổng cộng {categories.length} danh mục
          </p>

        </div>

        <button
          onClick={() => navigate("/admin/category/add")}
          className="flex items-center gap-2 bg-[#8B5E3C] hover:bg-[#714b2f] text-white px-5 py-3 rounded-xl font-medium transition"
        >
          <Plus size={20} />
          Thêm danh mục
        </button>

      </div>

      {/* Table */}

      <div className="bg-white rounded-3xl shadow-lg overflow-hidden">

        <table className="w-full">

          <thead className="bg-[#F3ECE5]">

            <tr className="text-gray-700">

              <th className="py-4 px-6 text-left">
                Hình ảnh
              </th>

              <th className="py-4 px-6 text-left">
                Tên danh mục
              </th>

              <th className="py-4 px-6 text-center">
                Thao tác
              </th>

            </tr>

          </thead>

          <tbody>

            {categories.length === 0 ? (

              <tr>

                <td
                  colSpan={3}
                  className="py-20 text-center"
                >

                  <FolderOpen
                    size={60}
                    className="mx-auto text-gray-300"
                  />

                  <p className="mt-4 text-gray-500">
                    Chưa có danh mục nào.
                  </p>

                </td>

              </tr>

            ) : (

              categories.map((cat) => (

                <tr
                  key={cat.id}
                  className="border-t hover:bg-[#faf8f6] transition"
                >

                  <td className="px-6 py-4">

                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-20 h-20 rounded-xl object-cover border shadow-sm"
                    />

                  </td>

                  <td className="px-6">

                    <h3 className="font-semibold text-gray-800 text-lg">
                      {cat.name}
                    </h3>

                  </td>

                  <td className="px-6">

                    <div className="flex justify-center gap-3">

                      <button
                        onClick={() =>
                          navigate(`/admin/category/update/${cat.id}`)
                        }
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-white transition"
                      >
                        <Pencil size={18} />
                        Sửa
                      </button>

                      <button
                        onClick={() => handleDelete(cat.id)}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition"
                      >
                        <Trash2 size={18} />
                        Xóa
                      </button>

                    </div>

                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

    </div>
  );
};

export default ListCategory;