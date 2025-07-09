import React, { useEffect, useState } from "react";

const LayerToggle = ({ webmap }) => {
    const [layers, setLayers] = useState([]);

    useEffect(() => {
        if (!webmap) return;

        const mapLayers = webmap.layers.map((layer) => ({
            id: layer.id,
            title: layer.title,
            visible: layer.visible,
            layer,
        }));

        setLayers(mapLayers);
    }, [webmap]);

    const toggleLayerVisibility = (id) => {
        setLayers((prevLayers) =>
            prevLayers.map((layerObj) => {
                if (layerObj.id === id) {
                    const newVisibility = !layerObj.visible;
                    layerObj.layer.visible = newVisibility;
                    return { ...layerObj, visible: newVisibility };
                }
                return layerObj;
            })
        );
    };

    return (
        <div className="absolute top-4 left-4 bg-white bg-opacity-90 rounded-xl shadow-md p-4 z-10 max-w-xs w-full">
            <h2 className="text-lg font-bold mb-2">Layer Toggle</h2>
            <ul className="space-y-2">
                {layers.map(({ id, title, visible }) => (
                    <li key={id} className="flex items-center justify-between">
                        <span className="text-sm">{title}</span>
                        <button
                            onClick={() => toggleLayerVisibility(id)}
                            className={`px-3 py-1 rounded text-sm font-semibold ${
                                visible ? "bg-green-500 text-white" : "bg-gray-300 text-gray-700"
                            }`}
                        >
                            {visible ? "On" : "Off"}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default LayerToggle;
