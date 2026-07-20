import { useState, useEffect } from 'react';
import axiosInstance from './../../utils/axios';
import { MapPin, Edit, Trash2, CheckCircle, Check, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const CheckoutPage = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('COD');
    const [addresses, setAddresses] = useState([]);
    const [formVisible, setFormVisible] = useState(false);
    const [form, setForm] = useState({
        fullName: '',
        phoneNumber: '',
        province: '',
        district: '',
        ward: '',
        detail: '',
        isDefault: false,
    });
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [isEdit, setIsEdit] = useState(false);
    const [editId, setEditId] = useState(null);

    const [cartItems, setCartItems] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);

    const navigate = useNavigate();
    const user = JSON.parse(sessionStorage.getItem('user'));
    // Thêm hàm lấy giá sản phẩm
    const getItemPrice = item => {
        // Nếu có variant và size
        if (item.variant && item.size) {
            const sizeObj = item.variant.sizes?.find(s => s.size === item.size);
            if (sizeObj) return sizeObj.price;
        }
        // fallback: giá product
        return item.product?.price || 0;
    };

    // Tính tổng tiền
    const totalPrice = cartItems.reduce(
        (total, item) => total + getItemPrice(item) * item.quantity,
        0
    );
    const fetchAddresses = async () => {
        try {
            const res = await axiosInstance.get('/api/address');
            setAddresses(res.data);
        } catch {
            toast.error('Không thể tải địa chỉ');
        }
    };

    const fetchCart = async () => {
        try {
            const res = await axiosInstance.get('/api/cart');
            const items = res.data?.items || [];

            if (items.length === 0) {
                toast.info('Giỏ hàng trống, vui lòng chọn thêm sản phẩm');
                navigate('/');
                return;
            }

            setCartItems(items);
        } catch {
            toast.error('Không thể tải giỏ hàng');
        }
    };
    useEffect(() => {
        if (!user) {
            toast.info('Vui lòng đăng nhập');
            navigate('/');
            return;
        }

        const init = async () => {
            await fetchAddresses();
            await fetchCart();
            await fetchProvinces();
        };

        init();
    }, []);
    const fetchProvinces = async () => {
        const res = await fetch('https://provinces.open-api.vn/api/?depth=1');
        const data = await res.json();
        setProvinces(data);
    };
    useEffect(() => {
        if (form.province) {
            const selected = provinces.find(p => p.name === form.province);
            if (selected) {
                fetch(
                    `https://provinces.open-api.vn/api/p/${selected.code}?depth=2`
                )
                    .then(res => res.json())
                    .then(data => setDistricts(data.districts));
            }
        } else {
            setDistricts([]);
            setWards([]);
        }
        setForm(prev => ({ ...prev, district: '', ward: '' }));
    }, [form.province]);

    useEffect(() => {
        if (form.district) {
            const selected = districts.find(d => d.name === form.district);
            if (selected) {
                fetch(
                    `https://provinces.open-api.vn/api/d/${selected.code}?depth=2`
                )
                    .then(res => res.json())
                    .then(data => setWards(data.wards));
            }
        } else {
            setWards([]);
        }
        setForm(prev => ({ ...prev, ward: '' }));
    }, [form.district]);

    const handleAddressSelect = address => {
        setSelectedAddress(address);
    };

    const handleSubmit = async e => {
        e.preventDefault();

        const nameRegex = /^[^\d]{6,}$/; // fullName: ít nhất 6 ký tự, không chứa số
        const phoneRegex = /^(0|\+84)(\d{9})$/; // phone: bắt đầu bằng 0 hoặc +84, có 10 số

        if (!form.fullName.trim()) {
            toast.warning('Họ tên không được để trống.');
            return;
        }

        if (!nameRegex.test(form.fullName.trim())) {
            toast.warning('Họ tên phải ít nhất 6 ký tự và không chứa số.');
            return;
        }

        if (!form.phoneNumber.trim()) {
            toast.warning('Số điện thoại không được để trống.');
            return;
        }

        if (!phoneRegex.test(form.phoneNumber.trim())) {
            toast.warning('Số điện thoại không đúng định dạng.');
            return;
        }

        if (!form.province || !form.district || !form.ward) {
            toast.warning(
                'Vui lòng chọn đầy đủ Tỉnh/Thành, Quận/Huyện và Phường/Xã.'
            );
            return;
        }

        if (!form.detail.trim() || form.detail.trim().length < 6) {
            toast.warning(' Địa chỉ chi tiết phải có ít nhất 6 ký tự.');
            return;
        }

        try {
            if (isEdit) {
                await axiosInstance.put(`/api/address/${editId}`, form);
                toast.success('Cập nhật địa chỉ thành công.');
            } else {
                await axiosInstance.post('/api/address', form);
                toast.success('Thêm địa chỉ thành công.');
            }

            setFormVisible(false);
            resetForm();
            fetchAddresses();
        } catch (error) {
            toast.error('Đã xảy ra lỗi khi gửi dữ liệu.');
        }
    };

    const handleEdit = async address => {
        setFormVisible(true);
        setIsEdit(true);
        setEditId(address.id);
        setForm(address); // Gán trước để hiển thị dữ liệu sẵn

        // đảm bảo provincesĐã có
        if (provinces.length === 0) {
            await fetchProvinces();
        }

        // Tìm province đang chọn
        const selectedProvince = provinces.find(
            p => p.name === address.province
        );

        if (selectedProvince) {
            // Fetch danh sách quận/huyện theo tỉnh
            const res = await fetch(
                `https://provinces.open-api.vn/api/p/${selectedProvince.code}?depth=2`
            );
            const data = await res.json();
            const fetchedDistricts = data.districts;
            setDistricts(fetchedDistricts);

            // Tìm district đang chọn
            const selectedDistrict = fetchedDistricts.find(
                d => d.name === address.district
            );

            if (selectedDistrict) {
                // Gán lại để đảm bảo cập nhật (cần thiết trong một số trường hợp)
                setForm(prev => ({ ...prev, district: selectedDistrict.name }));

                // Fetch danh sách phường/xã theo quận/huyện
                const res2 = await fetch(
                    `https://provinces.open-api.vn/api/d/${selectedDistrict.code}?depth=2`
                );
                const data2 = await res2.json();
                setWards(data2.wards);

                // đảm bảo form.ward cũng được cập nhật đúng
                setForm(prev => ({
                    ...prev,
                    ward: address.ward, // đảm bảo chọn lại đúng phường
                }));
            }
        }
    };

    const handleDelete = async id => {
        if (confirm('Xác nhận xóa địa chỉ này?')) {
            await axiosInstance.delete(`/api/address/${id}`);
            fetchAddresses();
        }
    };

    const resetForm = () => {
        setForm({
            fullName: '',
            phoneNumber: '',
            province: '',
            district: '',
            ward: '',
            detail: '',
            isDefault: false,
        });
        setIsEdit(false);
        setEditId(null);
    };

    const handleConfirm = async () => {
        if (isSubmitting) return; // ⬅️ Nếu đang xử lý thì bỏ qua
        setIsSubmitting(true); // ⬅️ Khóa nút lại

        if (!selectedAddress) {
            toast.warning('Vui lòng chọn địa chỉ giao hàng');
            setIsSubmitting(false);
            return;
        }

        try {
            const orderItems = cartItems.map(item => ({
                product: item.product.id,
                variant: item.variant?.id,
                size: item.size,
                quantity: item.quantity,
                price: item.product.price,
            }));

            // Tạo đơn hàng trước
            const createOrderRes = await axiosInstance.post('/api/order', {
                orderItems,
                address: selectedAddress.id,
                paymentMethod: paymentMethod,
                totalAmount: totalPrice,
            });
            // console.log('createOrderRes', createOrderRes);
            const orderId = createOrderRes.data.id;

            if (paymentMethod === 'COD') {
                toast.success(' đặt hàng thành công với phương thức COD!');
                navigate(`/payment-result-cod/${orderId}`);
            } else if (paymentMethod === 'vnpay') {
                const res = await axiosInstance.post(
                    '/api/order/create-vnpay',
                    {
                        orderId,
                        totalAmount: totalPrice,
                    }
                );
                // const updateStatus = await axiosInstance.put(`/api/order/pay/${orderId}`);

                // toast.success(' đặt hàng thành công với phương thức VNPay!');
                // navigate(`/payment-result/${orderId}`); // hoặc chuyển sang trang lịch sử đơn hàng
                window.location.href = res.data.url;
            }
        } catch (err) {
            console.error(err);
            toast.error(' đặt hàng thất bại!');
        } finally {
            setIsSubmitting(false); // ⬅️ Mở lại khi xong
        }
    };
    return (
        <div className=" bg-[#F5F1EB] w-full  px-28 py-8">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* LEFT: Address Section */}
