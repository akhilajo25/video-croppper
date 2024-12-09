import React, { useRef, useState, useEffect } from "react";
import CroppedPreview from "./CroppedPreview";
import Footer from "./Footer";
import Header from "./header";
import Pause from "../SVGComponents/Pause";
import Play from "../SVGComponents/Play";
import Speaker from "../SVGComponents/Speaker";
import VideoControls from "./VideoControls";

const VideoCropperUI = () => {
    const videoRef = useRef(null);
    const cropperRef = useRef(null);
    const previewCanvasRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [playbackRate, setPlaybackRate] = useState(1);
    const [isCropping, setIsCropping] = useState(false);
    const [aspectRatio, setAspectRatio] = useState("");
    const [cropperPosition, setCropperPosition] = useState({ top: 0, left: 50, width: 200, height: 0 });
    const [coordinateRecords, setCoordinateRecords] = useState([]);
    const [activeTab, setActiveTab] = useState("preview");

    useEffect(() => {
        if (videoRef.current) {
            const videoHeight = videoRef.current.clientHeight;
            const videoWidth = videoRef.current.clientWidth;

            setCropperPosition((prev) => ({
                ...prev,
                top: 0,
                left: Math.min(prev.left, videoWidth - prev.width),
                width: Math.min(prev.width, videoWidth),
                height: videoHeight,
            }));
        }
    }, [videoRef.current?.clientHeight, videoRef.current?.clientWidth]);

    useEffect(() => {
        if (duration === currentTime) {
            setIsPlaying(false);
        }
    }, [duration, currentTime]);

    const handleMetadataLoaded = () => {
        setDuration(videoRef.current.duration);
    };

    const handleTimeUpdate = () => {
        setCurrentTime(videoRef.current.currentTime);
        updatePreview();
    };

    const formatTime = (time) => {
        const hours = Math.floor(time / 3600);
        const minutes = Math.floor((time % 3600) / 60);
        const seconds = Math.floor(time % 60);
        return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    };

    const togglePlayPause = () => {
        const video = videoRef.current;
        if (isPlaying) {
            video.pause();
        } else {
            video.play();
        }
        setIsPlaying(!isPlaying);
    };

    const handleSeek = (e) => {
        const video = videoRef.current;
        video.currentTime = e.target.value;
        setCurrentTime(video.currentTime);
    };


    const changeVolume = (e) => {
        const newVolume = e.target.value;
        videoRef.current.volume = newVolume;
        setVolume(newVolume);
    };

    const updatePreview = () => {
        if (!isCropping || activeTab !== 'preview') return;

        const canvas = previewCanvasRef.current;
        const ctx = canvas.getContext("2d");
        const video = videoRef.current;

        const videoRect = video.getBoundingClientRect();
        const { top, left, width, height } = cropperPosition;

        const sx = (left / videoRect.width) * video.videoWidth;
        const sy = (top / videoRect.height) * video.videoHeight;
        const sWidth = (width / videoRect.width) * video.videoWidth;
        const sHeight = (height / videoRect.height) * video.videoHeight;

        canvas.width = width;
        canvas.height = height;

        const drawFrame = () => {
            ctx.drawImage(video, sx, sy, sWidth, sHeight, 0, 0, width, height);
            if (isCropping && activeTab === 'preview') {
                requestAnimationFrame(drawFrame);
            }
        };

        drawFrame();
    };

    const handleCropperMove = (e) => {
        e.stopPropagation();
        const startX = e.clientX;
        const videoRect = videoRef.current.getBoundingClientRect();
        // initialise animationFrameId
        let animationFrameId = null;

        const moveHandler = (moveEvent) => {
            const deltaX = moveEvent.clientX - startX;
            if (animationFrameId) {
                // before setting new animationFrameId, cancel the previous one prevents memory leaks
                cancelAnimationFrame(animationFrameId);
            }
            // set new animationFrameId, requestAnimationFrame is a method that requests the browser to call a function to update an animation before the next repaint
            animationFrameId = requestAnimationFrame(() => {
                setCropperPosition((prev) => {
                    const newLeft = Math.max(0, Math.min(prev.left + deltaX, videoRect.width - prev.width));
                    return { ...prev, left: newLeft };
                });
            });
        };

        const upHandler = () => {
            const record = {
                timestamp: new Date().getTime(),
                videoTimeElapsed: videoRef.current.currentTime,
                cropperPosition: cropperPosition,
                volume: volume,
                playbackRate: playbackRate
            };

            setCoordinateRecords(prevRecords => [...prevRecords, record]);
            document.removeEventListener("mousemove", moveHandler);
            document.removeEventListener("mouseup", upHandler);
        };

        document.addEventListener("mousemove", moveHandler);
        document.addEventListener("mouseup", upHandler);
    };



    return (
        <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", flexDirection: "column", padding: "20px", color: "#fff", borderRadius: "8px" }}>
                <Header setActiveTab={setActiveTab} activeTab={activeTab} />
                {/* Video and Cropper Section */}
                <div style={{ display: "flex" }}>
                    <div style={{ flex: 1, marginRight: "20px", position: "relative" }}>
                        <div style={{ position: "relative" }}>
                            <video
                                ref={videoRef}
                                style={{ width: "100%", borderRadius: "8px" }}
                                src="video.mp4"
                                controls={false}
                                onLoadedMetadata={handleMetadataLoaded}
                                onTimeUpdate={handleTimeUpdate}
                            ></video>

                            {isCropping && (
                                <div
                                    ref={cropperRef}
                                    style={{
                                        position: "absolute",
                                        top: cropperPosition.top,
                                        left: cropperPosition.left,
                                        width: cropperPosition.width,
                                        height: cropperPosition.height,
                                        border: "2px #fff",
                                        cursor: "grab",
                                        display: "grid",
                                        gridTemplateColumns: "repeat(3, 1fr)",
                                        gridTemplateRows: "repeat(3, 1fr)",
                                        backgroundColor: "transparent",
                                        // opacity: "0.1"
                                    }}
                                    onMouseDown={handleCropperMove}
                                >
                                    {[...Array(9)].map((_, index) => (
                                        <div
                                            key={index}
                                            style={{
                                                border: "1px solid rgba(255, 255, 255, 0.3)",
                                                width: "100%",
                                                height: "100%",
                                                backgroundColor: "rgba(235, 238, 241, 0.2)"
                                            }}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                        <div>
                            <div style={{ marginTop: "10px", display: "flex", alignItems: "center", marginBottom: "10px" }}>
                                <span onClick={togglePlayPause}>{isPlaying ? <Pause /> : <Play />}</span>
                                <input
                                    type="range"
                                    min="0"
                                    max={duration}
                                    value={currentTime}
                                    onChange={handleSeek}
                                    style={{ flex: 1, marginLeft: "10px", accentColor: "#fff", height: '5px', appearance: 'none', borderRadius: '2px', backgroundColor: '#b3aeae' }}
                                />
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <span>
                                    {formatTime(currentTime)} | {formatTime(duration)}
                                </span>
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "end" }}>
                                    <label htmlFor="volumeControl"><Speaker /></label>
                                    <input
                                        id="volumeControl"
                                        type="range"
                                        min="0"
                                        max="1"
                                        step="0.5"
                                        value={volume}
                                        onChange={changeVolume}
                                        //appearance: 'none' is used to remove the default styling of the input range
                                        style={{
                                            marginLeft: "10px",
                                            width: "50%", accentColor: "#fff",
                                            height: '3px', appearance: 'none', borderRadius: '2px', backgroundColor: '#b3aeae'
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                        <VideoControls
                            videoRef={videoRef}
                            setAspectRatio={setAspectRatio}
                            setCropperPosition={setCropperPosition}
                            aspectRatio={aspectRatio}
                            setPlaybackRate={setPlaybackRate}
                            playbackRate={playbackRate}
                        />
                    </div>
                    {activeTab === 'preview' && <CroppedPreview
                        previewCanvasRef={previewCanvasRef}
                        isCropping={isCropping}
                    />}
                    {activeTab === 'generate' &&
                        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
                            <h5>Generate Session</h5>
                            <p>This section is under development, please come back later!</p>
                        </div>
                    }
                </div>
            </div>
            <Footer
                setIsCropping={setIsCropping}
                coordinateRecords={coordinateRecords}
            />
        </div>
    );
};

export default VideoCropperUI;
