import { useEffect, useState } from 'react';
import axiosInstance from '../../../utils/axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { X } from 'lucide-react';

const AddProduct = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [images, setImages] = useState([]);
    const [previewImages, setPreviewImages] = useState([]);

    const [form, setForm] = useState({
        name: '',
        description: '',
        category: '',
        price: '',
        quantity: '',
    });

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await axiosInstance.get('/api/category');
                setCategories(res.data);
            } catch (error) {
                console.error('Không load được danh mục:', error);
                toast.error('Không thể tải danh mục!');
            }
        };
        fetchCategories();
    }, []);

    const handleChange = e => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };
    const handleAddSingleImage = e => {
        if (images.length >= 10) {
            toast.error('Chỉ thêm tối đa 10 ảnh cho 1 sản phẩm.');
            return;
        }
        const file = e.target.files[0];
        if (file) {
            setImages(prev => [...prev, file]);
            setPreviewImages(prev => [...prev, URL.createObjectURL(file)]);
        }
    };
    const handleRemoveImage = index => {
        const newImages = [...images];
        const newPreviews = [...previewImages];
        newImages.splice(index, 1);
        newPreviews.splice(index, 1);
        setImages(newImages);
        setPreviewImages(newPreviews);
    };

    const handleSubmit = async e => {
        e.preventDefault();

        if (images.length === 0) {
            return toast.error('Phải chọn ít nhất 1 ảnh!');
        }

        const formData = new FormData();

formData.append(
    "data",
    new Blob(
        [
            JSON.stringify({
                name: form.name,
                description: form.description,
                price: Number(form.price),
                quantity: Number(form.quantity),
                hasVariant: false,
                qrCodeUrl: null,
                categoryId: Number(form.category),
            }),
        ],
        {
            type: "application/json",
        }
    )
);

images.forEach(img => {
    formData.append("images", img);
});

        try {
            await axiosInstance.post('/api/product', formData);
            toast.success('Thêm sản phẩm thành công');
            navigate('/admin/product');
        } catch (err) {
            console.error(err);
            toast.error('Lỗi khi thêm sản phẩm');
        }
    };

    return (
    <div className="min-h-screen bg-[#f7f5f2] p-6">
        <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-sm hover:shadow-lg transition p-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-[#8B5E3C]">
                    Thêm sản phẩm
                </h1>
                <p className="text-gray-500 mt-2">
                    Tạo sản phẩm mới cho cửa hàng nội thất
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Tên */}
                <div>
                    <label className="block mb-2 font-semibold text-gray-700">
                        Tên sản phẩm
                    </label>

                    <input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Nhập tên sản phẩm..."
                        required
                        className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]"
                    />
                </div>

                {/* Mô tả */}
                <div>
                    <label className="block mb-2 font-semibold text-gray-700">
                        Mô tả
                    </label>

                    <textarea
                        rows={5}
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        placeholder="Nhập mô tả..."
                        required
                        className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]"
                    />
                </div>

                {/* Giá + Số lượng */}
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <label className="block mb-2 font-semibold text-gray-700">
                            Giá
                        </label>

                        <input
                            type="number"
                            name="price"
                            value={form.price}
                            onChange={handleChange}
                            placeholder="0"
                            required
                            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]"
                        />
                    </div>

                    <div>
                        <label className="block mb-2 font-semibold text-gray-700">
                            Số lượng
                        </label>

                        <input
                            type="number"
                            name="quantity"
                            value={form.quantity}
                            onChange={handleChange}
                            placeholder="0"
                            required
                            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]"
                        />
                    </div>
                </div>

                {/* Danh mục */}
                <div>
                    <label className="block mb-2 font-semibold text-gray-700">
                        Danh mục
                    </label>

                    <select
                        name="category"
                        value={form.category}
                        onChange={handleChange}
                        required
                        className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]"
                    >
                        <option value="">-- Chọn danh mục --</option>

                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Upload */}
                <div>
                    <label className="block mb-3 font-semibold text-gray-700">
                        Hình ảnh sản phẩm
                    </label>

                    <label className="flex justify-center items-center h-40 border-2 border-dashed border-[#8B5E3C]/40 rounded-2xl cursor-pointer hover:bg-[#faf7f4] transition">
                        <div className="text-center">
                            <p className="font-semibold text-[#8B5E3C]">
                                Chọn ảnh
                            </p>

                            <p className="text-sm text-gray-500 mt-1">
                                Tối đa 10 ảnh
                            </p>
                        </div>

                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleAddSingleImage}
                            className="hidden"
                        />
                    </label>
                </div>

                {/* Preview */}

                {previewImages.length > 0 && (
                    <div>
                        <label className="block mb-3 font-semibold text-gray-700">
                            Xem trước
                        </label>

                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                            {previewImages.map((src, idx) => (
                                <div
                                    key={idx}
                                    className="relative group rounded-xl overflow-hidden shadow"
                                >
                                    <img
                                        src={src}
                                        alt=""
                                        className="w-full h-40 object-cover"
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleRemoveImage(idx)
                                        }
                                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Buttons */}

                <div className="flex justify-end gap-4 pt-4">
                    <button
                        type="button"
                        onClick={() => navigate('/admin/product')}
                        className="px-6 py-3 rounded-xl bg-gray-200 hover:bg-gray-300 transition font-medium"
                    >
                        Quay lại
                    </button>

                    <button
                        type="submit"
                        className="px-6 py-3 rounded-xl bg-[#8B5E3C] text-white hover:bg-[#71482d] transition font-medium shadow"
                    >
                        Lưu sản phẩm
                    </button>
                </div>
            </form>
        </div>
    </div>
);
};

export default AddProduct;
