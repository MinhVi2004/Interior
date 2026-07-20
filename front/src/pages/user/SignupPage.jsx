import { useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate, useLocation } from 'react-router-dom';
import { X } from 'lucide-react';
import { useGoogleLogin } from '@react-oauth/google';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook } from 'react-icons/fa';
import axios from 'axios';
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const SignupPage = () => {
    const [loading, setLoading] = useState(false);
    const location = useLocation();
    const redirect =
        new URLSearchParams(location.search).get('redirect') || '/';
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        // gender: "",
        email: '',
        password: '',
        confirmPassword: '',
    });

    const handleChange = e => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async e => {
        e.preventDefault();
        if (loading) return; // nếu đang xử lý thì bỏ qua click tiếp theo
        const { name, email, password, confirmPassword } = formData;

        // Validation
        if (!name || !email || !password || !confirmPassword) {
            toast.error('Vui lòng điền đầy đủ thông tin.');
            return;
        }
        const numberRegex = /\d/;
        if (numberRegex.test(name)) {
            toast.warning('Tên không được chứa số.');
            return;
        }
        if (name.length < 2) {
            toast.warning('Tên phải có ít nhất 2 ký tự.');
            return;
        }
        // if(gender === "") {
        //   toast.warning("Vui lòng chọn giới tính.");
        //   return;
        // }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            toast.warning('Email không đúng định dạng.');
            return;
        }

        if (password.length < 6) {
            toast.warning('Mật khẩu phải có ít nhất 6 ký tự.');
            return;
        }

        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}$/;
        if (!passwordRegex.test(password)) {
            toast.warning('Mật khẩu phải chứa ít nhất 1 chữ cái và 1 số.');
            return;
        }

        if (password !== confirmPassword) {
            toast.error('Mật khẩu và xác nhận mật khẩu không khớp.');
            return;
        }

        try {
            setLoading(true);

            const res = await axios.post(`${BACKEND_URL}/api/user/signup`, {
                name,
                email,
                password,
                redirect, // cần định nghĩa redirect trước
            });

            toast.success(' đăng ký thành công! Vui lòng kiểm tra email để xác minh tài khoản.');

            setFormData({ name: '', email: '', password: '', confirmPassword: '' });

            setTimeout(() => {
                navigate(redirect ? `/signin?redirect=${redirect}` : '/signin', { replace: true });
            }, 1500);

            console.log('Server trả về:', res.data);
        } catch (error) {
            console.error('Lỗi đăng ký:', error.response);
            toast.error(error.response?.data?.message || 'Lỗi kết nối đến máy chủ.');
        } finally {
            setLoading(false);
        }
    };

   return (
  <div className="h-screen bg-[#f7f5f2] flex items-center justify-center p-3 overflow-hidden">
    <div className="w-full max-w-6xl h-[90vh] max-h-[820px] bg-white rounded-3xl shadow-2xl overflow-hidden grid lg:grid-cols-2">

      {/* LEFT */}
      <div className="relative hidden lg:block">
        <img
          src="/website/signup.jpg"
          className="w-full h-full object-cover"
          alt=""
        />

        <div className="absolute inset-0 bg-black/45" />

        <div className="absolute inset-0 flex flex-col justify-center px-10 text-white">
          <h1 className="text-4xl font-bold leading-tight">
            Create your
            <br />
            Dream Home
          </h1>

          <p className="mt-4 text-base leading-7 text-gray-200">
            Đăng ký tài khoản để lưu sản phẩm yêu thích,
            quản lý đơn hàng và nhận nhiều ưu đãi dành
            riêng cho khách hàng.
          </p>
        </div>
      </div>

      {/* RIGHT */}
      <div className="relative p-7 lg:p-8 flex flex-col justify-center">

        <button
          onClick={() => navigate("/")}
          className="absolute right-5 top-5 text-gray-500 hover:text-black"
        >
          <X size={24} />
        </button>

        <h2 className="text-3xl font-bold text-gray-800">
          Đăng ký
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Bắt đầu hành trình xây dựng ngôi nhà mơ ước
        </p>

        <form
          onSubmit={handleSubmit}
          className="space-y-3 mt-5"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Họ và tên
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Nguyễn Văn A"
              className="mt-1 w-full h-11 rounded-xl border border-gray-300 px-4 outline-none focus:ring-2 focus:ring-[#8B5E3C]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="example@gmail.com"
              className="mt-1 w-full h-11 rounded-xl border border-gray-300 px-4 outline-none focus:ring-2 focus:ring-[#8B5E3C]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Mật khẩu
            </label>

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="********"
              className="mt-1 w-full h-11 rounded-xl border border-gray-300 px-4 outline-none focus:ring-2 focus:ring-[#8B5E3C]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Xác nhận mật khẩu
            </label>

            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="********"
              className="mt-1 w-full h-11 rounded-xl border border-gray-300 px-4 outline-none focus:ring-2 focus:ring-[#8B5E3C]"
            />
          </div>


          <button
            disabled={loading}
            className="w-full h-11 rounded-xl bg-[#8B5E3C] hover:bg-[#714b2f] text-white font-semibold transition"
          >
            {loading ? "Đang xử lý..." : "Tạo tài khoản"}
          </button>
        </form>

        <div className="my-4 flex items-center">
          <div className="flex-1 h-px bg-gray-300" />

          <span className="mx-3 text-sm text-gray-400">
            hoặc
          </span>

          <div className="flex-1 h-px bg-gray-300" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            className="h-11 border rounded-xl flex justify-center items-center gap-2 hover:bg-gray-50 transition"
          >
            <FcGoogle size={22} />
            <span className="text-sm">Google</span>
          </button>

          <button
            type="button"
            className="h-11 border rounded-xl flex justify-center items-center gap-2 hover:bg-gray-50 transition"
          >
            <FaFacebook
              size={22}
              className="text-blue-600"
            />
            <span className="text-sm">Facebook</span>
          </button>
        </div>

        <p className="text-center mt-4 text-sm text-gray-500">
          Đã có tài khoản?

          <a
            href={`/signin?redirect=${redirect}`}
            className="ml-2 text-[#8B5E3C] font-semibold hover:underline"
          >
            Đăng nhập ngay
          </a>
        </p>

      </div>

    </div>
  </div>
);
};

export default SignupPage;
