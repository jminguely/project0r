let processor = {
  timerCallback: function () {
    if (this.video.paused || this.video.ended) {
      return;
    }
    this.computeFrame();
    let self = this;
    setTimeout(function () {
      self.timerCallback();
    }, 0);
  },

  doLoad: function () {
    this.video = document.getElementById("video");
    this.image = document.getElementById("image");
    this.c1 = document.getElementById("c1");
    this.ctx1 = this.c1.getContext("2d");
    this.c2 = document.getElementById("c2");
    this.ctx2 = this.c2.getContext("2d");
    this.c3 = document.getElementById("c3");
    this.ctx3 = this.c3.getContext("2d");
    let self = this;
    this.video.addEventListener(
      "play",
      function () {
        self.width = self.video.videoWidth;
        self.height = self.video.videoHeight;
        self.timerCallback();
      },
      false
    );
  },

  computeFrame: function () {
    this.ctx1.drawImage(this.video, 0, 0, this.width, this.height);
    this.ctx2.drawImage(this.image, 0, 0, this.width, this.height);

    let frame = this.ctx1.getImageData(0, 0, this.width, this.height);
    let frameImage = this.ctx2.getImageData(0, 0, this.width, this.height);

    let l = frame.data.length / 4;

    let zb = 960;
    let zf = 480;

    this.ctx3.putImageData(frameImage, 0, 0);

    for (let i = 0; i < l; i++) {
      let r = frame.data[i * 4 + 0];
      let g = frame.data[i * 4 + 1];
      let b = frame.data[i * 4 + 2];
      let lum = (g + r + b) / 3;

      if (lum>10) {

        let x = i - y * frame.width;
        let y = parseInt(i / frame.width, 10);

        let x_opposite = x - (frame.width / 2);
        let x_alpha = Math.atan(x_opposite / (zf+lum));
        let x_proj = Math.floor(Math.tan(x_alpha) * zb) + (frame.width / 2);

        let y_opposite = y - (frame.height / 2);
        let y_alpha = Math.atan(y_opposite / (zf + lum));
        let y_proj = Math.floor(Math.tan(y_alpha) * zb) + (frame.height / 2);

        let n = y_proj * frame.width + x_proj;

        frame.data[i * 4 + 0] = frameImage.data[n * 4 + 0];
        frame.data[i * 4 + 1] = frameImage.data[n * 4 + 1];
        frame.data[i * 4 + 2] = frameImage.data[n * 4 + 2];
        // frame.data[i * 4 + 3] = (g + r + b) / 3;
      }else {
        frame.data[i * 4 + 0] = frameImage.data[i * 4 + 0];
        frame.data[i * 4 + 1] = frameImage.data[i * 4 + 1];
        frame.data[i * 4 + 2] = frameImage.data[i * 4 + 2];
      }

    }
    this.ctx3.putImageData(frame, 0, 0);
    return;
  },
};

document.addEventListener("DOMContentLoaded", () => {
  processor.doLoad();
});
