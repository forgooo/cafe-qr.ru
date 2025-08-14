import React, { Component } from "react";

class BodyAbout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentSlide: 0,
      images: [
        "img/about-1.jpg",
        "img/about-2.jpg",
        "img/about-3.jpg",
        "img/about-4.jpg",
      ],
      transitioning: false
    };
  }

  nextSlide = () => {
    if (this.state.transitioning) return;
    this.setState({ transitioning: true });
    setTimeout(() => {
      this.setState((prevState) => ({
        currentSlide: (prevState.currentSlide + 1) % prevState.images.length,
        transitioning: false
      }));
    }, 300);
  };

  prevSlide = () => {
    if (this.state.transitioning) return;
    this.setState({ transitioning: true });
    setTimeout(() => {
      this.setState((prevState) => ({
        currentSlide:
          (prevState.currentSlide - 1 + prevState.images.length) %
          prevState.images.length,
        transitioning: false
      }));
    }, 300);
  };

  goToSlide = (index) => {
    if (this.state.transitioning || index === this.state.currentSlide) return;
    this.setState({ transitioning: true });
    setTimeout(() => {
      this.setState({ 
        currentSlide: index,
        transitioning: false
      });
    }, 300);
  };

  render() {
    const { currentSlide, images, transitioning } = this.state;

    return (
      <div className="bodyabout" style={{ fontFamily: "'Nunito', cursive" }}>
        <div className="container-xxl py-5">
          <div className="container">
            <div className="row g-5 align-items-center">
              <div className="col-lg-5">
                <div className="slider-container">
                  <div className={`slider-wrapper ${transitioning ? 'fade-out' : 'fade-in'}`}>
                    <img
                      className="img-fluid rounded"
                      src={images[currentSlide]}
                      alt={`About us ${currentSlide + 1}`}
                      style={{ 
                        width: '100%',
                        height: '400px',
                        objectFit: 'cover',
                        boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                      }}
                    />
                  </div>
                  
                  <button 
                    className="slider-btn prev-btn" 
                    onClick={this.prevSlide}
                    aria-label="Previous slide"
                  >
                    &lt;
                  </button>
                  <button 
                    className="slider-btn next-btn" 
                    onClick={this.nextSlide}
                    aria-label="Next slide"
                  >
                    &gt;
                  </button>
                  
                  <div className="slider-indicators">
                    {images.map((_, index) => (
                      <button
                        key={index}
                        className={`indicator ${index === currentSlide ? "active" : ""}`}
                        onClick={() => this.goToSlide(index)}
                        aria-label={`Go to slide ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div className="col-lg-7">
                <h5 className="section-title ff-secondary text-start text-primary1 fw-normal">
                  О нас
                </h5>
                <h2 className="mb-4">
                  Добро пожаловать в{" "}
                  <i className="fa fa-utensils text-primary1 me-2"></i>Ресторан
                </h2>
                <p className="mb-4">
                  Мы любим животных и стараемся поддерживать тех из них, кому не
                  посчастливилось иметь ласковых хозяев и тёплый кров.
                </p>
                <p className="mb-4">
                  Наш ресторан предлагает блюда высокой кухни, приготовленные
                  из свежих местных продуктов талантливыми поварами.
                </p>
                <div className="row g-4 mb-4">
                  <div className="col-sm-6">
                    <div className="d-flex align-items-center border-start border-5 border-primary1 px-3">
                      <h1 className="flex-shrink-0 display-5 text-primary1 mb-0">
                        5
                      </h1>
                      <div className="ps-4">
                        <p className="mb-0">Лет</p>
                        <h6 className="text-uppercase mb-0">Опыта</h6>
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="d-flex align-items-center border-start border-5 border-primary1 px-3">
                      <h1 className="flex-shrink-0 display-5 text-primary1 mb-0">
                        5
                      </h1>
                      <div className="ps-4">
                        <p className="mb-0">Популярных</p>
                        <h6 className="text-uppercase mb-0">Мастер-поваров</h6>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
          .slider-container {
            position: relative;
            height: 400px;
            margin-bottom: 20px;
          }
          
          .slider-wrapper {
            position: relative;
            height: 100%;
          }
          
          .fade-in {
            animation: fadeIn 0.6s ease-in-out;
          }
          
          .fade-out {
            opacity: 0;
            transition: opacity 0.6s ease-in-out;
          }
          
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          
          .slider-btn {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            background: rgba(0, 0, 0, 0.5);
            color: white;
            border: none;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            z-index: 10;
            transition: background 0.2s;
          }
          
          .slider-btn:hover {
            background: rgba(0, 0, 0, 0.7);
          }
          
          .prev-btn {
            left: 15px;
          }
          
          .next-btn {
            right: 15px;
          }
          
          .slider-indicators {
            display: flex;
            justify-content: center;
            gap: 8px;
            margin-top: 15px;
          }
          
          .indicator {
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background: #ccc;
            border: none;
            cursor: pointer;
            padding: 0;
            transition: background 0.2s;
          }
          
          .indicator.active {
            background: #333;
          }
          
          .indicator:hover {
            background: #999;
          }
        `}</style>
      </div>
    );
  }
}

export default BodyAbout;