import React, { useEffect, useRef, useState } from "react";
import MapView from "@arcgis/core/views/MapView";
import WebMap from "@arcgis/core/WebMap";
import Expand from "@arcgis/core/widgets/Expand";
import Legend from "@arcgis/core/widgets/Legend";
import "@arcgis/core/assets/esri/themes/light/main.css";
import LayerToggle from "./LayerToggle.jsx"; // Add this import

const ArcGISMap = () => {
    const mapDiv = useRef(null);
    const [view, setView] = useState(null);
    const [webmap, setWebmap] = useState(null);

    useEffect(() => {
        if (!mapDiv.current) return;

        const webmapInstance = new WebMap({
            portalItem: {
                id: "3e7231d48fd944d6a3384515b48053c8",
            },
        });

        const viewInstance = new MapView({
            container: mapDiv.current,
            map: webmapInstance,
            center: [-90.1994, 38.6270],
            zoom: 12,
        });

        const legend = new Legend({ view: viewInstance });
        const legendExpand = new Expand({
            view: viewInstance,
            content: legend,
            expandIconClass: "esri-icon-layer-list",
            expanded: true,
        });

        viewInstance.ui.add(legendExpand, "top-right");

        setView(viewInstance);
        setWebmap(webmapInstance);

        return () => {
            viewInstance.container = null; // instead of destroy
        };
    }, []);
    return (
        <div className="relative w-full h-full">
            <div ref={mapDiv} className="w-full h-full" />
            {webmap && <LayerToggle webmap={webmap} />}
        </div>
    );
};

export default ArcGISMap;
