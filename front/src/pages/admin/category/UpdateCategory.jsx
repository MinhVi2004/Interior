import { useEffect, useState } from "react";
import axiosInstance from "../../../utils/axios";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { X } from "lucide-react";
const UpdateCategory = () => {
  const { id } = useParams();
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (image) {
      const objectUrl = URL.createObjectURL(image);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else {
      setPreview(null);
    }
  }, [image]);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await axiosInstance.get(`api/category/${id}`);
        setName(res.data.name);
        setPreview(res.data.image); // nếu backend trả link ảnh
      } catch (err) {
        console.error(err);
        toast.error("Có lỗi xảy ra khi tải danh mục");
      }
    };
    fetchCategory();
  }, [id]);


const handleSubmit = async (e) => {
  e.preventDefault();

  if (!name.trim()) {
    toast.warning("Vui lòng nhập tên danh mục.");
    return;
  }

  try {
    setLoading(true);

    const formData = new FormData();
    formData.append("name", name);

    if (image) {
      formData.append("image", image);
    }

    await axiosInstance.put(
      `api/category/${id}`,
      formData
    );

    toast.success("Cập nhật danh mục thành công!");

    setTimeout(() => {
      navigate("/admin/category");
    }, 800);

  } catch (err) {
    console.error(err);

    toast.error(
      err.response?.data?.message ||
      "Không thể cập nhật danh mục."
    );
  } finally {
    setLoading(false);
  }
};

  return (
  <div className="min-h-screen bg-[#f7f5f2] flex items-center justify-center p-6">

    <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl p-8 relative">

      <button
        onClick={() => navigate("/admin/category")}
        className="absolute top-6 right-6 text-gray-400 hover:text-[#8B5E3C] transition"
      >
        <X size={28} />
      </button>

      <h2 className="text-3xl font-bold text-gray-800">
        Cập nhật danh mục
      </h2>

      <p className="text-gray-500 mt-2">
        Chỉnh sửa thông tin và hình ảnh danh mục.
      </p>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 mt-8"
      >

        <div>

          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Tên danh mục
          </label>

          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ví dụ: Sofa"
            className="w-full h-12 rounded-xl border border-gray-300 px-4 outline-none focus:ring-2 focus:ring-[#8B5E3C]"
          />

        </div>

        <div>

          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Hình ảnh
          </label>

          <label className="cursor-pointer">

            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => setImage(e.target.files[0])}
            />

            <div className="border-2 border-dashed border-gray-300 rounded-2xl h-52 flex flex-col justify-center items-center hover:border-[#8B5E3C] transition">

              {preview ? (

                <img
                  src={preview}
                  alt=""
                  className="h-40 object-contain rounded-xl"
                />

              ) : (

                <>
                  <span className="text-5xl mb-3">
                    🖼️
                  </span>

                  <p className="text-gray-500">
                    Chọn ảnh danh mục
                  </p>

                </>

              )}

            </div>

          </label>

          {image && (

            <p className="mt-2 text-sm text-gray-500">
              Đã chọn: <span className="font-medium">{image.name}</span>
            </p>

          )}

        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full h-12 rounded-xl bg-[#8B5E3C] hover:bg-[#714b2f] text-white font-semibold transition disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? "Đang cập nhật..." : "Lưu thay đổi"}
        </button>

      </form>

    </div>

  </div>
);
};

export default UpdateCategory;
