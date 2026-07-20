import { useState } from "react";
import axiosInstance from "../../utils/axios";
import { toast } from "react-toastify";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  User,
  MessageCircle
} from "lucide-react";

const ContactPage = () => {

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });

  const [isSending, setIsSending] = useState(false);


  const isValid =
    formData.name &&
    formData.email &&
    formData.message;


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValid) {
      toast.warn("Vui lòng nhập đầy đủ thông tin.");
      return;
    }


    try {

      setIsSending(true);

      await axiosInstance.post("/api/email", formData);

      toast.success("Gửi liên hệ thành công!");

      setFormData({
        name:"",
        email:"",
        message:""
      });


    } catch(err){

      toast.error(
        "Gửi thất bại. Vui lòng thử lại."
      );

    } finally {

      setIsSending(false);

    }
  };


  return (

    <div
      className="
      min-h-screen
      bg-[#F5F1EB]
      py-16
      px-6
      "
    >

      <div className="max-w-6xl mx-auto">


        {/* TITLE */}

        <div className="text-center mb-12">

          <h1
            className="
            text-4xl
            font-bold
            text-[#1F2937]
            "
          >
            Liên hệ với PDD Interior
          </h1>


          <p
            className="
            mt-3
            text-gray-600
            "
          >
            Hãy để chúng tôi giúp bạn tạo nên không gian sống hoàn hảo
          </p>

        </div>



        <div
          className="
          grid
          md:grid-cols-2
          gap-10
          bg-white
          rounded-3xl
          shadow-xl
          p-8
          md:p-12
          "
        >


          {/* CONTACT INFO */}


          <div>


            <h2
              className="
              text-2xl
              font-semibold
              text-[#8B5E3C]
              mb-8
              "
            >
              Thông tin cửa hàng
            </h2>



            <div className="space-y-6">


              <a
                href="https://maps.app.goo.gl/NoMTMFnsjyMvvSsu8"
                target="_blank"
                rel="noreferrer"
                className="
                flex
                gap-4
                items-center
                text-gray-700
                hover:text-[#8B5E3C]
                transition
                "
              >

                <div
                  className="
                  w-12
                  h-12
                  rounded-full
                  bg-[#F5F1EB]
                  flex
                  items-center
                  justify-center
                  "
                >
                  <MapPin
                    className="text-[#8B5E3C]"
                  />
                </div>


                <span>
                  Trường Đại học Sài Gòn,
                  Quận 5, TP.HCM
                </span>

              </a>



              <a
                href="tel:0772912452"
                className="
                flex
                gap-4
                items-center
                text-gray-700
                hover:text-[#8B5E3C]
                "
              >

                <div
                  className="
                  w-12
                  h-12
                  rounded-full
                  bg-[#F5F1EB]
                  flex
                  items-center
                  justify-center
                  "
                >

                  <Phone
                    className="text-[#8B5E3C]"
                  />

                </div>


                <span>
                  0772 912 452
                </span>

              </a>



              <a
                href="mailto:dvmv2017@gmail.com"
                className="
                flex
                gap-4
                items-center
                text-gray-700
                hover:text-[#8B5E3C]
                "
              >

                <div
                  className="
                  w-12
                  h-12
                  rounded-full
                  bg-[#F5F1EB]
                  flex
                  items-center
                  justify-center
                  "
                >

                  <Mail
                    className="text-[#8B5E3C]"
                  />

                </div>


                <span>
                  dvmv2017@gmail.com
                </span>

              </a>




              <div
                className="
                flex
                gap-4
                items-center
                text-gray-700
                "
              >

                <div
                  className="
                  w-12
                  h-12
                  rounded-full
                  bg-[#F5F1EB]
                  flex
                  items-center
                  justify-center
                  "
                >

                  <Clock
                    className="text-[#8B5E3C]"
                  />

                </div>


                <span>
                  8:00 - 18:00 (Thứ 2 - Thứ 7)
                </span>

              </div>


            </div>



            {/* IMAGE DECOR */}

            <div
              className="
              mt-10
              rounded-2xl
              overflow-hidden
              "
            >

              <img
                src="/website/logo_text.jpg"
                alt="Interior"
                className="
                w-full
                h-48
                object-cover
                "
              />

            </div>


          </div>





          {/* FORM */}


          <form
            onSubmit={handleSubmit}
            className="
            space-y-5
            "
          >


            <h2
              className="
              text-2xl
              font-semibold
              text-[#8B5E3C]
              "
            >
              Gửi yêu cầu
            </h2>



            <div>

              <label
                className="
                text-sm
                text-gray-600
                "
              >
                Họ và tên
              </label>


              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Nguyễn Văn A"
                className="
                mt-2
                w-full
                rounded-xl
                border
                border-gray-200
                px-4
                py-3
                outline-none
                focus:border-[#8B5E3C]
                focus:ring-2
                focus:ring-[#8B5E3C]/20
                "
              />

            </div>



            <div>

              <label
                className="
                text-sm
                text-gray-600
                "
              >
                Email
              </label>


              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="example@gmail.com"
                className="
                mt-2
                w-full
                rounded-xl
                border
                border-gray-200
                px-4
                py-3
                outline-none
                focus:border-[#8B5E3C]
                focus:ring-2
                focus:ring-[#8B5E3C]/20
                "
              />

            </div>



            <div>

              <label
                className="
                text-sm
                text-gray-600
                "
              >
                Nội dung
              </label>


              <textarea

                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Nhập yêu cầu của bạn..."
                className="
                mt-2
                w-full
                h-36
                resize-none
                rounded-xl
                border
                border-gray-200
                px-4
                py-3
                outline-none
                focus:border-[#8B5E3C]
                focus:ring-2
                focus:ring-[#8B5E3C]/20
                "

              />

            </div>



            <button

              disabled={!isValid || isSending}

              className="
              w-full
              flex
              items-center
              justify-center
              gap-2
              bg-[#8B5E3C]
              text-white
              py-3
              rounded-xl
              font-semibold
              hover:bg-[#70462d]
              transition
              disabled:opacity-50
              "

            >

              <Send size={18}/>

              {
                isSending
                ? "Đang gửi..."
                : "Gửi liên hệ"
              }

            </button>



          </form>


        </div>

      </div>


    </div>

  );
};


export default ContactPage;