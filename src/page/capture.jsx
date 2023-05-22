import React, { useEffect, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs';

const CaptureAndDetect = () => {
  const webcamRef = useRef(null);
  const [vehicleCount, setVehicleCount] = useState(0);

  useEffect(() => {
    const captureAndDetect = async () => {
      // Load the YOLO model
      const model = await tf.loadGraphModel('/path/to/yolo/model/model.json');

      setInterval(async () => {
        const webcam = webcamRef.current;
        const image = tf.browser.fromPixels(webcam.video);

        // Resize image to match YOLO input size
        const resizedImage = tf.image.resizeBilinear(image, [416, 416]);
        const expandedImage = resizedImage.expandDims();

        // Normalize image
        const normalizedImage = expandedImage.toFloat().div(tf.scalar(255));

        // Make predictions
        const predictions = await model.predict(normalizedImage).array();

        // Filter vehicle predictions
        const vehiclePredictions = predictions.filter(
          (prediction) =>
            prediction.class === 'car' || prediction.class === 'truck'
        );

        setVehicleCount(vehiclePredictions.length);

        // Clean up tensors
        image.dispose();
        resizedImage.dispose();
        expandedImage.dispose();
        normalizedImage.dispose();
      }, 30000); // Capture image every 30 seconds
    };

    captureAndDetect();
  }, []);

  return (
    <div>
      <Webcam ref={webcamRef} screenshotFormat="image/jpeg" />
      <p>Vehicle Count: {vehicleCount}</p>
    </div>
  );
};

export default CaptureAndDetect;