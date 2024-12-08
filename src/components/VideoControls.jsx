import React from "react";
import styled from "styled-components";
import '../App.css'

const Select = styled.select`
    margin-left: 2px;
    background-color: transparent;
    color: #c2c0c0;
    border: none;
    padding-right: 0px;
`;

const SelectDiv = styled.div`
    display: flex;
    align-items: center;
    border: 1px solid #45474E;
    border-radius: 5px;
    padding: 5px;
`;
const VideoControls = ({ videoRef, setAspectRatio, setCropperPosition, aspectRatio, setPlaybackRate, playbackRate }) => {
    const handleAspectRatioChange = (e) => {
        const newAspectRatio = e.target.value;
        const videoHeight = videoRef.current.clientHeight;
        const videoWidth = videoRef.current.clientWidth;
        setAspectRatio(newAspectRatio);
        const [widthRatio, heightRatio] = newAspectRatio.split(":").map(Number);
        let newWidth = (videoHeight * widthRatio) / heightRatio;

        // Ensure the new width doesn't exceed video width
        newWidth = Math.min(newWidth, videoWidth);

        // Calculate the maximum allowed left position
        const maxLeft = videoWidth - newWidth;

        setCropperPosition((prev) => ({
            ...prev,
            width: newWidth,
            // Ensure left position doesn't push cropper outside video
            left: Math.min(prev.left, maxLeft)
        }));
    };

    const changePlaybackRate = (e) => {
        const newRate = e.target.value;
        videoRef.current.playbackRate = newRate;
        setPlaybackRate(newRate);
    };

    return (<div style={{ display: 'flex', justifyContent: 'start', gap: '10px', marginTop: '10px' }}>
        <SelectDiv>
            <label htmlFor="aspectRatio">Aspect Ratio</label>
            <Select
                id="aspectRatio"
                value={aspectRatio}
                onChange={handleAspectRatioChange}
                className="dropdown-class"
            >
                <option value="9:18">9:18</option>
                <option value="9:16">9:16</option>
                <option value="4:3">4:3</option>
                <option value="3:4">3:4</option>
                <option value="1:1">1:1</option>
                <option value="4:5">4:5</option>
            </Select>
        </SelectDiv>
        <SelectDiv>
            <label htmlFor="playbackRate">Playback Speed</label>
            <Select
                id="playbackRate"
                value={playbackRate}
                onChange={changePlaybackRate}
                className="dropdown-class"
            >
                <option value="0.5">0.5x</option>
                <option value="1">1x</option>
                <option value="1.5">1.5x</option>
                <option value="2">2x</option>
            </Select>
        </SelectDiv>
    </div>)
};

export default VideoControls;
