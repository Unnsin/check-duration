const fs = require('fs')
const ffprobe = require('ffprobe');
const ffprobeStatic = require('ffprobe-static');

function getDuration() {
    let loading = (function() {
        var h = ['|', '/', '-', '\\'];
        var i = 0;

        return setInterval(() => {
          i = (i > 3) ? 0 : i;
          console.clear();
          console.log(h[i] + ' loading...');
          i++;
        }, 300);
      })();

    const musicPath = process.argv[2] || './' 

    const fileNames = fs.readdirSync(musicPath, (err, files) => {
        return files
    })

    const duration = fileNames.map(fileName => {
        return new Promise((resolve, reject) => {
            ffprobe(musicPath + fileName,{ path: ffprobeStatic.path }, (err, info) => {
                if(err) reject()

                let duration = info && info.streams[0].duration
                resolve(duration)
            })
        })
    })

    Promise.all(duration).then(res => {
        let result = res.reduce((accum, item) => {
            return accum + Number(item)
        }, 0)
        let zero = '0'
        let time = new Date(0, 0, 0, 0, 0, result)

        hh = time.getHours();
        mm = time.getMinutes();
        ss = time.getSeconds() 
    
        // Pad zero values to 00
        hh = (zero+hh).slice(-2);
        mm = (zero+mm).slice(-2);
        ss = (zero+ss).slice(-2);
        clearInterval(loading)
        time = hh + ':' + mm + ':' + ss;
        console.log("Duration: " + time)
    })
    .catch(err => console.log('No such file for count duration'))
}

exports.getDuration = getDuration