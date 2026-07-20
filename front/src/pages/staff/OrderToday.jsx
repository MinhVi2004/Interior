import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axios";
import {
  ShoppingCart,
  DollarSign,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom"; // thêm vào đầu file
// ✅ định dạng VND
const formatCurrency = (value) => {
  if (!value && value !== 0) return '';
  return value.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });
};

// ✅ Thẻ thống kê
const StatCard = ({ label, value, icon: Icon, color }) => (
  <div className="bg-white rounded-xl shadow p-4 border flex items-center gap-4">
    <div className={`p-3 rounded-full ${color} bg-opacity-10`}>
      <Icon className={`${color} w-6 h-6`} />
    </div>
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-xl font-bold text-gray-800">{value}</p>
    </div>
  </div>
);

// ✅ Bảng đơn hàng
const OrderTable = ({ orders }) => {
  const navigate = useNavigate();
  if (orders.length === 0) {
    return (
      <div className="text-center text-gray-500 mt-10">
        Không có đơn hàng nào hôm nay.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
          <tr>
            <th className="px-4 py-3 text-left">Mã đơn</th>
            <th className="px-4 py-3 text-left">Thu ngân</th>
            <th className="px-4 py-3 text-left">Tổng tiền</th>
            <th className="px-4 py-3 text-left">Thanh toán</th>
            <th className="px-4 py-3 text-left">Thời gian</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="border-t hover:bg-gray-50" onClick={() => navigate(`/staff/order/${order.id}`)}>
              <td className="px-4 py-3 font-medium text-gray-800">{order.id.toUpperCase()}</td>
              <td className="px-4 py-3">{order.user?.name || "N/A"}</td>
              <td className="px-4 py-3 text-green-600 font-medium">
                {formatCurrency(order.totalAmount)}
              </td>
              <td className="px-4 py-3">
                {order.isPaid ? (
                  <span className="text-green-600 font-semibold">✓Đã thanh toán</span>
                ) : (
                  <span className="text-red-500 font-semibold">✕ Chưa thanh toán</span>
                )}
              </td>
              <td className="px-4 py-3">
                {new Date(order.createdAt).toLocaleString("vi-VN")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// ✅ Trang chính
const OrderToday = () => {
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({});
  const today = new Date().toLocaleDateString("vi-VN");
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axiosInstance.get("/api/staff/orderToday");
        setOrders(res.data.orders);
        setStats(res.data.stats);
      } catch (error) {
        console.error("Lỗi khi tải đơn hàng:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        🧾 Đơn hàng tại cửa hàng: {today}
      </h2>

      {/* Thống kê */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <StatCard label="Tổng đơn" value={stats.totalOrders || 0} icon={ShoppingCart} color="text-blue-500" />
        <StatCard label="Tổng doanh thu" value={formatCurrency(stats.totalRevenue || 0)} icon={DollarSign} color="text-green-500" />
      </div>

      {/* Danh sách đơn */}
      <OrderTable orders={orders} />
    </div>
  );
};

export default OrderToday;
