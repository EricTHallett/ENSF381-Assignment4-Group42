import { useState } from 'react';

function FlavorItem({ flavor, onAdd }) {
    const [showDescription, setShowDescription] = useState(false);
    return (
        <div
            className="flavor-card"
            onMouseEnter={() => setShowDescription(true)}
            onMouseLeave={() => setShowDescription(false)}
        >
            <img src={flavor.image} alt={flavor.name} />
            <h3>{flavor.name}</h3>
            <p>${flavor.price.toFixed(2)}</p>

            {showDescription && <p>{flavor.description}</p>}

            <button onClick={() => onAdd(flavor)}>
                Add to Order
            </button>
        </div>
    );
}

export default FlavorItem;
