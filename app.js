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

button.addEventListener("click",()=>{
  if(!navigator.geolocation){status.textContent="Location services aren't supported by this browser.";return;}
  button.disabled=true;status.textContent="Requesting your location…";
  navigator.geolocation.getCurrentPosition(async({coords})=>{
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
  },error=>{
    const messages={1:"Location permission was denied. Please allow location access and try again.",2:"Your location couldn't be determined. Please try again.",3:"Location lookup timed out. Please try again."};
    status.textContent=messages[error.code]||"Something went wrong while getting your location.";
    button.disabled=false;
  },{enableHighAccuracy:true,timeout:12000,maximumAge:0});
});