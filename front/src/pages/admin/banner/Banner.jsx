import { useEffect, useState } from "react";
import axiosInstance from "../../../utils/axios";
import { useNavigate } from "react-router-dom";
import {
    Plus,
    Image,
    Trash2,
    Calendar,
} from "lucide-react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const ListBanner = () => {

    const [banners, setBanners] = useState([]);

    const navigate = useNavigate();

    const fetchBanners = async () => {

        try {

            const res = await axiosInstance.get("/api/banner");

            setBanners(res.data);

        } catch (err) {

            console.error(err);

            toast.error("Không thể tải danh sách banner.");

        }

    };

    useEffect(() => {

        fetchBanners();

    }, []);

    const handleAdd = () => {

        if (banners.length >= 6) {

            toast.info("Đã đủ 6 banner.");

            return;

        }

        navigate("/admin/banner/add");

    };

    const handleDelete = async (id) => {

        const result = await Swal.fire({

            title: "Xóa banner?",

            text: "Bạn có chắc chắn muốn xóa banner này?",

            icon: "warning",

            showCancelButton: true,

            confirmButtonColor: "#8B5E3C",

            cancelButtonColor: "#9ca3af",

            confirmButtonText: "Xóa",

            cancelButtonText: "Hủy",

        });

        if (!result.isConfirmed) return;

        try {

            await axiosInstance.delete(`/api/banner/${id}`);

            toast.success("Xóa banner thành công.");

            fetchBanners();

        } catch (err) {

            console.error(err);

            toast.error("Xóa banner thất bại.");

        }

    };

    return (

        <div className="max-w-7xl mx-auto p-8">

            <div className="bg-white rounded-3xl shadow-lg overflow-hidden">

                {/* Header */}

                <div className="border-b p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                    <div>

                        <h2 className="text-3xl font-bold text-gray-800">

                            Banner

                        </h2>

                        <p className="text-gray-500 mt-1">

                            Quản lý banner trang chủ

                        </p>

                    </div>

                    <div className="flex gap-3">

                        <span
                            className={`
                                px-4 py-2 rounded-full text-sm font-medium
                                ${
                                    banners.length >= 6
                                        ? "bg-red-100 text-red-600"
                                        : "bg-green-100 text-green-600"
                                }
                            `}
                        >

                            {banners.length}/6 Banner

                        </span>

                        <button
                            onClick={handleAdd}
                            disabled={banners.length >= 6}
                            className="
                                flex items-center gap-2
                                bg-[#8B5E3C]
                                hover:bg-[#714b2f]
                                disabled:bg-gray-300
                                disabled:cursor-not-allowed
                                text-white
                                px-5
                                py-2.5
                                rounded-xl
                                transition
                            "
                        >

                            <Plus size={18} />

                            Thêm banner

                        </button>

                    </div>

                </div>

                {/* Table */}

                <div className="overflow-x-auto">

                    <table className="w-full">

                        <thead className="bg-gray-50">

                            <tr>

                                <th className="text-left px-6 py-4">
                                    Banner
                                </th>

                                <th className="text-left px-6 py-4">
                                    Ngày tạo
                                </th>

                                <th className="text-center px-6 py-4">
                                    Thao tác
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {banners.length === 0 && (

                                <tr>

                                    <td
                                        colSpan={3}
                                        className="py-16"
                                    >

                                        <div className="flex flex-col items-center text-gray-400">

                                            <Image size={70} />

                                            <p className="mt-4 text-lg">

                                                Chưa có banner nào

                                            </p>

                                        </div>

                                    </td>

                                </tr>

                            )}

                            {banners.map((banner) => (

                                <tr
                                    key={banner.id}
                                    onClick={() =>
                                        navigate(
                                            `/admin/banner/update/${banner.id}`
                                        )
                                    }
                                    className="border-t hover:bg-[#faf8f5] transition cursor-pointer"
                                >

                                    <td className="px-6 py-5">

                                        <img
                                            src={banner.image}
                                            alt=""
                                            className="
                                                w-64
                                                h-32
                                                object-cover
                                                rounded-xl
                                                border
                                                shadow
                                            "
                                        />

                                    </td>

                                    <td className="px-6">

                                        <div className="flex items-center gap-2 text-gray-600">

                                            <Calendar size={16} />

                                            {new Date(
                                                banner.createdAt
                                            ).toLocaleDateString("vi-VN")}

                                        </div>

                                    </td>

                                    <td className="text-center">

                                        <button
                                            onClick={(e) => {

                                                e.stopPropagation();

                                                handleDelete(
                                                    banner.id
                                                );

                                            }}
                                            className="
                                                inline-flex
                                                items-center
                                                gap-2
                                                px-4
                                                py-2
                                                rounded-lg
                                                bg-red-500
                                                hover:bg-red-600
                                                text-white
                                                transition
                                            "
                                        >

                                            <Trash2 size={16} />

                                            Xóa

                                        </button>

                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>

            </div>

        </div>

    );

};

export default ListBanner;