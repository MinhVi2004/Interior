import { Link } from "react-router-dom";
import {
  User,
  Phone,
  House,
  ShoppingCart,
  Settings,
  LogOut,
  NotepadText,
  ChevronDown
} from "lucide-react";
import Swal from "sweetalert2";
import { useState, useEffect } from "react";

const Header = () => {
  const user = JSON.parse(sessionStorage.getItem("user"));
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [cartQuantity, setCartQuantity] = useState(0);

  useEffect(() => {
    const updateQuantity = () => {
      const quantity = JSON.parse(localStorage.getItem("cartQuantity")) || 0;
      setCartQuantity(quantity);
    };

    updateQuantity(); // load khi mount
    window.addEventListener("cartUpdated", updateQuantity);
    return () => window.removeEventListener("cartUpdated", updateQuantity);
  }, []);

  // Xử lý đăng xuất
  const handleLogout = async () => {
    const confirm = await Swal.fire({
      title: "Đăng xuất",
      text: "Bạn có chắc chắn muốn đăng xuất?",
      icon: "warning",
      showCancelButton: true,
      cancelButtonText: "Hủy",
      confirmButtonText: "Xác nhận",
      confirmButtonColor: "#8B5E3C", // Đồng bộ màu nâu gỗ cho nút xác nhận
      cancelButtonColor: "#1F2937", // Nút hủy dùng màu đen xám
      background: "#F5F1EB", // Nền kem nhã nhặn phù hợp logo
      customClass: {
        title: "text-[#1F2937] font-semibold",
        htmlContainer: "text-[#1F2937]/80",
      },
    });
    if (confirm.isConfirmed) {
      localStorage.removeItem("cart");
      sessionStorage.clear();
      window.location.href = "/";
    }
    localStorage.removeItem("cartQuantity");
  };

  return (
    <header
      className="
sticky top-0 
z-50 
bg-[#F5F1EB]
border-b border-[#8B5E3C]/20
shadow-sm
"
    >
      <div
        className="
max-w-7xl
mx-auto
h-24
px-6
relative
flex
items-center
justify-between
"
      >
        {/* LEFT MENU */}

        <nav
          className="
hidden
md:flex
items-center
gap-8
"
        >
          <Link
            to="/"
            className="
flex
items-center
gap-2
text-[#1F2937]
hover:text-[#8B5E3C]
transition
"
          >
            <House size={20} />
            <span className="text-sm font-medium">Trang chủ</span>
          </Link>

          {/* <Link
            to="/products"
            className="
text-sm
font-medium
text-[#1F2937]
hover:text-[#8B5E3C]
transition
"
          >
            Sản phẩm
          </Link> */}

          <Link
            to="/contact"
            className="
flex
items-center
gap-2
text-[#1F2937]
hover:text-[#8B5E3C]
transition
"
          >
            <Phone size={20} />

            <span className="text-sm font-medium">Liên hệ</span>
          </Link>
        </nav>

        {/* CENTER LOGO */}

        <Link
          to="/"
          className="
absolute
left-1/2
-translate-x-1/2
flex
items-center
"
        >
          <img
            src="/website/logo_text.jpg"
            alt="PDD Interior"
            className="
h-24
object-contain
"
          />
        </Link>

        {/* RIGHT ICON */}

        <div
          className="
flex
items-center
gap-6
"
        >
          {/* Cart */}

          <Link
            to="/cart"
            className="
relative
flex
flex-col
items-center
text-[#1F2937]
hover:text-[#8B5E3C]
transition
"
          >
            <ShoppingCart size={23} />

            {cartQuantity > 0 && (
              <span
                className="
absolute
-top-2
-right-3

bg-[#8B5E3C]
text-white

text-xs

w-5
h-5

rounded-full

flex
items-center
justify-center

"
              >
                {cartQuantity}
              </span>
            )}

            <span
              className="
hidden
md:block
text-xs
mt-1
"
            >
              Giỏ hàng
            </span>
          </Link>

          {/* User */}

          {!user ? (
            <Link
              to="/signin"
              className="
flex
flex-col
items-center
text-[#1F2937]
hover:text-[#8B5E3C]
transition
"
            >
              <User size={23} />

              <span className="hidden md:block text-xs mt-1">Đăng nhập</span>
            </Link>
          ) : (
            <div
              className="relative"
              onMouseLeave={() => setDropdownOpen(false)}
            >
              <button
    onClick={() => setDropdownOpen(!dropdownOpen)}
    className="
        flex
        items-center
        gap-3
        px-3
        py-2
        rounded-xl
        hover:bg-[#8B5E3C]/10
        transition-all
        duration-300
        group
    "
>
                <div className="relative">

    <img
        src="/website/male_avatar.png"
        alt="Avatar"
        className="
            w-11
            h-11
            rounded-full
            object-cover
            border-2
            border-[#8B5E3C]/40
            group-hover:border-[#8B5E3C]
            transition
        "
    />

    <span
        className="
            absolute
            bottom-0
            right-0
            w-3
            h-3
            bg-green-500
            rounded-full
            border-2
            border-[#F5F1EB]
        "
    />

</div>

                <div
className="
hidden
lg:flex
flex-col
text-left
"
>
                  <p
className="
font-semibold
text-sm
text-[#1F2937]
group-hover:text-[#8B5E3C]
transition
"
>
    {user.name}
</p>

                  <p
className="
text-xs
text-[#8B5E3C]
"
>
    {user.role === "ADMIN" ? "Quản trị viên" : "Khách hàng"}
</p>
                </div>
                <ChevronDown
    size={16}
    className={`
        text-[#8B5E3C]
        transition-transform
        duration-300
        ${
            dropdownOpen 
            ? "rotate-180"
            : ""
        }
    `}
/>
              </button>

              {/* Dropdown Menu */}
<div
    className={`
        absolute
        right-0
        top-full
        w-64
        pt-2
        bg-[#F5F1EB]
        rounded-2xl
        shadow-xl
        border
        border-[#8B5E3C]/20
        overflow-hidden
        transition-all
        duration-200
        ${
            dropdownOpen
                ? "opacity-100 translate-y-0 visible"
                : "opacity-0 -translate-y-2 invisible"
        }
    `}
>
    <Link
        to="/profile"
        className="
            flex
            items-center
            gap-3
            px-5
            py-3
            text-[#1F2937]
            hover:bg-white/60
            transition
        "
    >
        <User size={18} className="text-[#8B5E3C]" />
        Tài khoản
    </Link>


    <Link
        to="/order"
        className="
            flex
            items-center
            gap-3
            px-5
            py-3
            text-[#1F2937]
            hover:bg-white/60
            transition
        "
    >
        <NotepadText size={18} className="text-[#8B5E3C]" />
        Lịch sử đơn hàng
    </Link>


    <Link
        to="/profile/address"
        className="
            flex
            items-center
            gap-3
            px-5
            py-3
            text-[#1F2937]
            hover:bg-white/60
            transition
        "
    >
        <House size={18} className="text-[#8B5E3C]" />
        Địa chỉ giao hàng
    </Link>


    {user.role === "ADMIN" && (
        <Link
            to="/admin"
            className="
                flex
                items-center
                gap-3
                px-5
                py-3
                text-[#8B5E3C]
                bg-[#8B5E3C]/5
                hover:bg-[#8B5E3C]/10
                font-semibold
                transition
            "
        >
            <Settings size={18} />
            Trang quản trị
        </Link>
    )}


    <div className="border-t border-[#8B5E3C]/10" />


    <button
        onClick={handleLogout}
        className="
            w-full
            flex
            items-center
            gap-3
            px-5
            py-3
            text-red-600
            hover:bg-red-50
            transition
            font-medium
        "
    >
        <LogOut size={18} />
        Đăng xuất
    </button>

</div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
