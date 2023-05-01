import React, { useState, useEffect } from "react";
import "./App.css";
import ExpenseList from "./components/ExpenseList";
import Alert from "./components/Alert";
import ExpenseForm from "./components/ExpenseForm";

// for unique id's
import { v4 as uuid } from "uuid";

//to get items from local storage
const initialExpenses = localStorage.getItem("expenses")
  ? JSON.parse(localStorage.getItem("expenses"))
  : [];

// console.log(initialExpenses);

function App() {

  //************** state values **************** */
  
  // all expenses, add expenses
  const [expenses, setExpenses] = useState(initialExpenses);
  // console.log(expenses.length);

  // single expense
  const [charge, setCharge] = useState("");

  // single amount
  const [amount, setAmount] = useState("");

  //alert
  const [alert, setAlert] = useState({ show: false });

  //edit
  const [edit, setEdit] = useState(false);

  //edit item
  const [id, setId] = useState(0);

  //************** Use Effect **************** */

  useEffect(() => {
    // console.log("use effect called");
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }, [expenses]);

  //************** functionality **************** */

  // Handle Charge
  const handleCharge = (e) => {
    setCharge(e.target.value);
  };

  // Handle Amount
  const handleAmount = (e) => {
    setAmount(e.target.value);
  };
  // Handle Alert
  const handleAlert = ({ type, text }) => {
    setAlert({ show: true, type, text });
    setTimeout(() => {
      setAlert({ show: false });
    }, 7000);
  };

  // Handle Submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (charge !== "" && amount > 0) {
      if (edit) {
        let tempExpenses = expenses.map((item) => {
          return item.id === id ? { ...item, charge, amount } : item;
        });
        setExpenses(tempExpenses);
        setEdit(false);
      } else {
        const singleExpense = { id: uuid(), charge, amount };
        // console.log(singleExpense);
        setExpenses([...expenses, singleExpense]);
      }
      setCharge("");
      setAmount("");
      handleAlert({ type: "success", text: "Item Added" });
    } else {
      // handle alert call
      handleAlert({
        type: "danger",
        text: `charge can't be empty value and amount value has to be bigger than zero`,
      });
    }
  };

  //Clear All Items
  const clearItems = () => {
    console.log("cleared all items");
    setExpenses([]);
    handleAlert({ type: "danger", text: "All items deleted" });
  };

  // Handle Delete
  const handleDelete = (id) => {
    console.log(`item deleted : ${id}`);
    let tempExpenses = expenses.filter((item) => item.id !== id);
    setExpenses(tempExpenses);
    handleAlert({ type: "danger", text: "item deleted" });
  };

  // Handle Edit
  const handleEdit = (id) => {
    let expense = expenses.find((item) => item.id === id);
    // console.log(expense);
    let { charge, amount } = expense;
    setCharge(charge);
    setAmount(amount);
    setEdit(true);
    setId(id);
  };

  return (
    <>
      {alert.show && <Alert type={alert.type} text={alert.text} />}
      <Alert></Alert>
      <h1 className="main-title">Budget Calculator</h1>
      <main className="App">
        <ExpenseForm
          charge={charge}
          amount={amount}
          handleAmount={handleAmount}
          handleCharge={handleCharge}
          handleSubmit={handleSubmit}
          edit={edit}
        />
        <ExpenseList
          expenses={expenses}
          handleDelete={handleDelete}
          handleEdit={handleEdit}
          clearItems={clearItems}
        />
      </main>
      <h1>
        Total Spending :
        <span>
          ₹
          {expenses.reduce((total, current) => {
            return (total += parseInt(current.amount));
          }, 0)}
        </span>
      </h1>
    </>
  );
}

export default App;
