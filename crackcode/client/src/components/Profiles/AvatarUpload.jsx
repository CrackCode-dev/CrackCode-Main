import React, { useState, useRef, useEffect } from 'react'
import { Upload, Link2, X, ZoomIn, RotateCw } from 'lucide-react'
import Button from '../ui/Button';

const AvatarUpload = ({
    onAvatarSelect,
    currentAvatar = '',
    shape = 'circle', // 'circle', 'square'
    allowUrl = true,
    allowDragDrop = true,
    isOpen = true, // Control visibility from parent
    onClose // Callback when user closes modal

}) => {

    const [avatar, setAvatar] = useState(currentAvatar);
    const [tempImage, setTempImage] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [showCrop, setShowCrop] = useState(false);
    const [zoom, setZoom] = useState(1);
    const [rotation, setRotation] = useState(0);
    const [dragging, setDragging] = useState(false);
    const fileInputRef = useRef(null);

    //Reseting upladed avatar when deafult avatar changes
    useEffect(() => {

        setAvatar(currentAvatar)
        setTempImage('')
        setShowCrop(false)
        setZoom(1)
        setRotation(0)
        if (fileInputRef.current) fileInputRef.current.value = ''
    }, [currentAvatar])


    //shape style(circle/square)
    const shapeClass = shape === 'circle' ? 'rounded-full' : 'rounded-xl';

    //File Hanlder
    const handleFile = (file) => {
        if (!file?.type.startsWith('image/')) return alert('Select a valid image');
        const reader = new FileReader();
        reader.onload = () => {
            setTempImage(reader.result);
            setShowCrop(true);
        };
        reader.readAsDataURL(file);
    };

    //Drag and Drop
    const dragEvents = {
        onDragOver: e => { e.preventDefault(); if (allowDragDrop) setDragging(true); },
        onDragLeave: e => { e.preventDefault(); setDragging(false); },
        onDrop: e => { e.preventDefault(); setDragging(false); if (allowDragDrop) handleFile(e.dataTransfer.files[0]); }
    };

    //Importing Url

    const importUrl = () => {
        if (!imageUrl.trim()) return;
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
            setTempImage(imageUrl);
            setShowCrop(true);
            setImageUrl('');
        };
        img.onerror = () => alert('Invalid image URL');
        img.src = imageUrl;
    };

    //helper for crop image
    const getCroppedImage = (imageSrc, zoom = 1, rotation = 0, shape = 'circle') => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.src = imageSrc;

            img.onload = () => {
                const size = Math.min(img.width, img.height); // square crop
                //Create the canvas
                const canvas = document.createElement('canvas');
                canvas.width = size;
                canvas.height = size;
                const ctx = canvas.getContext('2d');

                // Move origin to center
                ctx.translate(size / 2, size / 2);
                //Apply rotation
                ctx.rotate((rotation * Math.PI) / 180);
                //Apply zoom
                ctx.scale(zoom, zoom);
                //move iage back
                ctx.translate(-img.width / 2, -img.height / 2);

                ctx.drawImage(img, 0, 0);

                // Apply circular mask if needed
                if (shape === 'circle') {
                    const circleCanvas = document.createElement('canvas');
                    circleCanvas.width = size;
                    circleCanvas.height = size;
                    const circleCtx = circleCanvas.getContext('2d');
                    circleCtx.beginPath();
                    circleCtx.arc(size / 2, size / 2, size / 2, 0, 2 * Math.PI);
                    circleCtx.closePath();
                    circleCtx.clip();
                    circleCtx.drawImage(canvas, 0, 0);
                    resolve(circleCanvas.toDataURL('image/png'));
                } else {
                    resolve(canvas.toDataURL('image/png'));
                }
            };

            img.onerror = (err) => reject(err);
        });
    };

    //Applying crop
    const applyCrop = async () => {

        const cropped = await getCroppedImage(tempImage, zoom, rotation, shape);
        setAvatar(cropped);
        setShowCrop(false);
        setZoom(1);
        setRotation(0);
        //Send cropped image to parent
        onAvatarSelect?.(cropped);

    };


    const closeModal = () => {
        setShowCrop(false);
        setTempImage('');
        setImageUrl('');
        setZoom(1);
        setRotation(0);
        onClose?.();
    };

    if (!isOpen) return null;

    return (
        <div className='fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4'>
            <div className='bg-gray-900 rounded-2xl p-6 max-w-xl w-full relative'>
                <button onClick={closeModal} className='absolute top-4 right-4 text-gray-400 hover:text-white'>
                    <X className='w-6 h-6' />
                </button>

                {!showCrop ? (
                    <>
                        <h2 className='text-2xl font-bold mb-4 text-white'>Upload Your Avatar</h2>

                        {allowDragDrop && (
                            <div {...dragEvents} onClick={() => fileInputRef.current?.click()}
                                className={`border-2 border-dashed p-6 text-center cursor-pointer mb-4
                     ${dragging ? 'border-orange-400 bg-orange-400 bg-opacity-10' : 'border-gray-700 hover:border-gray-600'}`}>
                                <Upload className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                                <p className="text-white">Drag & drop or click to browse</p>
                                <input ref={fileInputRef} type="file" accept="image/*"
                                    onChange={e => handleFile(e.target.files[0])} className="hidden" />
                            </div>
                        )}

                        {allowUrl && (
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <div className='absolute inset-y-0 left-3 flex items-center pointer-events-none'>
                                        <Link2 className="w-5 h-5 text-gray-400" />
                                    </div>
                                    <input type="url" value={imageUrl} onChange={e => setImageUrl(e.target.value)}
                                        placeholder='Paste image URL'
                                        onKeyDown={e => e.key === 'Enter' && importUrl()}
                                        className='w-full pl-10 pr-3 py-2 bg-gray-800 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400' />
                                </div>

                                <Button variant='primary' onClick={importUrl}>Import</Button>
                            </div>
                        )}
                    </>

                ) : (
                    <>
                        <h2 className='text-2xl font-bold mb-4 text-white'>Adjust Your Avatar</h2>
                        <div className={`w-64 h-64 mx-auto ${shapeClass} overflow-hidden bg-gray-800 mb-4`}>
                            <img src={tempImage} alt='Preview' className='w-full h-full object-cover'
                                style={{ transform: `scale(${zoom}) rotate(${rotation}deg)` }} />
                        </div>

                        <div className='mb-4'>
                            <label className='text-white flex items-center gap-2 mb-1'><ZoomIn /> Zoom: {zoom.toFixed(1)}x</label>
                            <input type="range" min="1" max="3" step="0.1" value={zoom} onChange={e => setZoom(+e.target.value)} className='w-full' />
                        </div>

                        <div className="mb-4">
                            <label className='text-white flex items-center gap-2 mb-1'><RotateCw /> Rotation: {rotation}°</label>
                            <input type='range' min='0' max='360' step='15' value={rotation} onChange={e => setRotation(+e.target.value)} className='w-full' />
                        </div>

                        <div className='flex gap-2'>

                            <Button variant='outline' onClick={closeModal} className='flex-1 py-2'>Cancel</Button>
                            <Button variant='primary' onClick={applyCrop} className='flex-1 py-2'>Apply</Button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default AvatarUpload;

