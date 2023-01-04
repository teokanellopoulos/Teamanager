import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";

export const Carousel = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    
    const sliderStyles = {
        height: "100%",
        position: "relative"
    };
    
    const slides = [
        { url: "1.jpg", title: "img1" },
        { url: "2.jpg", title: "img2" },
        { url: "3.jpg", title: "img3" },
        { url: "4.jpg", title: "img4" },
    ];
    
    const leftArrowStyles = {
        position: "absolute",
        top: "50%",
        transform: "translate(0, -50%)",
        left: "32px",
        fontSize: "45px",
        color: "white",
        zIndex: 1,
        cursor: "pointer"
    }

    const rightArrowStyles = {
        position: "absolute",
        top: "50%",
        transform: "translate(0, -50%)",
        right: "32px",
        fontSize: "45px",
        color: "white",
        zIndex: 1,
        cursor: "pointer"
    }

    const slideStyles = {
        width: "100%",
        height: "100%",
        borderRadius: "10px",
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundImage: `url(${slides[currentIndex].url})`
    };

    const containerStyles = {
        height: "380px",
        margin: "0 auto",
        marginTop: "30px"
    }

    const goToNext = () => {
        const isLastSlide = currentIndex === slides.length - 1;
        const newIndex = isLastSlide ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
    }

    const goToPrevious = () => {
        const isFirstSlide = currentIndex === 0;
        const newIndex = isFirstSlide ? slides.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
    }

    return (
        <div style={containerStyles} className="carousel">
            <div style={sliderStyles}>
                <div onClick={goToPrevious} style={leftArrowStyles}><FontAwesomeIcon icon={faArrowLeft} className="left"/></div>
                <div onClick={goToNext} style={rightArrowStyles}><FontAwesomeIcon icon={faArrowRight} className="right"/></div>
                <div style={slideStyles}></div>
            </div>
        </div>
    )
}
