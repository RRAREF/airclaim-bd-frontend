import React from "react";

function TicketSuggestions({

    suggestions,
    value,
    duplicate,
    onSelect

}) {

    if (
        suggestions.length === 0 &&
        !duplicate
    ) {
        return null;
    }

    return (

        <div className="mb-3">

            {/* Duplicate Warning */}

            {duplicate && (

                <div className="alert alert-danger py-2">

                    ❌ This Ticket Number has already been submitted.

                </div>

            )}

            {/* Suggestions */}

            {suggestions.length > 0 && (

                <div className="card shadow-sm">

                    <div className="card-header bg-success text-white">

                        Existing Ticket Numbers

                    </div>

                    <ul className="list-group list-group-flush">

                        {suggestions.map((ticket, index) => (

                            <li
                                key={index}
                                className={`list-group-item list-group-item-action ${
                                    ticket === value ? "active" : ""
                                }`}
                                style={{ cursor: "pointer" }}
                                onClick={() => onSelect(ticket)}
                            >

                                🎫 {ticket}

                            </li>

                        ))}

                    </ul>

                </div>

            )}

        </div>

    );

}

export default TicketSuggestions;