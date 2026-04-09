import FlavorItem from "./FlavorItem";

function FlavorCatalog({ flavors, onAdd }) {
    return (
        <div className="flavor-grid">
            {flavors.map((flavor) => (
                <FlavorItem
                    key={flavor.id}
                    flavor={flavor}
                    onAdd={onAdd}
                />
            ))}
        </div>
    );
}

export default FlavorCatalog;