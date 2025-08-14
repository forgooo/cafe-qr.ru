import React, { Component } from "react";

class Footer extends Component {
    handleNavigation = (path) => {
        window.location.href = path;
    };

    render() {
        return (
            <div className="footer" style={{ fontFamily: "'Nunito', cursive" }}>
                <div className="container-fluid bg-dark text-light footer pt-5 mt-5 wow fadeIn" data-wow-delay="0.1s">
                    <div className="container py-5">
                        <div className="row g-5">
                            <div className="col-lg-3 col-md-6">
                                <h4 className="section-title ff-secondary text-start text-primary1 fw-normal mb-4">Компания</h4>
                                <button
                                    className="btn btn-link"
                                    style={{ textDecoration: 'none', background: 'none', border: 'none', color: 'inherit', padding: 0 }}
                                    onClick={() => this.handleNavigation('/about')}
                                >
                                    О нас
                                </button>
                                <button
                                    className="btn btn-link"
                                    style={{ textDecoration: 'none', background: 'none', border: 'none', color: 'inherit', padding: 0 }}
                                    onClick={() => this.handleNavigation('/contact')}
                                >
                                    Связаться с нами
                                </button>
                                <a className="btn btn-link" href="https://www.google.com/" style={{ textDecoration: 'none' }}>Политика Конфиденциальности</a>
                            </div>
                            <div className="col-lg-3 col-md-6">
                                <h4 className="section-title ff-secondary text-start text-primary1 fw-normal mb-4">Контакты</h4>
                                <p className="mb-2"><i className="fa fa-map-marker-alt me-3"></i>Где-то в Казахстане</p>
                                <p className="mb-2"><i className="fa fa-phone-alt me-3"></i>+012 345 67890</p>
                                <p className="mb-2"><i className="fa fa-envelope me-3"></i>info@example.com</p>
                                <div className="d-flex pt-2">
                                    <a className="btn btn-outline-light btn-social" href="https://x.com/?lang=ru"><i className="fab fa-twitter"></i></a>
                                    <a className="btn btn-outline-light btn-social" href="https://ru-ru.facebook.com/"><i className="fab fa-facebook-f"></i></a>
                                    <a className="btn btn-outline-light btn-social" href="https://www.youtube.com/"><i className="fab fa-youtube"></i></a>
                                </div>
                            </div>
                            <div className="col-lg-3 col-md-6">
                                <h4 className="section-title ff-secondary text-start text-primary1 fw-normal mb-4">Рабочие время</h4>
                                <h5 className="text-light fw-normal">Понедельник - Суббота</h5>
                                <p>с 9 утра до 9 вечера</p>
                                <h5 className="text-light fw-normal">Воскресенье</h5>
                                <p>с 10 утра до 8 вечера</p>
                            </div>
                            <div className="col-lg-3 col-md-6">
                                <h4 className="section-title ff-secondary text-start text-primary1 fw-normal mb-4">Часто задаваемые вопросы</h4>
                                <p className="mb-2">Вопрос: Есть ли у вас программа лояльности?</p>
                                <p className="mb-2">Ответ: Да, более подробную информацию вы можете найти у вас в профиле</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Footer;