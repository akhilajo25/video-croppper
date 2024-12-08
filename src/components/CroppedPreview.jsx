import React from "react";
import YT from "../SVGComponents/YT";
import styled from "styled-components";

const Container = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const CroppedPreview = ({ previewCanvasRef, isCropping }) => {
    return (
        <Container>
            <h5>Preview</h5>
            <div style={{
                maxWidth: "100%",
                maxHeight: "80vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
            }}>
                {isCropping ? (<canvas
                    ref={previewCanvasRef}
                    style={{
                        maxWidth: "100%",
                        maxHeight: "100%",
                        objectFit: "contain"
                    }}
                ></canvas>) : (
                    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                        <YT />
                        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                            <h4>Preview not available</h4>
                            <p>Please click on start cropper and then play video</p>
                        </div>
                    </div>)
                }
            </div>
        </Container>
    );
};

export default CroppedPreview;