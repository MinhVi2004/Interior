import { useEffect, useState } from 'react';
import axiosInstance from '../../utils/axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';

const CartPage = () => {
    const [cart, setCart] = useState({
        items: []
    });
    const [loadingItem, setLoadingItem] = useState(null); // track item đang update/remove
    const navigate = useNavigate();
    const isLoggedIn = !!sessionStorage.getItem('token');

    useEffect(() => {
        fetchCart();
    }, []);

    const handleCheckout = () => {
        if ((cart.items || []).length === 0) {
            toast.info('Vui lòng chọn thêm sản phẩm để tiếp tục');
            return;
        }

        const token = sessionStorage.getItem('token');
        if (!token) {
            toast.info('Vui lòng đăng nhập để tiếp tục');
            navigate('/signin?redirect=/cart');
        } else {
            navigate('/checkout');
        }
    };

    const handleContinueShopping = () => navigate('/');

    const fetchCart = async () => {
    const token = sessionStorage.getItem('token');

    if (token) {
        try {
            const res = await axiosInstance.get('/api/cart');

            setCart({
                items: res.data.items || res.data.cartItems || []
            });

        } catch (err) {
            console.error('Lỗi tải giỏ hàng', err);
            toast.success('Lỗi tải giỏ hàng');
            setCart({ items: [] });
        }

    } else {

        const localCart =
            JSON.parse(localStorage.getItem('cart')) || [];

        setCart({
            items: localCart
        });
    }
};

    const getItemId = item =>
    isLoggedIn ? item.id : String(item.product.id);

    const getProductName = item => item.product?.name || item.name;
    const getProductImage = item =>
    item.product?.images?.[0]?.url ||
    item.product?.image ||
    item.product?.thumbnail ||
    "";
    // Lấy giá sản phẩm
    const getProductPrice = item =>
    item.product?.price ?? item.price ?? 0;

    const updateQuantity = async (itemId, newQty) => {
        setLoadingItem(itemId);
        const token = sessionStorage.getItem('token');

        try {
            let cartData = JSON.parse(localStorage.getItem('cart')) || [];

            if (token) {
                await axiosInstance.put('/api/cart', {
                    itemId,
                    quantity: newQty,
                });
                const res = await axiosInstance.get('/api/cart');
                cartData = res.data.items || [];
            } else {
                cartData = cartData.map(item =>
                    item.product.id === Number(itemId)
                        ? { ...item, quantity: newQty }
                        : item
                );

                // cập nhật localStorage cart
                localStorage.setItem('cart', JSON.stringify(cartData));
            }

            const cartQuantity = cartData.reduce(
                (sum, item) => sum + item.quantity,
                0
            );
            localStorage.setItem('cartQuantity', JSON.stringify(cartQuantity));
            window.dispatchEvent(new Event('cartUpdated'));
            fetchCart();
            toast.success('Cập nhật số lượng thành công');
        } catch (err) {
            console.error(err);
            toast.error('Cập nhật số lượng thất bại');
        } finally {
            setLoadingItem(null);
        }
    };

    const removeItem = async itemId => {
        const confirm = await Swal.fire({
            title: 'Xoá sản phẩm?',
            text: 'Bạn có chắc chắn muốn xoá sản phẩm này khỏi giỏ hàng?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Xoá',
            cancelButtonText: 'Huỷ',
        });

        if (!confirm.isConfirmed) return;

        setLoadingItem(itemId);
        const token = sessionStorage.getItem('token');

        try {
            let cartData = JSON.parse(localStorage.getItem('cart')) || [];

            if (token) {
                await axiosInstance.delete(`/api/cart/${itemId}`);
                const res = await axiosInstance.get('/api/cart');
                cartData = res.data.items || [];
            } else {
                cartData = cartData.filter(
                    item => item.product.id !== Number(itemId)
                );

                // cập nhật localStorage cart
                localStorage.setItem('cart', JSON.stringify(cartData));
            }

            const cartQuantity = cartData.reduce(
                (sum, item) => sum + item.quantity,
                0
            );
            localStorage.setItem('cartQuantity', JSON.stringify(cartQuantity));
            window.dispatchEvent(new Event('cartUpdated'));
            fetchCart();
            
            toast.success('Xoá sản phẩm thành công');
        } catch (err) {
            console.error(err);
            toast.error('Xoá sản phẩm thất bại');
        } finally {
            setLoadingItem(null);
        }
    };

    const total = (cart.items || []).reduce(
        (sum, item) => sum + getProductPrice(item) * item.quantity,
        0
    );

    return (
    <div className="min-h-screen bg-[#f8f6f2] py-10">
        <div className="max-w-7xl mx-auto px-5">

            <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#3b2f2f] mb-8">
                Giỏ hàng nội thất
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* LIST CART */}
                <div className="lg:col-span-2 space-y-5">

                    {(cart.items || []).length === 0 ? (

                        <div className="bg-white rounded-2xl p-10 text-center shadow-sm">
                            <p className="text-gray-500 text-lg">
                                Giỏ hàng của bạn đang trống
                            </p>

                            <button
                                onClick={handleContinueShopping}
                                className="
                                mt-5 px-6 py-3 
                                bg-[#6b4f3f]
                                text-white
                                rounded-xl
                                hover:bg-[#543b2f]
                                transition
                                "
                            >
                                Xem sản phẩm
                            </button>
                        </div>

                    ) : (

                        (cart.items || []).map(item => {

                            const itemId = getItemId(item);
                            const productId = item.product?.id || item.product;
                            const price = getProductPrice(item);
                            const totalPrice = price * item.quantity;
                            const isLoading = loadingItem === itemId;
                            const productSku = item.product?.sku;

                            return (

                                <div
                                    key={itemId}
                                    className="
                                    relative
                                    bg-white
                                    rounded-2xl
                                    shadow-sm
                                    p-5
                                    flex
                                    gap-5
                                    items-center
                                    "
                                >

                                    {
                                        isLoading &&
                                        <div className="
                                        absolute inset-0 
                                        bg-white/70 
                                        flex items-center justify-center
                                        rounded-2xl
                                        z-10">
                                            <div className="loader"/>
                                        </div>
                                    }


                                    <img
                                        src={getProductImage(item)}
                                        alt={getProductName(item)}
                                        className="
                                        w-28 h-28
                                        object-cover
                                        rounded-xl
                                        cursor-pointer
                                        "
                                        onClick={() =>
                                            navigate(`/product/${productSku}`)
                                        }
                                    />


                                    <div className="flex-1">

                                        <h2
                                            className="
                                            text-lg
                                            font-semibold
                                            text-[#3b2f2f]
                                            cursor-pointer
                                            hover:text-[#8b6f47]
                                            "
                                            onClick={() =>
                                                navigate(`/product/${productSku}`)
                                            }
                                        >
                                            {getProductName(item)}
                                        </h2>
                                        <p className="
                                        mt-2
                                        text-[#8b6f47]
                                        font-bold
                                        ">
                                            {price.toLocaleString()} đ
                                        </p>


                                        <p className="
                                        text-[#a0522d]
                                        font-semibold
                                        mt-1
                                        ">
                                            Thành tiền:
                                            {" "}
                                            {totalPrice.toLocaleString()} đ
                                        </p>

                                    </div>



                                    {/* QUANTITY */}

                                    <div className="
                                    flex
                                    items-center
                                    gap-3
                                    border
                                    rounded-xl
                                    px-3
                                    py-2
                                    ">

                                        <button
                                            disabled={isLoading}
                                            onClick={() =>
                                                updateQuantity(
                                                    itemId,
                                                    Math.max(
                                                        1,
                                                        item.quantity-1
                                                    )
                                                )
                                            }
                                        >
                                            <Minus size={17}/>
                                        </button>


                                        <span className="
                                        min-w-[25px]
                                        text-center
                                        font-medium
                                        ">
                                            {item.quantity}
                                        </span>


                                        <button
                                            disabled={isLoading}
                                            onClick={() =>
                                                updateQuantity(
                                                    itemId,
                                                    item.quantity+1
                                                )
                                            }
                                        >
                                            <Plus size={17}/>
                                        </button>

                                    </div>



                                    <button
                                        disabled={isLoading}
                                        onClick={() =>
                                            removeItem(itemId)
                                        }
                                        className="
                                        text-gray-400
                                        hover:text-red-500
                                        transition
                                        "
                                    >
                                        <Trash2 size={22}/>
                                    </button>


                                </div>

                            )

                        })

                    )}

                </div>



                {/* SUMMARY */}

                <div
                    className="
                    bg-white
                    rounded-2xl
                    shadow-sm
                    p-6
                    h-fit
                    sticky
                    top-5
                    "
                >

                    <h2 className="
                    text-2xl
                    font-serif
                    font-bold
                    text-[#3b2f2f]
                    mb-6
                    ">
                        Thông tin đơn hàng
                    </h2>


                    <div className="
                    flex
                    justify-between
                    text-gray-600
                    ">
                        <span>Tạm tính</span>

                        <span>
                            {total.toLocaleString()} đ
                        </span>

                    </div>


                    <div className="
                    border-t
                    my-5
                    "></div>


                    <div className="
                    flex
                    justify-between
                    text-xl
                    font-bold
                    ">

                        <span>
                            Tổng cộng
                        </span>


                        <span className="
                        text-[#8b6f47]
                        ">
                            {total.toLocaleString()} đ
                        </span>

                    </div>



                    <button
                        onClick={handleCheckout}
                        className="
                        w-full
                        mt-8
                        py-3
                        rounded-xl
                        bg-[#6b4f3f]
                        text-white
                        font-semibold
                        hover:bg-[#543b2f]
                        transition
                        "
                    >
                        Tiến hành đặt hàng
                    </button>



                    <button
                        onClick={handleContinueShopping}
                        className="
                        w-full
                        mt-3
                        py-3
                        rounded-xl
                        border
                        border-[#6b4f3f]
                        text-[#6b4f3f]
                        hover:bg-[#f5ede5]
                        transition
                        "
                    >
                        Tiếp tục mua sắm
                    </button>


                </div>

            </div>

        </div>


        <style>{`
            .loader {
                width:32px;
                height:32px;
                border:4px solid #8b6f47;
                border-top-color:transparent;
                border-radius:50%;
                animation:spin 1s linear infinite;
            }

            @keyframes spin {
                to {
                    transform:rotate(360deg);
                }
            }
        `}</style>

    </div>
);
};

export default CartPage;
