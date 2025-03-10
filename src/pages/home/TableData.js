import React, { useEffect, useState } from "react";
import { Button, Container, Form, Modal, Table } from "react-bootstrap";
import moment from "moment";
import EditNoteIcon from "@mui/icons-material/EditNote";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import "./Home.css";
import { deleteTransactions, editTransactions } from "../../utils/ApiRequest";
import axios from "axios";

const TableData = (props) => {
  const [show, setShow] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [currId, setCurrId] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [user, setUser] = useState(null);

  const [values, setValues] = useState({
    title: "",
    amount: "",
    description: "",
    category: "",
    date: "",
    transactionType: "",
  });

  const handleEditClick = (itemKey) => {
    const editTran = transactions.find((item) => item._id === itemKey);
    if (editTran) {
      setCurrId(itemKey);
      setEditingTransaction(editTran);
      setValues({
        title: editTran.title,
        amount: editTran.amount,
        description: editTran.description,
        category: editTran.category,
        date: moment(editTran.date).format("YYYY-MM-DD"),
        transactionType: editTran.transactionType,
      });
      setShow(true);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.put(`${editTransactions}/${currId}`, values);

      if (data.success) {
        setShow(false);
        setRefresh(!refresh);
      } else {
        console.log("Error updating transaction");
      }
    } catch (error) {
      console.error("Edit request failed:", error);
    }
  };

  const handleDeleteClick = async (itemKey) => {
    try {
      const { data } = await axios.post(`${deleteTransactions}/${itemKey}`, {
        userId: props.user._id,
      });

      if (data.success) {
        setRefresh(!refresh);
      } else {
        console.log("Error deleting transaction");
      }
    } catch (error) {
      console.error("Delete request failed:", error);
    }
  };

  useEffect(() => {
    setUser(props.user);
    setTransactions(props.data);
  }, [props.data, props.user, refresh]);

  return (
    <>
      <Container>
        <Table responsive="md" className="data-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Title</th>
              <th>Amount</th>
              <th>Type</th>
              <th>Category</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody className="text-white">
            {transactions.map((item) => (
              <tr key={item._id}>
                <td>{moment(item.date).format("YYYY-MM-DD")}</td>
                <td>{item.title}</td>
                <td>{item.amount}</td>
                <td>{item.transactionType}</td>
                <td>{item.category}</td>
                <td>
                  <div className="icons-handle">
                    <EditNoteIcon
                      sx={{ cursor: "pointer" }}
                      onClick={() => handleEditClick(item._id)}
                    />
                    <DeleteForeverIcon
                      sx={{ color: "red", cursor: "pointer" }}
                      onClick={() => handleDeleteClick(item._id)}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>

      {/* Edit Modal */}
      <Modal show={show} onHide={() => setShow(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Update Transaction</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleEditSubmit}>
            <Form.Group className="mb-3" controlId="formTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control
                name="title"
                type="text"
                value={values.title}
                onChange={(e) =>
                  setValues({ ...values, title: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formAmount">
              <Form.Label>Amount</Form.Label>
              <Form.Control
                name="amount"
                type="number"
                value={values.amount}
                onChange={(e) =>
                  setValues({ ...values, amount: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formCategory">
              <Form.Label>Category</Form.Label>
              <Form.Select
                name="category"
                value={values.category}
                onChange={(e) =>
                  setValues({ ...values, category: e.target.value })
                }
              >
                <option value="">Select Category</option>
                <option value="Groceries">Groceries</option>
                <option value="Rent">Rent</option>
                <option value="Salary">Salary</option>
                <option value="Tip">Tip</option>
                <option value="Food">Food</option>
                <option value="Medical">Medical</option>
                <option value="Utilities">Utilities</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Transportation">Transportation</option>
                <option value="Other">Other</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                name="description"
                value={values.description}
                onChange={(e) =>
                  setValues({ ...values, description: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formTransactionType">
              <Form.Label>Transaction Type</Form.Label>
              <Form.Select
                name="transactionType"
                value={values.transactionType}
                onChange={(e) =>
                  setValues({ ...values, transactionType: e.target.value })
                }
              >
                <option value="Credit">Credit</option>
                <option value="Expense">Expense</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formDate">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                name="date"
                value={values.date}
                onChange={(e) =>
                  setValues({ ...values, date: e.target.value })
                }
              />
            </Form.Group>

            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShow(false)}>
                Close
              </Button>
              <Button variant="primary" type="submit">
                Submit
              </Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default TableData;
