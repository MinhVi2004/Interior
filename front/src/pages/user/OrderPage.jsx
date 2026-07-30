import { useEffect, useState } from 'react';
import axiosInstance from './../../utils/axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Clock, PackageCheck, Truck, XCircle, CheckCircle, BadgeCheck, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const statusIcons = {
  'Đang xác nhận': <Clock className="text-yellow-500" />,
  'Đang xử lý': <PackageCheck className="text-blue-500" />,
  'Đang vận chuyển': <Truck className="text-orange-500" />,
  'Đã vận chuyển': <CheckCircle className="text-green-600" />,
  'Hoàn thành': <BadgeCheck className="text-green-700" />,
  'Đã hủy': <XCircle className="text-red-500" />,
};
const statusMap = {
    PENDING: "Đang xác nhận",
    PROCESSING: "Đang xử lý",
    SHIPPING: "Đang vận chuyển",
    DELIVERED: "Đã vận chuyển",
    COMPLETED: "Hoàn thành",
    CANCELLED: "Đã hủy",
};
const MyOrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('');
  const navigate = useNavigate();

  const fetchOrders = async () => {
    try {
      const token = sessionStorage.getItem('token');
      if (!token) {
        toast.info('Vui lòng đăng nhập để xem lịch sử đơn hàng');
        navigate('/signin?redirect=/order');
        return;
      }
      const res = await axiosInstance.get('/api/order');
      const data = res.data.reverse();
      setOrders(data);
      setFilteredOrders(data);
    } catch (err) {
        console.error(err);
      toast.error('Không thể tải lịch sử đơn hàng');
    }
  };

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem('user'));
    if (!user) {
      toast.info('Vui lòng đăng nhập');
      navigate('/');
      return;
    }
    fetchOrders();
  }, []);

  useEffect(() => {
    let result = [...orders];
    if (statusFilter) {
      result = result.filter(o => o.status === statusFilter);
    }
    if (paymentFilter) {
      result = result.filter(o => String(o.isPaid) === paymentFilter);
    }
    setFilteredOrders(result);
  }, [statusFilter, paymentFilter, orders]);

  return (
    <div className="min-h-screen bg-[#f8f6f2] py-8 px-4">

        <div className="max-w-5xl mx-auto">

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-semibold text-[#3b3028]">
                    Lịch sử đơn hàng
                </h1>

                <p className="text-[#8b8178] mt-2">
                    Theo dõi trạng thái các đơn hàng nội thất của bạn
                </p>
            </div>


            {/* Filter */}
            <div className="
                bg-white
                rounded-2xl
                p-5
                shadow-sm
                border border-[#eee5dc]
                flex
                flex-col
                sm:flex-row
                gap-4
                mb-8
            ">

                <select
                    value={statusFilter}
                    onChange={(e)=>setStatusFilter(e.target.value)}
                    className="
                        flex-1
                        border
                        border-[#ddd0c2]
                        rounded-xl
                        px-4
                        py-3
                        text-[#5c4033]
                        focus:outline-none
                        focus:ring-2
                        focus:ring-[#c8a97e]
                    "
                >
                    <option value="">
                        Tất cả trạng thái
                    </option>
                    <option value="PENDING">
                        Đang xác nhận
                    </option>
                    <option value="PROCESSING">
                        Đang xử lý
                    </option>
                    <option value="SHIPPING">
                        Đang vận chuyển
                    </option>
                    <option value="COMPLETED">
                        Hoàn thành
                    </option>
                    <option value="CANCELLED">
                        Đã hủy
                    </option>

                </select>


                <select
                    value={paymentFilter}
                    onChange={(e)=>setPaymentFilter(e.target.value)}
                    className="
                        flex-1
                        border
                        border-[#ddd0c2]
                        rounded-xl
                        px-4
                        py-3
                        text-[#5c4033]
                        focus:outline-none
                        focus:ring-2
                        focus:ring-[#c8a97e]
                    "
                >

                    <option value="">
                        Tất cả thanh toán
                    </option>

                    <option value="true">
                        Đã thanh toán
                    </option>

                    <option value="false">
                        Chưa thanh toán
                    </option>

                </select>

            </div>



            {filteredOrders.length === 0 ? (

                <div className="
                    bg-white
                    rounded-2xl
                    p-10
                    text-center
                    border
                    border-[#eee5dc]
                ">
                    <p className="text-[#8b8178]">
                        Không có đơn hàng phù hợp
                    </p>
                </div>

            ) : (

                <div className="space-y-6">

                    {filteredOrders.map(order => (

                        <Link
                            key={order.id}
                            to={`/order/${order.id}`}
                            className="
                                block
                                bg-white
                                rounded-2xl
                                overflow-hidden
                                border
                                border-[#eee5dc]
                                shadow-sm
                                hover:shadow-lg
                                transition
                            "
                        >

                            <div className="
                                p-6
                                flex
                                flex-col
                                sm:flex-row
                                justify-between
                                gap-5
                            ">


                                {/* Order info */}
                                <div>

                                    <p className="
                                        text-sm
                                        text-[#9a8174]
                                    ">
                                        Mã đơn hàng
                                    </p>

                                    <p className="
                                        text-xl
                                        font-semibold
                                        text-[#3b3028]
                                    ">
                                        #{order.id}
                                    </p>


                                    <p className="
                                        text-sm
                                        text-[#8b8178]
                                        mt-2
                                    ">
                                        {new Date(
                                            order.creatAt
                                        ).toLocaleString()}
                                    </p>

                                </div>



                                {/* Status */}
                                <div className="flex flex-col gap-3">


                                    <div className="
                                        flex
                                        items-center
                                        gap-2
                                        px-4
                                        py-2
                                        rounded-full
                                        bg-[#f5eee7]
                                        text-[#8b5e3c]
                                        font-medium
                                    ">

                                        {statusIcons[order.status] 
                                            || <Clock size={16}/>
                                        }

                                        <span>
                                            {statusMap[order.status]
                                                || order.status}
                                        </span>

                                    </div>



                                    <div className={`
                                        px-4
                                        py-2
                                        rounded-full
                                        text-center
                                        font-medium
                                        ${
                                            order.isPaid
                                            ?
                                            "bg-[#e7f1e8] text-[#567a58]"
                                            :
                                            "bg-[#f7ebe6] text-[#a45a3a]"
                                        }
                                    `}>

                                        {
                                            order.isPaid
                                            ?
                                            "Đã thanh toán"
                                            :
                                            "Chưa thanh toán"
                                        }

                                    </div>


                                </div>

                            </div>



                            {/* Footer */}
                            <div className="
                                bg-[#faf7f3]
                                border-t
                                border-[#eee5dc]
                                px-6
                                py-4
                                flex
                                justify-between
                                items-center
                            ">

                                <span className="
                                    text-[#6d625a]
                                ">
                                    Tổng tiền
                                </span>


                                <span className="
                                    text-xl
                                    font-bold
                                    text-[#8b5e3c]
                                ">
                                    {order.totalAmount.toLocaleString()}
                                    {" "}đ
                                </span>


                            </div>


                        </Link>

                    ))}

                </div>

            )}

        </div>

    </div>
);
};

export default MyOrderPage;