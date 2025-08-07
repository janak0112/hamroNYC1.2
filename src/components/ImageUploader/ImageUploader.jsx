import React, { useRef } from "react";

const ImageUploader = ({
    selectedFiles,
    setSelectedFiles,
    imagePreview,
    setImagePreview,
    existingImages = [],
    setExistingImages = () => { },
}) => {
    const fileInputRef = useRef(null);

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files).slice(0, 5);
        setSelectedFiles(files);
        setImagePreview(files.map((file) => URL.createObjectURL(file)));
    };

    const handleRemoveImage = (index) => {
        const newPreviews = [...imagePreview];
        const newFiles = [...selectedFiles];

        newPreviews.splice(index, 1);
        newFiles.splice(index, 1);

        setImagePreview(newPreviews);
        setSelectedFiles(newFiles);

        const dataTransfer = new DataTransfer();
        newFiles.forEach((file) => dataTransfer.items.add(file));
        if (fileInputRef.current) {
            fileInputRef.current.files = dataTransfer.files;
        }
    };

    const handleRemoveExistingImage = (index) => {
        const updated = [...existingImages];
        updated.splice(index, 1);
        setExistingImages(updated);
    };

    console.log("existingImages--",existingImages)

    return (
        <div>
            <label htmlFor="images" className="block text-sm font-semibold mb-2">
                Upload Images (Max 5)
            </label>

            <input
                id="images"
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                ref={fileInputRef}
                className="w-full p-2 border border-gray-300 rounded-md"
            />

            {selectedFiles.length > 0 && (
                <p className="text-xs text-gray-500 mt-1">
                    {selectedFiles.length} new image(s) selected
                </p>
            )}

            {/* Existing Images */}
            {existingImages.length > 0 && (
                <div className="grid grid-cols-5 gap-2 mt-2">
                    {existingImages.map((src, index) => (
                        <div key={index} className="relative group">
                            <img
                                src={src.preview}
                                alt={`Existing Preview ${index + 1}`}
                                className="w-full h-30 object-cover rounded"
                            />
                            <button
                                type="button"
                                onClick={() => handleRemoveExistingImage(index)}
                                className="absolute top-1 right-1 bg-black text-white rounded-full w-6 h-6 text-sm flex items-center justify-center opacity-75 hover:opacity-100"
                            >
                                ×
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* {existingImages.map((img, index) => (
                <div key={index} className="relative group">
                    <img
                        src={img.preview}
                        alt={`Existing Preview ${index + 1}`}
                        className="w-full h-30 object-cover rounded"
                    />
                    <button
                        type="button"
                        onClick={() => handleRemoveExistingImage(index)}
                        className="absolute top-1 right-1 bg-black text-white rounded-full w-6 h-6 text-sm flex items-center justify-center opacity-75 hover:opacity-100"
                    >
                        ×
                    </button>
                </div>
            ))} */}


            {/* New Uploads */}
            {imagePreview.length > 0 && (
                <div className="grid grid-cols-5 gap-2 mt-2">
                    {imagePreview.map((src, index) => (
                        <div key={index} className="relative group">
                            <img
                                src={src}
                                alt={`Preview ${index + 1}`}
                                className="w-full h-30 object-cover rounded"
                            />
                            <button
                                type="button"
                                onClick={() => handleRemoveImage(index)}
                                className="absolute top-1 right-1 bg-black text-white rounded-full w-6 h-6 text-sm flex items-center justify-center opacity-75 hover:opacity-100"
                            >
                                ×
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ImageUploader;
