import React, { Component } from "react";
import { Link } from "react-router-dom";
import reroImg from './img/rero.png';

class Navbar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isDropdownOpen: false,
        };
    }

    toggleDropdown = () => {
        this.setState((prevState) => ({
            isDropdownOpen: !prevState.isDropdownOpen,
        }));
    };

    render() {
        const { isDropdownOpen } = this.state;

        const imgProfClass = isDropdownOpen ? "img-prof1" : "img-prof";

        return (
            <div className="navbar" style={{ fontFamily: "'Nunito', cursive" }}>
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
                                <Link to="/" className="nav-item nav-link">Главная</Link>
                                <Link to="/about" className="nav-item nav-link active">О нас</Link>
                                <Link to="/contact" className="nav-item nav-link active">Контакты</Link>
                                <Link to="/login" className="nav-item">
                                    <img className={imgProfClass} src="./img/prof.png" alt="Profile" />
                                </Link>
                            </div>
                        </div>
                    </nav>
                </div>
            </div>
        );
    }
}

export default Navbar;