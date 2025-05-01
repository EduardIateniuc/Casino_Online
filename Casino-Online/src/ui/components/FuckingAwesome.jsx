import React from "react";
import gif from "../../assets/gif.gif";

export default function FuckingAwesome() {
    return (
        <div>
            <div className="flex flex-col items-center justify-center h-screen bg-gray-900">
                <h1 className="text-4xl font-bold text-white mb-4">Hi from Budka</h1>
                <h2 className="text-xl font-bold text-white mb-4">Congratulations, you're hacked</h2>
                <img src={gif} alt="Loading..." className="w-64 h-64" />
                <p className="text-lg text-gray-300 mt-4">Loading...</p>
            </div>
        </div>
    );
}
