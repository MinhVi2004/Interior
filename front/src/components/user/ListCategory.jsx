import { useRef, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axiosInstance from "../../utils/axios";

const ListCategory = () => {
  const containerRef = useRef(null);
  const [showButtons, setShowButtons] = useState(false);
  const [trendingItems, setTrendingItems] = useState([]);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const selectedCategoryId = searchParams.get("cate");

  const handleSelectCategory = (categoryId) => {
    if (categoryId) {
      navigate(`/?cate=${categoryId}`);
    } else {
      navigate(`/`);
    }
  };

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await axiosInstance.get("/api/category");
        setTrendingItems(res.data);
      } catch (err) {
        console.error("Lỗi khi tải danh mục:", err);
      }
    };
    fetchCategory();
  }, []);

  // Kiểm tra khi resize
  useEffect(() => {
    const checkOverflow = () => {
      if (!containerRef.current) return;
      const isOverflowing =
        containerRef.current.scrollWidth > containerRef.current.clientWidth;
      setShowButtons(isOverflowing);
    };

    checkOverflow();
    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, []);

  // Kiểm tra lại sau khi dữ liệu danh mục thay đổi
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!containerRef.current) return;
      const isOverflowing =
        containerRef.current.scrollWidth > containerRef.current.clientWidth;
      setShowButtons(isOverflowing);
    }, 100);

    return () => clearTimeout(timeout);
  }, [trendingItems]);

  const scroll = (direction) => {
    if (containerRef.current) {
      const scrollAmount = 300;
      containerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
  <div className="w-full max-w-7xl mx-auto px-5 py-12">

    <div className="mb-8">
      <h2
        className="
        text-3xl
        md:text-4xl
        font-serif
        font-bold
        text-[#3b2f2f]
        "
      >
        Khám phá bộ sưu tập
      </h2>

      <p className="
        mt-2
        text-gray-500
        "
      >
        Lựa chọn phong cách nội thất phù hợp cho không gian của bạn
      </p>
    </div>



    <div className="relative">


      {
        showButtons && (
          <button
            onClick={() => scroll("left")}
            className="
            absolute
            left-0
            top-1/2
            -translate-y-1/2
            z-10
            bg-white
            shadow-lg
            w-10
            h-10
            rounded-full
            flex
            items-center
            justify-center
            text-[#6b4f3f]
            hover:bg-[#f5ede5]
            transition
            "
          >
            <ChevronLeft size={22}/>
          </button>
        )
      }



      <div
        ref={containerRef}
        className="
        overflow-x-auto
        scroll-smooth
        no-scrollbar
        px-12
        "
      >

        <div
          className="
          flex
          gap-6
          w-max
          "
        >



          {/* ALL */}

          <div
            onClick={() => handleSelectCategory("")}
            className={`
              cursor-pointer
              group
              flex
              flex-col
              items-center
              w-[120px]

              ${
                !selectedCategoryId
                ?
                "text-[#8b6f47]"
                :
                "text-gray-500"
              }
            `}
          >

            <div
              className={`
              w-28
              h-28
              rounded-2xl
              flex
              items-center
              justify-center
              shadow-sm
              transition-all

              ${
                !selectedCategoryId
                ?
                "bg-[#f5ede5] border border-[#8b6f47]"
                :
                "bg-white border border-gray-100"
              }

              group-hover:shadow-lg
              `}
            >

              <span
                className="
                font-serif
                text-xl
                font-bold
                "
              >
                ALL
              </span>

            </div>


            <span className="
            mt-3
            text-sm
            font-medium
            ">
              Tất cả
            </span>

          </div>





          {/* CATEGORY */}

          {
            trendingItems.map(item => (

              <div
                key={item.id}
                onClick={() => handleSelectCategory(item.id)}
                className={`
                  cursor-pointer
                  group
                  flex
                  flex-col
                  items-center
                  w-[120px]

                  ${
                    selectedCategoryId == item.id
                    ?
                    "text-[#8b6f47]"
                    :
                    "text-gray-600"
                  }

                `}
              >


                <div
                  className={`
                  w-28
                  h-28
                  rounded-2xl
                  bg-white
                  border
                  flex
                  items-center
                  justify-center
                  overflow-hidden
                  shadow-sm
                  transition-all

                  ${
                    selectedCategoryId == item.id
                    ?
                    "border-[#8b6f47] ring-2 ring-[#e8d8c5]"
                    :
                    "border-gray-100"
                  }

                  group-hover:shadow-lg
                  group-hover:-translate-y-1

                  `}
                >

                  <img
                    src={item.image}
                    alt={item.name}
                    className="
                    w-20
                    h-20
                    object-cover
                    rounded-xl
                    "
                  />

                </div>


                <span
                  className="
                  mt-3
                  text-sm
                  text-center
                  line-clamp-2
                  font-medium
                  "
                >
                  {item.name}
                </span>


              </div>

            ))
          }


        </div>

      </div>




      {
        showButtons && (

          <button
            onClick={() => scroll("right")}
            className="
            absolute
            right-0
            top-1/2
            -translate-y-1/2
            z-10
            bg-white
            shadow-lg
            w-10
            h-10
            rounded-full
            flex
            items-center
            justify-center
            text-[#6b4f3f]
            hover:bg-[#f5ede5]
            transition
            "
          >

            <ChevronRight size={22}/>

          </button>

        )
      }


    </div>

  </div>
);
};

export default ListCategory;
