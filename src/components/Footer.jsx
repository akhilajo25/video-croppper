import React from "react";
import styled from "styled-components";

const Button = styled.button`
    padding: 10px 20px;
    border-radius: 8px;
    background-color: #6b5be5;
    color: #fffcfc;
    border: none;
`;

const Container = styled.div`
    border-top: 1px solid #444;
    padding: 20px 10px;
    display: flex;
    gap: 10px;
`;

const Footer = ({ setIsCropping, currentTime, cropperPosition, volume, playbackRate }) => {
    return (
        <Container>
            <Button onClick={() => setIsCropping(true)}>{"Start Cropper"}</Button>
            <Button onClick={() => setIsCropping(false)}>{"Remove Cropper"}</Button>
            <Button onClick={() => {
                const recordedData = {
                    timestamps: [{
                        time: currentTime,
                        cropperPosition: { ...cropperPosition },
                        volume,
                        playbackRate,
                        timestamp: new Date().toISOString()
                    }]
                };
                const dataStr = JSON.stringify(recordedData, null, 2);
                const blob = new Blob([dataStr], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = 'cropper-data.json';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
            }}>{"Generate Preview"}</Button>
        </Container>
    )
};

export default Footer;