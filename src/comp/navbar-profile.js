import React, { Component } from "react";
import { Link } from "react-router-dom";

class NavbarProfile extends Component {
    render() {
        return (
            <div className="navbarprofile" style={{ fontFamily: "'Nunito', cursive" }}>
                <div class="container-xxl position-relative p-0">
                    <nav class="navbar navbar-expand-lg navbar-dark bg-dark px-4 px-lg-5 py-3 py-lg-0">
                        <a href="" class="navbar-brand p-0">
                            <Link to="/" class="nav-item nav-link"><h1 class="text-primary1 m-0"><i class="fa fa-utensils me-3"></i>Restoran</h1></Link>
                            {/* <!-- <img src="img/logo.png" alt="Logo"> --> */}
                        </a>
                        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse">
                            <span class="fa fa-bars"></span>
                        </button>
                        <div class="collapse navbar-collapse" id="navbarCollapse">
                            <div class="navbar-nav ms-auto py-0 pe-4">
                                <Link to="/" class="nav-item nav-link active">Главная</Link>
                                <Link to="/about" class="nav-item nav-link active">О нас</Link>
                                <Link to="/contact" class="nav-item nav-link active">Контакты</Link>
                                <Link to="/login" class="nav-item"><img class="img-prof" src="./img/prof.png"/></Link>
                            </div>
                            {/* <a href="" class="btn btn-primary py-2 px-4">Book A Table</a> */}
                        </div>
                    </nav>

                    <div class="container-xxl py-5 bg-dark hero-header mb-5">
                        <div class="container text-center my-5 pt-5 pb-4">
                            <h1 class="display-3 text-white mb-3 animated slideInDown">Профиль</h1>
                        </div>
                    </div>
                </div>
            </div>

        );
    }
}

export default NavbarProfile;