<div className="space-y-6">
    {/* Header */}
    <div className="flex items-center justify-between">
        <div>
            <h2 className="text-3xl font-semibold text-[#2B2B2B]">
                Địa chỉ giao hàng
            </h2>
            <p className="text-sm text-gray-500 mt-1">
                Chọn địa chỉ để giao đơn hàng của bạn
            </p>
        </div>

        <button
            onClick={() => {
                resetForm();
                setFormVisible(true);
            }}
            className="flex items-center gap-2 rounded-full bg-[#8B5E3C] px-5 py-3 text-white transition hover:bg-[#71482D] shadow-md"
        >
            <Plus size={18} />
            Thêm địa chỉ
        </button>
    </div>

    {/* Address List */}
    <div className="space-y-5">
        {addresses.map(address => (
            <div
                key={address.id}
                onClick={() => handleAddressSelect(address)}
                className={`cursor-pointer rounded-2xl border bg-white p-6 transition-all duration-300
                ${
                    selectedAddress?.id === address.id
                        ? "border-[#8B5E3C] bg-[#F8F4EF] shadow-lg"
                        : "border-[#ECE6DF] hover:border-[#D2C2B2] hover:shadow-md"
                }`}
            >
                <div className="flex items-start justify-between">
                    <div className="flex gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F4ECE5]">
                            <MapPin
                                className="text-[#8B5E3C]"
                                size={22}
                            />
                        </div>

                        <div>
                            <div className="flex items-center gap-3">
                                <h3 className="font-semibold text-lg text-[#2B2B2B]">
                                    {address.fullName}
                                </h3>

                                {address.isDefault && (
                                    <span className="rounded-full bg-[#EFE3D6] px-3 py-1 text-xs font-medium text-[#8B5E3C]">
                                        Mặc định
                                    </span>
                                )}
                            </div>

                            <p className="mt-1 text-gray-600">
                                {address.phoneNumber}
                            </p>

                            <p className="mt-2 text-sm leading-6 text-gray-500">
                                {address.detail}, {address.ward},{" "}
                                {address.district}, {address.province}
                            </p>
                        </div>
                    </div>

                    {selectedAddress?.id === address.id && (
                        <div className="rounded-full bg-[#8B5E3C] p-2 text-white">
                            <Check size={16} />
                        </div>
                    )}
                </div>

                <div className="mt-6 flex gap-3">
                    <button
                        onClick={e => {
                            e.stopPropagation();
                            handleEdit(address);
                        }}
                        className="flex items-center gap-2 rounded-xl border border-[#8B5E3C] px-4 py-2 text-[#8B5E3C] transition hover:bg-[#F5EEE8]"
                    >
                        <Edit size={16} />
                        Sửa
                    </button>

                    <button
                        onClick={e => {
                            e.stopPropagation();
                            handleDelete(address.id);
                        }}
                        className="flex items-center gap-2 rounded-xl border border-red-300 px-4 py-2 text-red-500 transition hover:bg-red-50"
                    >
                        <Trash2 size={16} />
                        Xóa
                    </button>
                </div>
            </div>
        ))}
    </div>

    {/* Popup */}
    {formVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="relative w-[95%] max-w-2xl rounded-3xl bg-white p-8 shadow-2xl">

                <button
                    onClick={() => {
                        resetForm();
                        setFormVisible(false);
                    }}
                    className="absolute right-6 top-6 text-2xl text-gray-400 transition hover:text-[#8B5E3C]"
                >
                    ×
                </button>

                <h3 className="mb-8 text-center text-2xl font-semibold text-[#2B2B2B]">
                    {isEdit
                        ? "Cập nhật địa chỉ"
                        : "Thêm địa chỉ mới"}
                </h3>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                >
                    <input
                        placeholder="Họ và tên"
                        value={form.fullName}
                        onChange={e =>
                            setForm({
                                ...form,
                                fullName: e.target.value,
                            })
                        }
                        className="w-full rounded-xl border border-[#DDD6CE] px-4 py-3 outline-none transition focus:border-[#8B5E3C] focus:ring-2 focus:ring-[#EADFD4]"
                    />

                    <input
                        placeholder="Số điện thoại"
                        value={form.phoneNumber}
                        onChange={e =>
                            setForm({
                                ...form,
                                phoneNumber: e.target.value,
                            })
                        }
                        className="w-full rounded-xl border border-[#DDD6CE] px-4 py-3 outline-none transition focus:border-[#8B5E3C] focus:ring-2 focus:ring-[#EADFD4]"
                    />

                    <div className="grid grid-cols-2 gap-4">

                        <select
                            value={form.province}
                            onChange={e =>
                                setForm({
                                    ...form,
                                    province: e.target.value,
                                    district: "",
                                    ward: "",
                                })
                            }
                            className="rounded-xl border border-[#DDD6CE] px-4 py-3 outline-none focus:border-[#8B5E3C]"
                        >
                            <option value="">Chọn tỉnh / thành</option>

                            {provinces.map(province => (
                                <option
                                    key={province.code}
                                    value={province.name}
                                >
                                    {province.name}
                                </option>
                            ))}
                        </select>

                        <select
                            value={form.district}
                            disabled={!form.province}
                            onChange={e =>
                                setForm({
                                    ...form,
                                    district: e.target.value,
                                    ward: "",
                                })
                            }
                            className="rounded-xl border border-[#DDD6CE] px-4 py-3 outline-none focus:border-[#8B5E3C]"
                        >
                            <option value="">
                                Chọn quận / huyện
                            </option>

                            {districts.map(district => (
                                <option
                                    key={district.code}
                                    value={district.name}
                                >
                                    {district.name}
                                </option>
                            ))}
                        </select>

                        <select
                            value={form.ward}
                            disabled={!form.district}
                            onChange={e =>
                                setForm({
                                    ...form,
                                    ward: e.target.value,
                                })
                            }
                            className="col-span-2 rounded-xl border border-[#DDD6CE] px-4 py-3 outline-none focus:border-[#8B5E3C]"
                        >
                            <option value="">
                                Chọn phường / xã
                            </option>

                            {wards.map(ward => (
                                <option
                                    key={ward.code}
                                    value={ward.name}
                                >
                                    {ward.name}
                                </option>
                            ))}
                        </select>

                        <input
                            placeholder="Số nhà, tên đường..."
                            value={form.detail}
                            onChange={e =>
                                setForm({
                                    ...form,
                                    detail: e.target.value,
                                })
                            }
                            className="col-span-2 rounded-xl border border-[#DDD6CE] px-4 py-3 outline-none transition focus:border-[#8B5E3C] focus:ring-2 focus:ring-[#EADFD4]"
                        />
                    </div>

                    <label className="flex cursor-pointer items-center gap-3">
                        <input
                            type="checkbox"
                            checked={form.isDefault}
                            onChange={e =>
                                setForm({
                                    ...form,
                                    isDefault: e.target.checked,
                                })
                            }
                            className="h-5 w-5 accent-[#8B5E3C]"
                        />

                        <span className="text-gray-700">
                            Đặt làm địa chỉ mặc định
                        </span>
                    </label>

                    <div className="flex justify-end gap-3 pt-4">

                        <button
                            type="button"
                            onClick={() => {
                                resetForm();
                                setFormVisible(false);
                            }}
                            className="rounded-xl border border-gray-300 px-6 py-3 transition hover:bg-gray-100"
                        >
                            Hủy
                        </button>

                        <button
                            type="submit"
                            className="rounded-xl bg-[#8B5E3C] px-6 py-3 text-white transition hover:bg-[#71482D]"
                        >
                            {isEdit
                                ? "Cập nhật"
                                : "Thêm địa chỉ"}
                        </button>

                    </div>
                </form>
            </div>
        </div>
    )}
