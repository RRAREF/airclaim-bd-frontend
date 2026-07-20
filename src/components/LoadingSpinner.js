import React from "react";

function LoadingSpinner({ text = "Loading..." }) {
    return (
        <div className="text-center my-3">
            <div
                className="spinner-border text-primary"
                role="status"
            >
                <span className="visually-hidden">
                    Loading...
                </span>
            </div>

            <div className="mt-2 fw-semibold text-secondary">
                {text}
            </div>
        </div>
    );
}

export default LoadingSpinner;