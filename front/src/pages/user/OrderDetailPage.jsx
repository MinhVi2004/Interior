import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axiosInstance from "../../utils/axios";
import { toast } from "react-toastify";
import {
  Clock,
  PackageCheck,
  Truck,
  XCircle,
  CheckCircle,
  MapPin,
  ReceiptText,
  ShoppingBasket,
  ArrowLeftToLine,
} from "lucide-react";

const statusIcons = {
  PENDING: <Clock size={18} />,
  CONFIRMED: <CheckCircle size={18} />,
  PACKING: <PackageCheck size={18} />,
  SHIPPING: <Truck size={18} />,
  DELIVERED: <CheckCircle size={18} />,
  REFUNDED: <ReceiptText size={18} />,
  CANCELLED: <XCircle size={18} />,
};

const statusLabel = {
  PENDING: "Chờ xác nhận",
  CONFIRMED: "Đã xác nhận",
  PACKING: "Đang đóng gói",
  SHIPPING: "Đang vận chuyển",
  DELIVERED: "Đã giao hàng",
  REFUNDED: "Đã hoàn tiền",
  CANCELLED: "Đã hủy",
};

const OrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const handlePayment = async () => {
    try {
      const res = await axiosInstance.post("/api/order/create-vnpay", {
        orderId: id,
        totalAmount: order.totalAmount,
        retry: true, // thông báo cho backend rằng đây là thanh toán lại
      });

      if (res.data.url) {
        window.location.href = res.data.url; // chuyển hướng đến VNPAY
      } else {
        toast.error("Không lấy được link thanh toán");
      }
    } catch (err) {
      toast.error("Lỗi khi tạo thanh toán");
      console.error(err);
    }
  };

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    if (!user) {
      toast.info("Vui lòng đăng nhập");
      navigate("/");
      return;
    }

    const fetchOrder = async () => {
      try {
        const token = sessionStorage.getItem("token");
        if (!token) {
          toast.info("Vui lòng đăng nhập để xem chi tiết đơn hàng");
          navigate("/signin?redirect=/order");
          return;
        }

        const res = await axiosInstance.get(`/api/order/${id}`);
        setOrder(res.data);
      } catch {
        toast.error("Không thể tải đơn hàng");
      }
    };

    fetchOrder();
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
    <div className="min-h-screen bg-[#f8f6f2]">
      <div
        className="
            max-w-6xl
            mx-auto
            p-4 md:p-6
            relative
        "
      >
        {/* Back button */}
        <button
          onClick={() => navigate("/order")}
          className="absolute top-6 left-6 flex items-center gap-2 text-black-600 hover:text-gray-700 transition"
        >
          <ArrowLeftToLine size={22} />
          <span className="font-medium">Quay lại</span>
        </button>

        {/* Header */}
        <div className="flex flex-col items-center text-center mb-10 mt-10">
          {/* <CheckCircle className="w-20 h-20 text-green-500 mb-3" /> */}
          <h1 className="text-3xl font-bold text-black-600">
            Chi tiết đơn hàng
          </h1>
          {/* <p className="text-gray-600 mt-2">Cảm ơn bạnĐã đặt hàng tại cửa hàng của chúng tôi.</p> */}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {/* Trái: danh sách sản phẩm */}
          <div className="md:col-span-3 space-y-6">
            {/* Danh sách sản phẩm */}
            <div className="bg-white rounded-2xl shadow-sm border border-[#eadfd5] p-6">
              <h2 className="flex items-center gap-2 font-semibold text-[#3b3028] mb-5">
                <ShoppingBasket size={20} className="text-[#8b5e3c]" />
                Sản phẩm đã mua
              </h2>

              <div className="space-y-4">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="
                flex gap-5
                rounded-xl
                border border-[#eee3d8]
                p-4
                hover:shadow-md
                transition
                "
                  >
                    <Link to={`/product/${item.product.sku}`}>
                      <img
                        src={item.product.thumbnail || "/website/default.png"}
                        alt={item.product.name}
                        className="
                        w-20 h-20
                        rounded-xl
                        object-cover
                        bg-[#f5eee7]
                        "
                      />
                    </Link>

                    <div className="flex-1">
                      <Link
                        to={`/product/${item.product.sku}`}
                        className="
                        font-semibold
                        text-[#3b3028]
                        hover:text-[#8b5e3c]
                        "
                      >
                        {item.product.name}
                      </Link>

                      <p className="text-sm text-gray-500 mt-2">
                        Mã sản phẩm: {item.product.sku}
                      </p>

                      <p className="text-sm text-gray-600 mt-1">
                        Số lượng: {item.quantity}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="font-semibold text-[#8b5e3c]">
                        {item.price.toLocaleString()} đ
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Phải: địa chỉ + thông tin đơn hàng */}
          <div className="space-y-6 md:col-span-2">
            {/* địa chỉ giao hàng */}
            <div className="bg-white rounded-2xl shadow p-5 border">
              <h2 className="flex items-center gap-2 font-semibold text-gray-800 mb-2">
                <MapPin size={20} />
                Địa chỉ giao hàng
              </h2>
              <p className="text-gray-700 font-medium">
                {order.address.fullName} - {order.address.phoneNumber}
              </p>
              <p className="text-gray-600 leading-relaxed">
                {order.address.fullAddress}
              </p>
            </div>

            {/* Thông tin đơn hàng */}
            <div className="bg-white rounded-2xl shadow p-5 border h-fit">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-800 mb-4">
                <ReceiptText size={20} />
                Thông tin đơn hàng
              </h2>

              <div className="space-y-3 text-sm text-gray-700">
                <div className="flex justify-between">
                  <span>Mã đơn hàng:</span>
                  <span className="font-medium">{order.id}</span>
                </div>
                <div className="flex justify-between">
                  <span>Thời gian đặt:</span>
                  <span>{new Date(order.createdAt).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Phương thức thanh toán:</span>
                  <span className="capitalize">{order.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span>Trạng thái thanh toán:</span>
                  <span
                    className={`font-semibold ${
                      order.isPaid ? "text-green-600" : "text-red-500"
                    }`}
                  >
                    {order.isPaid ? "Đã thanh toán" : "Chưa thanh toán"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Trạng thái đơn hàng:</span>
                  <span
                    className={`
        inline-flex items-center gap-2
        px-3 py-1.5
        rounded-full
        text-sm font-semibold
        ${
          order.status === "PENDING"
            ? "text-[#9A6F2F] bg-[#FBF3E3]"
            : order.status === "CONFIRMED"
              ? "text-[#6F5948] bg-[#F2EAE3]"
              : order.status === "PACKING"
                ? "text-[#7A5A78] bg-[#F3EAF2]"
                : order.status === "SHIPPING"
                  ? "text-[#5E718F] bg-[#EAF0F7]"
                  : order.status === "DELIVERED"
                    ? "text-[#5F7F63] bg-[#EAF3EB]"
                    : order.status === "REFUNDED"
                      ? "text-[#A66A3F] bg-[#FBEEE5]"
                      : order.status === "CANCELLED"
                        ? "text-[#A85454] bg-[#FAEAEA]"
                        : "text-[#6F6259] bg-[#F5F0EB]"
        }
    `}
                  >
                    {statusIcons[order.status] || <Clock size={18} />}
                    {statusLabel[order.status] || order.status}
                  </span>
                </div>
              </div>

              <div className="mt-6 border-t pt-4 flex justify-between text-base font-semibold">
                <span>Tổng thanh toán:</span>
                <span className="text-xl text-black">
                  {order.totalAmount.toLocaleString()} đ
                </span>
              </div>
              {/* {!order.isPaid && (
                            <div className="mt-6">
                                <button
                                    onClick={handlePayment}
                                    className="w-full py-2 px-4 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
                                >
                                    Thanh toán ngay
                                </button>
                            </div>
                        )} */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
