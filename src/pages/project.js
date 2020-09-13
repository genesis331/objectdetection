import React, { useEffect } from 'react';
import './project.css';
const cocoSsd = require('@tensorflow-models/coco-ssd');

function Project() {
    const videoRef = React.createRef();
    const canvasRef = React.createRef();

    function showDetections( predictions ) {
        const ctx = canvasRef.current.getContext("2d");
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        const font = "24px helvetica";
        ctx.font = font;
        ctx.textBaseline = "top";

        predictions.forEach(prediction => {
            const x = prediction.bbox[0];
            const y = prediction.bbox[1];
            const width = prediction.bbox[2];
            const height = prediction.bbox[3];
            ctx.strokeStyle = "#2fff00";
            ctx.lineWidth = 1;
            ctx.strokeRect(x, y, width, height);
            ctx.fillStyle = "#2fff00";
            const textWidth = ctx.measureText(prediction.class).width;
            const textHeight = parseInt(font, 10);
            ctx.fillRect(x, y, textWidth, textHeight);
            ctx.fillRect(x, y + height - textHeight, textWidth, textHeight);

            ctx.fillStyle = "#000000";
            ctx.fillText(prediction.class, x, y);
            ctx.fillText(prediction.score.toFixed(2), x, y + height - textHeight);
        });
    }

    function detectFromVideoFrame(model, video) {
        model.detect(video).then(predictions => {
            showDetections(predictions);
            requestAnimationFrame(() => {
                detectFromVideoFrame(model, video);
            });
        }, (error) => {
            console.log("Couldn't start the webcam.");
            console.error(error);
        });
    }

    useEffect(() => {
        if (navigator.mediaDevices.getUserMedia) {
            const webcamPromise = navigator.mediaDevices
                .getUserMedia({
                    video: true,
                    audio: false,
                })
                .then(stream => {
                    window.stream = stream;
                    videoRef.current.srcObject = stream;

                    return new Promise(resolve => {
                        videoRef.current.onloadedmetadata = () => {
                            resolve();
                        };
                    });
                }, (error) => {
                    console.log("Couldn't start the webcam");
                    console.error(error);
                });

            const loadModelPromise = cocoSsd.load();

            Promise.all([loadModelPromise, webcamPromise])
                .then(values => {
                    detectFromVideoFrame(values[0], videoRef.current);
                })
                .catch(error => {
                    console.error(error);
                });
        }
    });

    return (
        <section className="video-canvas">
            <div className="video-canvas-box">
                <video
                    autoPlay
                    muted
                    ref={videoRef}
                    width="720"
                    height="500"
                />
            </div>
            <div className="video-canvas-box">
                <canvas ref={canvasRef} width="720" height="500" />
            </div>
        </section>
    );
}

export default Project;