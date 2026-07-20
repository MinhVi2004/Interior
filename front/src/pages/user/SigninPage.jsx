import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { X } from 'lucide-react';
import { useGoogleLogin } from '@react-oauth/google';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook } from 'react-icons/fa';
import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const SigninPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const redirect = new URLSearchParams(location.search).get('redirect') || '/';

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  useEffect(() => {
    window.fbAsyncInit = function () {
      window.FB.init({
        appId: '9993196520807950',
        cookie: true,
        xfbml: true,
        version: 'v23.0',
      });
    };
  }, []);

  const handleRedirectAfterLogin = (user, token) => {
    sessionStorage.setItem('token', token);
    sessionStorage.setItem('user', JSON.stringify(user));
    sessionStorage.setItem('role', user.role);

    toast.success(' đăng nhập thành công!');
    navigate(redirect);
  };

  const mergeLocalCart = async (token) => {
  const localCart = JSON.parse(localStorage.getItem("cart")) || [];

  if (!localCart.length) return;

  try {
    const payload = {
      items: localCart.map(item => ({
        productId: item.product.id,
        quantity: item.quantity
      }))
    };

    await axios.post(
      `${BACKEND_URL}/api/cart/merge`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    localStorage.removeItem("cart");

    const res = await axios.get(
      `${BACKEND_URL}/api/cart`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const cartQuantity = (res.data.items || []).reduce(
      (sum, item) => sum + item.quantity,
      0
    );

    localStorage.setItem(
      "cartQuantity",
      JSON.stringify(cartQuantity)
    );

    window.dispatchEvent(new Event("cartUpdated"));

  } catch (err) {
    console.error("Lỗi merge cart:", err);
  }
};

  const handleFacebookLogin = () => {
    window.FB.getLoginStatus(response => {
      if (response.status !== 'connected') {
        window.FB.login(res => {
          if (res.authResponse) {
            const accessToken = res.authResponse.accessToken;
            window.FB.api('/me', {
              fields: 'id,name,email',
              access_token: accessToken,
            }, userInfo => handleFacebookLoginToServer(userInfo));
          }
        }, { scope: 'email,public_profile' });
      } else {
        const accessToken = response.authResponse.accessToken;
        window.FB.api('/me', {
          fields: 'id,name,email',
          access_token: accessToken,
        }, userInfo => handleFacebookLoginToServer(userInfo));
      }
    });
  };

  const handleFacebookLoginToServer = async userInfo => {
    try {
      const res = await axios.post(`${BACKEND_URL}/api/users/signinByFacebook`, {
        email: userInfo.email,
        name: userInfo.name,
      });

      const { user, token } = res.data;
      await mergeLocalCart(token);
      handleRedirectAfterLogin(user, token);
    } catch (error) {
      toast.error(' đăng nhập bằng Facebook thất bại.');
    }
  };

  const handleGoogleLogin = async userLogin => {
    try {
      const res = await axios.post(`${BACKEND_URL}/api/users/signinByGoogle`, {
        email: userLogin.email,
        name: userLogin.name,
      });

      const { user, token } = res.data;
      await mergeLocalCart(token);
      handleRedirectAfterLogin(user, token);
    } catch (error) {
      toast.error(' đăng nhập bằng Google thất bại.');
    }
  };

  const login = useGoogleLogin({
    onSuccess: async tokenResponse => {
      try {
        const { access_token } = tokenResponse;
        const res = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${access_token}` },
        });
        handleGoogleLogin(res.data);
      } catch (error) {
        toast.error('Lỗi khi lấy thông tin người dùng từ Google.');
      }
    },
    onError: () => {
      toast.error(' đăng nhập Google thất bại.');
    },
  });

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    
    if (loading) return; 
    e.preventDefault();
    const { email, password } = formData;

    if (!email || !password) {
      toast.error('Vui lòng điền đầy đủ thông tin.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.warning('Email không đúng định dạng.');
      return;
    }

    if (password.length < 6) {
      toast.warning('Mật khẩu phải có ít nhất 6 ký tự.');
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(`${BACKEND_URL}/api/users/signin`, { email, password });
      const { user, accessToken } = res.data;
      console.log("trả về signin" + res.data);


      await mergeLocalCart(accessToken);
      handleRedirectAfterLogin(user, accessToken);
    } catch (error) { 
      toast.error(error.response?.data?.message || 'Đăng nhập thất bại.');
    }finally {
      setLoading(false);
    }
  };

 return (
  <div className="h-screen bg-[#f7f5f2] flex items-center justify-center p-3 overflow-hidden">
    <div className="w-full max-w-6xl h-[90vh] max-h-[820px] bg-white rounded-3xl shadow-2xl overflow-hidden grid lg:grid-cols-2">

      {/* LEFT */}
      <div className="relative hidden lg:block">
        <img
          src="/website/signin.jpg"
          className="w-full h-full object-cover"
          alt=""
        />

        <div className="absolute inset-0 bg-black/45" />

        <div className="absolute inset-0 flex flex-col justify-center px-10 text-white">
          <h1 className="text-4xl font-bold leading-tight">
            Welcome
            <br />
            Back
          </h1>

          <p className="mt-4 text-base leading-7 text-gray-200">
            Đăng nhập để quản lý đơn hàng,
            lưu sản phẩm yêu thích và tiếp tục
            mua sắm nội thất cho ngôi nhà của bạn.
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
          Đăng nhập
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Chào mừng bạn quay trở lại
        </p>

        <form
          onSubmit={handleSubmit}
          className="space-y-3 mt-5"
        >

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

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => navigate("/forget-password")}
              className="text-sm text-[#8B5E3C] hover:underline"
            >
              Quên mật khẩu?
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 rounded-xl bg-[#8B5E3C] hover:bg-[#714b2f] text-white font-semibold transition disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? "Đang xử lý..." : "Đăng nhập"}
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
            onClick={login}
            className="h-11 border rounded-xl flex items-center justify-center gap-2 hover:bg-gray-50 transition"
          >
            <FcGoogle size={22} />
            <span className="text-sm">Google</span>
          </button>

          <button
            type="button"
            onClick={handleFacebookLogin}
            className="h-11 border rounded-xl flex items-center justify-center gap-2 hover:bg-gray-50 transition"
          >
            <FaFacebook
              size={22}
              className="text-blue-600"
            />
            <span className="text-sm">Facebook</span>
          </button>

        </div>

        <p className="text-center mt-4 text-sm text-gray-500">
          Chưa có tài khoản?

          <a
            href={`/signup?redirect=${redirect}`}
            className="ml-2 text-[#8B5E3C] font-semibold hover:underline"
          >
            Đăng ký ngay
          </a>
        </p>

      </div>

    </div>
  </div>
);
};

export default SigninPage;
