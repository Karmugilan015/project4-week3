import "./Home.css";
import React, { useEffect, useState, useCallback } from "react";
import Header from "../../components/Header";
import { addTransaction, getTransactions } from "../../utils/ApiRequest";
import Spinner from "../../components/spinner";
import TableData from "./TableData";
import Analytics from "./Analytics";
import { useNavigate } from "react-router-dom";
import { Button, Modal, Form, Container } from "react-bootstrap";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import BarChartIcon from "@mui/icons-material/BarChart";

const Home = () => {
  const navigate = useNavigate();
  const [cUser, setcUser] = useState(null);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [frequency, setFrequency] = useState("7");
  const [type, setType] = useState("all");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [view, setView] = useState("table");

  const toastOptions = {
    position: "bottom-right",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    theme: "dark",
  };

  useEffect(() => {
    const avatarFunc = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) {
        navigate("/login");
        return;
      }
      if (!user.isAvatarImageSet || !user.avatarImage) {
        navigate("/setAvatar");
      }
      setcUser(user);
      setRefresh(true);
    };

    avatarFunc();
  }, [navigate]);

  const [values, setValues] = useState({
    title: "",
    amount: "",
    description: "",
    category: "",
    date: "",
    transactionType: "",
  });

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { title, amount, description, category, date, transactionType } = values;

    if (!title || !amount || !description || !category || !date || !transactionType) {
      toast.error("Please enter all fields", toastOptions);
      return;
    }

    setLoading(true);

    try {
      const { data } = await axios.post(addTransaction, {
        title,
        amount,
        description,
        category,
        date,
        transactionType,
        userId: cUser._id,
      });

      if (data.success) {
        toast.success(data.message, toastOptions);
        handleClose();
        setRefresh((prev) => !prev);
      } else {
        toast.error(data.message, toastOptions);
      }
    } catch (err) {
      toast.error("Something went wrong. Please try again.", toastOptions);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllTransactions = useCallback(async () => {
    if (!cUser) return;

    try {
      setLoading(true);
      const { data } = await axios.post(getTransactions, {
        userId: cUser._id,
        frequency,
        startDate,
        endDate,
        type,
      });

      setTransactions(data.transactions || []);
    } catch (err) {
      toast.error("Error fetching transactions. Please try again.", toastOptions);
    } finally {
      setLoading(false);
    }
  }, [cUser, frequency, startDate, endDate, type]);

  useEffect(() => {
    fetchAllTransactions();
  }, [refresh, fetchAllTransactions]);

  const handleReset = () => {
    setType("all");
    setStartDate(null);
    setEndDate(null);
    setFrequency("7");
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Header />

      {loading ? (
        <Spinner />
      ) : (
        <Container className="mt-3">
          <div className="filterRow">
            <div className="text-white">
              <Form.Group className="mb-3">
                <Form.Label>Select Frequency</Form.Label>
                <Form.Select value={frequency} onChange={(e) => setFrequency(e.target.value)}>
                  <option value="7">Last Week</option>
                  <option value="30">Last Month</option>
                  <option value="365">Last Year</option>
                  <option value="custom">Custom</option>
                </Form.Select>
              </Form.Group>
            </div>

            <div className="text-white type">
              <Form.Group className="mb-3">
                <Form.Label>Type</Form.Label>
                <Form.Select value={type} onChange={(e) => setType(e.target.value)}>
                  <option value="all">All</option>
                  <option value="expense">Expense</option>
                  <option value="credit">Income</option>
                </Form.Select>
              </Form.Group>
            </div>

            <div className="text-white iconBtnBox">
              <FormatListBulletedIcon
                sx={{ cursor: "pointer" }}
                onClick={() => setView("table")}
                className={view === "table" ? "iconActive" : "iconDeactive"}
              />
              <BarChartIcon
                sx={{ cursor: "pointer" }}
                onClick={() => setView("chart")}
                className={view === "chart" ? "iconActive" : "iconDeactive"}
              />
            </div>

            <Button onClick={handleShow} className="addNew">Add New</Button>

            <Modal show={show} onHide={handleClose} centered>
              <Modal.Header closeButton>
                <Modal.Title>Add Transaction Details</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form>
                  <Form.Group className="mb-3">
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                      name="title"
                      type="text"
                      placeholder="Enter Transaction Name"
                      value={values.title}
                      onChange={handleChange}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Amount</Form.Label>
                    <Form.Control
                      name="amount"
                      type="number"
                      placeholder="Enter Amount"
                      value={values.amount}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Form>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>Close</Button>
                <Button variant="primary" onClick={handleSubmit}>Submit</Button>
              </Modal.Footer>
            </Modal>
          </div>

          {view === "table" ? <TableData data={transactions} user={cUser} /> : <Analytics transactions={transactions} user={cUser} />}
          <ToastContainer />
        </Container>
      )}
    </>
  );
};

export default Home;
