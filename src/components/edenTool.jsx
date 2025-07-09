/* Food Systems – Regenerative agriculture, foraging, food forests.
 Water Systems – Harvesting, filtration, greywater, purification.

Power & Energy – Solar, human-powered, biogas, passive design.

Shelter & Construction – Cob, earthbags, timber, local materials.

Clothing & Fibers – Growing, weaving, repurposing, zero-waste apparel.

♻Waste & Sanitation – Compost toilets, recycling, greywater systems.

Community & Governance – Decision-making, sharing, education.

Culture, Knowledge & Health – Herbalism, teaching, art, spiritual values. */


import React, { useState, useEffect, useRef } from "react";
import '../styles/edenToolGlobal.css';
import '../styles/edenToolComponents.css';
import AnimatedBackground from './components/animatedBackground.jsx';
import AnimatedIntro from './components/animatedIntro.jsx';
import CircularText from './components/circularText.jsx';


export default function NativePlantRecommender() {
    const [showList, setShowList] = useState(true);
    const [allPlants, setAllPlants] = useState([]);
    const [genusImages, setGenusImages] = useState({});
    const [showAll, setShowAll] = useState(true);
    const [recommendations, setRecommendations] = useState([]);
    const [selectedPlant, setSelectedPlant] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const plantsPerPage = 10;
    const plantDetailRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const [isScrolledToBottom, setIsScrolledToBottom] = useState(false);
    const pageContainerRef = useRef(null);
    const [selectedFilters, setSelectedFilters] = useState({
        soilType: [],
        sunlight: [],
        habitat: [],
        plantType: [],
        plantStatus: [],
        landscape: []
    });



    const filterOptions = {
        plantStatus: ['S1', 'S2', 'S3', 'S4', 'S5'],
        soilType: ['moist', 'dry'],
        sunlight: ['full_sun', 'part_shade', 'full_shade'],
        plantType: ['Tree','Shrub','Forb','Fern', 'Grass'],
        habitat: [
            'rain_garden_wet',
            'rain_garden_dry',
            'wildlife_keystone',
            'ground_cover'
        ],
        landscape: ["bird_haven", "butterfly_garden", "native_pollinator"]
    };

    const habitatDisplayNames = {
        'rain_garden_wet': 'Rain Garden (Wet soil)',
        'rain_garden_dry': 'Rain Garden (Dry soil)',
        'bioswale': 'Bioswale',
        'wildlife_keystone': 'Wildlife Keystone',
        'ground_cover': 'Ground Cover'
    };

    const landscapeDisplayNames  = {
        "bird_haven": "Bird Haven",
        "butterfly_garden": "Butterfly Garden",
        "native_pollinator": "Native Pollinator Garden"
    };

    const handleScroll = () => {
        if (pageContainerRef.current) {
            const { scrollHeight, scrollTop, clientHeight } = pageContainerRef.current;
            setIsScrolledToBottom(scrollHeight - scrollTop === clientHeight);
        }
    };


    const scrollToTop = () => {
        window.scrollTo({
            bottom: 50,
            left: 0,
            behavior: 'smooth' // Optional, for animated scrolling
        });
    };

    useEffect(() => {
        fetch(process.env.PUBLIC_URL + "/plant_data.json")
            .then((res) => res.json())
            .then((data) => setAllPlants(data))
            .catch(() => setRecommendations([{ common_name: "⚠️ Error loading plant data." }]));
    }, []);

    useEffect(() => {
        fetch(`${process.env.PUBLIC_URL}/genusImages.json`)
            .then((res) => res.json())
            .then((data) => setGenusImages(data))
            .catch(() => console.error("⚠️ Error loading genus images data."));
    }, []);

    useEffect(() => {
        setLoading(true);
        const filteredPlants = filterPlants(allPlants);``
        setTimeout(() => setLoading(false), 800);
        setRecommendations(filteredPlants);
        setSelectedPlant(null);
        setCurrentPage(1);
    }, [selectedFilters, allPlants]);

    const filterPlants = (plants) => {
        return plants.filter(plant => {

            if (selectedFilters.plantType.length > 0 && !selectedFilters.plantType.includes(plant.plant_type)) {
                return false;
            }
            if (selectedFilters.soilType.length > 0 && !selectedFilters.soilType.includes(plant.soil_type)) {
                return false;
            }
            if (selectedFilters.sunlight.length > 0) {
                const hasSunlight = selectedFilters.sunlight.some(light => plant[light]);
                if (!hasSunlight) return false;
            }
            if (selectedFilters.habitat.length > 0) {
                const hasHabitat = selectedFilters.habitat.some(habitat => plant[habitat]);
                if (!hasHabitat) return false;
            }
            if (selectedFilters.landscape.length > 0) {
                const hasLandPlan = selectedFilters.landscape.some(landscape => plant[landscape]);
                if (!hasLandPlan) return false;
            }
            return true;
        });
    };

    const showPlantDetails = (plant) => {
        setLoading(true);
        setSelectedPlant(plant);
        setTimeout(() => {
            plantDetailRef.current?.scrollIntoView({behavior: "smooth" });
            setLoading(false);
        }, 200);
    };

    const handleViewAll = () => setShowAll(true);
    const handlePaginatedView = () => setShowAll(false);

    const handleFilterChange = (filterType, value) => {
        setSelectedFilters(prev => ({
            ...prev,
            [filterType]: prev[filterType].includes(value)
                ? prev[filterType].filter(item => item !== value)
                : [...prev[filterType], value]
        }));
    };

    const indexOfLastPlant = currentPage * plantsPerPage;
    const indexOfFirstPlant = indexOfLastPlant - plantsPerPage;
    const currentPlants = showAll ? recommendations : recommendations.slice(indexOfFirstPlant, indexOfLastPlant);
    const totalPages = Math.ceil(recommendations.length / plantsPerPage);
    const clearHabitatFilter = () => {
        setSelectedFilters((prevFilters) => ({
            ...prevFilters,
            habitat: [],
            landscape: []
        }));
    };

    function getGenusFromName(botanicalName) {
        return botanicalName?.split(" ")[0];
    }

    const GITHUB_JSON_BASE = "https://chickens5.github.io/umsl-plant-app";

    function getGenusKey(genus, genusImages) {
        if (!genus || !genusImages || typeof genusImages !== 'object') return null;

        // Convert to lowercase for comparison, then return the actual matching key
        const match = Object.keys(genusImages).find(
            key => key.toLowerCase() === genus.toLowerCase()
        );

        return match || null;
    }



    function getImageFromJson(plant, genusImages) {
        if (plant?.image) return `${GITHUB_JSON_BASE}${plant.image}`;
        const genus = getGenusFromName(plant.botanical_name);
        const genusKey = getGenusKey(genus, genusImages);
        const genusImage = genusImages[genusKey]?.image;
        return genusImage ? `${GITHUB_JSON_BASE}${genusImage}` : `${GITHUB_JSON_BASE}/plantImgs/default.jpg`;
    }

    function getSourceUrl(plant, genusImages) {
        if (plant?.url) return plant.url;
        const genus = getGenusFromName(plant.botanical_name);
        const genusKey = getGenusKey(genus, genusImages);
        return genusImages[genusKey]?.url || "#";
    }

    function getDescription(plant, genusImages) {
        if (plant?.description && plant.description.length > 10) return plant.description;
        const genus = getGenusFromName(plant.botanical_name);
        const genusKey = getGenusKey(genus, genusImages);
        return genusImages[genusKey]?.description || "No description available.";
    }


    const getPlantHabitats = (plant) => {
        return Object.entries(plant)
            .filter(([key, value]) => filterOptions.habitat.includes(key) && value)
            .map(([key]) => habitatDisplayNames[key]);
    };

    const getLandPlan = (plant) => {
        return Object.entries(plant)
            .filter(([key, value]) => filterOptions.landscape.includes(key) && value)
            .map(([key]) => landscapeDisplayNames[key]);
    };

    return (
        <div className="page-container" ref={pageContainerRef} onScroll={handleScroll}>
            <CircularText
                text="Return--To--Eden--"
                onHover="speedUp"
                spinDuration={30}
                className="custom-class"

            />
            <div className="title-text">
                <div className="wrapper">
                    <div id="E" className="letter">E</div>
                    <div className="shadow">E</div>
                </div>
                <div className="wrapper">
                    <div id="D" className="letter">D</div>
                    <div className="shadow">D</div>
                </div>
                <div className="wrapper">
                    <div id="E" className="letter">E</div>
                    <div className="shadow">E</div>
                </div>
                <div className="wrapper">
                    <div id="N" className="letter">N</div>
                    <div className="shadow">N</div>
                </div>
            </div>


            <AnimatedIntro
                distance={150}
                direction="vertical"
                reverse={false}
                duration={1.2}
                ease="bounce.out"
                initialOpacity={0.2}
                animateOpacity
                scale={3}
                threshold={0.2}
                delay={0.3}
            >
                <h4 id = 'intro-header'>
                    Welcome to the EdenPlant Tool!
                </h4>
                <h3 id = 'body-header'>
                    Did you know? Native plants help us fight climate change by creating life in soil, serving as wildlife keystones,
                    and preventing flooding while providing filtered drinking water!
                </h3>
            </AnimatedIntro>

            <div className="intro-container">
                <AnimatedBackground/>
                Utilize the filters below to select the perfect plant or food for your green space :)
                <div className="filter-section">
                    <div className ='filter-container'>
                        <h5 className='mini-container'>
                            Sunlight:
                        </h5>
                        <div className="filter-group">
                            {filterOptions.sunlight.map(light => (
                                <label className = "filter-text" key={light}>
                                    {light === 'full_sun' ? 'Full Sun' : light === 'part_shade' ? 'Part Shade' : 'Full Shade'}
                                    <input
                                        type="checkbox"
                                        name = 'input'
                                        checked={selectedFilters.sunlight.includes(light)}
                                        onChange={() => handleFilterChange('sunlight', light)}
                                    />
                                </label>
                            ))}
                        </div>

                        <h5 className='mini-container'>
                            Plant Type:
                        </h5>

                        <div className="filter-group">
                            {filterOptions.plantType.map(plant_type => (
                                <label className = "filter-text" key={plant_type}>
                                    {plant_type === 'Tree' ? 'Tree' : ''}
                                    {plant_type === 'Forb' ? 'Forb' : ''}
                                    {plant_type === 'Grass' ? 'Grass' : ''}
                                    {plant_type === 'Shrub' ? 'Shrub' : ''}
                                    {plant_type === 'Fern' ? 'Fern' : ''}
                                    <input
                                        type="checkbox"
                                        name = 'input'
                                        checked={selectedFilters.plantType.includes(plant_type)}
                                        onChange={() => handleFilterChange('plantType', plant_type)}
                                    />
                                </label>
                            ))}
                        </div>



                        {loading && (
                            <div className="loading-message">
                                <h4>
                                    Loading, please wait :)
                                </h4>
                            </div>
                        )}
                        <div className = 'dropdown-group'>

                            <h5 className="mini-container">
                                Habitat/Use:
                            </h5>
                            <section className="dropdown">
                                <select
                                    value={selectedFilters.habitat[0] || 'None'}
                                    onChange={(e) => handleFilterChange('habitat', e.target.value)}
                                    className="dropdown-select">

                                    <option>
                                        -- Select Habitat --
                                    </option>

                                    {filterOptions.habitat.map((habitat) => (
                                        <option key={habitat} value={habitat}>
                                            {habitatDisplayNames[habitat]}
                                        </option>
                                    ))}

                                </select>
                            </section>
                            <h5 className="mini-container">
                                Landscape Plan:
                            </h5>
                            <section className="dropdown">
                                <select
                                    value={selectedFilters.landscape[0] || 'None'}
                                    onChange={(e) => handleFilterChange('landscape', e.target.value)}
                                    className="dropdown-select">
                                    <option>
                                        -- Select Landscape Plan --
                                    </option>
                                    {filterOptions.landscape.map((landscape) => (
                                        <option key={landscape} value={landscape}>
                                            {landscapeDisplayNames[landscape]}
                                        </option>
                                    ))}
                                </select>
                            </section>
                            <button onClick={clearHabitatFilter} className="clear-button">
                                Clear Filter
                            </button>
                        </div>
                        <button className="scroll-to-results-button" onClick={() => setShowList(!showList)}>
                            {showList ? "Hide Plants" : "Show Plants"}
                        </button>
                    </div>
                </div>
            </div>

            <div className="app-container">
                <ul>
                    <h4 className="header-container">Recommendations: {recommendations.length}</h4>
                    {showList && currentPlants.map((plant, index) => (
                        <li className="plant-list" key={index} onClick={() => showPlantDetails(plant)}>
                            <div className="plant-title">
                                <strong>{plant.common_name.toUpperCase()}</strong><br/>
                                <strong>{plant.plantType}</strong><br/>
                                <em>{plant.botanical_name}</em>
                            </div>
                            <div className="plant-traits">
                                {plant.rain_garden_wet &&
                                    <span className="trait-badge wet">Loves Water (Rain garden)</span>}
                                {plant.bloom_time && <span className="trait-badge pollinator">Pollinator</span>}
                                {plant.rain_garden_dry &&
                                    <span className="trait-badge dry">Drought Tolerant (Rain garden slopes)</span>}
                                {plant.bioswale &&
                                    <span className="trait-badge bioswale">Flooding Control/Bioswale</span>}
                                {plant.wildlife_keystone &&
                                    <span className="trait-badge wildlife">Wildlife Keystone</span>}
                                {plant.ground_cover && <span className="trait-badge groundcover">Ground Cover</span>}
                            </div>
                        </li>
                    ))}
                </ul>
                <div className="pagbuttons-container">
                    {showAll && (
                        <button onClick={handlePaginatedView} className="pagination-button">
                            Show Paginated
                        </button>
                    )}
                    {!showAll && (
                        <>
                            <button className="pagination-button" disabled={currentPage === 1}
                                    onClick={() => setCurrentPage(p => p - 1)}>
                                ← Prev
                            </button>
                            <p className='pageNum-button'>Page {currentPage} of {totalPages}</p>
                            <button className="pagination-button" disabled={currentPage === totalPages}
                                    onClick={() => setCurrentPage(p => p + 1)}>
                                Next →
                            </button>
                        </>
                    )}
                </div>
                <div className="pagbuttons-container">
                    <button onClick={scrollToTop} className="pagination-button">
                        !Go ^^ Up!
                    </button>
                    <button onClick={handleViewAll} className="pagination-button">
                        View All Plants
                    </button>
                </div>
            </div>
            {selectedPlant && (
                <div className="results-list">
                    <div ref={plantDetailRef} className="plant-details">
                        <div className="header-container">
                            <strong>Scientific Name</strong><br/>
                            <h4>{selectedPlant.botanical_name}</h4>
                            <h2>Common Name:</h2>
                            <strong>{selectedPlant.common_name.toUpperCase()}</strong>
                        </div>
                        <section className="mini-container">
                            <h3>Genus:</h3>
                            <h4>{(selectedPlant.botanical_name.split(' ')[0])}</h4>
                            <strong>Type: {selectedPlant.plant_type || 'Plant'}</strong>
                        </section>
                        <div className="plant-image-container">
                            {loading && (
                                <div className="loading-message">
                                    <h4>
                                        Loading, please wait :)
                                    </h4>
                                </div>
                            )}
                            <img
                                className="plant-image"
                                src={getImageFromJson(selectedPlant, genusImages)}
                                alt={selectedPlant.botanical_name}
                            />
                        </div>
                        <h6>All Pictures and Descriptions are sourced from The MOBOT or MDC.</h6>
                        <div>
                            <button className='pagination-button'>
                                <a href={getSourceUrl(selectedPlant, genusImages)}>Source</a>
                            </button>
                        </div>
                        <section className="plant-details">
                            <h4>Description: </h4>
                            <p>{getDescription(selectedPlant, genusImages) || 'No Description Found'}</p>
                        </section>
                        <div className={'plant-tag-container'}>
                            <h4 className='mini-container'>Plant Characteristics:</h4>
                            <div className="plant-traits">
                                {selectedPlant.rain_garden_wet && <span className="trait-badge wet">Loves Water</span>}
                                {selectedPlant.bloom_time && <span className="trait-badge pollinator">Pollinator</span>}
                                {selectedPlant.rain_garden_dry &&
                                    <span className="trait-badge dry">Drought Tolerant</span>}
                                {selectedPlant.bioswale &&
                                    <span className="trait-badge bioswale">Flooding Control/Bioswale</span>}
                                {selectedPlant.wildlife_keystone &&
                                    <span className="trait-badge wildlife">Wildlife Keystone</span>}
                                {selectedPlant.ground_cover &&
                                    <span className="trait-badge groundcover">Ground Cover</span>}
                            </div>
                            <p>Soil: {selectedPlant.soil_type === 'moist' ? 'Moist areas' : 'Dry areas'}</p>
                            <p>Sun: {selectedPlant.full_sun ? 'Full sun' : ''}
                                {selectedPlant.part_shade ? ' Part shade' : ''}
                                {selectedPlant.full_shade ? ' Full shade' : ''}</p>
                            <p>Height: {selectedPlant.height}</p>
                            <p>Bloom Time: {selectedPlant.bloom_time}</p>
                            <h4 className='mini-container'>Recommended Uses:</h4>
                            <p>{getPlantHabitats(selectedPlant).join(', ') || 'None specified'}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}