function OrderItem({ item, onRemove, onQuantityChange }) {
    return (
        <div className="order-item">
            <div>
                <h4>{item.name}</h4>
                <p>${item.price.toFixed(2)}</p>
                <input type="number" min="1" value={item.quantity} onChange={e => onQuantityChange(item.flavorId, Number(e.target.value))} />
            </div>
            <button className="remove" onClick={() => onRemove(item.flavorId)}>Remove</button>
        </div>
    );
}

export default OrderItem;