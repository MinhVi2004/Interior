import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {

  // Tạo giá cũ giả (cao hơn 10-20%)
  const fakeOldPrice = Math.round(
    product.price * (1.15 + Math.random() * 0.1)
  );

  return (
    <div
      className="
      bg-white
      rounded-2xl
      overflow-hidden
      shadow-sm
      border border-[#eee5dc]
      hover:shadow-xl
      transition-all
      duration-300
      group
      "
    >

      <Link to={`/product/${product.sku}`}>

        {/* IMAGE */}
        <div className="
          relative
          aspect-square
          overflow-hidden
          bg-[#f5f1eb]
        ">

          <img
            src={product.thumbnail}
            alt={product.name}
            className="
            w-full
            h-full
            object-cover
            group-hover:scale-105
            transition-transform
            duration-500
            "
          />


          {/* Badge */}
          <span
            className="
            absolute
            top-3
            left-3
            bg-[#8b6f47]
            text-white
            text-xs
            px-3
            py-1
            rounded-full
            "
          >
            Nội thất
          </span>

        </div>



        {/* CONTENT */}
        <div className="p-5">


          <p
            className="
            text-sm
            text-[#8b6f47]
            mb-1
            "
          >
            {product.category?.name}
          </p>



          <h2
            className="
            text-lg
            font-semibold
            text-[#3b2f2f]
            line-clamp-2
            min-h-[56px]
            group-hover:text-[#8b6f47]
            transition
            "
          >
            {product.name}
          </h2>



          {/* PRICE */}
          <div className="
          mt-4
          flex
          items-center
          gap-3
          ">


            <span
              className="
              text-sm
              text-gray-400
              line-through
              "
            >
              {fakeOldPrice.toLocaleString()} đ
            </span>


            <span
              className="
              text-xl
              font-bold
              text-[#8b6f47]
              "
            >
              {product.price.toLocaleString()} đ
            </span>


          </div>




          {/* BUTTON */}
          <div
            className="
            mt-5
            "
          >

            <button
              className="
              w-full
              py-3
              rounded-xl
              bg-[#6b4f3f]
              text-white
              font-medium
              hover:bg-[#543b2f]
              transition
              "
            >
              Xem chi tiết
            </button>

          </div>


        </div>

      </Link>

    </div>
  );
};


export default ProductCard;