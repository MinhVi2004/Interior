import { useEffect, useState } from "react";
import axiosInstance from "../../../utils/axios";
import { useNavigate } from "react-router-dom";

const OrderPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [isPaidFilter, setIsPaidFilter] = useState("ALL");

    const navigate = useNavigate();

    const statuses = [
        { value: "ALL", label: "Tất cả" },
        { value: "PENDING", label: "Chờ xác nhận" },
        { value: "PROCESSING", label: "Đang xử lý" },
        { value: "SHIPPING", label: "Đang vận chuyển" },
        { value: "DELIVERED", label: "Đã giao hàng" },
        { value: "COMPLETED", label: "Hoàn thành" },
        { value: "CANCELLED", label: "Đã hủy" },
    ];


    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);

            try {
                const res = await axiosInstance.get("/api/order/admin");
                setOrders(res.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);


    const filteredOrders = orders.filter(order => {
        const matchStatus =
            statusFilter === "ALL" ||
            order.status === statusFilter;

        const matchPaid =
            isPaidFilter === "ALL" ||
            (isPaidFilter === "PAID" && order.isPaid) ||
            (isPaidFilter === "UNPAID" && !order.isPaid);

        return matchStatus && matchPaid;
    });


    const statusLabel = {
        PENDING: "Chờ xác nhận",
        PROCESSING: "Đang xử lý",
        SHIPPING: "Đang vận chuyển",
        DELIVERED: "Đã giao hàng",
        COMPLETED: "Hoàn thành",
        CANCELLED: "Đã hủy",
    };


    const statusClass = status => {
        switch(status) {
            case "PENDING":
                return "bg-yellow-100 text-yellow-700";

            case "PROCESSING":
                return "bg-purple-100 text-purple-700";

            case "SHIPPING":
                return "bg-blue-100 text-blue-700";

            case "DELIVERED":
                return "bg-indigo-100 text-indigo-700";

            case "COMPLETED":
                return "bg-green-100 text-green-700";

            case "CANCELLED":
                return "bg-red-100 text-red-700";

            default:
                return "bg-gray-100 text-gray-700";
        }
    };


    return (
        <div className="min-h-screen bg-[#f8f6f2] p-6">

            <div className="max-w-7xl mx-auto">

                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-[#3b3028]">
                        Quản lý đơn hàng
                    </h1>

                    <p className="text-gray-500 mt-2">
                        Theo dõi và xử lý các đơn đặt hàng
                    </p>
                </div>


                {/* Filter */}
                <div className="
                    bg-white
                    rounded-2xl
                    shadow-sm
                    border
                    p-5
                    mb-6
                    flex
                    flex-wrap
                    gap-5
                ">

                    <div>
                        <label className="block text-sm mb-2 text-gray-600">
                            Trạng thái
                        </label>

                        <select
                            value={statusFilter}
                            onChange={e=>setStatusFilter(e.target.value)}
                            className="
                                px-4
                                py-2
                                border
                                rounded-xl
                            "
                        >
                            {
                                statuses.map(item=>(
                                    <option 
                                        key={item.value}
                                        value={item.value}
                                    >
                                        {item.label}
                                    </option>
                                ))
                            }
                        </select>
                    </div>



                    <div>
                        <label className="block text-sm mb-2 text-gray-600">
                            Thanh toán
                        </label>

                        <select
                            value={isPaidFilter}
                            onChange={e=>setIsPaidFilter(e.target.value)}
                            className="
                                px-4
                                py-2
                                border
                                rounded-xl
                            "
                        >
                            <option value="ALL">
                                Tất cả
                            </option>

                            <option value="PAID">
                                Đã thanh toán
                            </option>

                            <option value="UNPAID">
                                Chưa thanh toán
                            </option>

                        </select>
                    </div>

                </div>



                {
                    loading ? (

                        <div className="text-center text-gray-500">
                            Đang tải...
                        </div>

                    ) : (

                    <div className="
                        bg-white
                        rounded-2xl
                        shadow-sm
                        border
                        overflow-hidden
                    ">

                        <table className="w-full text-sm">

                            <thead className="bg-[#f5f1eb]">

                                <tr>
                                    <th className="px-5 py-4 text-left">
                                        Mã đơn
                                    </th>

                                    <th className="px-5 py-4 text-left">
                                        Thanh toán
                                    </th>

                                    <th className="px-5 py-4 text-left">
                                        Phương thức
                                    </th>

                                    <th className="px-5 py-4 text-left">
                                        Tổng tiền
                                    </th>

                                    <th className="px-5 py-4 text-left">
                                        Trạng thái
                                    </th>

                                    <th className="px-5 py-4 text-left">
                                        Ngày tạo
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                            {
                                filteredOrders.map(order=>(

                                    <tr
                                        key={order.id}
                                        onClick={()=>
                                            navigate(`/admin/order/${order.id}`)
                                        }
                                        className="
                                            border-b
                                            hover:bg-gray-50
                                            cursor-pointer
                                        "
                                    >

                                        <td className="
                                            px-5
                                            py-4
                                            font-semibold
                                            text-[#8b5e3c]
                                        ">
                                            #{order.id}
                                        </td>


                                        <td className="px-5 py-4">

                                            {
                                                order.isPaid ?

                                                <span className="
                                                    px-3 py-1
                                                    rounded-full
                                                    bg-green-100
                                                    text-green-700
                                                ">
                                                    Đã thanh toán
                                                </span>

                                                :

                                                <span className="
                                                    px-3 py-1
                                                    rounded-full
                                                    bg-red-100
                                                    text-red-700
                                                ">
                                                    Chưa thanh toán
                                                </span>
                                            }

                                        </td>


                                        <td className="px-5 py-4">
                                            {order.paymentMethod}
                                        </td>


                                        <td className="
                                            px-5
                                            py-4
                                            font-semibold
                                        ">
                                            {order.totalAmount.toLocaleString("vi-VN")} đ
                                        </td>


                                        <td className="px-5 py-4">

                                            <span className={`
                                                px-3
                                                py-1
                                                rounded-full
                                                text-xs
                                                font-medium
                                                ${statusClass(order.status)}
                                            `}>
                                                {statusLabel[order.status]}
                                            </span>

                                        </td>


                                        <td className="px-5 py-4 text-gray-500">

                                            {
                                                new Date(order.createdAt)
                                                .toLocaleString("vi-VN")
                                            }

                                        </td>


                                    </tr>

                                ))
                            }


                            {
                                filteredOrders.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan="6"
                                            className="
                                                text-center
                                                py-8
                                                text-gray-500
                                            "
                                        >
                                            Không có đơn hàng
                                        </td>
                                    </tr>
                                )
                            }


                            </tbody>

                        </table>

                    </div>

                    )
                }

            </div>

        </div>
    );
};

export default OrderPage;