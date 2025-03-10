import React from "react";
import { Container, Row } from "react-bootstrap";
import CircularProgressBar from "../../components/circular progressbar";
import LineProgressBar from "../../components/line progressbar";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

const Analytics = ({ transactions }) => {
  const TotalTransactions = transactions.length;
  const totalIncomeTransactions = transactions.filter((item) => item.transactionType === "credit");
  const totalExpenseTransactions = transactions.filter((item) => item.transactionType === "expense");

  const totalIncomePercent = TotalTransactions ? (totalIncomeTransactions.length / TotalTransactions) * 100 : 0;
  const totalExpensePercent = TotalTransactions ? (totalExpenseTransactions.length / TotalTransactions) * 100 : 0;

  const totalTurnOver = transactions.reduce((acc, transaction) => acc + transaction.amount, 0);
  const totalTurnOverIncome = totalIncomeTransactions.reduce((acc, transaction) => acc + transaction.amount, 0);
  const totalTurnOverExpense = totalExpenseTransactions.reduce((acc, transaction) => acc + transaction.amount, 0);

  const TurnOverIncomePercent = totalTurnOver ? (totalTurnOverIncome / totalTurnOver) * 100 : 0;
  const TurnOverExpensePercent = totalTurnOver ? (totalTurnOverExpense / totalTurnOver) * 100 : 0;

  const categories = [
    "Groceries", "Rent", "Salary", "Tip", "Food", "Medical", "Utilities", "Entertainment", "Transportation", "Other"
  ];

  const colors = {
    Groceries: "#FF6384", Rent: "#36A2EB", Salary: "#FFCE56", Tip: "#4BC0C0", Food: "#9966FF",
    Medical: "#FF9F40", Utilities: "#8AC926", Entertainment: "#6A4C93", Transportation: "#1982C4", Other: "#F45B69"
  };

  const formatCurrency = (amount) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);

  return (
    <Container className="mt-5">
      <Row>
        <div className="col-lg-3 col-md-6 mb-4">
          <div className="card h-100">
            <div className="card-header bg-black text-white font-weight-bold">Total Transactions: {TotalTransactions}</div>
            <div className="card-body">
              <h5 className="text-success"><ArrowDropUpIcon /> Income: {totalIncomeTransactions.length}</h5>
              <h5 className="text-danger"><ArrowDropDownIcon /> Expense: {totalExpenseTransactions.length}</h5>
              <CircularProgressBar percentage={totalIncomePercent.toFixed(0)} color="green" />
              <CircularProgressBar percentage={totalExpensePercent.toFixed(0)} color="red" />
            </div>
          </div>
        </div>
        
        <div className="col-lg-3 col-md-6 mb-4">
          <div className="card h-100">
            <div className="card-header bg-black text-white font-weight-bold">Total TurnOver: {formatCurrency(totalTurnOver)}</div>
            <div className="card-body">
              <h5 className="text-success"><ArrowDropUpIcon /> Income: {formatCurrency(totalTurnOverIncome)}</h5>
              <h5 className="text-danger"><ArrowDropDownIcon /> Expense: {formatCurrency(totalTurnOverExpense)}</h5>
              <circularProgressBar percentage={TurnOverIncomePercent.toFixed(0)} color="green" />
              <circularProgressBar percentage={TurnOverExpensePercent.toFixed(0)} color="red" />
            </div>
          </div>
        </div>
        
        <div className="col-lg-3 col-md-6 mb-4">
          <div className="card h-100">
            <div className="card-header bg-black text-white font-weight-bold">Categorywise Income</div>
            <div className="card-body">
              {categories.map(category => {
                const income = totalIncomeTransactions.filter(transaction => transaction.category === category).reduce((acc, transaction) => acc + transaction.amount, 0);
                const incomePercent = totalTurnOver ? (income / totalTurnOver) * 100 : 0;
                return income > 0 && <lineProgressBar key={category} label={category} percentage={incomePercent.toFixed(0)} lineColor={colors[category]} />;
              })}
            </div>
          </div>
        </div>
        
        <div className="col-lg-3 col-md-6 mb-4">
          <div className="card h-100">
            <div className="card-header bg-black text-white font-weight-bold">Categorywise Expense</div>
            <div className="card-body">
              {categories.map(category => {
                const expenses = totalExpenseTransactions.filter(transaction => transaction.category === category).reduce((acc, transaction) => acc + transaction.amount, 0);
                const expensePercent = totalTurnOver ? (expenses / totalTurnOver) * 100 : 0;
                return expenses > 0 && <LineProgressBar key={category} label={category} percentage={expensePercent.toFixed(0)} lineColor={colors[category]} />;
              })}
            </div>
          </div>
        </div>
      </Row>
    </Container>
  );
};

export default Analytics;
