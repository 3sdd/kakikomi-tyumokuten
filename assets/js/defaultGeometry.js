import {fabric} from "fabric"

const defaultColor="rgba(255,0,0,1)";
const defaultStrokeWidth=4;

function createDefaultLine(){
    return new fabric.Line([50,100,200,100],{
        left:100,
        top:100,
        stroke:defaultColor,
        strokeWidth:defaultStrokeWidth,
    });
}

function createDefaultRect(){
    return new fabric.Rect({
        left:100,
        top:100,
        fill:"rgba(0,0,0,0)",
        stroke:defaultColor,
        strokeWidth:defaultStrokeWidth,
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
        strokeWidth:defaultStrokeWidth,
        strokeUniform:true,
        radius:40
    });
}

function createDefaultArrow(){
    const arrow =new fabric.Path('M 8.6568723,64.692841 62.691581,102.30107 V 76.307339 H 120.46384 V 53.077161 H 62.691581 V 27.083434 Z');
    arrow.set({
        left:100,
        top:100,
        width:150,
        height:100,
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