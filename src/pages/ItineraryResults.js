import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import "../styles/ItineraryResults.css";
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import Footer from "../components/Footer";

const s3Client = new S3Client({
    region: process.env.REACT_APP_AWS_REGION,
    credentials: {
        accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
    },
});

const ItineraryResults = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [itinerary, setItinerary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setItinerary(location.state?.itinerary || null);
            setLoading(false);
        }, 1500);

        return () => clearTimeout(timer);
    }, [location.state]);

    const handleBack = () => {
        navigate("/itinerary", { state: { formData: location.state?.formData } });
    };

    const generateAndUploadPDF = async () => {
        setUploading(true);
        try {
            if (!itinerary) {
                throw new Error("Itinerary data is missing or invalid");
            }

            const formData = location.state?.formData || {};

            let days = 7;
            if (formData.fromDate && formData.toDate) {
                const checkIn = new Date(formData.fromDate);
                const checkOut = new Date(formData.toDate);
                if (!isNaN(checkIn.getTime()) && !isNaN(checkOut.getTime())) {
                    const diffTime = Math.abs(checkOut - checkIn);
                    days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                }
            } else if (
                itinerary.flights &&
                itinerary.flights.outbound?.departureTime &&
                itinerary.flights.return?.arrivalTime
            ) {
                const departure = new Date(itinerary.flights.outbound.departureTime);
                const arrival = new Date(itinerary.flights.return.arrivalTime);
                if (!isNaN(departure.getTime()) && !isNaN(arrival.getTime())) {
                    const diffTime = Math.abs(arrival - departure);
                    days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                }
            }

            const tourDays = itinerary.tourPlaces ? Object.keys(itinerary.tourPlaces).length : 0;
            const minPages = Math.max(3, 2 + tourDays + (itinerary.messages?.length > 0 ? 1 : 0));

            const doc = new jsPDF();
            let yPosition = 20;
            const pageHeight = 270;
            const pageWidth = 170;
            let currentPage = 1;

            const addTextWithPageBreak = (text, x, fontSize) => {
                doc.setFontSize(fontSize);
                const lines = doc.splitTextToSize(text, pageWidth);
                lines.forEach((line) => {
                    if (yPosition > pageHeight) {
                        doc.addPage();
                        yPosition = 20;
                        currentPage++;
                        addBrandedHeader();
                        doc.setFontSize(20);
                        doc.text("Your Itinerary (Continued)", 20, yPosition);
                        yPosition += 25;
                    }
                    doc.text(line, x, yPosition);
                    yPosition += fontSize * 0.5;
                });
                yPosition += 5;
            };

            const startNewPage = (title) => {
                doc.addPage();
                yPosition = 20;
                currentPage++;
                addBrandedHeader();
                doc.setFontSize(20);
                doc.text(title, 20, yPosition);
                yPosition += 25;
            };

            const addBrandedHeader = () => {
                doc.setFontSize(24);
                doc.text("XploreOn", 20, 15);
                doc.setFontSize(12);
                doc.text("Explore the World with Ease", 20, 25);
                doc.setLineWidth(0.5);
                doc.line(20, 30, 190, 30);
                yPosition = 40;
            };

            const addBrandedFooter = () => {
                const totalPages = doc.internal.getNumberOfPages();
                for (let i = 1; i <= totalPages; i++) {
                    doc.setPage(i);
                    doc.setFontSize(10);
                    doc.text("Powered by XploreOn", 20, 285);
                    doc.text(`Page ${i} of ${totalPages}`, 180, 285);
                }
            };

            doc.setFontSize(30);
            doc.text("XploreOn Itinerary", 20, 50);
            doc.setFontSize(16);
            doc.text("Explore the World with Ease", 20, 65);
            doc.setFontSize(14);
            doc.text(`From: ${formData.fromDate || "N/A"}`, 20, 90);
            doc.text(`To: ${formData.toDate || "N/A"}`, 20, 100);
            doc.setLineWidth(0.5);
            doc.line(20, 110, 190, 110);

            startNewPage("Your Itinerary");

            if (itinerary.flights) {
                addTextWithPageBreak("Flights", 20, 16);
                const flightPrice = itinerary.flights.price ? Math.round(Number(itinerary.flights.price)) : "N/A";
                addTextWithPageBreak(`Price: ${flightPrice} ${itinerary.flights.currency || ""}`, 20, 12);

                const outboundDeparture = new Date(itinerary.flights.outbound?.departureTime);
                const outboundArrival = new Date(itinerary.flights.outbound?.arrivalTime);
                const returnDeparture = new Date(itinerary.flights.return?.departureTime);
                const returnArrival = new Date(itinerary.flights.return?.arrivalTime);

                const outboundText = `Outbound: ${itinerary.flights.outbound?.airline || "N/A"} | Depart: ${
                    !isNaN(outboundDeparture.getTime()) ? outboundDeparture.toLocaleString() : "N/A"
                } | Arrive: ${
                    !isNaN(outboundArrival.getTime()) ? outboundArrival.toLocaleString() : "N/A"
                }`;
                const returnText = `Return: ${itinerary.flights.return?.airline || "N/A"} | Depart: ${
                    !isNaN(returnDeparture.getTime()) ? returnDeparture.toLocaleString() : "N/A"
                } | Arrive: ${
                    !isNaN(returnArrival.getTime()) ? returnArrival.toLocaleString() : "N/A"
                }`;

                addTextWithPageBreak(outboundText, 20, 12);
                addTextWithPageBreak(returnText, 20, 12);
                yPosition += 10;
            }

            if (itinerary.hotels) {
                addTextWithPageBreak("Hotel", 20, 16);
                addTextWithPageBreak(`Name: ${itinerary.hotels.name || "N/A"}`, 20, 12);
                const hotelPrice = itinerary.hotels.price ? Math.round(Number(itinerary.hotels.price)) : "N/A";
                addTextWithPageBreak(`Price: ${hotelPrice} ${itinerary.hotels.currency || ""}`, 20, 12);
                addTextWithPageBreak(`Review Score: ${itinerary.hotels.reviewScore || "N/A"}`, 20, 12);
                addTextWithPageBreak(`Check-In: ${itinerary.hotels.checkInDate || "N/A"}`, 20, 12);
                addTextWithPageBreak(`Check-Out: ${itinerary.hotels.checkOutDate || "N/A"}`, 20, 12);
                yPosition += 10;
            } else if (formData.services?.includes("Hotel")) {
                addTextWithPageBreak("Hotel", 20, 16);
                addTextWithPageBreak("No hotels available for your selected dates and destination.", 20, 12);
                yPosition += 10;
            }

            if (itinerary.carRentals) {
                addTextWithPageBreak("Car Rental", 20, 16);
                itinerary.carRentals.forEach((car, index) => {
                    addTextWithPageBreak(`Car ${index + 1}:`, 20, 12);
                    addTextWithPageBreak(`Vehicle: ${car.vehicle || "N/A"}`, 20, 12);
                    addTextWithPageBreak(`Supplier: ${car.supplier || "N/A"}`, 20, 12);
                    const carPrice = car.price ? Math.round(Number(car.price)) : "N/A";
                    addTextWithPageBreak(`Price: ${carPrice} ${car.currency || ""}`, 20, 12);
                    yPosition += 5;
                });
                yPosition += 10;
            }

            startNewPage("Your Itinerary (Restaurants)");
            if (itinerary.restaurants && itinerary.restaurants.length > 0) {
                addTextWithPageBreak("Restaurants", 20, 16);
                itinerary.restaurants.forEach((restaurant, index) => {
                    addTextWithPageBreak(`Restaurant ${index + 1}:`, 20, 12);
                    addTextWithPageBreak(`Name: ${restaurant.name || "N/A"}`, 20, 12);
                    addTextWithPageBreak(`Rating: ${restaurant.averageRating || "N/A"}`, 20, 12);
                    addTextWithPageBreak(`Location: ${restaurant.parentGeoName || "N/A"}`, 20, 12);
                    addTextWithPageBreak(`Tags: ${restaurant.tags?.join(", ") || "N/A"}`, 20, 12);
                    yPosition += 10;
                });
            } else {
                addTextWithPageBreak("No restaurants available.", 20, 12);
            }

            if (itinerary.tourPlaces && Object.keys(itinerary.tourPlaces).length > 0) {
                const tourDays = Object.keys(itinerary.tourPlaces);
                tourDays.forEach((day, index) => {
                    startNewPage(`Your Itinerary (Tour Places - ${day})`);
                    addTextWithPageBreak(day, 20, 14);
                    itinerary.tourPlaces[day].forEach((tour, tourIndex) => {
                        addTextWithPageBreak(`Tour ${tourIndex + 1}:`, 20, 12);
                        addTextWithPageBreak(`Name: ${tour.name || "N/A"}`, 20, 12);
                        const description = tour.description || "N/A";
                        addTextWithPageBreak(`Description: ${description}`, 20, 12);
                        yPosition += 15;
                    });
                });
            }

            if (itinerary.messages && itinerary.messages.length > 0) {
                startNewPage("Your Itinerary (Messages)");
                addTextWithPageBreak("Messages", 20, 16);
                itinerary.messages.forEach((message, index) => {
                    addTextWithPageBreak(`${index + 1}. ${message || "N/A"}`, 20, 12);
                    yPosition += 5;
                });
            }

            while (currentPage < minPages) {
                startNewPage("Your Itinerary (Additional Notes)");
                addTextWithPageBreak("Additional space for notes or itinerary details.", 20, 12);
            }

            addBrandedFooter();

            const pdfBuffer = doc.output("arraybuffer");

            const key = `itinerary-${Date.now()}.pdf`;
            const params = {
                Bucket: "xploreon",
                Key: key,
                Body: pdfBuffer,
                ContentType: "application/pdf",
            };

            const uploadCommand = new PutObjectCommand(params);
            await s3Client.send(uploadCommand);

            const getObjectParams = {
                Bucket: params.Bucket,
                Key: params.Key,
            };
            const url = await getSignedUrl(s3Client, new GetObjectCommand(getObjectParams), {
                expiresIn: 3600,
            });

            const response = await fetch(url);
            if (!response.ok) {
                throw new Error("Failed to fetch PDF from pre-signed URL");
            }
            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = blobUrl;
            link.download = "itinerary.pdf";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);
        } catch (error) {
            alert("Failed to generate and download PDF. Please try again.");
        } finally {
            setUploading(false);
        }
    };

    if (loading) {
        return (
            <div className="itinerary-results-container">
                <div className="loading-spinner">
                    <div className="spinner"></div>
                    <p>Loading your itinerary...</p>
                </div>
            </div>
        );
    }

    if (!itinerary) {
        return (
            <div className="itinerary-results-container">
                <div className="error-message">No itinerary data available. Please try again.</div>
            </div>
        );
    }

    return (
        <div className="itinerary-results-container">
            <div className="header-section">
                <h2 className="page-title">Your XploreOn Itinerary</h2>
                <div className="button-group">
                    <button onClick={handleBack} className="back-button">Back to Search</button>
                    <button onClick={generateAndUploadPDF} disabled={uploading} className="pdf-button">
                        {uploading ? "Generating PDF..." : "Generate PDF Itinerary"}
                    </button>
                </div>
            </div>

            {(itinerary.flights || itinerary.carRentals) && (
                <div className="section-card">
                    <h3 className="section-title">Travel Arrangements</h3>
                    <div className="travel-grid">
                        {itinerary.flights && (
                            <div className="card">
                                <div className="card-header">
                                    <h4>Flights</h4>
                                </div>
                                <div className="card-body">
                                    <div className="info-row">
                                        <span className="label">Price:</span>
                                        <span className="value">{Math.round(itinerary.flights.price)} {itinerary.flights.currency}</span>
                                    </div>
                                    <div className="info-row">
                                        <span className="label">Outbound:</span>
                                        <span className="value">{itinerary.flights.outbound.airline} | Depart: {new Date(itinerary.flights.outbound.departureTime).toLocaleString()} | Arrive: {new Date(itinerary.flights.outbound.arrivalTime).toLocaleString()}</span>
                                    </div>
                                    <div className="info-row">
                                        <span className="label">Return:</span>
                                        <span className="value">{itinerary.flights.return.airline} | Depart: {new Date(itinerary.flights.return.departureTime).toLocaleString()} | Arrive: {new Date(itinerary.flights.return.arrivalTime).toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        )}
                        {itinerary.carRentals && itinerary.carRentals.length > 0 && (
                            <div className="card">
                                <div className="card-header">
                                    <h4>Car Rentals</h4>
                                </div>
                                <div className="card-body">
                                    {itinerary.carRentals.map((car, index) => (
                                        <div key={index} className="car-rental-entry">
                                            <div className="info-row">
                                                <span className="label">Car {index + 1}:</span>
                                                <span className="value">{car.vehicle}</span>
                                            </div>
                                            <div className="info-row">
                                                <span className="label">Supplier:</span>
                                                <span className="value">{car.supplier}</span>
                                            </div>
                                            <div className="info-row">
                                                <span className="label">Price:</span>
                                                <span className="value">{Math.round(car.price)} {car.currency}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {itinerary.hotels ? (
                <div className="section-card">
                    <h3 className="section-title">Hotel</h3>
                    <div className="card">
                        <div className="card-body">
                            <div className="info-row">
                                <span className="label">Name:</span>
                                <span className="value">{itinerary.hotels.name}</span>
                            </div>
                            <div className="info-row">
                                <span className="label">Price:</span>
                                <span className="value">{Math.round(itinerary.hotels.price)} {itinerary.hotels.currency}</span>
                            </div>
                            <div className="info-row">
                                <span className="label">Review Score:</span>
                                <span className="value">{itinerary.hotels.reviewScore || "N/A"}</span>
                            </div>
                            <div className="info-row">
                                <span className="label">Check-In:</span>
                                <span className="value">{itinerary.hotels.checkInDate}</span>
                            </div>
                            <div className="info-row">
                                <span className="label">Check-Out:</span>
                                <span className="value">{itinerary.hotels.checkOutDate}</span>
                            </div>
                        </div>
                    </div>
                </div>
            ) : location.state?.formData?.services.includes("Hotel") ? (
                <div className="section-card">
                    <h3 className="section-title">Hotel</h3>
                    <div className="error-message">No hotels available for your selected dates and destination.</div>
                </div>
            ) : null}

            {itinerary.restaurants && itinerary.restaurants.length > 0 && (
                <div className="section-card">
                    <h3 className="section-title">Restaurants</h3>
                    <div className="card-grid">
                        {itinerary.restaurants.map((restaurant, index) => (
                            <div key={index} className="card">
                                <div className="card-header">
                                    <h4>{restaurant.name}</h4>
                                </div>
                                <div className="card-body">
                                    <div className="info-row">
                                        <span className="label">Rating:</span>
                                        <span className="value">{restaurant.averageRating}</span>
                                    </div>
                                    <div className="info-row">
                                        <span className="label">Location:</span>
                                        <span className="value">{restaurant.parentGeoName}</span>
                                    </div>
                                    <div className="info-row">
                                        <span className="label">Tags:</span>
                                        <span className="value">{restaurant.tags.join(", ")}</span>
                                    </div>
                                </div>
                                {restaurant.thumbnail && (
                                    <div className="card-image">
                                        <img src={restaurant.thumbnail} alt={restaurant.name} />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {itinerary.tourPlaces && Object.keys(itinerary.tourPlaces).length > 0 && (
                <div className="section-card">
                    <h3 className="section-title">Tour Places</h3>
                    {Object.keys(itinerary.tourPlaces).map((day) => (
                        <div key={day} className="tour-day">
                            <h4 className="day-title">{day}</h4>
                            <div className="card-grid">
                                {itinerary.tourPlaces[day].map((tour, index) => (
                                    <div key={index} className="card">
                                        <div className="card-header">
                                            <h4>{tour.name}</h4>
                                        </div>
                                        <div className="card-body">
                                            <div className="info-row">
                                                <span className="label">Description:</span>
                                                <span className="value">{tour.description}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {itinerary.messages && itinerary.messages.length > 0 && (
                <div className="section-card">
                    <h3 className="section-title">Messages</h3>
                    <ul className="message-list">
                        {itinerary.messages.map((message, index) => (
                            <li key={index} className="message-item">{message}</li>
                        ))}
                    </ul>
                </div>
            )}
            <Footer />
        </div>
    );
};

export default ItineraryResults;