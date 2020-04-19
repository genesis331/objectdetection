import React, { useState } from 'react';
import './App.css';
import { Button, Modal, Text } from '@zeit-ui/react';
import zixuLogo from './assets/zixuLogo.svg';
import githubBtnIcon from './assets/githubBtnIcon.svg';

function App() {
    const [modalState, setModalState] = useState(false);
    const handler = () => setModalState(true);
    const closeHandler = (event) => {
        setModalState(false)
    };
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
            <section className="footer">
                <div className="footer-grid">
                    <div style={{'textAlign': 'left','height': '100%'}}>
                        <div className="footer-contents">
                            <Text h6></Text>
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