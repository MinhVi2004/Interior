import { useEffect, useState } from "react";
import axiosInstance from "../../../utils/axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
    X,
    Upload,
    Image as ImageIcon,
} from "lucide-react";

const AddBanner = () => {

    const navigate = useNavigate();

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

        if (!image) {

            toast.warning("Vui lòng chọn ảnh banner.");

            return;

        }

        try {

            setLoading(true);

            const formData = new FormData();

            formData.append("image", image);

            await axiosInstance.post(
                "/api/banner",
                formData
            );

            toast.success("Thêm banner thành công.");

            setTimeout(() => {

                navigate("/admin/banner");

            }, 700);

        } catch (err) {

            console.error(err);

            toast.error(
                err.response?.data?.message ||
                "Không thể thêm banner."
            );

        } finally {

            setLoading(false);

        }

    };

    return (

        <div className="min-h-screen bg-[#f7f5f2] flex items-center justify-center p-6">

            <div className="w-full max-w-3xl bg-white rounded-3xl shadow-xl p-8 relative">

                <button
                    onClick={() => navigate("/admin/banner")}
                    className="absolute top-6 right-6 text-gray-400 hover:text-[#8B5E3C] transition"
                >
                    <X size={28} />
                </button>

                <h2 className="text-3xl font-bold text-gray-800">

                    Thêm Banner

                </h2>

                <p className="text-gray-500 mt-2">

                    Upload banner cho trang chủ.

                </p>

                <form
                    onSubmit={handleSubmit}
                    className="mt-8 space-y-6"
                >

                    <div>

                        <label className="block text-sm font-semibold text-gray-700 mb-3">

                            Hình ảnh Banner

                        </label>

                        <label className="cursor-pointer">

                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) =>
                                    setImage(e.target.files[0])
                                }
                            />

                            <div
                                className="
                                    border-2
                                    border-dashed
                                    border-gray-300
                                    rounded-2xl
                                    h-72
                                    flex
                                    flex-col
                                    justify-center
                                    items-center
                                    hover:border-[#8B5E3C]
                                    transition
                                "
                            >

                                {preview ? (

                                    <img
                                        src={preview}
                                        alt=""
                                        className="h-60 object-contain rounded-xl"
                                    />

                                ) : (

                                    <>

                                        <ImageIcon
                                            size={60}
                                            className="text-gray-400"
                                        />

                                        <p className="mt-4 text-gray-500">

                                            Chọn ảnh banner

                                        </p>

                                        <span className="text-sm text-gray-400">

                                            JPG, PNG, WEBP

                                        </span>

                                    </>

                                )}

                            </div>

                        </label>

                        {image && (

                            <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">

                                <Upload size={16} />

                                {image.name}

                            </div>

                        )}

                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="
                            w-full
                            h-12
                            rounded-xl
                            bg-[#8B5E3C]
                            hover:bg-[#714b2f]
                            disabled:bg-gray-400
                            disabled:cursor-not-allowed
                            text-white
                            font-semibold
                            transition
                        "
                    >

                        {loading
                            ? "Đang tải lên..."
                            : "Thêm Banner"}

                    </button>

                </form>

            </div>

        </div>

    );

};

export default AddBanner;