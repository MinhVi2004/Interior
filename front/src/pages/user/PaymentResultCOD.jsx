import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axiosInstance from './../../utils/axios';
import {
    CheckCircle,
    ReceiptText,
    ShoppingBasket,
    MapPin,
    ArrowLeftToLine,
} from 'lucide-react';

const PaymentResultCOD = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const res = await axiosInstance.get(`/api/order/${id}`);
                setOrder(res.data);
            } catch (err) {
                console.error('Lỗi lấy đơn hàng COD:', err);
                // navigate('/');
            }
        };

        if (id) fetchOrder();
    }, [id]);

    if (!order)
    return (
        <div className="min-h-[400px] flex items-center justify-center bg-[#FAF7F3]">
            <div className="flex flex-col items-center gap-5">
                <div className="relative">
                    <div className="w-16 h-16 rounded-full border-4 border-[#E8DDD3]"></div>
                    <div className="absolute top-0 left-0 w-16 h-16 rounded-full border-4 border-[#8B5E3C] border-t-transparent animate-spin"></div>
                </div>

                <div className="text-center">
                    <p className="text-lg font-medium text-[#5C4033]">
                        Đang tải đơn hàng...
                    </p>
                    <p className="text-sm text-[#9A8174] mt-1">
                        Vui lòng chờ trong giây lát
                    </p>
                </div>
            </div>
        </div>
    );

    return (
    <div className="min-h-screen bg-[#F8F5F1] py-10 px-4">
        <div className="max-w-6xl mx-auto">
            {/* Back button */}
            <button
                onClick={() => navigate('/')}
                className="mb-8 flex items-center gap-2 text-[#8B5E3C] hover:text-[#6F472B] transition"
            >
                <ArrowLeftToLine size={20} />
                <span className="font-medium">Quay lại trang chủ</span>
            </button>

            {/* Success */}
            <div className="bg-white rounded-3xl border border-[#ECE5DD] shadow-sm p-10 text-center mb-8">
                <div className="w-20 h-20 rounded-full bg-[#F3ECE5] flex items-center justify-center mx-auto mb-5">
                    <CheckCircle className="w-10 h-10 text-[#8B5E3C]" />
                </div>

                <h1 className="text-3xl font-bold text-[#5C4033]">
                    Đặt hàng thành công
                </h1>

                <p className="mt-3 text-gray-500">
                    Cảm ơn bạn đã đặt hàng tại cửa hàng của chúng tôi.
                </p>

                <p className="text-sm text-gray-400 mt-2">
                    Chúng tôi sẽ liên hệ với bạn để xác nhận đơn hàng trong thời gian sớm nhất.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Shipping */}
                    <div className="bg-white rounded-3xl border border-[#ECE5DD] shadow-sm p-6">
                        <h2 className="flex items-center gap-2 text-xl font-semibold text-[#5C4033] mb-5">
                            <MapPin size={20} />
                            Địa chỉ giao hàng
                        </h2>

                        <div className="space-y-2 text-gray-600">
                            <p className="font-semibold text-[#5C4033]">
                                {order.address.fullName}
                            </p>

                            <p>{order.address.phoneNumber}</p>

                            <p>
                                {order.address.detail},{" "}
                                {order.address.ward},{" "}
                                {order.address.district},{" "}
                                {order.address.province}
                            </p>
                        </div>
                    </div>

                    {/* Products */}
                    <div className="bg-white rounded-3xl border border-[#ECE5DD] shadow-sm p-6">

                        <h2 className="flex items-center gap-2 text-xl font-semibold text-[#5C4033] mb-6">
                            <ShoppingBasket size={20} />
                            Sản phẩm đã mua
                        </h2>

                        <div className="space-y-5">

                            {order.items?.map((item) => {
                                const product = item.product;

                                return (
                                    <div
                                        key={item.id}
                                        className="flex flex-col sm:flex-row gap-5 border border-[#ECE5DD] rounded-2xl p-5 hover:shadow-md transition"
                                    >
                                        <Link to={`/product/${product.sku}`}>
                                            <img
                                                src={product.thumbnail}
                                                alt={product.name}
                                                className="w-full sm:w-32 h-32 object-cover rounded-xl"
                                            />
                                        </Link>

                                        <div className="flex-1 flex flex-col justify-between">

                                            <div>

                                                <Link
                                                    to={`/product/${product.sku}`}
                                                    className="text-xl font-semibold text-[#5C4033] hover:text-[#8B5E3C]"
                                                >
                                                    {product.name}
                                                </Link>

                                                <p className="text-sm text-gray-500 mt-2">
                                                    SKU: {product.sku}
                                                </p>

                                                <p className="text-sm text-gray-500 mt-1">
                                                    Số lượng: {item.quantity}
                                                </p>

                                            </div>

                                            <div className="mt-4 text-2xl font-bold text-[#8B5E3C]">
                                                {item.price.toLocaleString()} đ
                                            </div>

                                        </div>
                                    </div>
                                );
                            })}

                        </div>
                    </div>
                </div>

                {/* Right */}
                <div className="bg-white rounded-3xl border border-[#ECE5DD] shadow-sm p-6 h-fit sticky top-24">

                    <h2 className="flex items-center gap-2 text-xl font-semibold text-[#5C4033] mb-6">
                        <ReceiptText size={20} />
                        Thông tin đơn hàng
                    </h2>

                    <div className="space-y-5 text-sm">

                        <div className="flex justify-between">
                            <span className="text-gray-500">
                                Mã đơn hàng
                            </span>

                            <span className="font-semibold">
                                #{order.id}
                            </span>
                        </div>

                        <div className="flex justify-between">
                            <span className="text-gray-500">
                                Ngày đặt
                            </span>

                            <span className="font-medium">
                                {new Date(order.createdAt).toLocaleString()}
                            </span>
                        </div>

                        <div className="flex justify-between">
                            <span className="text-gray-500">
                                Thanh toán
                            </span>

                            <span className="font-medium">
                                {order.paymentMethod}
                            </span>
                        </div>

                        <div className="flex justify-between items-center">
                            <span className="text-gray-500">
                                Trạng thái thanh toán
                            </span>

                            <span
                                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                    order.isPaid
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-orange-100 text-orange-700'
                                }`}
                            >
                                {order.isPaid
                                    ? 'Đã thanh toán'
                                    : 'Thanh toán khi nhận hàng'}
                            </span>
                        </div>

                        <div className="flex justify-between items-center">
                            <span className="text-gray-500">
                                Trạng thái đơn
                            </span>

                            <span className="px-3 py-1 rounded-full bg-[#F4ECE6] text-[#8B5E3C] text-xs font-semibold">
                                {order.status}
                            </span>
                        </div>

                    </div>

                    <div className="border-t border-[#ECE5DD] mt-8 pt-6">

                        <div className="flex justify-between items-center">

                            <span className="text-lg font-semibold">
                                Tổng thanh toán
                            </span>

                            <span className="text-3xl font-bold text-[#8B5E3C]">
                                {order.totalAmount.toLocaleString()} đ
                            </span>

                        </div>

                    </div>

                    <div className="mt-8 space-y-3">

                        <button
                            onClick={() => navigate('/')}
                            className="w-full py-3 rounded-xl bg-[#8B5E3C] text-white hover:bg-[#744B2E] transition"
                        >
                            Tiếp tục mua sắm
                        </button>

                        <button
                            onClick={() => navigate('/orders')}
                            className="w-full py-3 rounded-xl border border-[#8B5E3C] text-[#8B5E3C] hover:bg-[#F4ECE6] transition"
                        >
                            Xem đơn hàng
                        </button>

                    </div>

                </div>
            </div>
        </div>
    </div>
);
};

export default PaymentResultCOD;
