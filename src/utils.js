export const drawRect = (detections, ctx) => {
    let count =0;
    detections.forEach(prediction => {
        const [x, y, width, height] = prediction['bbox'];
        // console.log(prediction['bbox']);
        const text = prediction['class'];
        // if(text === 'car' | text === 'motorcylce' | text === 'bus' | text === 'truck'){
        //     count++;
        //     // console.log('vehicle detected');
        // }
        // if(text=== 'person'){
        //     count++;
        //     console.log('person detected');
        // }
        count++;
        const color = 'red';
        ctx.strokeStyle = color;
        ctx.font = '18px Arial';
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.fillText(text, x, y);
        ctx.rect(x, y, 300, 300);
        ctx.stroke();
        
    });
    return count;
}