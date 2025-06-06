<div className="app-container">
    {loading && (
        <div className="loading-message">
            <h4>
                Loading, please wait :)
            </h4>
        </div>
    )}
    <h4 className ="header-container">Recommendations: {recommendations.length}</h4>
    <ul>
        {showList && currentPlants.map((plant, index) => (
            <li className="plant-list" key={index} onClick={() => showPlantDetails(plant)}>
                <div className="header-container">
                    <strong>{plant.common_name.toUpperCase()}</strong><br />
                    <strong>{plant.plantType}</strong><br />
                    <em>{plant.botanical_name}</em>
                </div>
                <div className="plant-traits">
                    {plant.rain_garden_wet && <span className="trait-badge wet">Loves Water (Rain garden)</span>}
                    {plant.bloom_time && <span className="trait-badge pollinator">Pollinator</span>}
                    {plant.rain_garden_dry && <span className="trait-badge dry">Drought Tolerant (Rain garden slopes)</span>}
                    {plant.bioswale && <span className="trait-badge bioswale">Flooding Control/Bioswale</span>}
                    {plant.wildlife_keystone && <span className="trait-badge wildlife">Wildlife Keystone</span>}
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
                <button className="pagination-button" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>
                    ← Prev
                </button>
                <p className='pageNum-button'>Page {currentPage} of {totalPages}</p>
                <button className="pagination-button" disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>
                    Next →
                </button>
            </>
        )}
    </div>
    <div className="pagbuttons-container">
        <button onClick={scrollToTop} className="pagination-button">
            <img className ="plant-image" src ="/public/images/goUp.png" alt="Go Up!"
            />
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
                <strong>Scientific Name</strong><br />
                <h4>{selectedPlant.botanical_name}</h4>
                <h2>Common Name:</h2>
                <strong>{selectedPlant.common_name.toUpperCase()}</strong>
            </div>
            <section className ="mini-container">
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
                <h4 className ='mini-container'>Plant Characteristics:</h4>
                <div className="plant-traits">
                    {selectedPlant.rain_garden_wet && <span className="trait-badge wet">Loves Water</span>}
                    {selectedPlant.bloom_time && <span className="trait-badge pollinator">Pollinator</span>}
                    {selectedPlant.rain_garden_dry && <span className="trait-badge dry">Drought Tolerant</span>}
                    {selectedPlant.bioswale && <span className="trait-badge bioswale">Flooding Control/Bioswale</span>}
                    {selectedPlant.wildlife_keystone && <span className="trait-badge wildlife">Wildlife Keystone</span>}
                    {selectedPlant.ground_cover && <span className="trait-badge groundcover">Ground Cover</span>}
                </div>
                <p>Soil: {selectedPlant.soil_type === 'moist' ? 'Moist areas' : 'Dry areas'}</p>
                <p>Sun: {selectedPlant.full_sun ? 'Full sun' : ''}
                    {selectedPlant.part_shade ? ' Part shade' : ''}
                    {selectedPlant.full_shade ? ' Full shade' : ''}</p>
                <p>Height: {selectedPlant.height}</p>
                <p>Bloom Time: {selectedPlant.bloom_time}</p>
                <h4 className ='mini-container'>Recommended Uses:</h4>
                <p>{getPlantHabitats(selectedPlant).join(', ') || 'None specified'}</p>
            </div>
        </div>
    </div>
)}
</div>
);
}