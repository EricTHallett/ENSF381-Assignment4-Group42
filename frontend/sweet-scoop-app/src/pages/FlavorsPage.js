import { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import FlavorCatalog from "../components/FlavorCatalog";
import OrderList from "../components/OrderList";

function FlavorsPage() {
    const [flavors, setFlavors] = useState([]);
    const [order, setOrder] = useState([]);
    const [statusMessage, setStatusMessage] = useState("");
    const userId = parseInt(localStorage.getItem("userId"));

    useEffect(() => {
        fetch("http://127.0.0.1:5000/flavors")
            .then(res => res.json())
            .then(data => {
                if (data.success) setFlavors(data.flavors);
            });

        fetch(`http://127.0.0.1:5000/cart?userId=${userId}`)
            .then(res => res.json())
            .then(data => {
                if (data.success) setOrder(data.cart);
            });
    }, [userId]);

    const handleAdd = (flavor) => {
        const alreadyInCart = order.find(item => item.flavorId === flavor.id);

        if (alreadyInCart) {
            fetch("http://127.0.0.1:5000/cart", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, flavorId: flavor.id, quantity: alreadyInCart.quantity + 1 })
            })
            .then(res => res.json())
            .then(data => { if (data.success) setOrder(data.cart); });
        } else {
            fetch("http://127.0.0.1:5000/cart", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, flavorId: flavor.id })
            })
            .then(res => res.json())
            .then(data => { if (data.success) setOrder(data.cart); });
        }
    };

    const handleRemove = (flavorId) => {
        fetch("http://127.0.0.1:5000/cart", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId, flavorId })
        })
        .then(res => res.json())
        .then(data => { if (data.success) setOrder(data.cart); });
    };

    const handleQuantityChange = (flavorId, quantity) => {
        if (quantity < 1) return;
        fetch("http://127.0.0.1:5000/cart", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId, flavorId, quantity })
        })
        .then(res => res.json())
        .then(data => { if (data.success) setOrder(data.cart); });
    };

    const handlePlaceOrder = () => {
        fetch("http://127.0.0.1:5000/orders", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId })
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                setOrder([]);
                setStatusMessage("Order placed successfully!");
            } else {
                setStatusMessage(data.message);
            }
        })
        .catch(() => setStatusMessage("Server error. Please try again."));
    };

    return (
        <div className="flavors-grid">
            <Header />
            <div className="content">
                <FlavorCatalog flavors={flavors} onAdd={handleAdd} />
                <OrderList
                    order={order}
                    onRemove={handleRemove}
                    onQuantityChange={handleQuantityChange}
                    onPlaceOrder={handlePlaceOrder}
                    statusMessage={statusMessage}
                />
            </div>
            <Footer />
        </div>
    );
}

export default FlavorsPage;