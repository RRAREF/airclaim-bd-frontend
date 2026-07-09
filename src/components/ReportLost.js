import { useState } from "react";
import API from "../api/api";

function ReportLost() {

  const loggedInUser = JSON.parse(localStorage.getItem("user"));

  const [formData, setFormData] = useState({
    airportName: "",
    passengerName: loggedInUser?.name || "",
    email: loggedInUser?.email || "",
    phone: "",
    itemName: "",
    itemDescription: "",
    bagTagNumber: "",
    ticketNumber: "",
    dateLost: "",
    image: null
  });

  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {

    if (e.target.name === "image") {

      const file = e.target.files[0];

      setFormData({
        ...formData,
        image: file
      });

      if (file) {
        setPreview(URL.createObjectURL(file));
      }

    } else {

      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      });

    }

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const data = new FormData();

      data.append("airportName", formData.airportName);
      data.append("passengerName", loggedInUser?.name);
      data.append("email", loggedInUser?.email);
      data.append("phone", formData.phone);
      data.append("itemName", formData.itemName);
      data.append("itemDescription", formData.itemDescription);
      data.append("bagTagNumber", formData.bagTagNumber);
      data.append("ticketNumber", formData.ticketNumber);
      data.append("dateLost", formData.dateLost);

      if (formData.image) {
        data.append("image", formData.image);
      }

      await API.post("/lost-items", data, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      alert("✅ Lost Item Submitted Successfully!");

      setFormData({
        airportName: "",
        passengerName: loggedInUser?.name || "",
        email: loggedInUser?.email || "",
        phone: "",
        itemName: "",
        itemDescription: "",
        bagTagNumber: "",
        ticketNumber: "",
        dateLost: "",
        image: null
      });

      setPreview(null);

    } catch (err) {

      console.log(err);

      alert("❌ Error Submitting Lost Item");

    }

  };

  return (

    <div className="container mt-4">

      <h2>📦 Report Lost Item</h2>

      <form className="card p-4 mt-3 shadow-sm" onSubmit={handleSubmit}>

        <input
          className="form-control mb-2"
          value={loggedInUser?.name}
          readOnly
        />

        <input
          className="form-control mb-2"
          value={loggedInUser?.email}
          readOnly
        />

        <input
          className="form-control mb-2"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
        />

        <input
          className="form-control mb-2"
          name="itemName"
          placeholder="Item Name"
          value={formData.itemName}
          onChange={handleChange}
        />

        <textarea
          className="form-control mb-2"
          name="itemDescription"
          placeholder="Description"
          value={formData.itemDescription}
          onChange={handleChange}
        />

        <input
          className="form-control mb-2"
          name="bagTagNumber"
          placeholder="Bag Tag Number"
          value={formData.bagTagNumber}
          onChange={handleChange}
        />

        <input
          className="form-control mb-2"
          name="ticketNumber"
          placeholder="Ticket Number"
          value={formData.ticketNumber}
          onChange={handleChange}
        />

        <select
          className="form-control mb-2"
          name="airportName"
          value={formData.airportName}
          onChange={handleChange}
        >
          <option value="">Select Airport</option>
          <option value="Dhaka Airport">Hazrat Shahjalal International Airport</option>
          <option value="Sylhet Airport">Osmani International Airport</option>
          <option value="Chattogram Airport">Shah Amanat International Airport</option>
          <option value="CoxBazar Airport">Cox’s Bazar Airport</option>
          <option value="Saidpur Airport">Saidpur Airport</option>
        </select>

        <input
          type="date"
          className="form-control mb-3"
          name="dateLost"
          value={formData.dateLost}
          onChange={handleChange}
        />

        <label className="form-label fw-bold">
          Upload Item Photo
        </label>

        <input
          type="file"
          className="form-control mb-3"
          name="image"
          accept="image/*"
          onChange={handleChange}
        />

        {preview && (
          <div className="text-center mb-3">
            <img
              src={preview}
              alt="Preview"
              className="img-thumbnail"
              style={{
                maxWidth: "250px",
                maxHeight: "250px"
              }}
            />
          </div>
        )}

        <button className="btn btn-danger w-100">
          Submit Lost Report
        </button>

      </form>

    </div>

  );

}

export default ReportLost;