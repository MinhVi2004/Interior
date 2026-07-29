import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../../utils/axios";
import { toast } from "react-toastify";

const UpdateProduct = () => {
  const { sku } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    quantity: "",
  });
  const [productId, setProductId] = useState(null);
  const [images, setImages] = useState([]); // file images mới
  const [previewImages, setPreviewImages] = useState([]); // preview url
  // const [oldImages, setOldImages] = useState([]); // từ server

  // Get product data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, prodRes] = await Promise.all([
          axiosInstance.get("/api/category"),
          axiosInstance.get(`/api/product/sku/${sku}`),
        ]);
        setCategories(catRes.data);

        const product = prodRes.data;

        setProductId(product.id);

        setForm({
          name: product.name,
          description: product.description,
          category: product.categoryId || "",
          price: product.price,
          quantity: product.quantity,
        });

        const previewsFromServer = (product.images || []).map((img) => ({
          url: img.url,
          publicId: img.publicId,
          isOld: true,
        }));

        setPreviewImages(previewsFromServer);
      } catch (error) {
        toast.error("Không tìm thấy sản phẩm");
        navigate("/admin/product");
      }
    };

    fetchData();
  }, [sku, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddImage = (e) => {
    if (previewImages.length >= 10) {
      return toast.error("Chỉ tối đa 10 ảnh");
    }

    const file = e.target.files[0];
    if (file) {
      setImages((prev) => [...prev, file]);
      setPreviewImages((prev) => [
        ...prev,
        { url: URL.createObjectURL(file), isOld: false },
      ]);
    }
  };

  const handleRemoveImage = (index) => {
    const removed = previewImages[index];
    const newPreviews = [...previewImages];
    newPreviews.splice(index, 1);
    setPreviewImages(newPreviews);

    // Nếu ảnh bị xoá là ảnh mới (chưa upload)
    if (!removed.isOld) {
      const newImages = [...images];
      const fileIndex = previewImages
        .filter((img) => !img.isOld)
        .indexOf(removed);
      if (fileIndex !== -1) {
        newImages.splice(fileIndex, 1);
        setImages(newImages);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    const formData = new FormData();

    formData.append(
      "data",
      new Blob(
        [
          JSON.stringify({
            name: form.name,
            description: form.description,
            price: Number(form.price),
            quantity: Number(form.quantity),
            categoryId: Number(form.category),
            keepOldImages: previewImages
              .filter((img) => img.isOld)
              .map((img) => img.url),
          }),
        ],
        {
          type: "application/json",
        },
      ),
    );

    images.forEach((img) => {
      formData.append("images", img);
    });

    try {
      await axiosInstance.put(`/api/product/${productId}`, formData);

      toast.success("Cập nhật sản phẩm thành công");
      navigate(`/admin/product/${sku}`);
    } catch (err) {
      console.error(err);
      toast.error("Lỗi khi cập nhật sản phẩm");
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f6f2] p-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-[#3b3028]">
            Chỉnh sửa sản phẩm
          </h2>
          <p className="text-gray-500 mt-2">
            Cập nhật thông tin sản phẩm nội thất
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="
                    bg-white
                    rounded-2xl
                    shadow-sm
                    border
                    border-gray-100
                    p-6
                    space-y-6
                "
        >
          {/* Product info */}
          <div>
            <h3 className="text-lg font-semibold text-[#3b3028] mb-4">
              Thông tin sản phẩm
            </h3>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-600">Tên sản phẩm</label>

                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Ví dụ: Bàn làm việc gỗ"
                  required
                  className="
                                    mt-1
                                    w-full
                                    px-4 py-3
                                    border
                                    rounded-xl
                                    focus:ring-2
                                    focus:ring-[#c8a97e]
                                    outline-none
                                "
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">Mô tả</label>

                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows="5"
                  placeholder="Mô tả sản phẩm..."
                  required
                  className="
                                    mt-1
                                    w-full
                                    px-4 py-3
                                    border
                                    rounded-xl
                                    resize-none
                                    focus:ring-2
                                    focus:ring-[#c8a97e]
                                    outline-none
                                "
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm text-gray-600">Giá sản phẩm</label>

                  <input
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    type="number"
                    className="
                                        mt-1
                                        w-full
                                        px-4 py-3
                                        border
                                        rounded-xl
                                    "
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-600">Số lượng</label>

                  <input
                    name="quantity"
                    value={form.quantity}
                    onChange={handleChange}
                    type="number"
                    className="
                                        mt-1
                                        w-full
                                        px-4 py-3
                                        border
                                        rounded-xl
                                    "
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-600">Danh mục</label>

                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className="
                                        mt-1
                                        w-full
                                        px-4 py-3
                                        border
                                        rounded-xl
                                    "
                  >
                    <option value="">Chọn danh mục</option>

                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Images */}

          <div>
            <h3 className="text-lg font-semibold text-[#3b3028] mb-4">
              Hình ảnh sản phẩm
            </h3>

            <label
              className="
                            flex
                            items-center
                            justify-center
                            h-32
                            border-2
                            border-dashed
                            border-[#c8a97e]
                            rounded-xl
                            cursor-pointer
                            hover:bg-[#faf6f0]
                            transition
                        "
            >
              <div className="text-center">
                <p className="text-[#8b5e3c] font-medium">+ Thêm hình ảnh</p>

                <p className="text-sm text-gray-400">PNG, JPG tối đa 10 ảnh</p>
              </div>

              <input
                type="file"
                accept="image/*"
                onChange={handleAddImage}
                hidden
              />
            </label>

            <div className="flex flex-wrap gap-4 mt-5">
              {previewImages.map((img, idx) => (
                <div
                  key={idx}
                  className="
                                    relative
                                    group
                                "
                >
                  <img
                    src={img.url}
                    alt=""
                    className="
                                        w-28
                                        h-28
                                        object-cover
                                        rounded-xl
                                        border
                                    "
                  />

                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="
                                        absolute
                                        -top-2
                                        -right-2
                                        w-6
                                        h-6
                                        rounded-full
                                        bg-red-500
                                        text-white
                                        text-sm
                                        opacity-90
                                        hover:scale-110
                                    "
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}

          <div
            className="
                    flex
                    justify-end
                    gap-3
                    pt-4
                    border-t
                "
          >
            <button
              type="button"
              disabled={loading}
              onClick={() => navigate("/admin/product")}
              className={`
        px-6 py-3 rounded-xl
        bg-gray-200 text-gray-700
        hover:bg-gray-300
        ${loading ? "opacity-50 cursor-not-allowed" : ""}
    `}
            >
              Hủy
            </button>

            <button
              type="submit"
              disabled={loading}
              className={`
        px-6 py-3 rounded-xl
        bg-[#8b5e3c]
        text-white
        hover:bg-[#70482d]
        transition
        ${loading ? "opacity-50 cursor-not-allowed" : ""}
    `}
            >
              {loading ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateProduct;
