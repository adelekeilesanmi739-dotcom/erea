const sections = ["recharge","withdraw","vip"];

function showPage(id){
  document.querySelectorAll(".page-panel").forEach(el => el.classList.add("hidden"));
  document.querySelectorAll(".panel,.quick-grid,.welcome-card,.balance-card").forEach(el => {
    if(id) el.classList.add("hidden"); else el.classList.remove("hidden");
  });
  if(id){
    const target=document.getElementById(id);
    if(target) target.classList.remove("hidden");
  }
  document.querySelectorAll("[data-page]").forEach(btn=>{
    btn.classList.toggle("active", btn.dataset.page===id);
  });
}

document.querySelectorAll("[data-page]").forEach(btn=>{
  btn.addEventListener("click",()=>showPage(btn.dataset.page));
});

document.querySelector("[data-home]").addEventListener("click",()=>showPage(null));

document.querySelectorAll(".amount-grid button").forEach(btn=>{
  btn.addEventListener("click",()=>{
    document.querySelectorAll(".amount-grid button").forEach(b=>b.classList.remove("selected"));
    btn.classList.add("selected");
  });
});

document.getElementById("soundBtn").addEventListener("click",()=>{
  const msg = new SpeechSynthesisUtterance("Welcome to Earnvia. Start your journey today.");
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(msg);
});
