import React, { useState } from "react";
import '../styles/carRental.css';
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { FaSearchLocation } from "react-icons/fa";
import { BsFillCalendarDateFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import { FaMapMarkerAlt, FaCalendarAlt, FaCar, FaCreditCard } from "react-icons/fa";



const locations = [
  { name: "Toronto", image: "../images/torontocar.png" },
  { name: "Vancouver", image: "../images/vancouvercar.png" },
  { name: "Montreal", image: "../images/montrealcar.png" },
  { name: "Calgary", image: "../images/calgarycar.png" },
];

const reviews = [
  {
    id: 1,
    name: "John Doe",
    review: "Amazing service! The car was in perfect condition and the process was seamless.",
    rating: 5
  },
  {
    id: 2,
    name: "Sarah Williams",
    review: "Great experience! Easy booking and friendly customer support.",
    rating: 5
  },
  {
    id: 3,
    name: "Michael Brown",
    review: "Smooth ride, clean cars, and affordable pricing. Will book again!",
    rating: 5
  }
];

const ReviewCard = ({ name, review, rating }) => {
  return (
    <div className="review-card">
      <h3 className="review-name">{name}</h3>
      <p className="review-text">"{review}"</p>
      <div className="star-rating">
        {Array.from({ length: 5 }, (_, i) => (
          <span key={i} className={`star ${i < rating ? "filled" : ""}`}>&#9733;</span>
        ))}
      </div>
    </div>
  );
};

const Car = () => {
  return (
    <div className="car-container">
      <section className="customer-reviews">
        <h2 className="review-title">What Our Customers Say</h2>
        <div className="review-container">
          {reviews.map((review) => (
            <ReviewCard key={review.id} {...review} />
          ))}
        </div>
      </section>
    </div>
  );
};


const CarStepBooking = () => {
  return (
    <div className="car-container">
      <section className="car-booking-steps">
        <h2 className="car-steps-title">How to Book Your Ride</h2>
        <div className="car-steps-container">
          <div className="car-step-card car-step-up">
            <span className="car-step-number">1</span>
            <FaMapMarkerAlt className="step-icon" />

            <h3 className="car-step-title">Select Pickup & Drop</h3>
            <p className="car-step-description">
              Choose your preferred locations for pick-up and drop-off. Make sure the location is convenient for you.
            </p>
          </div>

          <div className="car-step-card car-step-up">
            <span className="car-step-number">2</span>
            <FaCalendarAlt className="step-icon" />

            <h3 className="car-step-title">Select Date & Time</h3>
            <p className="car-step-description">
              Select the date and time for your ride. Ensure the availability of your preferred vehicle.
            </p>
          </div>

          <div className="car-step-card car-step-down">
            <span className="car-step-number">3</span>
            <FaCar className="step-icon" />

            <h3 className="car-step-title">Choose Your Car</h3>
            <p className="car-step-description">
              Pick a car that fits your style and budget. Choose from economy, luxury, or SUVs.
            </p>
          </div>

          <div className="car-step-card car-step-down">
            <span className="car-step-number">4</span>
            <FaCreditCard className="step-icon" />

            <h3 className="car-step-title">Confirm & Pay</h3>
            <p className="car-step-description">
              Secure your booking with an online payment and get ready for your ride.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

const SecondCarPage = () => {


  return (
    <section className="SecondContainer-car">
      <div className="SecondPage-car">

        <h2 className="secondpagecar-title">Our car rental providers</h2>

        <img src="../images/alamo.png" alt="Alamo" className="image-frame-car" />
        <img src="../images/national.png" alt="national" className="image-frame-car" />
        <img src="../images/dollar.png" alt="Dollar" className="image-frame-car" />
        <img src="../images/thrifty.png" alt="Thrifty" className="image-frame-car" />
        <img src="../images/hertz.png" alt="Hertz" className="image-frame-car" />
        <img src="../images/enterprise.png" alt="Enterprise" className="image-frame-car" />
        <img src="../images/budget-car.png" alt="Budget" className="image-frame-car" />
        <img src="../images/avis.png" alt="Avis" className="image-frame-car" />
        <img src="../images/sixt.png" alt="Sixt" className="image-frame-car" />
      </div>
    </section>
  )
}



const CarRental = () => {
  const [pickupLocation, setPickupLocation] = useState("");
  const [returnLocation, setReturnLocation] = useState("");
  const [PickupDate, setPickupDate] = useState(new Date());
  const [ReturnDate, setReturnDate] = useState(new Date());

  const navigate = useNavigate();


  const handleSearch = () => {
    if (!PickupDate || !ReturnDate || !pickupLocation || !returnLocation) {
      alert("All the fiels are required");
      return;
    }


    const pickUpDate = PickupDate.toISOString().split('T')[0];
    const pickUpTime = PickupDate.toISOString().split('T')[1].slice(0, 5);
    const dropOffDate = ReturnDate.toISOString().split('T')[0];
    const dropOffTime = ReturnDate.toISOString().split('T')[1].slice(0, 5);

    const carsearchParams = {
      pickupLocation,
      dropOffLocation: returnLocation,
      pickUpDate,
      dropOffDate,
      pickUpTime,
      dropOffTime,
      currencyCode: "CAD",
    };

    navigate("/carrentaldetails", { state: carsearchParams });

  };

  const backgroundImage = "/images/carmain.jpg";

  return (
    <div className="hotel-container">
      <div className="heroo-section" style={{ backgroundImage: `url(${backgroundImage})` }}>
        <h1 className="main-title-car">From Short Trips to Long Drives<br></br> We've Got You Covered</h1>

        <div className="search-bar-container-car">
          <div className="search-bar-car">
            <div className="input-field-car">
              <FaSearchLocation className="icon" />
              <input
                type="text"
                placeholder="Pick-up Location"
                value={pickupLocation}
                onChange={(e) => setPickupLocation(e.target.value)}
              />
            </div>
            <div className="input-field-car">
              <FaSearchLocation className="icon" />
              <input
                type="text"
                placeholder="Return Location"
                value={returnLocation}
                onChange={(e) => setReturnLocation(e.target.value)}
              />
            </div>

            <div className="input-field-car">
              <BsFillCalendarDateFill className="icon" />
              <DatePicker
                selected={PickupDate}
                onChange={setPickupDate}
                placeholderText="Pick-up Date & Time"
                className="date-picker-input"
                minDate={new Date()}
                showTimeSelect
                dateFormat="MMMM d, yyyy h:mm aa"
              />
            </div>

            <div className="input-field-car">
              <BsFillCalendarDateFill className="icon" />
              <DatePicker
                selected={ReturnDate}
                onChange={setReturnDate}
                placeholderText="Return Date & Time"
                className="date-picker-input"
                minDate={PickupDate || new Date()}
                showTimeSelect
                dateFormat="MMMM d, yyyy h:mm aa"
              />
            </div>

            <button className="search-btn-car" onClick={handleSearch}>Search →</button>
          </div>
        </div>
      </div>
      <SecondCarPage />
      <CarStepBooking />
      <section className="customer-reviews">
        <h2 className="review-title">What Our Customers Say</h2>
        <div className="review-container">
          {reviews.map((review) => (
            <ReviewCard key={review.id} {...review} />
          ))}
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default CarRental;