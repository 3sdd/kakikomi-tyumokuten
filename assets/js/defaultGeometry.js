import {fabric} from "fabric"

const defaultColor="rgba(255,0,0,1)"

function createDefaultLine(){
    return new fabric.Line([50,100,200,100],{
        left:100,
        top:100,
        stroke:defaultColor,
    });
}

function createDefaultRect(){
    return new fabric.Rect({
        left:100,
        top:100,
        fill:"rgba(0,0,0,0)",
        stroke:defaultColor,
        strokeWidth:2,
        strokeUniform:true,
        width:200,
        height:50,
    });
}

function createDefaultCircle(){
    return new fabric.Circle({
        left:100,
        top:100,
        fill:"rgba(0,0,0,0)",
        stroke:defaultColor,
        strokeWidth:2,
        strokeUniform:true,
        radius:40
    });
}

function createDefaultArrow(){
    const arrow =new fabric.Path('M121.32,0L44.58,0C36.67,0,29.5,3.22,24.31,8.41\
    c-5.19,5.19-8.41,12.37-8.41,20.28c0,15.82,12.87,28.69,28.69,28.69c0,0,4.4,\
    0,7.48,0C36.66,72.78,8.4,101.04,8.4,101.04C2.98,106.45,0,113.66,0,121.32\
    c0,7.66,2.98,14.87,8.4,20.29l0,0c5.42,5.42,12.62,8.4,20.28,8.4c7.66,0,14.87\
    -2.98,20.29-8.4c0,0,28.26-28.25,43.66-43.66c0,3.08,0,7.48,0,7.48c0,15.82,\
    12.87,28.69,28.69,28.69c7.66,0,14.87-2.99,20.29-8.4c5.42-5.42,8.4-12.62,8.4\
    -20.28l0-76.74c0-7.66-2.98-14.87-8.4-20.29C136.19,2.98,128.98,0,121.32,0z');
    arrow.set({
        left:100,
        top:100,
        width:150,
        height:150,
        fill:defaultColor,
    }).scale(0.5);

    return arrow;
}


export {
    createDefaultLine,
    createDefaultRect,
    createDefaultCircle,
    createDefaultArrow
}