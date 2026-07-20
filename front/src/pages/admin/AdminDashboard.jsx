import { useEffect, useState } from 'react';
import axiosInstance from './../../utils/axios';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from 'recharts';
import {
    CheckCircle,
    XCircle,
    ShoppingCart,
    CreditCard,
    Wallet,
    DollarSign,
} from 'lucide-react';

const AdminDashboard = () => {
    const [orders, setOrders] = useState([]);
    const [stats, setStats] = useState({
        total: 0,
        paid: 0,
        unpaid: 0,
        revenue: 0,
    });
    const [monthlyRevenue, setMonthlyRevenue] = useState([]);
    const getStatusBadge = status => {
    const base =
        'text-xs font-medium px-2 py-1 rounded-full inline-block';
    switch (status) {
        case 'Đang xác nhận':
            return `${base} bg-yellow-100 text-yellow-700`;
        case 'Đang xử lý':
            return `${base} bg-purple-100 text-purple-700`;
        case 'Đang vận chuyển':
            return `${base} bg-blue-100 text-blue-700`;
        case 'Đã vận chuyển':
            return `${base} bg-indigo-100 text-indigo-700`;
        case 'Hoàn thành':
            return `${base} bg-green-100 text-green-700`;
        case 'Đã hủy':
            return `${base} bg-red-100 text-red-600`;
        default:
            return `${base} bg-gray-100 text-gray-700`;
    }
};

    useEffect(() => {
        fetchData();
    }, []);
    const isThisWeek = date => {
        const now = new Date();
        const inputDate = new Date(date);

        const dayOfWeek = now.getDay(); // 0 (CN) → 6 (T7)

        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - dayOfWeek);
        startOfWeek.setHours(0, 0, 0, 0); // reset to 00:00:00

        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999); // end of day

        return inputDate >= startOfWeek && inputDate <= endOfWeek;
    };

    const fetchData = async () => {
        try {
            const res = await axiosInstance.get('/api/order/admin');
            const orderData = res.data;

            let total = orderData.length;
            let paid = orderData.filter(o => o.isPaid).length;
            let unpaid = total - paid;
            let revenue = orderData.reduce(
                (sum, o) => (o.isPaid ? sum + o.totalAmount : sum),
                0
            );

            const monthly = Array(12).fill(0);
            orderData.forEach(o => {
                const date = new Date(o.createdAt);
                const month = date.getMonth();
                if (o.isPaid) monthly[month] += o.totalAmount;
            });

            const monthlyChartData = monthly.map((value, index) => ({
                name: `Th ${index + 1}`,
                revenue: value,
            }));

            const ordersThisWeek = orderData.filter(o =>
                isThisWeek(o.createdAt)
            );

            setOrders(ordersThisWeek.reverse());
            setStats({ total, paid, unpaid, revenue });
            setMonthlyRevenue(monthlyChartData);
        } catch (err) {
            console.error('Error loading orders', err);
        }
    };

    return (
    <div className="min-h-screen bg-[#f7f5f2] p-6">

        {/* Header */}

        <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#8B5E3C]">
                Dashboard
            </h1>

            <p className="text-gray-500 mt-2">
                Tổng quan hoạt động cửa hàng nội thất
            </p>
        </div>

        {/* Statistics */}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

            <StatCard
                title="Tổng đơn hàng"
                value={stats.total}
                icon={<ShoppingCart size={28} />}
                bg="bg-[#8B5E3C]/10"
                color="text-[#8B5E3C]"
            />

            <StatCard
                title="Đã thanh toán"
                value={stats.paid}
                icon={<CreditCard size={28} />}
                bg="bg-green-100"
                color="text-green-600"
            />

            <StatCard
                title="Chưa thanh toán"
                value={stats.unpaid}
                icon={<Wallet size={28} />}
                bg="bg-red-100"
                color="text-red-600"
            />

            <StatCard
                title="Doanh thu"
                value={stats.revenue.toLocaleString()}
                suffix=" đ"
                icon={<DollarSign size={28} />}
                bg="bg-[#8B5E3C]/10"
                color="text-[#8B5E3C]"
            />

        </div>

        {/* Chart */}

        <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition mt-8 p-6">

            <h2 className="text-xl font-semibold">
                Doanh thu theo tháng
            </h2>

            <p className="text-gray-500 mb-6">
                Doanh thu các đơn đã thanh toán
            </p>

            <ResponsiveContainer width="100%" height={350}>

                <BarChart data={monthlyRevenue}>

                    <CartesianGrid strokeDasharray="3 3" />

                    <XAxis dataKey="name" />

                    <YAxis tickFormatter={v => `${v / 1000000}tr`} />

                    <Tooltip
                        formatter={value => `${value.toLocaleString()} đ`}
                    />

                    <Bar
                        dataKey="revenue"
                        fill="#8B5E3C"
                        radius={[8, 8, 0, 0]}
                    />

                </BarChart>

            </ResponsiveContainer>

        </div>

        {/* Orders */}

        <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition mt-8 p-6">

            <div className="mb-6">

                <h2 className="text-xl font-semibold">
                    Đơn hàng tuần này
                </h2>

                <p className="text-gray-500">
                    Các đơn hàng được tạo trong tuần
                </p>

            </div>

            <div className="overflow-x-auto">

                <table className="min-w-full">

                    <thead>

                        <tr className="bg-gray-50 border-b">

                            <th className="px-4 py-4 text-left">
                                Mã đơn
                            </th>

                            <th className="px-4 py-4 text-center">
                                Thanh toán
                            </th>

                            <th className="px-4 py-4 text-center">
                                Ngày đặt
                            </th>

                            <th className="px-4 py-4 text-center">
                                Tổng tiền
                            </th>

                            <th className="px-4 py-4 text-center">
                                Trạng thái
                            </th>

                            <th className="px-4 py-4 text-center">
                                Payment
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {orders.map(order => (

                            <tr
                                key={order.id}
                                className="border-b hover:bg-[#faf7f4] transition"
                            >

                                <td className="px-4 py-4 font-semibold text-[#8B5E3C]">
                                    {order.id.toUpperCase()}
                                </td>

                                <td className="px-4 py-4 text-center">
                                    {order.paymentMethod}
                                </td>

                                <td className="px-4 py-4 text-center">
                                    {new Date(order.createdAt).toLocaleDateString()}
                                </td>

                                <td className="px-4 py-4 text-center font-semibold text-[#8B5E3C]">
                                    {order.totalAmount.toLocaleString()} đ
                                </td>

                                <td className="px-4 py-4 text-center">

                                    <span className={getStatusBadge(order.status)}>
                                        {order.status}
                                    </span>

                                </td>

                                <td className="px-4 py-4 text-center">

                                    {order.isPaid ? (

                                        <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">

                                            <CheckCircle size={15} />

                                            Đã thanh toán

                                        </span>

                                    ) : (

                                        <span className="inline-flex items-center gap-1 bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-semibold">

                                            <XCircle size={15} />

                                            Chưa thanh toán

                                        </span>

                                    )}

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

const StatCard = ({
    title,
    value,
    icon,
    bg,
    color,
    suffix = '',
}) => {

    return (

        <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 p-6">

            <div className="flex items-center justify-between">

                <div>

                    <p className="text-gray-500 text-sm">
                        {title}
                    </p>

                    <h2 className={`text-3xl font-bold mt-2 ${color}`}>
                        {value}
                        {suffix}
                    </h2>

                </div>

                <div className={`${bg} p-4 rounded-full ${color}`}>

                    {icon}

                </div>

            </div>

        </div>

    );

};

export default AdminDashboard;
