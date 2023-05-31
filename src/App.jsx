// Import dependencies
import React, { useRef, useState, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
// 1. TODO - Import required model here
import * as cocossd from "@tensorflow-models/coco-ssd";
import Webcam from "react-webcam";
import "./App.css";
// import dotenv from "dotenv";
// 2. TODO - Import drawing utility here
import { drawRect } from "./utils.js";
import NotificationSound from "./notify.mp3";
import { Navbar } from "./components/navbar";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from "react-toastify";
import CaptureAndDetect from "./page/capture";
// dotenv.config();

export default function App() {
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
    highDensity: ()=> toast.error("Density is high", {
      containerId: 'A'
    }),
    lowDensity : ()=> toast.warn("Density is low"), 
    SecIncrement10 : ()=> toast.info("Apply signal rotation of 10 sec", {
      containerId: 'B'
    }),
    SecIncrement20 : ()=> toast.info("Apply signal rotation of 20 sec", {
      containerId: 'B'
    }),
    SecIncrement30 : ()=> toast.info("Apply signal rotation of 30 sec", {
      containerId: 'B'
    }),
    manualController : ()=> toast.info("shift to manual signal transitions", {
      containerId: 'B'
    }),
  }

  const runCoco = async () => {
    const net = await cocossd.load();
    
    setInterval(() => {
      detect(net);
    }, 1000);
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
      if(counter > 4){
        notify.highDensity();
        playAudio();
        if(counter < 5){
        notify.SecIncrement30();
      }
      else if(count > 5 && count < 8){
        notify.SecIncrement20();
      }
      else if (count > 8 && count < 10){
        notify.SecIncrement10();
      }
      else if (count > 10){
        notify.manualController();
      }
    }

  }
};
  
  console.log(count);
  useEffect(()=>{runCoco()},[]);
  
  return (
    <div className="App">
      <Navbar/>
      <div className="w-full flex flex-col">
      <div className="w-full">
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
       
      <div className=""> 
        <h1 className="text-2xl text-center bg-blue-600 text-white rounded-xl p-2" style={{
          position: "absolute",
          marginLeft: "auto",
          marginRight: "auto",
          left: 0,
          right: 0,
          textAlign: "center",
          zindex: 9,
          marginTop: "30rem",
          width: "25%",
        }}>Total Count : {count}</h1>
      </div>
      </div>
      <audio ref={audioRef} src={NotificationSound} />
      <ToastContainer theme="dark" position="bottom-center" limit={1} containerId={'A'} enableMultiContainer/>
      <ToastContainer theme="dark" position="top-right" limit={1} containerId={'B'} enableMultiContainer />

    </div>
    // <div className="App">
    //   <CaptureAndDetect/>
    // </div>
  );

}