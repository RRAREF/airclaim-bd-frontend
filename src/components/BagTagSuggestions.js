import React from "react";

function BagTagSuggestions({

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

                    ❌ This Bag Tag Number has already been submitted.

                </div>

            )}

            {/* Suggestions */}

            {suggestions.length > 0 && (

                <div className="card shadow-sm">

                    <div className="card-header bg-primary text-white">

                        Existing Bag Tag Numbers

                    </div>

                    <ul className="list-group list-group-flush">

                        {suggestions.map((tag, index) => (

                            <li
                                key={index}
                                className={`list-group-item list-group-item-action ${tag === value ? "active" : ""}`}
                                style={{ cursor: "pointer" }}
                                onClick={() => onSelect(tag)}
                            >

                                🎒 {tag}

                            </li>

                        ))}

                    </ul>

                </div>

            )}

        </div>

    );

}

export default BagTagSuggestions;