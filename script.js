canvas = document.querySelector("#myCanvas")
resetBtn = document.querySelector("#reset")
const bgColorPicker = document.querySelector("#colourPicker")
const plotColorPicker = document.querySelector("#plotColor")
const slider = document.querySelector("#slider")
const itSlider = document.querySelector("#iter")
const instantColourChange = document.querySelector("#ICH")
let totalIterations = itSlider.value
let allPoints = []
let size = 2
let plotColor = ""
let CanvasWidth = 0
let CanvasHeight = 0
let point1 = [100, CanvasHeight-100]
let point2 = [CanvasWidth-100,CanvasHeight-100]
let point3 = [CanvasWidth/2,100]
let startingPoints = [point1,point2,point3]
function padZero(str, len=2) {
    var zeroes = new Array(len).join('0')
    return (zeroes + str).slice(-len)
}

function getRandomColour() {
    const r = Math.floor(Math.random()*255)
    const g = Math.floor(Math.random()*255)
    const b = Math.floor(Math.random()*255)
    return `#${padZero(r)}${padZero(g)}${padZero(b)}`
}

function randInt(N) {
    return Math.floor(Math.random()*N)
}

function getPoint(Nx, Ny) {
    return [randInt(Nx), randInt(Ny)]
}

function collinear(x1, y1, x2, y2, x3, y3) {
    const a = x1 * (y2 - y3) + x2 * (y3 - y1) + x3 * (y1 - y2)
    // console.log(`yes ${a} ${x1}, ${y1}, ${x2}, ${y2}, ${x3}, ${y3}`)
    return a == 0
}

function canAdd(Points, newPoint) {
    const N = Points.length
    const x3 = newPoint[0]
    const y3 = newPoint[1]
    for(let i=0;i<N;++i){
        for(let j=i+1;j<N;++j) {
            let x1 = Points[i][0]
            let y1 = Points[i][1]
            let x2 = Points[j][0]
            let y2 = Points[j][1]
            if(collinear(x1,y1,x2,y2,x3,y3)) {
                return false
            }
        }
    }
    return true
}

function getPoints(N=3,x,y) {
    const P1 = [x,y]
    let P2 = getPoint(CanvasWidth, CanvasHeight)
    while(P1==P2) {
        P2 = getPoint(CanvasWidth, CanvasHeight)
    }
    let points = [P1,P2]
    let noOfPoints = 2
    let i=0
    while(noOfPoints<N && i<10) {
        const newPoint = getPoint(CanvasWidth, CanvasHeight)
        
        if(canAdd(points, newPoint)) {
            noOfPoints+=1
            points.push(newPoint)
        }
        i++
    }
    return points
}

function plotThePoint(x,y,color="#FF0000") {
    color = plotColor
    let ctx = canvas.getContext("2d");
    ctx.fillStyle = color
    ctx.fillRect(x,y,size,size)
}

function getCursorPosition(e) {
    const rect = canvas.getBoundingClientRect()
    let x = e.clientX - rect.left
    let y = e.clientY - rect.top
    // points = getPoints(3,x,y)
    // plotIntialPoints()
    
    plotPoints(x,y,totalIterations)
}

function plotPoints(x,y,noOfIterations) {
    
    count = 0
    plotThePoint(x,y,"#0000FF")
    while(count<noOfIterations) {
        count+=1
        die = randInt(3)
        x = (startingPoints[die][0] + x)/2
        y = (startingPoints[die][1] + y)/2
        plotThePoint(x,y, plotColor)
        allPoints.push([x,y])
    }
    
}
function plotIntialPoints() {
    allPoints = []
    allPoints.push(...startingPoints)
    for (let i in startingPoints) {
        plotThePoint(startingPoints[i][0], startingPoints[i][1],"#00FF00")
    }
}
function resize(e) {
    CanvasWidth = window.innerWidth*0.9
    CanvasHeight = window.innerHeight*0.97
    canvas.width = CanvasWidth
    canvas.height = CanvasHeight
    point1 = [100, CanvasHeight-100]
    point2 = [CanvasWidth-100,CanvasHeight-100]
    point3 = [CanvasWidth/2,100]
    startingPoints = [point1,point2,point3]
    if (allPoints.length>5) {
        plotPoints(allPoints[0][0], allPoints[0][1], totalIterations)
    }
}

function reset(clearPoints=true) {
    canvas.addEventListener("mousedown",getCursorPosition)
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    if(clearPoints) {
        allPoints = []
    }
    plotIntialPoints()
} 

function changeBackground(e) {
    canvas.style.backgroundColor = bgColorPicker.value
}

function changePlotColor(e) {
    plotColor = plotColorPicker.value
    if(instantColourChange.checked) {
        rePlot()
    }
}

function changeSize(e) {
    size = e.target.value
    rePlot()
}

function ChangeIterations(e) {
    totalIterations = itSlider.value
    rePlot()
}

function rePlot(noOfIterations = totalIterations) {
    if(allPoints.length<5) {
        plotIntialPoints()
        return
    }
    reset(false)
    const N = allPoints.length
    let oldPoints = Math.min(noOfIterations, N)
    for(let i = 0; i<oldPoints;++i) {
        plotThePoint(allPoints[i][0], allPoints[i][1],plotColor)
    }
    if(noOfIterations>N) {
        plotPoints(allPoints[N-1][0], allPoints[N-1][1], noOfIterations - oldPoints)
    }
}

window.addEventListener("resize",resize)
resetBtn.addEventListener("click",reset)
bgColorPicker.addEventListener("input", changeBackground)
plotColorPicker.addEventListener("input", changePlotColor)
slider.addEventListener("input", changeSize)
itSlider.addEventListener("input", ChangeIterations)
reset()
resize()
changeBackground()
changePlotColor()
plotIntialPoints()