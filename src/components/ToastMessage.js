import React from "react";

function ToastMessage({

    show,
    type = "success",
    message,
    onClose

}) {

    if (!show) return null;

    return (

        <div
            className={`alert alert-${type} alert-dismissible fade show shadow`}
            role="alert"
        >

            <strong>

                {type === "success"
                    ? "✅ Success! "
                    : type === "danger"
                        ? "❌ Error! "
                        : type === "warning"
                            ? "⚠ Warning! "
                            : "ℹ Info! "}

            </strong>

            {message}

            <button
                type="button"
                className="btn-close"
                onClick={onClose}
            />

        </div>

    );

}

export default ToastMessage;