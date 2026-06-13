import { useState } from "react";
import API from "../api/api";

function ReportLost() {

  const [formData, setFormData] = useState({
    airportName: "",
    passengerName: "",
    email: "",
    phone: "",
    itemName: "",
    itemDescription: "",
    bagTagNumber: "",
    ticketNumber: "",
    dateLost: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post("/lost-items", formData);
      alert("✅ Lost item submitted successfully!");
    } catch (err) {
      console.log(err);
      alert("❌ Error submitting lost item");
    }
  };

  return (
    <div className="container mt-4">
      <h2>📦 Report Lost Item</h2>

      <form className="card p-4 mt-3 shadow-sm" onSubmit={handleSubmit}>

        <input className="form-control mb-2" name="passengerName" placeholder="Your Name" onChange={handleChange} />

        <input className="form-control mb-2" name="email" placeholder="Email" onChange={handleChange} />

        <input className="form-control mb-2" name="phone" placeholder="Phone" onChange={handleChange} />

        <input className="form-control mb-2" name="itemName" placeholder="Item Name" onChange={handleChange} />

        <textarea className="form-control mb-2" name="itemDescription" placeholder="Description" onChange={handleChange} />

        <input className="form-control mb-2" name="bagTagNumber" placeholder="Bag Tag Number" onChange={handleChange} />

        <input className="form-control mb-2" name="ticketNumber" placeholder="Ticket Number" onChange={handleChange} />

        <select className="form-control mb-2" name="airportName" onChange={handleChange}>
          <option value="">Select Airport</option>
          <option value="Dhaka Airport">Hazrat Shahjalal International Airport</option>
          <option value="Sylhet Airport">Osmani International Airport</option>
          <option value="Chattogram Airport">Shah Amanat International Airport</option>
          <option value="CoxBazar Airport">Cox’s Bazar Airport</option>
          <option value="Saidpur Airport">Saidpur Airport</option>
        </select>

        <input type="date" className="form-control mb-2" name="dateLost" onChange={handleChange} />

        <button className="btn btn-danger w-100">
          Submit Lost Report
        </button>

      </form>
    </div>
  );
}

export default ReportLost;