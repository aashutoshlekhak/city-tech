// Dashboard.js
import { useState, useEffect } from "react";
import "./Dashboard.css";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const Dashboard = () => {
  const [showSubMenu, setShowSubMenu] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [transactionsPerPage] = useState(4);
  const [username, setUsername] = useState("hello wrold");

  useEffect(() => {
    setUsername(localStorage.getItem("username"));
    fetchTransactions();
  }, []);

  useEffect(() => {
    const checkSessionExpiration = () => {
      const sessionExpireTime = localStorage.getItem("session_expire_time");
      const currentTime = new Date().toISOString();

      if (sessionExpireTime && currentTime > sessionExpireTime) {
        localStorage.removeItem("jwtToken");
        localStorage.removeItem("username");
        toast.error("Session expired");
        navigate("/");
      }
    };

    checkSessionExpiration();

    const intervalId = setInterval(checkSessionExpiration, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const navigate = useNavigate();
  const handleLogout = () => {
    // Remove JWT token and username from localStorage
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("username");
    toast.success("Successfully logged out!");
    // navigte to the login page
    navigate("/");
  };

  const fetchTransactions = async () => {
    try {
      const jwtToken = localStorage.getItem("jwtToken");
      const response = await fetch(
        "https://jp-dev.cityremit.global/web-api/transaction-manager/v1/admin/dashboard/search",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
          body: JSON.stringify({}),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      const responseData = await response.json();
      setTransactions(responseData.data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      toast.error("Login to continue!");
    }
  };

  const totalPages = Math.ceil(transactions.length / transactionsPerPage);
  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = transactions.slice(
    indexOfFirstTransaction,
    indexOfLastTransaction
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  //   The part below is for the custom button in payment status
  function getClassForStatus(status) {
    switch (status) {
      case "Processing":
        return "yellow-button";
      case "Hold":
        return "red-button";
      case "Authorized":
        return "blue-button";
      case "Completed":
        return "green-button";
      default:
        return "yellow-button";
    }
  }

  // if user tries to goto "/dashboard" without logging in, redirect to "/
  if (!localStorage.getItem("jwtToken")) {
    return <Navigate to="/" />;
  }

  return (
    <div className="dashboard-container">
      {showSubMenu && (
        <div className="overlay" onClick={() => setShowSubMenu(false)} />
      )}
      <div className="sidebar">
        <div className="menu-item">
          <button>Settings</button>
          <button onClick={fetchTransactions}>Transactions</button>
        </div>
      </div>
      <div className="content">
        <div className="header">
          <h2 className="transaction-heading">Transactions</h2>
          <div className="profile-info">
            <span className="username">{username}</span>
            <img
              src="/src/assets/greta_tunberg.jpg"
              alt="Profile"
              className="profile-image"
              onClick={() => setShowSubMenu(!showSubMenu)}
            />

            {showSubMenu && (
              <div className="sub-menu">
                <div className="sub-menu-item">Profile</div>
                <div className="sub-menu-item" onClick={handleLogout}>
                  Log Out
                </div>
              </div>
            )}
          </div>
        </div>
        <div>
          <div className="main-content">
            <table className="custom-table">
              <thead className="thead">
                <tr>
                  <th>ID</th>
                  <th>Sender Full Name</th>
                  <th>Receiver Full Name</th>
                  <th>Current Status</th>
                  <th>Send Amount</th>
                  <th>Send Country</th>
                  <th>Receive Amount</th>
                  <th>Receive Country</th>
                </tr>
              </thead>
              <tbody>
                {currentTransactions.map((transaction, index) => (
                  <tr key={index}>
                    <td>{indexOfFirstTransaction + index + 1}</td>
                    <td>{transaction["Sender Full Name"]}</td>
                    <td>{transaction["Receiver Full Name"]}</td>
                    <td>
                      <div
                        className={getClassForStatus(
                          transaction["Current Status"]
                        )}
                      >
                        {transaction["Current Status"]}
                      </div>
                    </td>
                    <td>{transaction["Send Amount"]}</td>
                    <td>{transaction["Send Country"]}</td>
                    <td>{transaction["Receive Amount"]}</td>
                    <td>{transaction["Receive Country"]}</td>
                  </tr>
                ))}
                {/* added empty rows to maintain fixed height */}
                {currentTransactions.length < 4 &&
                  Array.from({ length: 4 - currentTransactions.length }).map(
                    (_, index) => (
                      <tr key={`empty-${index}`} className="empty-row">
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                      </tr>
                    )
                  )}
              </tbody>
            </table>

            <div className="pagination">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => paginate(i + 1)}
                  className={currentPage === i + 1 ? "active" : ""}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
