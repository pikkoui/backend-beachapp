import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles.css";

const OrderCard = ({ order, onUpdateStatus }) => (
  <div
    className={`order-card mb-4 ${
      order.status === "new" ? "new-order" : "preparing-order"
    }`}
  >
    <div className="card-header d-flex justify-content-between align-items-center">
      <h5 className="mb-0">
        Order #{order.id} - Umbrella {order.umbrella}
      </h5>
      <span
        className={`badge ${
          order.status === "new" ? "bg-primary" : "bg-warning text-dark"
        }`}
      >
        {order.status}
      </span>
    </div>
    <div className="card-body">
      <p>
        <strong>Items:</strong>
      </p>
      <ul>
        {order.items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
      <p>
        <strong>Time:</strong> {new Date(order.timestamp).toLocaleTimeString()}
      </p>
      <div className="mt-3">
        {order.status === "new" && (
          <button
            className="btn btn-primary me-2"
            onClick={() => onUpdateStatus(order.id, "preparing")}
          >
            Prepare
          </button>
        )}
        {order.status === "preparing" && (
          <button
            className="btn btn-success me-2"
            onClick={() => onUpdateStatus(order.id, "ready")}
          >
            Ready
          </button>
        )}
        <button
          className="btn btn-danger"
          onClick={() => onUpdateStatus(order.id, "completed")}
        >
          Complete
        </button>
      </div>
    </div>
  </div>
);

const CategoryManagement = ({
  categories,
  onAddCategory,
  onRemoveCategory,
  onReorderCategories,
}) => {
  const [newCategoryName, setNewCategoryName] = useState("");

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      onAddCategory(newCategoryName.trim());
      setNewCategoryName("");
    }
  };

  return (
    <div className="category-management mt-4">
      <h2>Manage Categories</h2>
      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="New category name"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
        />
        <button className="btn btn-primary" onClick={handleAddCategory}>
          Add Category
        </button>
      </div>
      <Droppable droppableId="categories">
        {(provided) => (
          <ul
            className="list-group"
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {categories.map((category, index) => (
              <Draggable
                key={category.id}
                draggableId={category.id.toString()}
                index={index}
              >
                {(provided) => (
                  <li
                    className="list-group-item d-flex justify-content-between align-items-center"
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    {category.name}
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => onRemoveCategory(category.id)}
                    >
                      Remove
                    </button>
                  </li>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </ul>
        )}
      </Droppable>
    </div>
  );
};

const MenuItemManagement = ({
  categories,
  menuItems,
  onAddMenuItem,
  onRemoveMenuItem,
  onReorderMenuItems,
}) => {
  const [newItem, setNewItem] = useState({
    name: "",
    price: "",
    categoryId: "",
  });

  const handleAddMenuItem = () => {
    if (newItem.name && newItem.price && newItem.categoryId) {
      onAddMenuItem(newItem);
      setNewItem({ name: "", price: "", categoryId: "" });
    }
  };

  return (
    <div className="menu-item-management mt-4">
      <h2>Manage Menu Items</h2>
      <div className="row g-3 mb-3">
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="Item name"
            value={newItem.name}
            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
          />
        </div>
        <div className="col-md-3">
          <input
            type="number"
            className="form-control"
            placeholder="Price"
            value={newItem.price}
            onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
          />
        </div>
        <div className="col-md-3">
          <select
            className="form-select"
            value={newItem.categoryId}
            onChange={(e) =>
              setNewItem({ ...newItem, categoryId: e.target.value })
            }
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-2">
          <button className="btn btn-primary w-100" onClick={handleAddMenuItem}>
            Add Item
          </button>
        </div>
      </div>
      {Object.entries(menuItems).map(([categoryName, items]) => (
        <div key={categoryName} className="mb-4">
          <h3>{categoryName}</h3>
          <Droppable droppableId={categoryName}>
            {(provided) => (
              <ul
                className="list-group"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {items.map((item, index) => (
                  <Draggable key={item.id} draggableId={item.id} index={index}>
                    {(provided) => (
                      <li
                        className="list-group-item d-flex justify-content-between align-items-center"
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        {item.name} - ${item.price}
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() =>
                            onRemoveMenuItem(categoryName, item.id)
                          }
                        >
                          Remove
                        </button>
                      </li>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </div>
      ))}
    </div>
  );
};

const App = () => {
  const [orders, setOrders] = useState([
    {
      id: 4,
      umbrella: "A4",
      items: ["New Item 4"],
      status: "new",
      timestamp: "2024-09-30T10:40:30",
    },
    {
      id: 1,
      umbrella: "A1",
      items: ["Mojito", "Nachos"],
      status: "preparing",
      timestamp: "2024-09-30T14:30:00",
    },
    {
      id: 2,
      umbrella: "B3",
      items: ["Piña Colada", "Fish Tacos"],
      status: "preparing",
      timestamp: "2024-09-30T14:15:00",
    },
  ]);

  const [categories, setCategories] = useState([
    { id: 1, name: "Starters", displayOrder: 1 },
    { id: 2, name: "Main Courses", displayOrder: 2 },
    { id: 3, name: "Desserts", displayOrder: 3 },
    { id: 4, name: "Drinks", displayOrder: 4 },
  ]);

  const [menuItems, setMenuItems] = useState({
    Starters: [
      { id: "item-1", name: "Nachos", price: 8.99, categoryId: 1 },
      { id: "item-2", name: "Chicken Wings", price: 10.99, categoryId: 1 },
    ],
    "Main Courses": [
      { id: "item-3", name: "Fish Tacos", price: 14.99, categoryId: 2 },
      { id: "item-4", name: "Beach Burger", price: 12.99, categoryId: 2 },
    ],
    Drinks: [
      { id: "item-5", name: "Mojito", price: 7.99, categoryId: 4 },
      { id: "item-6", name: "Piña Colada", price: 8.99, categoryId: 4 },
    ],
  });

  const [activeView, setActiveView] = useState("orders");

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(
      orders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  const filterOrders = (status) =>
    orders.filter((order) => order.status === status);

  const handleAddCategory = (name) => {
    const newCategory = {
      id: Date.now(),
      name,
      displayOrder: categories.length + 1,
    };
    setCategories([...categories, newCategory]);
  };

  const handleRemoveCategory = (id) => {
    setCategories(categories.filter((category) => category.id !== id));
  };

  const handleReorderCategories = (result) => {
    if (!result.destination) return;
    const items = Array.from(categories);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setCategories(
      items.map((item, index) => ({ ...item, displayOrder: index + 1 }))
    );
  };

  const handleAddMenuItem = (newItem) => {
    const category = categories.find(
      (cat) => cat.id === parseInt(newItem.categoryId)
    );
    if (!category) return;
    const newItemWithId = {
      ...newItem,
      id: `item-${Date.now()}`,
      categoryId: parseInt(newItem.categoryId),
      price: parseFloat(newItem.price),
    };
    setMenuItems((prevItems) => ({
      ...prevItems,
      [category.name]: [...(prevItems[category.name] || []), newItemWithId],
    }));
  };

  const handleRemoveMenuItem = (categoryName, itemId) => {
    setMenuItems((prevItems) => ({
      ...prevItems,
      [categoryName]: prevItems[categoryName].filter(
        (item) => item.id !== itemId
      ),
    }));
  };

  const handleReorderMenuItems = (result) => {
    if (!result.destination) return;
    const { source, destination } = result;
    const sourceItems = [...menuItems[source.droppableId]];
    const destItems =
      source.droppableId === destination.droppableId
        ? sourceItems
        : [...menuItems[destination.droppableId]];
    const [removed] = sourceItems.splice(source.index, 1);
    destItems.splice(destination.index, 0, removed);
    setMenuItems({
      ...menuItems,
      [source.droppableId]: sourceItems,
      [destination.droppableId]: destItems,
    });
  };

  return (
    <DragDropContext
      onDragEnd={(result) => {
        if (result.type === "CATEGORY") {
          handleReorderCategories(result);
        } else {
          handleReorderMenuItems(result);
        }
      }}
    >
      <div className="container-fluid p-0">
        <nav className="navbar navbar-dark bg-dark">
          <div className="container-fluid">
            <span className="navbar-brand mb-0 h1">
              🏖️ Beach Bar Order Management
            </span>
          </div>
        </nav>

        <div className="row g-0">
          <div className="col-md-2 bg-light sidebar">
            <div className="position-sticky pt-3">
              <ul className="nav flex-column">
                <li className="nav-item">
                  <a
                    className={`nav-link ${
                      activeView === "orders" ? "active" : ""
                    }`}
                    href="#"
                    onClick={() => setActiveView("orders")}
                  >
                    Orders
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className={`nav-link ${
                      activeView === "completed" ? "active" : ""
                    }`}
                    href="#"
                    onClick={() => setActiveView("completed")}
                  >
                    Completed Orders
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className={`nav-link ${
                      activeView === "categories" ? "active" : ""
                    }`}
                    href="#"
                    onClick={() => setActiveView("categories")}
                  >
                    Manage Categories
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className={`nav-link ${
                      activeView === "menu" ? "active" : ""
                    }`}
                    href="#"
                    onClick={() => setActiveView("menu")}
                  >
                    Manage Menu
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <main className="col-md-10 ms-sm-auto px-md-4">
            {activeView === "orders" && (
              <div className="row mt-4">
                <div className="col-md-6 pe-md-4">
                  <h2 className="mb-3">New Orders</h2>
                  <div className="orders-container new-orders">
                    {filterOrders("new").map((order) => (
                      <OrderCard
                        key={order.id}
                        order={order}
                        onUpdateStatus={updateOrderStatus}
                      />
                    ))}
                  </div>
                </div>
                <div className="col-md-6 ps-md-4">
                  <h2 className="mb-3">Preparing Orders</h2>
                  <div className="orders-container preparing-orders">
                    {filterOrders("preparing").map((order) => (
                      <OrderCard
                        key={order.id}
                        order={order}
                        onUpdateStatus={updateOrderStatus}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
            {activeView === "completed" && (
              <div className="mt-3">
                <h2>Completed Orders</h2>
                {filterOrders("completed").map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    onUpdateStatus={updateOrderStatus}
                  />
                ))}
              </div>
            )}
            {activeView === "categories" && (
              <CategoryManagement
                categories={categories}
                onAddCategory={handleAddCategory}
                onRemoveCategory={handleRemoveCategory}
                onReorderCategories={handleReorderCategories}
              />
            )}
            {activeView === "menu" && (
              <MenuItemManagement
                categories={categories}
                menuItems={menuItems}
                onAddMenuItem={handleAddMenuItem}
                onRemoveMenuItem={handleRemoveMenuItem}
                onReorderMenuItems={handleReorderMenuItems}
              />
            )}
          </main>
        </div>
      </div>
    </DragDropContext>
  );
};

export default App;
