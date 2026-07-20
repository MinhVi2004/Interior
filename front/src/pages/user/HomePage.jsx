// src/pages/HomePage.jsx
import { useSearchParams } from "react-router-dom";
import Banner from "../../components/user/Banner";
import ListCategory from "../../components/user/ListCategory";
import ListProduct from "../../components/user/ListProduct";

const HomePage = () => {
  const [searchParams] = useSearchParams();
  const categoryId = searchParams.get("cate");

  return (
    <main className="min-h-screen bg-[#F5F1EB]">

        <div className="relative z-10">
            <Banner />
        </div>

        <ListCategory />

        <ListProduct selectedCategory={categoryId} />

    </main>
);
};

export default HomePage;
