import React, { useState } from "react";

const dummyPayments = [
  { id: 101, date: "2024-11-12", amount: "$500", status: "Paid", invoice: "invoice_101.pdf" },
  { id: 102, date: "2024-12-05", amount: "$300", status: "Pending", invoice: "invoice_102.pdf" },
];

const PaymentHistory = () => {
  const [payments] = useState(dummyPayments);

  const handleDownload = (invoice) => {
    alert(`Download ${invoice}`);
  };

  return (
    <div className="payments-container">
      <h2>Payment History</h2>
      <div className="payments-list">
        {payments.map((payment) => (
          <div key={payment.id} className={`payment-card ${payment.status.toLowerCase()}`}>
            <p>Date: {payment.date}</p>
            <p>Amount: {payment.amount}</p>
            <p>Status: <span className={payment.status.toLowerCase()}>{payment.status}</span></p>
            <button className="download-btn" onClick={() => handleDownload(payment.invoice)}>Download Invoice</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaymentHistory;
