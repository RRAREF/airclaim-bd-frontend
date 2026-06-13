import { useState } from "react";
import API from "../api/api";

function ReportFound() {

  const [formData, setFormData] = useState({
    airportName: "",
    itemName: "",
    itemDescription: "",
    bagTagNumber: "",
    ticketNumber: "",
    dateFound: ""
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
      await API.post("/found-items", formData);
      alert("✅ Found item submitted successfully!");
    } catch (err) {
      console.log(err);
      alert("❌ Error submitting found item");
    }
  };

  return (
    <div className="container mt-4">
      <h2>📍 Report Found Item</h2>

      <form className="card p-4 mt-3 shadow-sm" onSubmit={handleSubmit}>

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

        <input type="date" className="form-control mb-2" name="dateFound" onChange={handleChange} />

        <button className="btn btn-success w-100">
          Submit Found Report
        </button>

      </form>
    </div>
  );
}

export default ReportFound;