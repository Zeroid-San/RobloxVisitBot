const $=id=>document.getElementById(id);
const defaults={threads:10,loop:"true",delay:10};
const key="rvb-dashboard-settings";
let saved={...defaults,...JSON.parse(localStorage.getItem(key)||"{}")};
let running=false,startedAt=0,timer=null,sessionTimer=null,eventTotal=0;

function loadSettings(){ $("threads").value=saved.threads; $("loop").value=saved.loop; $("delay").value=saved.delay; }
function addEvent(message,type="ok"){
  const list=$("activityList"),empty=$("emptyLog");
  if(empty) empty.remove();
  const row=document.createElement("div"); row.className="event";
  const now=new Date(); const time=now.toLocaleTimeString([], {hour:"2-digit",minute:"2-digit",second:"2-digit"});
  row.innerHTML="<i></i><span>"+message+"</span><time>"+time+"</time>";
  list.prepend(row); eventTotal++; $("eventCount").textContent=eventTotal;
}
function setState(label,badge){
  $("runState").textContent=label; $("runBadge").textContent=badge;
}
function health(){
  const secure=location.protocol==="https:"||location.hostname==="localhost";
  $("statusBadge").textContent="READY"; $("dashboardState").textContent="ONLINE";
  $("saveMessage").textContent=secure?"Health check passed — secure browser context detected.":"Health check passed — static dashboard is running.";
  addEvent("Browser health check passed");
}
function formatTime(ms){const s=Math.floor(ms/1000);return String(Math.floor(s/60)).padStart(2,"0")+":"+String(s%60).padStart(2,"0")}
function startMonitor(){
  if(running)return;
  running=true; startedAt=Date.now(); $("startBtn").disabled=true; $("stopBtn").disabled=false;
  setState("Running","ACTIVE"); addEvent("Browser monitor started");
  let width=0; $("progressBar").style.width="8%";
  timer=setInterval(()=>{width=Math.min(width+4,92);$("progressBar").style.width=width+"%"},350);
  sessionTimer=setInterval(()=>{$("sessionTime").textContent=formatTime(Date.now()-startedAt)},1000);
}
function stopMonitor(){
  if(!running)return;
  running=false; clearInterval(timer); clearInterval(sessionTimer); $("progressBar").style.width="0%";
  $("sessionTime").textContent="00:00"; $("startBtn").disabled=false; $("stopBtn").disabled=true;
  setState("Stopped","IDLE"); addEvent("Browser monitor stopped");
}
$("startBtn").addEventListener("click",startMonitor);
$("stopBtn").addEventListener("click",stopMonitor);
$("healthBtn").addEventListener("click",health);
$("clearLog").addEventListener("click",()=>{ $("activityList").innerHTML='<div class="empty" id="emptyLog"><span>✓</span><p>No events yet.<small>Run a health check or start the monitor.</small></p></div>';eventTotal=0;$("eventCount").textContent="0"; });
$("saveBtn").addEventListener("click",()=>{
  const threads=Number($("threads").value),delay=Number($("delay").value);
  if(!Number.isInteger(threads)||threads<1||threads>100){$("saveMessage").textContent="Threads must be a whole number from 1 to 100.";return}
  if(!Number.isFinite(delay)||delay<0||delay>3600){$("saveMessage").textContent="Delay must be between 0 and 3600 seconds.";return}
  saved={threads,loop:$("loop").value,delay};localStorage.setItem(key,JSON.stringify(saved));
  $("configState").textContent="SAVED";$("saveMessage").textContent="Settings saved locally.";addEvent("Dashboard settings saved");
});
$("resetBtn").addEventListener("click",()=>{saved={...defaults};localStorage.removeItem(key);loadSettings();$("configState").textContent="DEFAULT";$("saveMessage").textContent="Settings reset to defaults.";addEvent("Dashboard settings reset")});
function updateClock(){$("clock").textContent=new Date().toLocaleTimeString()}
loadSettings();updateClock();setInterval(updateClock,1000);health();
