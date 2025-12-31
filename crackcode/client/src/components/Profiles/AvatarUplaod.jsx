import React, { useState, useRef } from 'react'
import { Upload, Link2, X, ZoomIn, RotateCw } from 'lucide-react'

const AvatarUpload = ({
    onAvatarSelect,
    currentAvatar = '',
    shape = 'circle', // 'circle', 'square'
    allowUrl = true,
    allowDragDrop = true,
    isOpen = true, // Control visibility from parent
    onClose // Callback when user closes modal
}) => {
    const [uploadedAvatar, setUploadedAvatar] = useState(currentAvatar);
    const [showCropModal, setShowCropModal] = useState(false);
    const [tempImage, setTempImage] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [isDragging, setIsDragging] = useState(false);

    // Crop states
    const [zoom, setZoom] = useState(1);
    const [rotation, setRotation] = useState(0);

    const fileInputRef = useRef(null);

    const shapeClasses = {
        circle: 'rounded-full',
        square: 'rounded-xl'
    };

    // File Upload Handler
    const handleFileSelect = (file) => {
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = () => {
                setTempImage(reader.result);
                setShowCropModal(true);
            };
            reader.readAsDataURL(file);
        } else {
            alert('Please select a valid image file');
        }
    };

    // Drag and Drop Handlers
    const handleDragOver = (e) => {
        e.preventDefault();
        if (allowDragDrop) {
            setIsDragging(true);
        }
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        if (allowDragDrop) {
            const file = e.dataTransfer.files[0];
            handleFileSelect(file);
        }
    };

    // URL Import Handler
    const handleUrlImport = () => {
        if (imageUrl.trim()) {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => {
                setTempImage(imageUrl);
                setShowCropModal(true);
                setImageUrl('');
            };
            img.onerror = () => {
                alert('Unable to load image from URL. Please check the URL and try again.');
            };
            img.src = imageUrl;
        }
    };

    // Crop and Apply
    const applyCroppedImage = () => {
        setUploadedAvatar(tempImage);
        setShowCropModal(false);
        setZoom(1);
        setRotation(0);

        // Call parent callback
        if (onAvatarSelect) {
            onAvatarSelect(tempImage);
        }
    };

    const closeModals = () => {
        setShowCropModal(false);
        setTempImage('');
        setImageUrl('');
        setZoom(1);
        setRotation(0);
        if (onClose) {
            onClose();
        }
    };

    return (
        <>
            {/* Upload Options Modal */}
            {isOpen && !showCropModal && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-900 rounded-2xl p-8 max-w-2xl w-full relative">
                        <button
                            onClick={closeModals}
                            className="absolute top-4 right-4 text-gray-400 hover:text-white"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        <h2 className="text-2xl font-bold mb-6 text-white">Upload Your Avatar</h2>

                        <div className="space-y-4">
                            {/* Drag & Drop Area */}
                            {allowDragDrop && (
                                <div
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                    className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer
                    ${isDragging
                                            ? 'border-orange-400 bg-orange-400 bg-opacity-10'
                                            : 'border-gray-700 hover:border-gray-600'
                                        }`}
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                                    <p className="text-lg mb-2 text-white">Drag & Drop your image here</p>
                                    <p className="text-sm text-gray-400">or click to browse</p>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleFileSelect(e.target.files[0])}
                                        className="hidden"
                                    />
                                </div>
                            )}

                            {/* URL Import */}
                            {allowUrl && (
                                <div className="space-y-2">
                                    <div className="flex gap-2">
                                        <div className="relative flex-1">
                                            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                                <Link2 className="w-5 h-5 text-gray-400" />
                                            </div>
                                            <input
                                                type="url"
                                                value={imageUrl}
                                                onChange={(e) => setImageUrl(e.target.value)}
                                                placeholder="Paste image URL"
                                                onKeyPress ={(e) => e.key === 'Enter' && handleUrlImport()}
                                                className="w-full pl-11 pr-4 py-3 bg-gray-800 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
                                            />
                                        </div>
                                        <button
                                            onClick={handleUrlImport}
                                            className="px-6 py-3 bg-orange-500 hover:bg-orange-600 rounded-xl transition-colors text-white"
                                        >
                                            Import
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Crop Modal */}
            {showCropModal && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-900 rounded-2xl p-8 max-w-2xl w-full relative">
                        <button
                            onClick={closeModals}
                            className="absolute top-4 right-4 text-gray-400 hover:text-white"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        <h2 className="text-2xl font-bold mb-6 text-white">Adjust Your Avatar</h2>

                        <div className="space-y-6">
                            {/* Image Preview */}
                            <div className={`relative w-64 h-64 mx-auto ${shapeClasses[shape]} overflow-hidden bg-gray-800`}>
                                <img
                                    src={tempImage}
                                    alt="Preview"
                                    className="w-full h-full object-cover"
                                    style={{
                                        transform: `scale(${zoom}) rotate(${rotation}deg)`,
                                        transition: 'transform 0.2s'
                                    }}
                                />
                            </div>

                            {/* Controls */}
                            <div className="space-y-4">
                                {/* Zoom */}
                                <div>
                                    <label className="flex items-center gap-2 mb-2 text-white">
                                        <ZoomIn className="w-5 h-5" />
                                        <span>Zoom: {zoom.toFixed(1)}x</span>
                                    </label>
                                    <input
                                        type="range"
                                        min="1"
                                        max="3"
                                        step="0.1"
                                        value={zoom}
                                        onChange={(e) => setZoom(parseFloat(e.target.value))}
                                        className="w-full"
                                    />
                                </div>

                                {/* Rotation */}
                                <div>
                                    <label className="flex items-center gap-2 mb-2 text-white">
                                        <RotateCw className="w-5 h-5" />
                                        <span>Rotation: {rotation}°</span>
                                    </label>
                                    <input
                                        type="range"
                                        min="0"
                                        max="360"
                                        step="15"
                                        value={rotation}
                                        onChange={(e) => setRotation(parseInt(e.target.value))}
                                        className="w-full"
                                    />
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-4">
                                <button
                                    onClick={closeModals}
                                    className="flex-1 py-3 bg-gray-800 hover:bg-gray-700 rounded-xl transition-colors text-white"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={applyCroppedImage}
                                    className="flex-1 py-3 bg-orange-500 hover:bg-orange-600 rounded-xl transition-colors text-white"
                                >
                                    Apply
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default AvatarUpload;