import { useState, useEffect } from "react";
import {
    Outlet,
    NavLink,
    useNavigate,
} from "react-router-dom";

import {
    Menu,
    LayoutDashboard,
    Folder,
    Package,
    ShoppingBag,
    Users,
    Image,
    Home,
    LogOut,
    X,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";

const AdminLayout = () => {

    const navigate = useNavigate();

    const user = JSON.parse(sessionStorage.getItem("user"));

    const [avatar, setAvatar] = useState("/website/male_avatar.png");

    const [sidebarOpen, setSidebarOpen] = useState(false);

    const [collapse, setCollapse] = useState(false);

    useEffect(() => {

        if (user?.avatar) {
            setAvatar(user.avatar);
        }

    }, [user]);

    const menus = [

        {
            title: "Dashboard",
            icon: LayoutDashboard,
            path: "/admin",
        },

        {
            title: "Danh mục",
            icon: Folder,
            path: "/admin/category",
        },

        {
            title: "Banner",
            icon: Image,
            path: "/admin/banner",
        },

        {
            title: "Sản phẩm",
            icon: Package,
            path: "/admin/product",
        },

        {
            title: "Đơn hàng",
            icon: ShoppingBag,
            path: "/admin/order",
        },

        {
            title: "Người dùng",
            icon: Users,
            path: "/admin/user",
        },

    ];

    return (

        <div className="flex h-screen bg-[#f7f5f2] overflow-hidden">

            {/* Overlay mobile */}

            {sidebarOpen && (

                <div
                    onClick={() => setSidebarOpen(false)}
                    className="fixed inset-0 bg-black/40 z-40 lg:hidden"
                />

            )}

            {/* Sidebar */}

            <aside
                className={`
                    fixed lg:static
                    z-50
                    h-full
                    bg-white
                    border-r
                    shadow-lg
                    transition-all
                    duration-300
                    ${collapse ? "w-20" : "w-64"}
                    ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
                `}
            >

                {/* Logo */}

                <div className="relative h-20 border-b flex items-center justify-center">

                    {!collapse ? (

                        <div className="text-center">

                            <h2 className="text-2xl font-bold text-[#8B5E3C]">
                                FurniHome
                            </h2>

                            <p className="text-xs text-gray-500">
                                Admin Panel
                            </p>

                        </div>

                    ) : (

                        <span className="text-2xl font-bold text-[#8B5E3C]">
                            F
                        </span>

                    )}

                    <button
                        onClick={() => setCollapse(!collapse)}
                        className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 bg-white border rounded-full w-7 h-7 items-center justify-center shadow"
                    >
                        {collapse ? (
                            <ChevronRight size={16} />
                        ) : (
                            <ChevronLeft size={16} />
                        )}
                    </button>

                </div>

                {/* Menu */}

                <nav className="p-4 space-y-2">

                    <NavLink
                        to="/"
                        className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100 transition"
                    >

                        <Home size={20} />

                        {!collapse && "Về trang chủ"}

                    </NavLink>

                    {menus.map(menu => {

                        const Icon = menu.icon;

                        return (

                            <NavLink
                                key={menu.path}
                                to={menu.path}
                                end={menu.path === "/admin"}
                                className={({ isActive }) =>
                                    `
                                    flex
                                    items-center
                                    gap-3
                                    px-4
                                    py-3
                                    rounded-xl
                                    transition
                                    ${
                                        isActive
                                            ? "bg-[#8B5E3C] text-white shadow"
                                            : "hover:bg-gray-100 text-gray-700"
                                    }
                                    `
                                }
                            >

                                <Icon size={20} />

                                {!collapse && menu.title}

                            </NavLink>

                        );

                    })}

                </nav>

                {/* Footer */}

                <div className="absolute bottom-0 left-0 right-0 border-t bg-white p-4">

                    <div className="flex items-center gap-3">

                        <img
                            src={avatar}
                            alt=""
                            className="w-11 h-11 rounded-full border object-cover"
                        />

                        {!collapse && (

                            <div className="flex-1">

                                <p className="font-semibold text-gray-800">
                                    {user?.name}
                                </p>

                                <p className="text-xs text-gray-500">
                                    Administrator
                                </p>

                            </div>

                        )}

                    </div>

                    <button
                        onClick={() => {

                            sessionStorage.clear();

                            navigate("/signin");

                        }}
                        className={`
                            mt-4
                            w-full
                            flex
                            items-center
                            justify-center
                            gap-2
                            bg-red-50
                            text-red-600
                            rounded-xl
                            py-2.5
                            hover:bg-red-100
                            transition
                        `}
                    >

                        <LogOut size={18} />

                        {!collapse && "Đăng xuất"}

                    </button>

                </div>

            </aside>

            {/* Content */}

            <div className="flex-1 flex flex-col overflow-hidden">

                {/* Header */}

                <header className="h-16 bg-white border-b flex items-center justify-between px-6 shadow-sm">

                    <div className="flex items-center gap-3">

                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden"
                        >
                            <Menu />
                        </button>

                        <h1 className="text-xl font-semibold text-gray-800">

                            Hệ thống quản trị

                        </h1>

                    </div>

                    <div className="flex items-center gap-3">

                        <img
                            src={avatar}
                            alt=""
                            className="w-10 h-10 rounded-full border object-cover"
                        />

                        <div className="hidden sm:block">

                            <p className="font-medium">
                                {user?.name}
                            </p>

                            <p className="text-xs text-gray-500">
                                Admin
                            </p>

                        </div>

                    </div>

                </header>

                {/* Main */}

                <main className="flex-1 overflow-y-auto p-8">

                    <Outlet />

                </main>

            </div>

        </div>

    );

};

export default AdminLayout;