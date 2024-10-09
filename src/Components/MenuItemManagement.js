import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import "bootstrap/dist/css/bootstrap.min.css";

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
    choices: [],
    additions: [],
    removals: [],
  });

  const handleAddMenuItem = () => {
    if (newItem.name && newItem.price && newItem.categoryId) {
      onAddMenuItem(newItem);
      setNewItem({
        name: "",
        price: "",
        categoryId: "",
        choices: [],
        additions: [],
        removals: [],
      });
    }
  };

  const handleAddChoice = () => {
    setNewItem({ ...newItem, choices: [...newItem.choices, ""] });
  };

  const handleAddAddition = () => {
    setNewItem({ ...newItem, additions: [...newItem.additions, ""] });
  };

  const handleAddRemoval = () => {
    setNewItem({ ...newItem, removals: [...newItem.removals, ""] });
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const sourceCategoryName = result.source.droppableId;
    const destinationCategoryName = result.destination.droppableId;
    onReorderMenuItems(
      sourceCategoryName,
      result.source.index,
      destinationCategoryName,
      result.destination.index
    );
  };

  return (
    <div className="menu-item-management container mt-4">
      <div className="card mb-4">
        <div className="card-body">
          <h3 className="card-title">Manage Menu Items</h3>
          <div className="row mb-3">
            <div className="col-md-4">
              <input
                type="text"
                className="form-control"
                placeholder="Item name"
                value={newItem.name}
                onChange={(e) =>
                  setNewItem({ ...newItem, name: e.target.value })
                }
              />
            </div>
            <div className="col-md-3">
              <input
                type="number"
                className="form-control"
                placeholder="Price"
                value={newItem.price}
                onChange={(e) =>
                  setNewItem({ ...newItem, price: e.target.value })
                }
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
              <button
                className="btn btn-primary w-100"
                onClick={handleAddMenuItem}
              >
                Add Item
              </button>
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-12">
              <h5>Choices:</h5>
              {newItem.choices.map((choice, index) => (
                <div key={index} className="input-group mb-2">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Choice"
                    value={choice}
                    onChange={(e) => {
                      const updatedChoices = [...newItem.choices];
                      updatedChoices[index] = e.target.value;
                      setNewItem({ ...newItem, choices: updatedChoices });
                    }}
                  />
                </div>
              ))}
              <button className="btn btn-secondary" onClick={handleAddChoice}>
                Add Choice
              </button>
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-12">
              <h5>Additions:</h5>
              {newItem.additions.map((addition, index) => (
                <div key={index} className="input-group mb-2">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Addition"
                    value={addition}
                    onChange={(e) => {
                      const updatedAdditions = [...newItem.additions];
                      updatedAdditions[index] = e.target.value;
                      setNewItem({ ...newItem, additions: updatedAdditions });
                    }}
                  />
                </div>
              ))}
              <button className="btn btn-secondary" onClick={handleAddAddition}>
                Add Addition
              </button>
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-12">
              <h5>Removals:</h5>
              {newItem.removals.map((removal, index) => (
                <div key={index} className="input-group mb-2">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Removal"
                    value={removal}
                    onChange={(e) => {
                      const updatedRemovals = [...newItem.removals];
                      updatedRemovals[index] = e.target.value;
                      setNewItem({ ...newItem, removals: updatedRemovals });
                    }}
                  />
                </div>
              ))}
              <button className="btn btn-secondary" onClick={handleAddRemoval}>
                Add Removal
              </button>
            </div>
          </div>
        </div>
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        {Object.entries(menuItems).map(([categoryName, items]) => (
          <div key={categoryName} className="card mb-4">
            <div className="card-header bg-secondary text-white">
              <h4 className="mb-0">{categoryName}</h4>
            </div>
            <div className="card-body">
              <Droppable droppableId={categoryName}>
                {(provided) => (
                  <ul
                    className="list-group"
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    {items.map((item, index) => (
                      <Draggable
                        key={item.id}
                        draggableId={item.id}
                        index={index}
                      >
                        {(provided) => (
                          <li
                            className="list-group-item d-flex justify-content-between align-items-center"
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <span>
                              {item.name} - ${item.price.toFixed(2)}
                            </span>
                            <button
                              className="btn btn-danger btn-sm"
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
          </div>
        ))}
      </DragDropContext>
    </div>
  );
};

export default MenuItemManagement;
