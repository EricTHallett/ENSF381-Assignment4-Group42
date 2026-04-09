import OrderItem from "./OrderItem";

function OrderList({ order, onRemove, onQuantityChange, onPlaceOrder, statusMessage }) {
    const total = order.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <div className="order-list">
            <h2>Your Order</h2>
            {order.map(item => (
                <OrderItem
                    key={item.flavorId}
                    item={item}
                    onRemove={onRemove}
                    onQuantityChange={onQuantityChange}
                />
            ))}
            <h3>Total: ${total.toFixed(2)}</h3>
            <button onClick={onPlaceOrder}>Place Order</button>
            {statusMessage && <p>{statusMessage}</p>}
        </div>
    );
}

export default OrderList;