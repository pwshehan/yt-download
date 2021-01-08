const youtubedl = require("youtube-dl");
const fs = require("fs");

// function downloadVideo(url, save) {

// }

// downloadVideo("https://www.youtube.com/watch?v=EngW7tLk6R8", "123.mp4");

const ytVideos = [
  { i: 1, url: "https://www.youtube.com/watch?v=EngW7tLk6R8" },
  // { i: 2, url: "https://www.youtube.com/watch?v=EngW7tLk6R8" },
  // { i: 3, url: "https://www.youtube.com/watch?v=EngW7tLk6R8" },
  // { i: 4, url: "https://www.youtube.com/watch?v=EngW7tLk6R8" },
  // { i: 5, url: "https://www.youtube.com/watch?v=EngW7tLk6R8" },
  // { i: 6, url: "https://www.youtube.com/watch?v=EngW7tLk6R8" },
  // { i: 7, url: "https://www.youtube.com/watch?v=EngW7tLk6R8" },
  // { i: 8, url: "https://www.youtube.com/watch?v=EngW7tLk6R8" },
  // { i: 9, url: "https://www.youtube.com/watch?v=EngW7tLk6R8" },
  // { i: 10, url: "https://www.youtube.com/watch?v=EngW7tLk6R8" },
];

const download = (ytVideo) =>
  new Promise((res) => {
    let output = ytVideo.i ? ytVideo.i.toString() + ".mp4" : "myvideo.mp4";

    const video = youtubedl(
      ytVideo.url,

      // Optional arguments passed to youtube-dl.
      ["--format=22"],

      // start will be sent as a range header
      { start: 0, cwd: __dirname }
    );

    // Will be called when the download starts.
    video.on("info", function (info) {
      console.log("Download started");
      console.log("filename: " + info._filename);

      // info.size will be the amount to download, add
      let total = info.size;
      console.log("size: " + total);
    });

    video.pipe(fs.createWriteStream(output, { flags: "a" }));

    // Will be called if download was already completed and there is nothing more to download.
    video.on("complete", function complete(info) {
      "use strict";
      console.log("filename: " + info._filename + " already downloaded.");
    });

    video.on("end", function () {
      res(ytVideo.i);
    });
  });

const dlPromise = (video) =>
  download(video).then((result) => {
    console.log("finished downloading: ", result);
  });

ytVideos.reduce((p, x) => p.then((_) => dlPromise(x)), Promise.resolve());
