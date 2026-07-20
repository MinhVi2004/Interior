import { useState, useEffect } from "react";
import axiosInstance from "../../../utils/axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { X } from "lucide-react";

const AddCategory = () => {

    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {

        if (!image) {
            setPreview(null);
            return;
        }

        const objectUrl = URL.createObjectURL(image);

        setPreview(objectUrl);

        return () => URL.revokeObjectURL(objectUrl);

    }, [image]);

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!name.trim()) {
            toast.warning("Vui lòng nhập tên danh mục.");
            return;
        }

        if (!image) {
            toast.warning("Vui lòng chọn hình ảnh.");
            return;
        }

        try {

            setLoading(true);

            const formData = new FormData();

            formData.append("name", name);
            formData.append("image", image);

            await axiosInstance.post(
                "/api/category",
                formData
            );

            toast.success("Thêm danh mục thành công.");

            setTimeout(() => {
                navigate("/admin/category");
            }, 800);

        } catch (err) {

            console.error(err);

            toast.error(
                err.response?.data?.message ||
                "Không thể thêm danh mục."
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
                    Thêm danh mục
                </h2>

                <p className="text-gray-500 mt-2">
                    Tạo danh mục mới cho cửa hàng nội thất.
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

                            <div className="border-2 border-dashed border-gray-300 rounded-2xl h-56 flex flex-col justify-center items-center hover:border-[#8B5E3C] transition">

                                {preview ? (

                                    <img
                                        src={preview}
                                        alt=""
                                        className="h-40 object-contain rounded-xl"
                                    />

                                ) : (

                                    <>
                                        <span className="text-5xl">
                                            🖼️
                                        </span>

                                        <p className="mt-3 text-gray-500">
                                            Chọn ảnh danh mục
                                        </p>
                                    </>

                                )}

                            </div>

                        </label>

                        {image && (

                            <p className="mt-3 text-sm text-gray-500">
                                Đã chọn:
                                <span className="ml-1 font-medium">
                                    {image.name}
                                </span>
                            </p>

                        )}

                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full h-12 rounded-xl bg-[#8B5E3C] hover:bg-[#714b2f] text-white font-semibold transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        {loading
                            ? "Đang thêm..."
                            : "Thêm danh mục"}
                    </button>

                </form>

            </div>

        </div>

    );

};

export default AddCategory;