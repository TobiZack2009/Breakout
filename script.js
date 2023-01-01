this.scaleToFit=0
 function resizeHandler() {
    let scaleX = innerWidth / canvas.width;
    let scaleY = innerHeight / canvas.height;
     this.scaleToFit = Math.min(scaleX, scaleY);
    canvas.style.transform=`scale(${scaleToFit})`
}
let canvasDiv=document.querySelector("#canvas-div")
let game=new BreakoutGame()
let canvas=game.canvas
canvasDiv.appendChild(canvas)
resizeHandler()
addEventListener("resize",resizeHandler)
