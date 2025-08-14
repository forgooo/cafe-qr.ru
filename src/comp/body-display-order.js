import React, { Component } from "react";

class BodyDisplayOrder extends Component {
    state = {
        orders: [],
        dishes: {},
        loading: true,
        error: null,
        showMenuId: null,
    };

    componentDidMount() {
        this.fetchOrders();
        this.orderUpdateInterval = setInterval(this.fetchOrders, 5000);
    }

    componentWillUnmount() {
        clearInterval(this.orderUpdateInterval);
    }

    fetchOrders = async () => {
        try {
            const response = await fetch('https://cafe-qr.ru/order/pending-orders/', {
                headers: { 'accept': 'application/json' }
            });

            if (!response.ok) throw new Error('Ошибка загрузки заказов');
            const newOrders = await response.json();

            // 🧠 Кэшируем старые статусы
            const { orders: currentOrders } = this.state;
            const statusMap = {};
            currentOrders.forEach(order => {
                if (order.status) {
                    statusMap[order.id] = order.status;
                }
            });

            // 🔁 Назначаем старые статусы новым заказам
            const ordersWithStatus = newOrders.map(order => ({
                ...order,
                status: statusMap[order.id] || "Не готово"
            }));

            this.setState({ orders: ordersWithStatus }, this.fetchDishes);

        } catch (error) {
            this.setState({ error: error.message, loading: false });
        }
    };

    fetchDishes = async () => {
        const { orders } = this.state;
        const uniqueDishIds = [...new Set(orders.flatMap(order => order.dish_ids))];

        try {
            const dishRequests = uniqueDishIds.map(id =>
                fetch(`https://cafe-qr.ru/menu/dishes/${id}`, {
                    headers: { 'accept': 'application/json' }
                }).then(response => response.json())
            );

            const dishesData = await Promise.all(dishRequests);
            const dishMap = {};
            dishesData.forEach(dish => {
                dishMap[dish.dish_id] = dish.name;
            });
            this.setState({ dishes: dishMap, loading: false });
        } catch (error) {
            this.setState({ error: error.message, loading: false });
        }
    };

    updateOrderStatus = async (orderId, status) => {
        const updateData = {
            is_ordered: status === "Готово",
            is_delivered: status === "Выдан",
        };

        console.log(`Обновление статуса для заказа ${orderId}: ${status}`, updateData);

        try {
            const response = await fetch(`https://cafe-qr.ru/order/update/${orderId}`, {
                method: 'PUT',
                headers: {
                    'accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updateData),
            });
            if (!response.ok) throw new Error('Ошибка обновления статуса');

            this.setState(prevState => {
                const updatedOrders = prevState.orders.map(order => {
                    if (order.id === orderId) {
                        if (status === "Выдан") {
                            order.issuedTime = Date.now();
                        }
                        return { ...order, status };
                    }
                    return order;
                });

                if (status === "Выдан") {
                    setTimeout(() => {
                        this.removeExpiredOrders(orderId);
                    }, 60000);
                }

                return { orders: updatedOrders };
            });
        } catch (error) {
            console.error('Ошибка обновления статуса:', error.message);
            this.setState({ error: error.message });
        }
    };

    removeExpiredOrders = (orderId) => {
        this.setState(prevState => {
            const updatedOrders = prevState.orders.filter(order => order.id !== orderId);
            return { orders: updatedOrders };
        });
    };

    toggleMenu = (orderId) => {
        this.setState((prevState) => ({
            showMenuId: prevState.showMenuId === orderId ? null : orderId,
        }));
    };

    getButtonColor = (status) => {
        if (status === "Выдан") return "lawngreen";
        if (status === "Готово") return "yellow";
        return "red";
    };

    render() {
        const { orders, dishes, loading, error, showMenuId } = this.state;

        if (loading) return <div>Загрузка...</div>;
        if (error) return <div>Ошибка: {error}</div>;

        return (
            <div className="bodydisplayorder" style={{ fontFamily: "'Nunito', cursive" }}>
                <div className="container-xxl py-5">
                    <div className="container">
                        {orders.length > 0 ? (
                            <div className="order-grid">
                                {orders.map(order => {
                                    const dishCount = order.dish_ids.reduce((acc, id) => {
                                        acc[id] = (acc[id] || 0) + 1;
                                        return acc;
                                    }, {});

                                    return (
                                        <div key={order.id} className="display-order">
                                            <div className="display-order-status-container" style={{ position: 'relative' }}>
                                                <button
                                                    className="display-order-status-button"
                                                    style={{
                                                        backgroundColor: this.getButtonColor(order.status),
                                                        width: '100%',
                                                    }}
                                                    onClick={() => this.toggleMenu(order.id)}
                                                >
                                                    {order.status || "Не готово"}
                                                    <span className="display-order-arrow" />
                                                </button>

                                                {showMenuId === order.id && (
                                                    <div className="custom-dropdown-menu">
                                                        <button
                                                            className="custom-button-not-ready"
                                                            onClick={() => this.updateOrderStatus(order.id, "Не готово")}
                                                        >
                                                            Не готово
                                                        </button>
                                                        <button
                                                            className="custom-button-ready"
                                                            onClick={() => this.updateOrderStatus(order.id, "Готово")}
                                                        >
                                                            Готово
                                                        </button>
                                                        <button
                                                            className="custom-button-issued"
                                                            onClick={() => this.updateOrderStatus(order.id, "Выдан")}
                                                        >
                                                            Выдан
                                                        </button>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="display-order-section">
                                                <span className="display-order-main-text">Заказ № {order.id}</span>
                                                <div className="display-order-line"></div>

                                                <div>
                                                    Номер телефона: {order.phone_number || "Не указан"}
                                                </div>
                                                <div className="display-order-line"></div>

                                                {Object.keys(dishCount).map(id => (
                                                    <div key={id}>
                                                        {dishes[id]} x{dishCount[id]}
                                                    </div>
                                                ))}

                                                <div className="display-order-line"></div>
                                                <span>Комментарий: {order.comment || "Нет комментария"}</span>
                                                <div className="display-order-line"></div>
                                                <span className="display-order-number">Итого: {order.total_amount} $</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div>Нет активных заказов</div>
                        )}
                    </div>
                </div>
            </div>
        );
    }
}

export default BodyDisplayOrder;