import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';

const Body = () => {
    const [menuCategories, setMenuCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState(1);
    const [dishCounts, setDishCounts] = useState({});
    const [addedDishes, setAddedDishes] = useState({});
    const [phoneNumber, setPhoneNumber] = useState(""); // Состояние для хранения номера телефона
    const [comment, setComment] = useState(""); // Состояние для хранения комментария
    const [orderError, setOrderError] = useState(""); // Состояние для хранения ошибки заказа
    const [orderId, setOrderId] = useState(""); // Состояние для хранения номера заказа

    useEffect(() => {
        Promise.all([
            fetch("https://cafe-qr.ru/menu/categories/1").then((response) => response.json()),
            fetch("https://cafe-qr.ru/menu/categories/2").then((response) => response.json()),
            fetch("https://cafe-qr.ru/menu/categories/3").then((response) => response.json()),
            fetch("https://cafe-qr.ru/menu/dishes/1").then((response) => response.json()),
            fetch("https://cafe-qr.ru/menu/dishes/2").then((response) => response.json()),
            fetch("https://cafe-qr.ru/menu/dishes/3").then((response) => response.json())
        ])
            .then((data) => {
                const categories = data.slice(0, 3);
                const dishes = data.slice(3, 6);

                const categoriesWithDishes = categories.map((category) => {
                    let categoryDishes = [];
                    switch (category.category_id) {
                        case 1:
                            categoryDishes = [dishes[0]];
                            break;
                        case 2:
                            categoryDishes = [dishes[1]];
                            break;
                        case 3:
                            categoryDishes = [dishes[2]];
                            break;
                        default:
                            categoryDishes = [];
                    }

                    return { ...category, dishes: categoryDishes };
                });

                console.log("Категории с блюдами:", categoriesWithDishes);
                setMenuCategories(categoriesWithDishes);
                setLoading(false);
            })
            .catch((error) => {
                setError(error.message);
                setLoading(false);
            });
    }, []);

    const toggleAddDish = (dishId) => {
        setAddedDishes((prevAddedDishes) => {
            const isAdded = prevAddedDishes[dishId];
            if (!isAdded) {
                setDishCounts((prevCounts) => ({
                    ...prevCounts,
                    [dishId]: 1,
                }));
            } else {
                setDishCounts((prevCounts) => ({
                    ...prevCounts,
                    [dishId]: 0,
                }));
            }
            return {
                ...prevAddedDishes,
                [dishId]: !isAdded,
            };
        });
    };

    const increaseCount = (dishId) => {
        setDishCounts((prevCounts) => ({
            ...prevCounts,
            [dishId]: (prevCounts[dishId] || 0) + 1,
        }));
    };

    const decreaseCount = (dishId) => {
        setDishCounts((prevCounts) => {
            const currentCount = prevCounts[dishId] || 0;
            if (currentCount > 0) {
                return { ...prevCounts, [dishId]: currentCount - 1 };
            }
            return prevCounts;
        });
    };

    // Функция для расчета общей суммы заказа
    const calculateTotalPrice = () => {
        let total = 0;
        Object.keys(dishCounts).forEach((dishId) => {
            const count = dishCounts[dishId];
            const dish = menuCategories
                .flatMap((category) => category.dishes)
                .find((dish) => dish.dish_id === parseInt(dishId));
            if (dish) {
                total += dish.price * count;
            }
        });
        return total.toFixed(2); // Возвращаем сумму с двумя знаками после запятой
    };

    const handleOrder = () => {
        const orderDetails = {
            dish_ids: Object.keys(dishCounts).reduce((acc, dishId) => {
                const count = dishCounts[dishId];
                if (count > 0) {
                    for (let i = 0; i < count; i++) {
                        acc.push(parseInt(dishId));
                    }
                }
                return acc;
            }, []),
            total_amount: parseFloat(calculateTotalPrice()),
            comment,
            phone_number: phoneNumber, // ✅ Добавили номер телефона
            is_ordered: false,
            is_delivered: false,
            is_finished: false,        // ✅ Добавили флаг, который есть в curl
            user_id: 0
        };

        console.log("Данные заказа:", orderDetails);

        if (orderDetails.dish_ids.length === 0) {
            setOrderError("Заказ не может быть пустым. Добавьте хотя бы одно блюдо.");
            return;
        }

        fetch("https://cafe-qr.ru/order/create/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(orderDetails)
        })
            .then(response => response.text().then(text => {
                console.log("Полный ответ сервера:", text);
                if (!response.ok) {
                    throw new Error(`Ошибка при оформлении заказа: ${response.status} - ${response.statusText}`);
                }
                return JSON.parse(text);
            }))
            .then(data => {
                console.log("Заказ успешно создан:", data);
                window.location.href = "https://cafe-qr.ru/order";
            })
            .catch(error => {
                if (error.message.includes("401")) {
                    setOrderError("Вам нужно авторизироваться на сайте. Пожалуйста, авторизируйтесь.");
                } else {
                    setOrderError(`Произошла ошибка при оформлении заказа: ${error.message}`);
                }
                console.error("Ошибка:", error);
            });
    };




    const handlePhoneNumberChange = (e) => {
        const value = e.target.value;
        const regex = /^[0-9]*$/; // Регулярное выражение для цифр
        if (regex.test(value) || value === "") {
            setPhoneNumber(value);
        }
    };

    const handleCommentChange = (e) => {
        setComment(e.target.value);
    };

    if (loading) {
        return <div>Загрузка...</div>;
    }

    if (error) {
        return <div>Ошибка: {error}</div>;
    }

    if (!menuCategories.length) {
        return <div>Категории не найдены</div>;
    }

    return (
        <div className="body" style={{ fontFamily: "'Nunito', cursive" }}>
            <div className="container-xxl py-5">
                <div className="container">
                    <div className="text-center wow fadeInUp" data-wow-delay="0.1s">
                        <h2 className="section-title ff-secondary text-center text-primary1 fw-normal mb-5">Меню</h2>
                    </div>
                    <div className="tab-class text-center wow fadeInUp" data-wow-delay="0.1s">
                        <ul className="nav nav-pills d-inline-flex justify-content-center border-bottom mb-5">
                            {menuCategories.map((category, index) => (
                                <li className="nav-item" key={index}>
                                    <a
                                        className={`d-flex align-items-center text-start mx-3 pb-3 ${activeTab === category.category_id ? "active" : ""}`}
                                        onClick={() => setActiveTab(category.category_id)}
                                        style={{ cursor: "pointer" }}
                                    >
                                        <i className="fa fa-utensils fa-2x text-primary1 my-customization-body-underline"></i>
                                        <div className="ps-3 my-customization-body-underline">
                                            <small className="text-body my-customization-body">{category.description}</small>
                                            <h6 className="mt-n1 mb-0 my-customization-body">{category.name}</h6>
                                        </div>
                                    </a>
                                </li>
                            ))}
                        </ul>
                        <div className="tab-content">
                            {menuCategories.map((category) =>
                                category.category_id === activeTab ? (
                                    <div id={`tab-${category.category_id}`} className="tab-pane fade show active" key={category.category_id}>
                                        <div className="row g-4">
                                            {category.dishes && category.dishes.length > 0 ? (
                                                category.dishes.map((dish, dishIndex) => (
                                                    <div className="col-lg-6" key={dishIndex}>
                                                        <div className="d-flex align-items-center">
                                                            <img className="flex-shrink-0 img-fluid rounded" src="img/menu-1.jpg" alt="" />
                                                            <div className="w-100 d-flex flex-column text-start ps-4">
                                                                <h5 className="d-flex justify-content-between border-bottom pb-2">
                                                                    <span>{dish.name}</span>
                                                                    <span className="text-primary1">${dish.price}</span>
                                                                </h5>
                                                                <div className="d-flex justify-content-between align-items-center pb-2">
                                                                    <small className="fst-italic">{dish.description}</small>
                                                                    <button className="add-button" onClick={() => toggleAddDish(dish.dish_id)}>
                                                                        {addedDishes[dish.dish_id] ? "Убрать" : "Добавить"}
                                                                    </button>
                                                                </div>
                                                                {addedDishes[dish.dish_id] && (
                                                                    <div className="d-flex flex-column align-items-center justify-content-center sum-gap">
                                                                        <div className="d-flex align-items-center justify-content-center">
                                                                            <button className="plus-minus-button" onClick={() => decreaseCount(dish.dish_id)}>-</button>
                                                                            <input className="number-of-dishes" value={dishCounts[dish.dish_id] || 0} readOnly />
                                                                            <button className="plus-minus-button" onClick={() => increaseCount(dish.dish_id)}>+</button>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div>Блюда не найдены</div>
                                            )}
                                        </div>
                                    </div>
                                ) : null
                            )}
                        </div>
                    </div>

                    <div className="order-summary mt-6 ms-auto">
                        <h5 className="text-end">Общая сумма заказа: ${calculateTotalPrice()}</h5>
                        <div className="form-floating custom-buttons-info">
                            <input
                                type="tel"
                                value={phoneNumber}
                                onChange={handlePhoneNumberChange}
                                placeholder="Введите ваш номер телефона"
                                className="form-control mb-3 custom-buttons-info"
                                maxLength="11"
                            />
                            <label htmlFor="phone">Введите ваш номер телефона</label>
                        </div>
                        <div className="form-floating custom-buttons-info">
                            <input
                                type="text"
                                value={comment}
                                onChange={handleCommentChange}
                                placeholder="Комментарий к заказу"
                                className="form-control mb-3 custom-buttons-info"
                            />
                            <label htmlFor="comment">Комментарий к заказу</label>
                        </div>
                        <div className="text-end">
                            <Link to="/order" className="myOrder-button">Мои заказы</Link>
                            <button className="customization-button error-order-repel" onClick={handleOrder}>Заказать</button><br />
                            {orderError && <span className="error-order">{orderError}</span>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Body;