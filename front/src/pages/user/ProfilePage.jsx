import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, Mail, User, ShieldCheck, Award } from "lucide-react";

const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isNormal, setIsNormal] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = sessionStorage.getItem("user");

        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            setIsNormal(parsedUser.type === "NORMAL");
        } else {
            navigate("/signin");
        }
    }, [navigate]);

    if (!user) {
        return (
            <div className="flex justify-center items-center min-h-[calc(100vh-10rem)]">
                Đang tải...
            </div>
        );
    }

    return (
        <div className="min-h-[calc(100vh-10rem)] bg-[#F8F5F1] py-10 px-4 relative">
            {/* Mobile menu */}
            <button
                className="absolute top-4 left-4 md:hidden bg-white p-2 rounded-full shadow"
                onClick={() => setSidebarOpen(!sidebarOpen)}
            >
                <Menu size={22} />
            </button>

            <div className="max-w-3xl mx-auto">
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    {/* Header */}
                    <div className="bg-[#8B5E3C] px-8 py-10 text-center text-white">
                        <div className="w-24 h-24 mx-auto rounded-full bg-white text-[#8B5E3C] flex items-center justify-center text-4xl font-bold shadow-lg">
                            {user.name?.charAt(0).toUpperCase()}
                        </div>

                        <h2 className="mt-4 text-2xl font-semibold">
                            {user.name}
                        </h2>

                        <p className="text-white/80 mt-1">
                            {user.email}
                        </p>
                    </div>

                    {/* Body */}
                    <div className="p-8 space-y-5">

                        <div className="grid md:grid-cols-2 gap-5">

                            <div className="border rounded-xl p-4">
                                <div className="flex items-center gap-2 text-[#8B5E3C] font-semibold mb-2">
                                    <User size={18} />
                                    Họ tên
                                </div>

                                <p className="text-gray-700">
                                    {user.name}
                                </p>
                            </div>

                            <div className="border rounded-xl p-4">
                                <div className="flex items-center gap-2 text-[#8B5E3C] font-semibold mb-2">
                                    <Mail size={18} />
                                    Email
                                </div>

                                <p className="text-gray-700 break-all">
                                    {user.email}
                                </p>
                            </div>

                            <div className="border rounded-xl p-4">
                                <div className="flex items-center gap-2 text-[#8B5E3C] font-semibold mb-2">
                                    <Award size={18} />
                                    Điểm tích lũy
                                </div>

                                <p className="text-gray-700">
                                    {user.point} điểm
                                </p>
                            </div>

                            <div className="border rounded-xl p-4">
                                <div className="flex items-center gap-2 text-[#8B5E3C] font-semibold mb-2">
                                    <ShieldCheck size={18} />
                                    Trạng thái
                                </div>

                                <span
                                    className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                                        user.isVerified
                                            ? "bg-green-100 text-green-700"
                                            : "bg-yellow-100 text-yellow-700"
                                    }`}
                                >
                                    {user.isVerified
                                        ? "Đã xác thực"
                                        : "Chưa xác thực"}
                                </span>
                            </div>
                        </div>

                        {isNormal && (
                            <button
                                onClick={() =>
                                    navigate("/change-password")
                                }
                                className="w-full bg-[#8B5E3C] hover:bg-[#744B2E] text-white py-3 rounded-xl font-semibold transition"
                            >
                                Đổi mật khẩu
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;