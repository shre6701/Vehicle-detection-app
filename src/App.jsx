// Import dependencies
import React, { useRef, useState, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
// 1. TODO - Import required model here
import * as cocossd from "@tensorflow-models/coco-ssd";
import Webcam from "react-webcam";
import "./App.css";
// 2. TODO - Import drawing utility here
import { drawRect } from "./utils.js";
import NotificationSound from "./notify.mp3";
import { Navbar } from "./components/navbar";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from "react-toastify";
import CaptureAndDetect from "./page/capture";

function App() {
  const [count , setCount] = useState(0);
  const [width, setWidth] = useState(640);
  const [height, setHeight] = useState(480);
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const audioRef = useRef(null);
  function playAudio() {
    audioRef.current.play();
  }
  
  const notify =  {
    highDensity: ()=> toast.error("Density is high"),
    lowDensity : ()=> toast.warn("Density is low")
  }

  const runCoco = async () => {
    const net = await cocossd.load();
    
    setInterval(() => {
      detect(net);
    }, 10000);
  };

 
  const detect = async (net) => {
    // Check data is available
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      // Get Video Properties
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      // Set video width
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      // Set canvas height and width
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      // 4. TODO - Make Detections
      const obj = await net.detect(video);
      // console.log(obj);

      // Draw mesh
      const ctx = canvasRef.current.getContext("2d");

      // 5. TODO - Update drawing utility
      const counter = drawRect(obj, ctx);
      setCount(counter);
      if(counter > 1){
        notify.highDensity();
        playAudio();
      }
    }

  };
  
  console.log(count);
  useEffect(()=>{runCoco()},[]);
  
  return (
    <div className="App">
      <Navbar/>
      <div className="w-full h-full">

        <Webcam
          ref={webcamRef}
          muted={true} 
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 9,
            width: 360,
            height: 480,
          }}
        />

        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 8,
            width: 300,
            height: 480,
          }}
        />
      </div>
      <audio ref={audioRef} src={NotificationSound} />
      <ToastContainer theme="dark" position="bottom-center" limit={1}/>
    </div>
    // <div className="App">
    //   <CaptureAndDetect/>
    // </div>
  );
}

export default App;
