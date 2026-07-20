import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from './../../utils/axios';
import { toast } from 'react-toastify';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import RelatedCategoryProduct from './RelatedCategoryProduct';

const ProductDetailPage = () => {
    const { sku } = useParams();
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });

        const fetchProduct = async () => {
            try {
                const res = await axiosInstance.get(`/api/product/sku/${sku}`);
                setProduct(res.data);
                const catId = res.data.category?.id;
                if (catId) {
                    const relatedRes = await axiosInstance.get(
                        `/api/product/category/${catId}`
                    );
                    setRelatedProducts(relatedRes.data || []);
                }
            } catch (error) {
                console.error('Lỗi lấy sản phẩm:', error);
            }
        };
        fetchProduct();
    }, [sku]);

    if (!product)
        return (
            <div className="p-6 text-center text-gray-600">
                Đang tải sản phẩm...
            </div>
        );

    const handleAddToCart = async () => {
    const user = JSON.parse(sessionStorage.getItem("user"));

    const cartItem = {
        productId: product.id,
        quantity: quantity
    };

    try {
        if (user) {
            await axiosInstance.post("/api/cart", cartItem);
        } else {
            const localCart =
                JSON.parse(localStorage.getItem("cart")) || [];

            const existing = localCart.find(
                item => item.product.id === product.id
            );

            if (existing) {
                existing.quantity += quantity;
            } else {
                localCart.push({
                    product: {
                        id: product.id,
                        name: product.name,
                        image: product.images?.[0]?.url,
                        price: product.price,
                        sku: product.sku
                    },
                    quantity
                });
            }

            localStorage.setItem("cart", JSON.stringify(localCart));
        }

        const currentQuantity =
            JSON.parse(localStorage.getItem("cartQuantity")) || 0;

        localStorage.setItem(
            "cartQuantity",
            JSON.stringify(currentQuantity + quantity)
        );

        window.dispatchEvent(new Event("cartUpdated"));

        toast.success("Đã thêm vào giỏ hàng");
    } catch (err) {
        console.error(err);
        toast.error("Thêm vào giỏ hàng thất bại");
    }
};

    return (
    <div className="min-h-screen bg-[#f7f5f2]">

        <div className="max-w-7xl mx-auto px-6 py-10">

            <div className="grid lg:grid-cols-2 gap-10">

                {/* IMAGE */}
                <div className="bg-white rounded-3xl shadow-sm p-6">

                    <Carousel
                        showThumbs
                        infiniteLoop
                        autoPlay
                        showStatus={false}
                        thumbWidth={90}
                    >
                        {product.images?.map((img, index) => (
                            <div key={index}>
                                <img
                                    src={img.url}
                                    alt=""
                                    className="aspect-square object-cover rounded-2xl"
                                />
                            </div>
                        ))}
                    </Carousel>

                </div>


                {/* INFORMATION */}
                <div className="bg-white rounded-3xl shadow-sm p-8 space-y-6">


                    <div>
                        <p className="text-sm text-gray-500">
                            {product.category?.name || "Nội thất"}
                        </p>

                        <h1 className="text-4xl font-bold text-gray-900 mt-2">
                            {product.name}
                        </h1>
                    </div>



                    <div className="border-b pb-5">

                        <span className="text-3xl font-bold text-[#8B5E3C]">
                            {product.price?.toLocaleString()} đ
                        </span>

                    </div>
                    {/* QUANTITY */}

                    <div className="flex items-center gap-5">

                        <span className="font-semibold">
                            Số lượng
                        </span>


                        <div className="flex border rounded-xl overflow-hidden">

                            <button
                            onClick={()=>
                                setQuantity(q=>Math.max(1,q-1))
                            }
                            className="w-10 h-10 hover:bg-gray-100"
                            >
                                -
                            </button>


                            <span className="w-12 flex items-center justify-center">
                                {quantity}
                            </span>


                            <button
                            onClick={()=>
                                setQuantity(q=>q+1)
                            }
                            className="w-10 h-10 hover:bg-gray-100"
                            >
                                +
                            </button>


                        </div>

                    </div>




                    {/* ACTION */}

                    <div className="space-y-3">


                        <button
                        onClick={handleAddToCart}
                        className="
                        w-full
                        bg-[#8B5E3C]
                        hover:bg-[#70482d]
                        text-white
                        py-4
                        rounded-2xl
                        font-semibold
                        transition
                        "
                        >
                            Đặt hàng
                        </button>


                        <button
                        onClick={()=>navigate('/')}
                        className="
                        w-full
                        border
                        border-gray-300
                        py-4
                        rounded-2xl
                        hover:bg-gray-100
                        transition
                        "
                        >
                            Tiếp tục xem sản phẩm
                        </button>


                    </div>



                    {/* DESCRIPTION */}

                    <div className="pt-5 border-t">

                        <h3 className="font-semibold mb-3">
                            Mô tả sản phẩm
                        </h3>


                        <p className="text-gray-600 leading-7">
                            {product.description}
                        </p>


                    </div>



                </div>


            </div>



            {/* RELATED */}

            <div className="mt-16">

                <h2 className="
                text-3xl
                font-bold
                text-gray-900
                mb-8
                ">
                    Sản phẩm liên quan
                </h2>


                <RelatedCategoryProduct
                    products={relatedProducts}
                    currentProductId={product.id}
                />


            </div>


        </div>


    </div>
);
};

export default ProductDetailPage;
