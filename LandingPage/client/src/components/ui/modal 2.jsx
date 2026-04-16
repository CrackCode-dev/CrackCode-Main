import React, { useEffect } from "react"
import { Button } from "./button"

export function Modal({ isOpen, onClose, title, children }) {
    // Prevent scrolling when modal is open
    useEffect(() => {
        const previousOverflow = document.body.style.overflow

        if (isOpen) {
            document.body.style.overflow = "hidden"
        } else {
            document.body.style.overflow = previousOverflow || "unset"
        }

        return () => {
            document.body.style.overflow = previousOverflow || "unset"
        }
    }, [isOpen])

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
            <div className="relative w-full max-w-2xl max-h-[80vh] flex flex-col bg-card border border-border rounded-lg shadow-xl">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-xl font-bold text-foreground">{title}</h2>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-md transition-colors hover:text-orange-500 focus:outline-none focus:ring-1 focus-rounded-full"
                    >
                        ✕
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 text-muted-foreground leading-relaxed">
                    {children}
                </div>

                {/* Footer */}
                <div className="p-4 border-t flex justify-end">
                    <Button variant="outline" className="hover:bg-orange-500 transition-colors focus:outline-none 
                    focus:ring-1 focus:ring-orange-500" onClick={onClose}>
                        Close
                    </Button>
                </div>
            </div>
        </div>
    )
}