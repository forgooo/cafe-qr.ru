import React, { Component } from "react";

class BodyContact extends Component {
    render() {
        return (
            <div className="bodyсontact" style={{ fontFamily: "'Nunito', cursive" }}>
                <div class="container-xxl py-5">
                    <div class="container">
                        <div class="text-center wow fadeInUp" data-wow-delay="0.1s">
                            <h5 class="section-title ff-secondary text-center text-primary1 fw-normal">Связаться с нами</h5>
                            <h1 class="mb-5">Контакты по любым вопросом</h1>
                        </div>
                        <div class="row g-4">
                            <div class="col-12">
                                <div class="row gy-4">
                                    <div class="col-md-4">
                                        <h5 class="section-title ff-secondary fw-normal text-start text-primary1">Бронирование</h5>
                                        <p><i class="fa fa-envelope-open text-primary1 me-2"></i>book@example.com</p>
                                    </div>
                                    <div class="col-md-4">
                                        <h5 class="section-title ff-secondary fw-normal text-start text-primary1">Общий</h5>
                                        <p><i class="fa fa-envelope-open text-primary1 me-2"></i>info@example.com</p>
                                    </div>
                                    <div class="col-md-4">
                                        <h5 class="section-title ff-secondary fw-normal text-start text-primary1">Технический</h5>
                                        <p><i class="fa fa-envelope-open text-primary1 me-2"></i>tech@example.com</p>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6 wow fadeIn" data-wow-delay="0.1s">
                                <iframe class="position-relative rounded w-100 h-100"
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3001156.4288297426!2d-78.01371936852176!3d42.72876761954724!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4ccc4bf0f123a5a9%3A0xddcfc6c1de189567!2sNew%20York%2C%20USA!5e0!3m2!1sen!2sbd!4v1603794290143!5m2!1sen!2sbd"
                                    frameborder="0"
                                    style={{ minHeight: "320px", border: "0" }}
                                    aria-hidden="false"
                                    tabindex="0"
                                    title="Google Maps Embed of New York">
                                </iframe>
                            </div>
                            <div class="col-md-6">
                                <div class="wow fadeInUp" data-wow-delay="0.2s">
                                    <form>
                                        <div class="row">
                                            <div class="col-md-6">
                                                <div class="form-floating">
                                                    <input type="text" class="form-control" id="name" placeholder="Ваше имя" />
                                                    <label for="name">Ваше имя</label>
                                                </div>
                                            </div>
                                            <div class="col-md-6">
                                                <div class="form-floating">
                                                    <input type="email" class="form-control" id="email" placeholder="Ваша почта" />
                                                    <label for="email">Ваша почта</label>
                                                </div>
                                            </div>
                                            <div class="col-12 custom-contact-info">
                                                <div class="form-floating">
                                                    <input type="text" class="form-control" id="subject" placeholder="Тема" />
                                                    <label for="subject">Тема</label>
                                                </div>
                                            </div>
                                            <div class="col-12 custom-contact-info-2">
                                                <div class="form-floating">
                                                    <textarea class="form-control" placeholder="Leave a message here" id="Сообщение" style={{ resize: "none" }}></textarea>
                                                    <label for="message">Сообщение</label>
                                                </div>
                                            </div>
                                            <div class="col-12">
                                                <button class="w-100 py-3 customization-button" type="submit">Отправить Сообщение</button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default BodyContact;