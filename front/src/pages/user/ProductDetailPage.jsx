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
    const [selectedColorIndex, setSelectedColorIndex] = useState(0);
    const [selectedSize, setSelectedSize] = useState(null);
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

    const hasVariants = product.variants && product.variants.length > 0;
    const selectedVariant = hasVariants
        ? product.variants[selectedColorIndex]
        : null;

    const handleAddToCart = async () => {
        const user = JSON.parse(sessionStorage.getItem('user'));
        let cartQuantity =
            JSON.parse(localStorage.getItem('cartQuantity')) || 0;

        if (hasVariants && !selectedSize) {
            return toast.error('Vui lòng chọn kích thước!');
        }

        const cartItem = {
            product: {
                id: product.id,
                name: product.name,
                images: product.images,
            },
            variant: selectedVariant
                ? {
                      id: selectedVariant.id,
                      color: selectedVariant.color,
                      image: selectedVariant.image,
                  }
                : null,
            size: selectedSize ? selectedSize.size : 'default',
            quantity,
            price: selectedSize ? selectedSize.price : product.price,
        };

        try {
            if (user && user.id) {
                await axiosInstance.post('/api/cart', cartItem);
                toast.success('Đã thêm vào giỏ hàng');
            } else {
                const localCart =
                    JSON.parse(localStorage.getItem('cart')) || [];
                const existingIndex = localCart.findIndex(
                    item =>
                        item.product.id === cartItem.product.id &&
                        item.size === cartItem.size &&
                        (cartItem.variant
                            ? item.variant?.id === cartItem.variant.id
                            : !item.variant)
                );

                if (existingIndex !== -1) {
                    localCart[existingIndex].quantity += cartItem.quantity;
                } else {
                    localCart.push(cartItem);
                }

                localStorage.setItem('cart', JSON.stringify(localCart));
                toast.success('Đã thêm vào giỏ hàng');
            }

            // Cập nhật cartQuantity và dispatch event để Header nhận
            cartQuantity += quantity;
            localStorage.setItem('cartQuantity', JSON.stringify(cartQuantity));

            // Tạo custom event để Header lắng nghe
            window.dispatchEvent(new Event('cartUpdated'));
        } catch (err) {
            console.error('Lỗi thêm vào giỏ hàng:', err);
            toast.error('Thêm vào giỏ hàng thất bại');
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



                    {/* VARIANT */}
                    {hasVariants && (

                        <div>

                            <h3 className="font-semibold text-gray-800 mb-3">
                                Lựa chọn màu sắc
                            </h3>


                            <div className="flex gap-4 flex-wrap">

                                {product.variants.map((variant,index)=>(

                                    <button
                                        key={variant.id}
                                        onClick={()=>{
                                            setSelectedColorIndex(index);
                                            setSelectedSize(null);
                                        }}
                                        className={`
                                        rounded-2xl border p-2 transition
                                        ${
                                            selectedColorIndex===index
                                            ?
                                            "border-[#8B5E3C] shadow-lg"
                                            :
                                            "border-gray-200"
                                        }
                                        `}
                                    >

                                        <img
                                            src={variant.image}
                                            className="w-20 h-20 object-cover rounded-xl"
                                        />

                                        <p className="text-sm mt-2">
                                            {variant.color}
                                        </p>


                                    </button>

                                ))}

                            </div>

                        </div>

                    )}



                    {/* SIZE */}

                    {selectedVariant?.sizes?.length > 0 && (

                        <div>

                            <h3 className="font-semibold mb-3">
                                Kích thước
                            </h3>


                            <div className="flex flex-wrap gap-3">

                                {
                                selectedVariant.sizes.map((s)=>(
                                    
                                    <button
                                    key={s.id}
                                    onClick={()=>setSelectedSize(s)}
                                    className={`
                                    px-5 py-3 rounded-xl border transition
                                    
                                    ${
                                    selectedSize?.size===s.size
                                    ?
                                    "bg-[#8B5E3C] text-white border-[#8B5E3C]"
                                    :
                                    "bg-white hover:border-[#8B5E3C]"
                                    }
                                    `}
                                    >

                                    {s.size}

                                    </button>

                                ))
                                }

                            </div>


                        </div>

                    )}



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
