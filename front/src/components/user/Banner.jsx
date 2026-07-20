import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import axiosInstance from './../../utils/axios';

const Banner = () => {
    const [slides, setSlides] = useState([]);
    const [current, setCurrent] = useState(0);
    const intervalRef = useRef(null);

    useEffect(() => {
        const fetchSlides = async () => {
            try {
                const res = await axiosInstance.get('/api/banner');
                const data = res.data;

                setSlides(data);

                if (data.length > 0) {
                    const randomIndex = Math.floor(
                        Math.random() * data.length
                    );
                    setCurrent(randomIndex);
                }

            } catch (err) {
                console.error('Lỗi khi lấy banner:', err);
            }
        };

        fetchSlides();
    }, []);



    useEffect(() => {
        if (slides.length <= 1) return;

        intervalRef.current = setInterval(() => {
            setCurrent(prev => (prev + 1) % slides.length);
        }, 5000);


        return () => {
            clearInterval(intervalRef.current);
        };

    }, [slides]);



    const prevSlide = () => {
        setCurrent(prev =>
            prev === 0 ? slides.length - 1 : prev - 1
        );
    };


    const nextSlide = () => {
        setCurrent(prev =>
            (prev + 1) % slides.length
        );
    };


    if (!slides.length) return null;


    return (

        <section
    className="
    relative
    z-10
    max-w-screen-xl
    mx-auto
    px-4
    pt-5
    "
>


            <div
                className="
                relative
                overflow-hidden
                rounded-3xl
                shadow-xl
                bg-[#F5F1EB]
                "
            >


                {/* Image area */}

                <div
                    className="
                    relative
                    h-[35vh]
                    sm:h-[50vh]
                    lg:h-[65vh]
                    "
                >

                    {
                        slides.map((slide,index)=>(

                            <div
                                key={slide.id || index}
                                className={`
                                absolute
                                inset-0

                                transition-all
                                duration-1000
                                ease-in-out

                                ${
                                    index === current
                                    ?
                                    "opacity-100 scale-100 z-10"
                                    :
                                    "opacity-0 scale-105 z-0"
                                }

                                `}
                            >


                                <img
                                    src={slide.image}
                                    alt={`Banner ${index+1}`}
                                    className="
                                    w-full
                                    h-full
                                    object-cover
                                    "
                                />


                                {/* overlay */}

                                <div
                                    className="
                                    absolute
                                    inset-0
                                    bg-black/20
                                    "
                                />

                            </div>


                        ))
                    }


                </div>



                {/* Previous */}

                {
                    slides.length > 1 &&

                    <button
                        onClick={prevSlide}
                        className="
                        absolute
                        left-5
                        top-1/2
                        -translate-y-1/2

                        w-11
                        h-11

                        rounded-full

                        bg-white/80
                        backdrop-blur

                        flex
                        items-center
                        justify-center

                        shadow-lg

                        hover:bg-white
                        hover:scale-110

                        transition

                        z-20
                        "
                    >
                        <ChevronLeft
                            size={24}
                            className="text-[#8B5E3C]"
                        />

                    </button>

                }



                {/* Next */}

                {
                    slides.length > 1 &&

                    <button
                        onClick={nextSlide}
                        className="
                        absolute
                        right-5
                        top-1/2
                        -translate-y-1/2

                        w-11
                        h-11

                        rounded-full

                        bg-white/80
                        backdrop-blur

                        flex
                        items-center
                        justify-center

                        shadow-lg

                        hover:bg-white
                        hover:scale-110

                        transition

                        z-20
                        "
                    >

                        <ChevronRight
                            size={24}
                            className="text-[#8B5E3C]"
                        />

                    </button>

                }




                {/* Indicators */}

                <div
                    className="
                    absolute
                    bottom-5
                    left-1/2
                    -translate-x-1/2

                    flex
                    gap-2

                    z-20
                    "
                >

                    {
                        slides.map((_,index)=>(

                            <button

                                key={index}

                                onClick={() =>
                                    setCurrent(index)
                                }

                                className={`
                                
                                h-2
                                rounded-full

                                transition-all
                                duration-300

                                ${
                                    current === index

                                    ?

                                    "w-8 bg-[#8B5E3C]"

                                    :

                                    "w-2 bg-white/80"

                                }

                                `}
                            />

                        ))
                    }

                </div>


            </div>


        </section>

    );
};


export default Banner;