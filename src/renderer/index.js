const KinectAzure = require('kinect-azure');
const kinect = new KinectAzure();

const $outputCanvas = document.createElement('canvas'),
  outputCtx = $outputCanvas.getContext('2d');

document.body.appendChild($outputCanvas);
let outputImageData, depthModeRange;

const init = () => {
  startKinect();
  animate();
};

const startKinect = () => {
  if(kinect.open()) {

    kinect.startCameras({
      depth_mode: KinectAzure.K4A_DEPTH_MODE_NFOV_UNBINNED,
      color_format: KinectAzure.K4A_IMAGE_FORMAT_COLOR_BGRA32,
      color_resolution: KinectAzure.K4A_COLOR_RESOLUTION_720P,
    });
    depthModeRange = kinect.getDepthModeRange(KinectAzure.K4A_DEPTH_MODE_NFOV_UNBINNED);
    kinect.createTracker({
      processing_mode: KinectAzure.K4ABT_TRACKER_PROCESSING_MODE_GPU_CUDA
    });

    kinect.startListening((data) => {
      if (!outputImageData && data.colorImageFrame.width > 0) {
        $outputCanvas.width = data.colorImageFrame.width;
        $outputCanvas.height = data.colorImageFrame.height;
        outputImageData = outputCtx.createImageData($outputCanvas.width, $outputCanvas.height);
      }
      if (outputImageData) {
        renderBGRA32ColorFrame(outputCtx, outputImageData, data.colorImageFrame);
      }
      if (data.bodyFrame.bodies) {
        // render the skeleton joints on top of the depth feed
        outputCtx.save();
        data.bodyFrame.bodies.forEach(body => {
          outputCtx.fillStyle = 'red';
          body.skeleton.joints.forEach(joint => {
            outputCtx.fillRect(joint.colorX, joint.colorY, 10, 10);
          });
          // draw the pelvis as a green square
          const pelvis = body.skeleton.joints[KinectAzure.K4ABT_JOINT_PELVIS];
          outputCtx.fillStyle = 'green';
          outputCtx.fillRect(pelvis.colorX, pelvis.colorY, 10, 10);
        });
        outputCtx.restore();
      }
    });
  }
};

const renderBGRA32ColorFrame = (ctx, canvasImageData, imageFrame) => {
  const newPixelData = Buffer.from(imageFrame.imageData);
  const pixelArray = canvasImageData.data;
  for (let i = 0; i < canvasImageData.data.length; i+=4) {
    pixelArray[i] = newPixelData[i+2];
    pixelArray[i+1] = newPixelData[i+1];
    pixelArray[i+2] = newPixelData[i];
    pixelArray[i+3] = 0xff;
  }
  ctx.putImageData(canvasImageData, 0, 0);
};

const animate = () => {
  requestAnimationFrame( animate );
}

init();