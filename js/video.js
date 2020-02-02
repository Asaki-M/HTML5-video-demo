window.onload = function(){
	var videoContain = new Vue({
		el:"#videoContain",
		data:{
			precent:0,
			fileSrc:""
		},
		methods:{
			uploadFile:function(){
				var that = this;
				var pic=document.querySelector("#uploadFile").files[0];
				var fd=new FormData();
				var xhr=new XMLHttpRequest();
				var reader = new FileReader();
				reader.readAsDataURL(pic);
				reader.onload = function(event){
					that.fileSrc = event.target.result;
				}
				xhr.open('post','01.php',true);
				xhr.upload.onprogress=function (ev){
					//如果ev.lengthComputable为true就可以开始计算上传进度
					//上传进度 = 100* ev.loaded/ev.total
					if(ev.lengthComputable){
						var precent=100 * ev.loaded/ev.total;
						document.getElementById("bar").style.width = precent + "%";
						that.precent = Math.floor(precent);
					}
				}
				fd.append('pic',pic); 
				xhr.send(fd);
					
				
			},
		}
	});

	//video交互与功能
	var control  = document.querySelector(".control");
	var play = document.querySelector("#play");
	var pause = document.querySelector("#pause");
	var back = document.querySelector("#back");
	var forward = document.querySelector("#forward");
	var noVoice = document.querySelector("#noVoice");
	var voice = document.querySelector("#voice");
	var voiceControl = document.querySelector(".voiceControl");
	var voiceDone = document.querySelector(".voiceDone");
	var voiceCircle = document.querySelector(".voiceCircle");
	var speedList = document.querySelectorAll("#playSpeed li");
	var video = document.querySelector("#video");
	var fullScreen = document.querySelector("#fullScreen");
	var exitFullScreen = document.querySelector("#exitFullScreen");
	var progressBar = document.querySelector(".progressBar");
	var progressDone = document.querySelector(".progressDone");
	var progressCircle = document.querySelector(".progressCircle");
	var container = document.querySelector(".v_container");
	var isMove = false;
	var isPlay = false;
	//显示控制条
	video.onmousemove = function(){
		control.style.display = "block";
		progressBar.style.bottom = 52 + "px";
	}
	video.onmouseleave = function(){
		control.style.display = "none";
		progressBar.style.bottom = 4 + "px";
	}
	control.onmouseenter = function(){
		control.style.display = "block";
		progressBar.style.bottom = 52 + "px";
	}
	control.onmouseleave = function(){
		control.style.display = "none";
		progressBar.style.bottom = 4 + "px";
	}
	progressBar.onmousemove = function(){
		control.style.display = "block";
		progressBar.style.bottom = 52 + "px";
	}
	progressBar.onmouseleave = function(){
		control.style.display = "none";
		progressBar.style.bottom = 4 + "px";
	}

	//点击进度条位置设置播放时长
	progressBar.onclick = function(event){
		var length = parseInt(progressBar.offsetWidth);
		var timePercent = (event.offsetX / length).toFixed(2);
		var now = parseInt(video.duration * timePercent); 
		video.currentTime = now;
	}

	//点击视频开始播放/暂停
	video.onclick = function(event){
		if (isPlay) {
			video.pause();
			isPlay = false;
			play.style.display="block";
			pause.style.display="none";
		} else{
			video.play();
			isPlay = true;
			play.style.display="none";
			pause.style.display="block";
		}
		event.stopPropagation();
	}


	// 播放按钮
	play.onclick = function(){
		video.play();
		play.style.display="none";
		pause.style.display="block";
	}
	// 暂停按钮
	pause.onclick =function(){
		video.pause();
		play.style.display="block";
		pause.style.display="none";
	}
	// 快退按钮
	back.onclick = function(){
		var oldTime = Math.floor(video.currentTime);
		var newTime = oldTime - 30;
		video.currentTime = newTime;
	}

	// 快退按钮
	forward.onclick = function(){
		var oldTime = Math.floor(video.currentTime);
		var newTime = oldTime + 30;
		video.currentTime = newTime;
	}

	//音量点击静音
	voice.onclick = function(event){
		if(video.volume!=0){
			video.volume = 0;
			voiceCircle.style.left = 0+"px";
			voiceDone.style.width = 0+"px";
			noVoice.style.display = "block";
			voice.style.display = "none";
		} else{
			video.volume = 1;
			voiceCircle.style.left = 90+"px";
			voiceDone.style.width = 100+"px";
		}
		event.stopPropagation();
	}
	//音量点击最大
	noVoice.onclick = function(event) {
		video.volume = 1;
		noVoice.style.display = "none";
		voice.style.display = "block";
		voiceCircle.style.left = 90+"px";
		voiceDone.style.width = 100+"px";
		event.stopPropagation();
	}
	//单击设置音量
	voiceControl.onclick = function(event){
		var voiceSize = (event.offsetX/100).toFixed(1);
		console.log(voiceSize);
		video.volume = voiceSize;
		voiceCircle.style.left = event.offsetX+"px";
		voiceDone.style.width = event.offsetX+"px";
		event.stopPropagation();
	}
	//播放速度设置
	for(var i = 0; i < speedList.length; i++) {
		speedList[i].onclick = function() {
			var speed = parseFloat(this.innerText);
			video.playbackRate = speed;
		}
	}

	//全屏按钮
	fullScreen.onclick = function() {
		var videoHeight = window.innerHeight-10 + "px";
		container.style.width = 100 + "%";
		container.style.margin = "5px auto";
		control.style.width = 100 + "%";
		progressBar.style.width = 100 + "%";
		video.style.height = videoHeight;
		fullScreen.style.display = "none";
		exitFullScreen.style.display = "block";
	}

	//退出全屏按钮
	exitFullScreen.onclick = function(){
		fullScreen.style.display = "block";
		exitFullScreen.style.display = "none";
		container.removeAttribute("style");
		control.style.width = 900 + "px";
		progressBar.style.width = 900 + "px";
		video.removeAttribute("style");
	}

	//设置实时播放进度
	video.addEventListener("timeupdate",function(){
		var currentTime = document.getElementById("currentTime");
		var vLength = video.duration;
		var cLength = video.currentTime;
		var current = getTime(cLength);
		var width = Math.floor(cLength)/Math.floor(vLength)*100;
		currentTime.innerText = current;
		progressDone.style.width = width + "%";
		progressCircle.style.left = width + "%";
		if (cLength == vLength) {
			play.style.display = "block";
			pause.style.display = "none";
		}
	})

	// 获取视频的总时间
	video.onloadedmetadata = function () {
		var totalTime = document.getElementById("totalTime");
		var vLength = video.duration; 
		var total = getTime(vLength);
		totalTime.innerText = total;
	}

	//设置时间格式
	function getTime(time){
		var hours = Math.floor(time%86400/3600);

		var minutes = Math.floor(time%86400%3600/60);

		var seconds = Math.floor(time%60);
		// console.log(seconds);

		hours = hours > 10 ? hours : '0' + hours;
		minutes = minutes > 10 ? minutes : '0' + minutes;
		seconds = seconds > 10 ? seconds : '0' + seconds;

		var str = '';
		str = hours + ':' + minutes + ':' + seconds;
		// console.log(str);
		return str;
	}
}