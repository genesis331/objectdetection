import React, {useEffect, useState} from 'react';
import './App.css';
import { Button, Modal, Text } from '@zeit-ui/react';
import zixuLogo from './assets/zixuLogo.svg';
import githubBtnIcon from './assets/githubBtnIcon.svg';
const cocoSsd = require('@tensorflow-models/coco-ssd');

function App() {
    const [modalState, setModalState] = useState(false);
    const handler = () => setModalState(true);
    const closeHandler = (event) => {
        setModalState(false)
    };
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
            ctx.fillRect(x, y, textWidth + 10, textHeight + 10);
            ctx.fillRect(x, y + height - textHeight, textWidth + 15, textHeight + 10);

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
        <div className="content">
            <Modal open={modalState} onClose={closeHandler}>
                <Modal.Title>Warning</Modal.Title>
                <Modal.Content>
                    <p>You'll be redirected to GitHub.</p>
                </Modal.Content>
                <Modal.Action passive>Cancel</Modal.Action>
                <Modal.Action onClick={() => {window.location.href = 'https://github.com/genesis331/objectdetection';}}>OK</Modal.Action>
            </Modal>
            <section className="header">
                <div className="header-grid">
                    <div style={{'textAlign': 'left','height': '100%'}}>
                        <div className="header-contents">
                            <img src={zixuLogo} alt="zixuLogo" draggable={false} style={{'height': '2.8rem','verticalAlign': 'middle','marginRight': '2rem'}}/>
                            <div style={{'display': 'inline-block','verticalAlign': 'middle'}}>
                                <Text h4 style={{'fontFamily': 'Volte Bold', 'margin': '0'}}>AI Experiments</Text>
                                <Text h5 style={{'margin': '0'}}>TFJS Experiment - Object Detection</Text>
                            </div>
                        </div>
                    </div>
                    <div style={{'textAlign': 'right','height': '100%'}}>
                        <div className="header-contents">
                            <Button auto onClick={handler}><img src={githubBtnIcon} alt="moon" style={{'height': '1rem','verticalAlign': 'middle','paddingRight': '0.5rem'}}/><span style={{'verticalAlign': 'middle'}}> See Page Source Code</span></Button>
                        </div>
                    </div>
                </div>
            </section>
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
            <section className="footer">
                <div className="footer-grid">
                    <div style={{'textAlign': 'left','height': '100%'}}>
                        <div className="footer-contents">
                            <Text h6>

                            </Text>
                        </div>
                    </div>
                    <div style={{'textAlign': 'right','height': '100%'}}>
                        <div className="footer-contents">

                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default App;