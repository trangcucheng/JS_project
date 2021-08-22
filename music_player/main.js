/**
 Các sự kiện cần phải xử lý:
 1. Render songs => ok
 2. Scroll top => ok
 3. Play /pause/ seek
 4. CD rotate
 5. Next / prev
 6. Random
 7. Next/ Repeat when end
 8. Active song
 9. Schroll active song into view
 10. Play song when click
 */

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);


const btnPlay = $('.btn-toggle');
const audio = $('audio');
const nextBtn =  $('.btn-next');
const prevBtn =  $('.btn-prev');
const random = $('.btn-shuffle');
const repeat = $('.btn-repeat');

// tìm chỉ số index random

const app = {
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    currentIndex: 0,
    randomIndex: function(){
        do{
            var index = Math.floor(Math.random()*8);
        }
        while (index=== app.currentIndex);
        return index;
    },
    songs: [
        {
            id: 0,
            name: "Mạc vấn quy kỳ", 
            singers: "Thị Thất Thúc Ni",
            path: 'music/song1.mp3',
            image: 'img/img3.jpg'
        },
        {
            id: 1,
            name: "Nữ Nhi Tình", 
            singers: "Lý Ngọc Cương",
            path: 'music/song2.mp3',
            image: 'img/img4.jpg'
        },
        {
            id: 2,
            name: "Quảng Hàn Cung", 
            singers: "Hoàn Tử U",
            path: 'music/song3.mp3',
            image: 'img/img4.jpg'
        },
        {
            id: 3,
            name: "Xích Linh", 
            singers: "Lý Ngọc Cương",
            path: 'music/song4.mp3',
            image: 'img/img5.jpg'
        },
        {
            id: 4,
            name: "Phi điểu và ve sầu", 
            singers: "Nhậm Nhiên",
            path: 'music/song5.mp3',
            image: 'img/img6.jpg'
        },
        {
            id: 5,
            name: "Có chút ngọt ngào", 
            singers: "Uông Tô Lang",
            path: 'music/song6.mp3',
            image: 'img/img7.jpg'
        },
        {
            id: 6,
            name: "Best Luck", 
            singers: "Chen(EXO-M)",
            path: 'music/song8.mp3',
            image: 'img/img9.jpg'
        },
        {
            id: 7,
            name: "Say Yes", 
            singers: "Loco, Punch",
            path: 'music/song7.mp3',
            image: 'img/img10.jpg'
        }
    ],
    // them thuoc tinh currentSong cho app
    defineProperty: function() {
        Object.defineProperty(this, 'currentSong',{
            get: function(){
                return this.songs[this.currentIndex];
            }
        })
    },

    loadCurrentSong: function() {
        $('.dashboard h3').innerText = `${this.currentSong.name}`;
        $('.cd .img').style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;
        if ($(".song.playing")!==null)  $(".song.playing").classList.remove("playing");
        document.getElementById(`${app.currentIndex}`).classList.add("playing");
        // xử lí kéo lên
        $(".song.playing").scrollIntoView(true);
    },

    render: function(){
        const htmls = this.songs.map(song => {
            return `
                <div class="song" style= "cursor: pointer;" id = "${song.id}">
                    <div class="image" style = "background-image: url('${song.image}');">
                    </div>
                    <div class="info">
                        <h3>${song.name}</h3>
                        <p>${song.singers}</p>
                    </div>
                    <div class="opts">
                        <i class="ti-more"></i>
                    </div>
                </div>
            `
        });

        $('.playList').innerHTML = htmls.join('\n');
    },

    handleEvents: function() {

        // cuộn playlist
        const cdWidth = $('.cd').offsetWidth; // ban dau
        document.onscroll = function() {
            // console.log(window.scrollY);
            // console.log(document.documentElement.scrollTop)
            const newcdWidth = cdWidth - window.scrollY;
            $('.cd').style.width = newcdWidth > 0 ? newcdWidth + "px" : 0;
            $('.cd').style.opacity = newcdWidth / cdWidth;
            
        };

        // quay đĩa CD
        const cdRotate = $(".cd").animate([
            // keyframes
            { transform: 'rotate(360deg)' }
          ], {
            // timing options
            duration: 10000,
            iterations: Infinity
          });
        cdRotate.pause();
        // bấm nút play:
        btnPlay.onclick =  function(){
            if (app.isPlaying) {
                audio.pause();
                cdRotate.pause();
                app.isPlaying = false;
                $('.ti-control-pause').style.display = "none";
                $('.ti-control-play').style.display =  "block";
            }
            else {
                audio.play();
                cdRotate.play();
                app.isPlaying = true;
                $('.ti-control-pause').style.display = "block";
                $('.ti-control-play').style.display =  "none";
            }
        };

        // seek
        audio.ontimeupdate = function () {
            if (audio.duration) {
              const progressPercen = (audio.currentTime / audio.duration) * 100;
              $('input').value = progressPercen;
            }
        };

        $('input').oninput = function (e) {
            const seekTime = (audio.duration / 100) * e.target.value;
            audio.currentTime = seekTime;
        };

        // chuyển sang bài hát tiếp theo
        nextBtn.onclick =  function(){
           if (!app.isRandom && !app.isRepeat ){
                if (app.currentIndex === app.songs.length-1) app.currentIndex=0;
                else app.currentIndex+=1;
                app.loadCurrentSong();
                app.isPlaying = false;
                btnPlay.click();
           };
           if (app.isRandom){
               app.currentIndex =app.randomIndex();
                // app.currentIndex = Math.floor(Math.random()*8);
                app.loadCurrentSong();
                app.isPlaying = false;
                btnPlay.click();
           };
           if (app.isRepeat) {
                app.loadCurrentSong();
                app.isPlaying = false;
                btnPlay.click();
            }
        };

        // chuyển sang bài hát trước đó
        prevBtn.onclick =  function(){
            if (!app.isRandom && !app.isRepeat ){
                if (app.currentIndex === 0) app.currentIndex=app.songs.length -1;
                else app.currentIndex-=1;
                app.loadCurrentSong();
                app.isPlaying = false;
                btnPlay.onclick();
           };

           if (app.isRandom){
               app.currentIndex =app.randomIndex();
                // app.currentIndex = Math.floor(Math.random()*8);
                app.loadCurrentSong();
                app.isPlaying = false;
                btnPlay.onclick();
           };

           if (app.isRepeat) {
                app.loadCurrentSong();
                app.isPlaying = false;
                btnPlay.click();
            }
        };
           
    
        random.onclick = function(){
            if (!app.isRandom){
                this.classList.add('active');
                app.isRandom=true;
                if (app.isRepeat) {
                    repeat.classList.remove('active');
                    app.isRepeat = false;
                }
            }
            else{
                this.classList.remove('active');
                app.isRandom=false;
            }
        }
        // bấm vào nút repeat 
        repeat.onclick = function(){
            if (!app.isRepeat){
                this.classList.add('active');
                app.isRepeat=true;
                if (app.isRandom){
                    random.classList.remove('active');
                    app.isRandom = false;
                }
            }
            else{
                this.classList.remove('active');
                app.isRepeat=false;
            }
        };

        // khi heet bài hát tự động chuyển bài
        audio.onended = function () {
            nextBtn.onclick();
          };

        const songArr = $$('.song');
          // xử lí click on playlist
        songArr.forEach((item, index)=>{
            item.onclick = function(){
                app.currentIndex= index;
                app.loadCurrentSong();
                app.isPlaying = false;
                btnPlay.click();
            }
        })
        
    },


    start: function() {
        this.render();
        this.defineProperty();
        this.loadCurrentSong();
        this.handleEvents();
        if (app.isPlaying){
            document.getElementById(`${app.currentIndex}`).classList.add("playing");
        }
        console.log();
    }
}

app.start();


