import React, { Component } from "react";
import { Link } from "react-router-dom";
import reroImg from './img/rero.png';

class NavbarOrder extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isDropdownOpen: false, // State to manage dropdown visibility
        };
    }

    toggleDropdown = () => {
        this.setState((prevState) => ({
            isDropdownOpen: !prevState.isDropdownOpen, // Toggle state
        }));
    };

    render() {
        const { isDropdownOpen } = this.state;

        // Determine the class for img-prof based on dropdown state
        const imgProfClass = isDropdownOpen ? "img-prof1" : "img-prof";

        return (
            <div className="navbarorder" style={{ fontFamily: "'Nunito', cursive" }}>
                <div className="container-xxl position-relative p-0">
                    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4 px-lg-5 py-3 py-lg-0">
                        <a href="/" className="navbar-brand p-0">
                            <h1 className="text-primary1 m-0">
                                <img className="navbar-logo-img" src={reroImg} alt="Logo" />
                            </h1>
                        </a>

                        <button className={`navbar-toggler ${isDropdownOpen ? 'collapsed' : ''}`} type="button" onClick={this.toggleDropdown}>
                            <span className="fa fa-bars dropbtn"></span>
                        </button>

                        <div className={`collapse navbar-collapse ${isDropdownOpen ? 'show' : ''}`} id="navbarCollapse">
                            <div className="navbar-nav ms-auto py-0 pe-4 dropmenu-style">
                                <Link to="/" className="nav-item nav-link active">Главная</Link>
                                <Link to="/about" className="nav-item nav-link">О нас</Link>
                                <Link to="/contact" className="nav-item nav-link active">Контакты</Link>
                                <Link to="/login" className="nav-item">
                                    <img className={imgProfClass} src="./img/prof.png" alt="Profile" />
                                </Link>
                            </div>
                        </div>
                    </nav>

                    <div class="container-xxl py-5 bg-dark hero-header mb-5">
                        <div class="container text-center my-5 pt-5 pb-4">
                            <h1 class="display-3 text-white mb-3 animated slideInDown">О нас</h1>
                            <nav aria-label="breadcrumb">
                                <ol class="breadcrumb justify-content-center text-uppercase">
                                    <li class="breadcrumb-item"><Link to="/" class="nav-item nav-link1" style={{ textDecoration: 'none' }}>Главная</Link></li>
                                    <li class="breadcrumb-item text-white active" aria-current="page">О нас</li>
                                    <li class="breadcrumb-item"><Link to="/contact" class="nav-item nav-link1" style={{ textDecoration: 'none' }}>Контакты</Link></li>
                                </ol>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>

        );
    }
}

export default NavbarOrder;