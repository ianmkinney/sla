const button=document.querySelector("#locate");
const status=document.querySelector("#status");
const returnLink=document.querySelector("#returnLink");
const params=new URLSearchParams(location.search);

function safeReturnUrl(value){
  if(!value)return null;
  try{const url=new URL(value);return url.protocol==="https:"?url.href:null;}catch{return null;}
}
const destination=safeReturnUrl(params.get("return"));
if(destination){returnLink.href=destination;returnLink.hidden=false;}

async function copyText(text){
  if(navigator.clipboard?.writeText){await navigator.clipboard.writeText(text);return;}
  const area=document.createElement("textarea");
  area.value=text;area.style.position="fixed";area.style.opacity="0";
  document.body.appendChild(area);area.select();
  const copied=document.execCommand("copy");area.remove();
  if(!copied)throw new Error("Clipboard copy failed");
}

function getPosition(options){
  return new Promise((resolve,reject)=>navigator.geolocation.getCurrentPosition(resolve,reject,options));
}

button.addEventListener("click",async()=>{
  if(!navigator.geolocation){status.textContent="Location services aren't supported by this browser.";return;}
  button.disabled=true;
  status.textContent="Requesting your location…";

  let position;
  try{
    // Fast path: accept a recent/cached fix and don't force GPS-level accuracy.
    position=await getPosition({enableHighAccuracy:false,timeout:15000,maximumAge:300000});
  }catch(firstError){
    try{
      // Fallback: give the device longer to obtain a fresh fix.
      status.textContent="Still locating you…";
      position=await getPosition({enableHighAccuracy:true,timeout:30000,maximumAge:600000});
    }catch(error){
      const messages={
        1:"Location permission was denied. Please allow location access in your browser settings and try again.",
        2:"Your device couldn't determine a location. Make sure Location Services are enabled, then try again.",
        3:"Location is taking too long. Try opening this page in Safari or Chrome and make sure Location Services are enabled."
      };
      status.textContent=messages[error.code]||"Something went wrong while getting your location.";
      button.disabled=false;
      return;
    }
  }

  const {coords}=position;
  const coordinates=`${coords.latitude.toFixed(6)}, ${coords.longitude.toFixed(6)}`;
  try{
    await copyText(coordinates);
    if(destination){
      status.textContent="Location copied! Returning to the form…";
      setTimeout(()=>location.href=destination,900);
    }else{
      status.textContent=`Location copied: ${coordinates}`;
      button.disabled=false;
    }
  }catch{
    status.textContent=`Copy failed. Your location is: ${coordinates}`;
    button.disabled=false;
  }
});