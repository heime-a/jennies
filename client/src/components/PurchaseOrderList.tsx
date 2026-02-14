import "./PurchaseOrderList.css";
import React, { useState, useEffect } from "react";
import { Button, Alert, Spinner } from "reactstrap";
import PurchaseOrderForm from "./PurchaseOrderForm";
import postOrPutData from "../common/postOrPutData";
import apiUrl from "../common/apiurl.js";
import { Ingredient } from "./IngredientList";


//TODO: printing layout for purchaseorders  started
export interface LineItem {
  ingredient: Ingredient;
  quantity: number;
  unitCost: number;
}
export interface Po {
  _id: string;
  poNumber: string;
  ingredients: Array<LineItem>;
  supplier: {
    name: string;
    address: string;
  };
}
interface PurchaseOrderListState {
  loading: boolean;
  content: Array<Po>;
  selectedId: string;
  ingData: {
    [index: string]: string;
  };
  alertMessage?: string;
}
function PurchaseOrderList() {
  const [poState, setPoState] = useState<PurchaseOrderListState>({
    loading: true,
    content: [
      {
        _id: "1",
        poNumber: "1",
        supplier: { name: "Test1", address: "address" },
        ingredients: [
          {
            ingredient: { _id: "0", name: "name", type: "type", unit: "unit" },
            quantity: 0,
            unitCost: 0,
          },
        ],
      },
      {
        _id: "2",
        poNumber: "2",
        supplier: { name: "Test1", address: "address" },
        ingredients: [
          {
            ingredient: { _id: "0", name: "name", type: "type", unit: "unit" },
            quantity: 0,
            unitCost: 0,
          },
        ],
      },
    ],
    selectedId: "",
    ingData: {
      sugar: "ounces",
    },
  });

  
  useEffect(() => {
    loadContent();
  }, []);

  async function loadContent() {
    const newState: PurchaseOrderListState = { ...poState };

    let response = await fetch(`${apiUrl()}/purchaseOrders`, { credentials: 'include' });
    let jsonMessage = await response.json();
    if (jsonMessage) {
      newState.content = jsonMessage.content;
    } else {
      console.log("json message failed");
    }

    response = await fetch(`${apiUrl()}/ingredients`, { credentials: 'include' });
    jsonMessage = await response.json();
    if (jsonMessage) {
      newState.ingData = jsonMessage.content.reduce(
        (
          acc: { [index: string]: string },
          val: { name: string; unit: string }
        ) => {
          acc[val.name] = val.unit;
          return acc;
        },
        {}
      );
      newState.loading = false;
      setPoState(newState);
    } else {
      console.log("json message failed");
    }
  }

  function newPurchaseOrder() {
    const getUniqPo = (poNums: Array<string>) => {
      const maxPo = Math.max(
        ...poNums.map((i) => Number(i.replace(/\D*/, "")))
      );
      return `new${maxPo + 1}`;
    };

    const newState = { ...poState };
    const newPoNumber = getUniqPo(
      poState.content.map((i) => i.poNumber.toString())
    );

    newState.content.push({
      _id: newPoNumber,
      poNumber: newPoNumber,
      ingredients: [
        {
          ingredient: {
            _id: "0",
            name: "New Ingredient",
            type: "Type",
            unit: "Oz.",
          },
          quantity: 0,
          unitCost: 1,
        },
      ],
      supplier: { name: "Test2", address: "address" },
    });
    setPoState(newState);
  }

  const saveSelectedPO = () => {
    const saveItem = async (item?: Po) => {
      let data;
      if (!item) return;
      if (item._id.includes("new")) {
        data = await postOrPutData(`${apiUrl()}/purchaseOrders`, {
          poNumber: item.poNumber,
          ingredients: item.ingredients,
          supplier: item.supplier,
        });
      } else {
        data = await postOrPutData(
          `${apiUrl()}/purchaseOrders/${item._id}`,
          {
            poNumber: item.poNumber,
            ingredients: item.ingredients,
            supplier: item.supplier,
          },
          "PUT"
        );
      }
      if (data) console.log(JSON.stringify(data));
      setPoState({ ...poState, alertMessage: data.message });
      setTimeout(() => {
        setPoState({ ...poState, alertMessage: undefined });
      }, 3000);
    };

    const foundItem = poState.content.find(
      (i) => poState.selectedId === i._id
    );
    saveItem(foundItem);
  };

  const handleItemSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newState = { ...poState };
    newState.selectedId = event.target.value;
    setPoState(newState);
  };

  const handleChangePO = (
    event: React.ChangeEvent<HTMLSelectElement>,
    idx: number
  ) => {
    console.log(event.target.value);
    const newState = { ...poState };

    const foundItem = newState.content.find(
      (el) => el._id === newState.selectedId
    );
    if (foundItem) {
      if (event.target.name === "quantity")
        foundItem.ingredients[idx].quantity = Number(event.target.value);
      if (event.target.name === "name")
        foundItem.ingredients[idx].ingredient.name = event.target.value;
      if (event.target.name === "unitCost")
        foundItem.ingredients[idx].unitCost = Number(event.target.value);
      setPoState(newState);
    }
  };
  const handleRemovePoLine = (idx: number) => {
    const newState = { ...poState };

    const foundItem = newState.content.find(
      (el) => el._id === newState.selectedId
    );
    if (foundItem) {
      foundItem.ingredients = [...foundItem.ingredients];
      foundItem.ingredients.splice(idx, 1);
      setPoState(newState);
    }
  };

  const handleAddPoLine = () => {
    const newState = { ...poState };
    const foundItem = newState.content.find(
      (el) => el._id === newState.selectedId
    );
    if (foundItem) {
      foundItem.ingredients.push({
        quantity: 1,
        unitCost: 0.01,
        ingredient: { _id: "", name: "New Item", type: "type", unit: "Oz" },
      });
      setPoState(newState);
    }
  };

  const foundItem = poState.content.find(
    (el) => el._id === poState.selectedId
  );
  if (poState.loading)
    return (<div className="page-content"><Spinner color="secondary" style={{ width: '10rem', height: '10rem' }} type="grow" /></div>)
  else
    return (
      <>
        <h2 className="page-title">Purchase Orders</h2>
        <div className="page-content">
          <div id="poListGrid">
            <ul className="styled-list">
              {poState.content.map((item) => (
                <li
                  className={item._id === poState.selectedId ? "active" : ""}
                  key={item.poNumber}
                  onClick={() => setPoState({ ...poState, selectedId: item._id })}
                >{`${item.poNumber} — ${item.supplier.name}`}</li>
              ))}
            </ul>
            {foundItem && (
              <PurchaseOrderForm
                item={foundItem}
                onChange={handleChangePO}
                onAddLine={handleAddPoLine}
                onRemoveLine={handleRemovePoLine}
                ingData={poState.ingData}
              />
            )}
            <div className="poButtons delete">
              <Button
                color="success"
                onClick={(e) => newPurchaseOrder()}
              >
                New Purchase Order
              </Button>
              <Button color="warning" onClick={saveSelectedPO}>
                Save Current
              </Button>
            </div>
          </div>
          {poState.alertMessage && (
            <Alert
              color={
                poState.alertMessage.includes("ERROR:") ? "danger" : "info"
              }
            >
              {poState.alertMessage}
            </Alert>
          )}
        </div>
      </>
    );
}

export default PurchaseOrderList;
