import React from "react";

const Header = ({ setActiveTab, activeTab }) => {
    return (
        <>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '0 20px'
            }}>
                <div>
                    <h3>Cropper</h3>
                </div>
                <div className="cropper-container">
                    <button
                        className={`tab-button ${activeTab === "preview" ? "active" : ""}`}
                        onClick={() => setActiveTab("preview")}
                    >
                        Preview Session
                    </button>
                    <button
                        className={`tab-button ${activeTab === "generate" ? "active" : ""}`}
                        onClick={() => setActiveTab("generate")}
                    >
                        Generate Session
                    </button>
                </div>
                <div style={{ visibility: 'hidden' }}>
                    <h3>Cropper</h3>
                </div>
            </div>
        </>
    )
}

export default Header;