</div>

            {/* RIGHT: Cart Summary */}
<div className="sticky top-6 h-fit rounded-2xl border border-[#E8E2DA] bg-white p-6 shadow-lg">

    <div className="border-b border-[#EFE8E1] pb-4">
        <h2 className="text-xl font-semibold text-[#2B2B2B]">
            Đơn hàng của bạn
        </h2>

        <p className="mt-1 text-sm text-gray-500">
            {cartItems.length} sản phẩm
        </p>
    </div>

    {cartItems.length === 0 ? (
        <div className="py-12 text-center text-gray-500">
            Giỏ hàng trống
        </div>
    ) : (
        <>
            {/* Product List */}
            <div className="mt-5 max-h-[240px] overflow-y-auto space-y-3 pr-2">

                {cartItems.map((item, index) => (
                    <div
                        key={index}
                        className="flex gap-3 rounded-xl border border-[#F1EBE5] bg-[#FCFBFA] p-3"
                    >
                        <img
                            src={
                                item.variant
                                    ? item.variant.image
                                    : item.product.thumbnail
                            }
                            alt={item.product.name}
                            className="h-16 w-16 rounded-lg object-cover border border-[#ECE6DF]"
                        />

                        <div className="flex flex-1 flex-col justify-between">

                            <div>

                                <h4 className="line-clamp-2 text-sm font-medium text-[#2B2B2B]">
                                    {item.product.name}
                                </h4>

                                {item.variant && (
                                    <p className="mt-1 text-xs text-gray-500">
                                        {item.variant.color} • {item.size}
                                    </p>
                                )}

                                <p className="text-xs text-gray-500">
                                    SL: {item.quantity}
                                </p>

                            </div>

                            <span className="text-sm font-semibold text-[#8B5E3C]">
                                {(
                                    getItemPrice(item) * item.quantity
                                ).toLocaleString()} ₫
                            </span>

                        </div>
                    </div>
                ))}

            </div>

            {/* Summary */}

            <div className="mt-5 space-y-3 border-t border-dashed border-[#E8E2DA] pt-5">

                <div className="flex justify-between text-sm text-gray-600">
                    <span>Tạm tính</span>

                    <span>
                        {totalPrice.toLocaleString()} ₫
                    </span>
                </div>

                <div className="flex justify-between text-sm text-gray-600">
                    <span>Vận chuyển</span>

                    <span className="font-medium text-green-600">
                        Miễn phí
                    </span>
                </div>

                <div className="flex justify-between border-t border-[#E8E2DA] pt-4">

                    <span className="font-semibold text-[#2B2B2B]">
                        Tổng cộng
                    </span>

                    <span className="text-2xl font-bold text-[#8B5E3C]">
                        {totalPrice.toLocaleString()} ₫
                    </span>

                </div>

            </div>

            {/* Payment */}

            <div className="mt-6">

                <h3 className="mb-3 font-semibold text-[#2B2B2B]">
                    Thanh toán
                </h3>

                <div className="space-y-2">

                    <label
                        className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition
                        ${
                            paymentMethod === "COD"
                                ? "border-[#8B5E3C] bg-[#F8F4EF]"
                                : "border-[#ECE6DF] hover:border-[#8B5E3C]"
                        }`}
                    >
                        <input
                            type="radio"
                            checked={paymentMethod === "COD"}
                            onChange={() => setPaymentMethod("COD")}
                            className="accent-[#8B5E3C]"
                        />

                        <div>
                            <p className="text-sm font-medium">
                                Thanh toán khi nhận hàng
                            </p>

                            <span className="text-xs text-gray-500">
                                COD
                            </span>
                        </div>
                    </label>

                    <label
                        className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition
                        ${
                            paymentMethod === "vnpay"
                                ? "border-[#8B5E3C] bg-[#F8F4EF]"
                                : "border-[#ECE6DF] hover:border-[#8B5E3C]"
                        }`}
                    >
                        <input
                            type="radio"
                            checked={paymentMethod === "vnpay"}
                            onChange={() => setPaymentMethod("vnpay")}
                            className="accent-[#8B5E3C]"
                        />

                        <div>
                            <p className="text-sm font-medium">
                                Thanh toán VNPay
                            </p>

                            <span className="text-xs text-gray-500">
                                Thanh toán trực tuyến
                            </span>
                        </div>
                    </label>

                </div>

            </div>

            {/* Button */}

            <button
                onClick={handleConfirm}
                disabled={isSubmitting}
                className={`mt-6 flex w-full items-center justify-center gap-2 rounded-xl py-3 text-base font-semibold text-white transition
                ${
                    paymentMethod === "COD"
                        ? "bg-[#8B5E3C] hover:bg-[#6E472C]"
                        : "bg-[#2E7D32] hover:bg-[#256428]"
                }
                ${
                    isSubmitting
                        ? "cursor-not-allowed opacity-60"
                        : ""
                }`}
            >
                <CheckCircle size={20} />

                {isSubmitting
                    ? "Đang xử lý..."
                    : paymentMethod === "COD"
                    ? "Đặt hàng"
                    : "Thanh toán ngay"}
            </button>

            <p className="mt-3 text-center text-[11px] leading-5 text-gray-500">
                Bằng việc tiếp tục, bạn đồng ý với điều khoản mua hàng và
                chính sách bảo mật của chúng tôi.
            </p>

        </>
    )}
</div>
        </div>
        </div>
    );
};

export default CheckoutPage;
