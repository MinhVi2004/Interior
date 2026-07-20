import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../../utils/axios';
import { toast } from 'react-toastify';

const ProductDetail = () => {
  const { sku } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axiosInstance.get(`api/product/sku/${sku}`);
        setProduct(res.data);
      } catch (error) {
        toast.error('Không tìm thấy sản phẩm');
        navigate('/admin/product');
      }
    };

    fetchProduct();
  }, [sku, navigate]);

  if (!product) return <div className="p-4"> đang tải...</div>;

  return (
    <div className="min-h-screen bg-[#f7f5f2] p-8">
        <div className="max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-[#8B5E3C]">
                        Chi tiết sản phẩm
                    </h1>
                    <p className="text-gray-500 mt-1">
                        Thông tin chi tiết của sản phẩm
                    </p>
                </div>

                <button
                    onClick={() => navigate('/admin/product')}
                    className="px-5 py-3 rounded-xl bg-gray-200 hover:bg-gray-300 transition"
                >
                    Quay lại
                </button>
            </div>

            <div className="grid lg:grid-cols-5 gap-8">
                {/* Gallery */}
                <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm p-6">
                    <h3 className="font-semibold text-lg mb-5 text-[#8B5E3C]">
                        Hình ảnh sản phẩm
                    </h3>

                    {product.images?.length > 0 ? (
                        <>
                            <img
                                src={product.images[0].url}
                                className="w-full h-[420px] object-cover rounded-2xl"
                                alt=""
                            />

                            <div className="grid grid-cols-4 gap-3 mt-4">
                                {product.images.map(img => (
                                    <img
                                        key={img.id}
                                        src={img.url}
                                        alt=""
                                        className="h-24 w-full rounded-xl object-cover border hover:scale-105 transition"
                                    />
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="h-[420px] flex items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 text-gray-400">
                            Không có ảnh
                        </div>
                    )}

                    {product.qrCodeUrl && (
                        <div className="mt-8">
                            <h4 className="font-semibold mb-3 text-[#8B5E3C]">
                                QR Code
                            </h4>

                            <img
                                src={product.qrCodeUrl}
                                alt=""
                                className="w-44 h-44 rounded-xl border p-2"
                            />
                        </div>
                    )}
                </div>

                {/* Information */}
                <div className="lg:col-span-3 space-y-6">
                    <div className="bg-white rounded-3xl shadow-sm p-8">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold">
                                {product.name}
                            </h2>

                            <span className="px-4 py-2 rounded-full bg-[#8B5E3C]/10 text-[#8B5E3C] font-semibold">
                                {product.sku}
                            </span>
                        </div>

                        <div className="grid md:grid-cols-2 gap-y-5 gap-x-10 text-sm">
                            <Info
                                title="Mã sản phẩm"
                                value={product.id}
                            />

                            <Info
                                title="Danh mục"
                                value={product.category?.name ?? "Không có"}
                            />

                            <Info
                                title="Giá"
                                value={`${product.price.toLocaleString()} đ`}
                            />

                            <Info
                                title="Số lượng"
                                value={product.quantity}
                            />

                            {/* <Info
                                title="Biến thể"
                                value={
                                    product.hasVariant
                                        ? "Có"
                                        : "Không"
                                }
                            /> */}

                            <Info
                                title="Ngày tạo"
                                value={new Date(
                                    product.createdAt
                                ).toLocaleString()}
                            />
                        </div>

                        <div className="mt-8">
                            <h4 className="font-semibold mb-3 text-[#8B5E3C]">
                                Mô tả sản phẩm
                            </h4>

                            <div className="bg-gray-50 rounded-2xl p-5 leading-8 text-gray-700">
                                {product.description || "Không có mô tả"}
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-4">
                        <button
                            onClick={() =>
                                navigate(
                                    `/admin/product/update/${product.sku}`
                                )
                            }
                            className="px-6 py-3 rounded-xl bg-[#8B5E3C] text-white hover:opacity-90 transition"
                        >
                            Cập nhật
                        </button>

                        {/* {product.hasVariant && (
                            <button
                                onClick={() =>
                                    navigate(
                                        `/admin/product/variant/${product.id}`
                                    )
                                }
                                className="px-6 py-3 rounded-xl bg-green-600 text-white hover:bg-green-700 transition"
                            >
                                Quản lý biến thể
                            </button>
                        )} */}
                    </div>
                </div>
            </div>
        </div>
    </div>
);
};
const Info = ({ title, value }) => (
    <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <p className="font-semibold text-gray-800 mt-1">{value}</p>
    </div>
);
export default ProductDetail;
