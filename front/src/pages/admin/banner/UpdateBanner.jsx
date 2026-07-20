import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../../utils/axios";
import { toast } from "react-toastify";
import {
    X,
    Upload,
    Image as ImageIcon,
} from "lucide-react";

const UpdateBanner = () => {

    const { id } = useParams();

    const navigate = useNavigate();

    const [banner, setBanner] = useState(null);

    const [image, setImage] = useState(null);

    const [preview, setPreview] = useState(null);

    const [loading, setLoading] = useState(false);

    useEffect(() => {

        const fetchBanner = async () => {

            try {

                const res = await axiosInstance.get(`/api/banner/${id}`);

                setBanner(res.data);

                setPreview(res.data.image);

            } catch (err) {

                console.error(err);

                toast.error("Không thể tải banner.");

            }

        };

        fetchBanner();

    }, [id]);

    useEffect(() => {

        if (!image) return;

        const objectUrl = URL.createObjectURL(image);

        setPreview(objectUrl);

        return () => URL.revokeObjectURL(objectUrl);

    }, [image]);

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!image) {

            toast.warning("Vui lòng chọn ảnh mới.");

            return;

        }

        try {

            setLoading(true);

            const formData = new FormData();

            formData.append("image", image);

            await axiosInstance.put(
                `/api/banner/${id}`,
                formData
            );

            toast.success("Cập nhật banner thành công.");

            setTimeout(() => {

                navigate("/admin/banner");

            }, 700);

        } catch (err) {

            console.error(err);

            toast.error(
                err.response?.data?.message ||
                "Không thể cập nhật banner."
            );

        } finally {

            setLoading(false);

        }

    };

    if (!banner) {

        return (

            <div className="min-h-screen bg-[#f7f5f2] flex items-center justify-center">

                <div className="text-gray-500 text-lg">

                    Đang tải dữ liệu...

                </div>

            </div>

        );

    }

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

                    Cập nhật Banner

                </h2>

                <p className="text-gray-500 mt-2">

                    Chọn ảnh mới để thay thế banner hiện tại.

                </p>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-6 mt-8"
                >

                    <div>

                        <label className="block text-sm font-semibold text-gray-700 mb-3">

                            Banner

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
                            ? "Đang cập nhật..."
                            : "Lưu thay đổi"}

                    </button>

                </form>

            </div>

        </div>

    );

};

export default UpdateBanner;