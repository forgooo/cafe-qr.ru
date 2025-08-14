import React, { Component } from "react";

class BodyOrder extends Component {
    state = {
        orders: [],
        loading: true,
        error: null,
    };

    componentDidMount() {
        this.fetchUserData();

        // Запускаем опрос каждые 3 секунды
        this.pollingInterval = setInterval(() => {
            this.fetchUserOrders();
        }, 3000);
    }

    componentWillUnmount() {
        // Очищаем интервал при размонтировании компонента
        clearInterval(this.pollingInterval);
    }

    fetchUserData = async () => {
        try {
            const response = await fetch('https://cafe-qr.ru/user/get_user_data', {
                credentials: 'include',
                headers: { 'accept': 'application/json' }
            });

            if (response.ok) {
                const userData = await response.json();
                console.log("Авторизованный пользователь:", userData);
                this.setState({ userId: userData.id });
            } else {
                console.warn("Пользователь не авторизован, продолжаем как гость.");
            }
        } catch (error) {
            console.warn("Ошибка при получении данных пользователя:", error);
        } finally {
            this.fetchUserOrders();
        }
    };

    fetchUserOrders = async () => {
        console.log("Загружаем заказы через /order/my-orders/");

        try {
            const response = await fetch('https://cafe-qr.ru/order/my-orders/', {
                credentials: 'include',
                headers: { 'accept': 'application/json' }
            });

            if (!response.ok) throw new Error('Ошибка загрузки заказов');

            const orders = await response.json();
            console.log("Заказы пользователя получены:", orders);

            this.setState({ orders, loading: false });
        } catch (error) {
            console.error("Ошибка при загрузке заказов:", error);
            this.setState({ error: error.message, loading: false });
        }
    };

    getOrderStatus = (order) => {
        if (!order.is_ordered) {
            return { text: "Заказ не принят", className: "order-no-ready" };
        } else if (order.is_ordered && !order.is_delivered) {
            return { text: "Заказ принят", className: "order-ready" };
        } else if (order.is_delivered && !order.is_finished) {
            return { text: "Заказ доставлен", className: "order-ready" };
        } else if (order.is_finished) {
            return { text: "Заказ завершён", className: "order-ready" };
        }
        return { text: "Статус неизвестен", className: "order-no-ready" };
    };

    render() {
        const { orders, loading, error } = this.state;

        if (loading) return <div>Загрузка...</div>;
        if (error) return <div>Ошибка: {error}</div>;

        const filteredOrders = orders.filter(order => !order.is_delivered);

        if (filteredOrders.length === 0) return <div className="order-noOrder">У вас нет активных заказов</div>;

        return (
            <div className="bodyorder" style={{ fontFamily: "'Nunito', cursive" }}>
                <div className="container-xxl py-5">
                    <div className="container">
                        {filteredOrders.map(order => {
                            const status = this.getOrderStatus(order);
                            return (
                                <div key={order.id} className="order">
                                    <div className="order-content">
                                        <div className="left-section">
                                            <span className="order-main-text">Ваш заказ:</span>
                                            <span className="order-order">Заказ #{order.id}</span>
                                        </div>
                                        <div className="right-section">
                                            <span className="order-number">Номер заказа: {order.id}</span>
                                            <span className="order-price">Сумма заказа: {order.total_amount} $</span>
                                        </div>
                                    </div>

                                    <div className="order-status">
                                        <span>Статус заказа:</span>{" "}
                                        <span className={status.className}>
                                            {status.text}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    }
}

export default BodyOrder;
