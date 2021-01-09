const youtubedl = require("youtube-dl");
const fs = require("fs");
const prettyBytes = require("pretty-bytes");
var figlet = require("figlet");

const ytVideos = [
  { i: 1, url: "https://www.youtube.com/watch?v=EngW7tLk6R8" },
  { i: 2, url: "https://www.youtube.com/watch?v=HjxYvcdpVnU" },
  // { i: 3, url: "https://www.youtube.com/watch?v=EngW7tLk6R8" },
  // { i: 4, url: "https://www.youtube.com/watch?v=EngW7tLk6R8" },
  // { i: 5, url: "https://www.youtube.com/watch?v=EngW7tLk6R8" },
  // { i: 6, url: "https://www.youtube.com/watch?v=EngW7tLk6R8" },
  // { i: 7, url: "https://www.youtube.com/watch?v=EngW7tLk6R8" },
  // { i: 8, url: "https://www.youtube.com/watch?v=EngW7tLk6R8" },
  // { i: 9, url: "https://www.youtube.com/watch?v=EngW7tLk6R8" },
  // { i: 10, url: "https://www.youtube.com/watch?v=EngW7tLk6R8" },
];

figlet("yt-Download!!", function (err, data) {
  if (err) {
    console.log("yt-Download!");
  }
  console.log(data);
  console.log("---- By Mickfrost");
  console.log("=================");
});

const download = (ytVideo) =>
  new Promise((res) => {
    let output = ytVideo.i ? ytVideo.i.toString() + ".mp4" : "myvideo.mp4";
    let output_modified = null;

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
      output_modified = info._filename;
      console.log("size: " + prettyBytes(info.size));
    });

    video.pipe(fs.createWriteStream(output, { flags: "a" }));

    // Will be called if download was already completed and there is nothing more to download.
    video.on("complete", function complete(info) {
      "use strict";
      console.log("filename: " + info._filename + " already downloaded.");
    });

    video.on("end", function () {
      res({ i: ytVideo.i, output, output_modified });
    });
  });

const dlPromise = (video) =>
  download(video).then(({ i, output, output_modified }) => {
    console.log("finished downloading: ", i);
    try {
      if (!fs.existsSync(output_modified)) {
        fs.rename(output, output_modified, () => {
          console.log(i, "Renamed with Youtube Title");
          console.log("--------------------------------------------------");
        });
      } else {
        console.log(i, "Unable to rename");
        console.log("--------------------------------------------------");
      }
    } catch (err) {
      console.error(err);
    }
  });

ytVideos.reduce((p, x) => p.then((_) => dlPromise(x)), Promise.resolve());
