import React from "react";

export default function paginated () {
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
        <img src = "/public/images/goUp.png" alt="Go Up!"
        />
    </button>
    <button onClick={handleViewAll} className="pagination-button">
        View All Plants
    </button>
</div>
</div>
);
}