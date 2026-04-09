import { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

function OrderHistoryPage() {
    const [orders, setOrders] = useState([]);
    const userId = parseInt(localStorage.getItem("userId"));

    useEffect(() => {
        fetch(`http://127.0.0.1:5000/orders?userId=${userId}`)
            .then(res => res.json())
            .then(data => {
                if (data.success) setOrders(data.orders);
            });
    }, [userId]);

    return (
        <div>
            <Header />
            <div className="main-section">
                <h2>Order History</h2>
                {orders.length === 0 ? (
                    <p>You haven't placed any orders yet.</p>
                ) : (
                    orders.map(order => (
                        <div key={order.orderId} className="order-item">
                            <h3>Order #{order.orderId}</h3>
                            <p>{order.timestamp}</p>
                            {order.items.map(item => (
                                <div key={item.flavorId}>
                                    <p>{item.name} x{item.quantity} - ${(item.price * item.quantity).toFixed(2)}</p>
                                </div>
                            ))}
                            <h4>Total: ${order.total.toFixed(2)}</h4>
                        </div>
                    ))
                )}
            </div>
            <Footer />
        </div>
    );
}

export default OrderHistoryPage;