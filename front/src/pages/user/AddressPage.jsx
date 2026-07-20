import { useState, useEffect } from 'react';
import axios from '../../utils/axios';
import { Check } from 'lucide-react';
import { toast } from 'react-toastify';

const AddressPage = () => {
    const [addresses, setAddresses] = useState([]);
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);

    const [form, setForm] = useState({
        fullName: '',
        phoneNumber: '',
        province: '',
        district: '',
        ward: '',
        detail: '',
        isDefault: false,
    });

    const [isEdit, setIsEdit] = useState(false);
    const [editId, setEditId] = useState(null);

    const fetchAddresses = async () => {
        const res = await axios.get('/api/address');
        setAddresses(res.data);
    };

    useEffect(() => {
        fetchAddresses();
        fetchProvinces();
    }, []);

    // Load tỉnh/thành
    const fetchProvinces = async () => {
        const res = await fetch('https://provinces.open-api.vn/api/?depth=1');
        const data = await res.json();
        setProvinces(data);
    };

    // Load quận/huyện theo tỉnh
    useEffect(() => {
        if (form.province) {
            const selected = provinces.find(p => p.name === form.province);
            if (selected) {
                fetch(
                    `https://provinces.open-api.vn/api/p/${selected.code}?depth=2`
                )
                    .then(res => res.json())
                    .then(data => {
                        setDistricts(data.districts);
                        if (
                            !data.districts.find(d => d.name === form.district)
                        ) {
                            setForm(prev => ({
                                ...prev,
                                district: '',
                                ward: '',
                            }));
                        }
                    });
            }
        } else {
            setDistricts([]);
            setWards([]);
            setForm(prev => ({ ...prev, district: '', ward: '' }));
        }
    }, [form.province]);

    // Load phường/xã theo quận
    useEffect(() => {
        const fetchWards = async () => {
            if (form.district) {
                const selected = districts.find(d => d.name === form.district);
                if (selected) {
                    const res = await fetch(
                        `https://provinces.open-api.vn/api/d/${selected.code}?depth=2`
                    );
                    const data = await res.json();
                    setWards(data.wards);

                    // Nếu form.ward hiện tại không có trong danh sách mới -> reset
                    const validWard = data.wards.find(
                        w => w.name === form.ward
                    );
                    if (!validWard) {
                        setForm(prev => ({ ...prev, ward: '' }));
                    }
                }
            } else {
                setWards([]);
                setForm(prev => ({ ...prev, ward: '' }));
            }
        };

        fetchWards();
    }, [form.district]);

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
            toast.warning('Số  điện thoại không  đúng định dạng.');
            return;
        }

        if (!form.province || !form.district || !form.ward) {
            toast.warning(
                'Vui lòng chọn  đầy đủ Tỉnh/Thành, Quận/Huyện và Phường/Xã.'
            );
            return;
        }

        if (!form.detail.trim() || form.detail.trim().length < 6) {
            toast.warning(' địa chỉ chi tiết phải có ít nhất 6 ký tự.');
            return;
        }
        try {
            if (isEdit) {
                await axios.put(`/api/address/${editId}`, form);
                toast.success('Sửa  địa chỉ thành công!');
            } else {
                await axios.post('/api/address', form);
                toast.success('Thêm  địa chỉ thành công!');
            }
            resetForm();
            fetchAddresses();
        } catch (err) {
            toast.error('Đã xảy ra lỗi!');
        }
    };

    const handleDelete = async id => {
        if (confirm('Bạn có chắc chắn muốn xóa địa chỉ này?')) {
            await axios.delete(`/api/address/${id}`);
            toast.success('Xóa địa chỉ thành công!');
            fetchAddresses();
        }
    };

    const handleEdit = async address => {
        setForm(address); // Gán trước để hiển thị dữ liệu cơ bản
        setEditId(address.id);
        setIsEdit(true);

        // Fetch lại districts theo province
        const selectedProvince = provinces.find(
            p => p.name === address.province
        );
        if (selectedProvince) {
            const res = await fetch(
                `https://provinces.open-api.vn/api/p/${selectedProvince.code}?depth=2`
            );
            const data = await res.json();
            setDistricts(data.districts);

            // Tiếp tục fetch wards theo district
            const selectedDistrict = data.districts.find(
                d => d.name === address.district
            );
            if (selectedDistrict) {
                const res2 = await fetch(
                    `https://provinces.open-api.vn/api/d/${selectedDistrict.code}?depth=2`
                );
                const data2 = await res2.json();
                setWards(data2.wards);
            }
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

    return (
    <div className="min-h-screen bg-[#f8f6f2] p-6">

        <div className="max-w-6xl mx-auto">

            <h2 className="text-3xl font-semibold text-[#3b3028] mb-8">
                Địa chỉ giao hàng
            </h2>


            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">


                {/* Address List */}
                <div className="lg:col-span-3 space-y-5">

                    <div className="flex justify-between items-center">
                        <h3 className="text-xl font-medium text-[#3b3028]">
                            Địa chỉ của bạn
                        </h3>

                        <span className="text-sm text-gray-500">
                            {addresses.length} địa chỉ
                        </span>
                    </div>


                    {addresses.length === 0 ? (

                        <div className="bg-white rounded-xl p-8 text-center shadow-sm">
                            <p className="text-gray-500">
                                Chưa có địa chỉ giao hàng
                            </p>
                        </div>

                    ) : (

                        addresses.map(address => (

                            <div
                                key={address.id}
                                className={`
                                    bg-white rounded-xl p-5
                                    border shadow-sm
                                    transition
                                    hover:shadow-md
                                    ${
                                        address.isDefault
                                        ? "border-[#8b5e3c]"
                                        : "border-gray-200"
                                    }
                                `}
                            >

                                <div className="flex justify-between">


                                    <div className="space-y-2">

                                        <div className="flex items-center gap-3">

                                            <h4 className="font-semibold text-[#3b3028]">
                                                {address.fullName}
                                            </h4>


                                            {address.isDefault && (

                                                <span
                                                    className="
                                                    text-xs
                                                    px-3 py-1
                                                    rounded-full
                                                    bg-[#efe3d4]
                                                    text-[#8b5e3c]
                                                    "
                                                >
                                                    Địa chỉ mặc định
                                                </span>

                                            )}

                                        </div>


                                        <p className="text-gray-600">
                                            {address.phoneNumber}
                                        </p>


                                        <p className="text-gray-600 text-sm">
                                            {address.detail},
                                            {address.ward},
                                            {address.district},
                                            {address.province}
                                        </p>

                                    </div>



                                    <div className="flex flex-col gap-2">

                                        <button
                                            onClick={() =>
                                                handleEdit(address)
                                            }
                                            className="
                                            px-4 py-2
                                            rounded-lg
                                            text-sm
                                            bg-[#f5eee7]
                                            text-[#8b5e3c]
                                            hover:bg-[#ead8c4]
                                            "
                                        >
                                            Chỉnh sửa
                                        </button>


                                        <button
                                            onClick={() =>
                                                handleDelete(address.id)
                                            }
                                            className="
                                            px-4 py-2
                                            rounded-lg
                                            text-sm
                                            bg-red-50
                                            text-red-600
                                            hover:bg-red-100
                                            "
                                        >
                                            Xóa
                                        </button>

                                    </div>

                                </div>

                            </div>

                        ))

                    )}

                </div>





                {/* Form */}
                <div className="lg:col-span-2">


                    <form
                        onSubmit={handleSubmit}
                        className="
                        bg-white
                        rounded-xl
                        shadow-sm
                        p-6
                        space-y-5
                        "
                    >


                        <h3 className="
                            text-xl
                            font-semibold
                            text-[#3b3028]
                        ">
                            {
                                isEdit
                                ? "Cập nhật địa chỉ"
                                : "Thêm địa chỉ mới"
                            }
                        </h3>



                        <input
                            placeholder="Tên người nhận"
                            className="
                            w-full
                            px-4 py-3
                            border
                            rounded-lg
                            focus:outline-none
                            focus:ring-2
                            focus:ring-[#c8a97e]
                            "
                            value={form.fullName}
                            onChange={e =>
                                setForm({
                                    ...form,
                                    fullName:e.target.value
                                })
                            }
                        />



                        <input
                            placeholder="Số điện thoại"
                            className="
                            w-full
                            px-4 py-3
                            border
                            rounded-lg
                            "
                            value={form.phoneNumber}
                            onChange={e =>
                                setForm({
                                    ...form,
                                    phoneNumber:e.target.value
                                })
                            }
                        />



                        <div className="grid grid-cols-2 gap-3">


                            <select
                                className="border rounded-lg px-3 py-3"
                                value={form.province}
                                onChange={e =>
                                    setForm({
                                        ...form,
                                        province:e.target.value
                                    })
                                }
                            >

                                <option>
                                    Tỉnh / Thành phố
                                </option>

                                {
                                    provinces.map(p=>(
                                        <option
                                            key={p.code}
                                            value={p.name}
                                        >
                                            {p.name}
                                        </option>
                                    ))
                                }

                            </select>



                            <select
                                className="border rounded-lg px-3 py-3"
                                value={form.district}
                                onChange={e =>
                                    setForm({
                                        ...form,
                                        district:e.target.value
                                    })
                                }
                            >

                                <option>
                                    Quận / Huyện
                                </option>

                                {
                                    districts.map(d=>(
                                        <option
                                            key={d.code}
                                            value={d.name}
                                        >
                                            {d.name}
                                        </option>
                                    ))
                                }

                            </select>



                            <select
                                className="
                                col-span-2
                                border
                                rounded-lg
                                px-3 py-3
                                "
                                value={form.ward}
                                onChange={e =>
                                    setForm({
                                        ...form,
                                        ward:e.target.value
                                    })
                                }
                            >

                                <option>
                                    Phường / Xã
                                </option>

                                {
                                    wards.map(w=>(
                                        <option
                                            key={w.code}
                                            value={w.name}
                                        >
                                            {w.name}
                                        </option>
                                    ))
                                }

                            </select>



                            <input
                                placeholder="Số nhà, đường..."
                                className="
                                col-span-2
                                border
                                rounded-lg
                                px-4 py-3
                                "
                                value={form.detail}
                                onChange={e =>
                                    setForm({
                                        ...form,
                                        detail:e.target.value
                                    })
                                }
                            />

                        </div>



                        <label className="flex gap-3 items-center">

                            <input
                                type="checkbox"
                                checked={form.isDefault}
                                onChange={e =>
                                    setForm({
                                        ...form,
                                        isDefault:e.target.checked
                                    })
                                }
                                className="accent-[#8b5e3c]"
                            />

                            <span className="text-gray-700">
                                Sử dụng làm địa chỉ mặc định
                            </span>

                        </label>



                        <div className="flex justify-end gap-3">


                            {
                                isEdit && (
                                    <button
                                        type="button"
                                        onClick={resetForm}
                                        className="
                                        px-5 py-3
                                        rounded-lg
                                        bg-gray-200
                                        "
                                    >
                                        Hủy
                                    </button>
                                )
                            }



                            <button
                                className="
                                px-6 py-3
                                rounded-lg
                                bg-[#8b5e3c]
                                text-white
                                hover:bg-[#70482d]
                                transition
                                "
                            >
                                {
                                    isEdit
                                    ? "Lưu địa chỉ"
                                    : "Thêm địa chỉ"
                                }
                            </button>


                        </div>


                    </form>

                </div>


            </div>

        </div>

    </div>
);
};

export default AddressPage;
