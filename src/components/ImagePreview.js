import React from "react";

function ImagePreview({

    file,
    preview,
    onRemove

}) {

    if (!file || !preview) return null;

    const fileSize = (file.size / 1024).toFixed(2);

    return (

        <div className="card shadow-sm mb-3">

            <div className="card-header bg-dark text-white">

                📷 Image Preview

            </div>

            <div className="card-body text-center">

                <img
                    src={preview}
                    alt="Preview"
                    className="img-fluid rounded shadow"
                    style={{
                        maxHeight: "280px",
                        objectFit: "contain"
                    }}
                />

                <hr />

                <p className="mb-1">

                    <strong>File Name:</strong>

                    <br />

                    {file.name}

                </p>

                <p className="mb-3">

                    <strong>Size:</strong>

                    {" "}

                    {fileSize} KB

                </p>

                <button
                    type="button"
                    className="btn btn-outline-danger"
                    onClick={onRemove}
                >

                    🗑 Remove Image

                </button>

            </div>

        </div>

    );

}

export default ImagePreview;