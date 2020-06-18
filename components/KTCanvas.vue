<template>
    <div>
        <v-card min-height="800" min-width="800" class="mx-auto">
            <v-layout>
                <v-container>
                    <v-row>
                        <v-col cols="10">
                            
                        <div width="600" height="600">
                            <canvas id="canvas" width="500" height="500">
                            </canvas>
                        </div>
                        </v-col>
                        <v-col cols="2">
                            <div v-for="(userObject,index) in userObjects" :key="index">
                                <v-card color="primary">
                                    <v-card-text>
                                        {{userObject.name}}
                                    </v-card-text>
                                </v-card>
                            </div>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-card>
                            <v-container>
                                <v-row>
                                    <div>
                                        <v-btn color="primary" @click="createLine">
                                            <img src="~/assets/icon-line.svg" width="32" height="32">
                                        </v-btn>
                                    </div>
                                    <div>
                                        <v-btn color="primary" @click="createCircle">
                                            <img src="~/assets/icon-circle.svg" width="32" height="32">
                                        </v-btn>
                                    </div>
                                    <div>
                                        <v-btn color="primary" @click="createRectangle">
                                            <img src="~/assets/icon-rectangle.svg" width="32" height="32">
                                        </v-btn>
                                    </div>
                                    <div>
                                        <v-btn color="primary" @click="createArrow">
                                            <img src="~/assets/icon-arrow.svg" width="32" height="32">
                                        </v-btn>
                                    </div>
                                </v-row>
                            </v-container>
                        </v-card>
                    </v-row>
                    <v-row>
                        <v-col class="text-center" cols="6">
                            <v-file-input filled prepend-icon="mdi-image" label="元画像" accept="image/*" placeholder="画像を選択" clearable @change="onImageChange">
                            </v-file-input>
                        </v-col>
                        <v-col class="text-center" cols="6">
                            <v-btn color="primary" @click="downloadAsPng">
                                pngとしてエクスポート
                            </v-btn>
                        </v-col>

                    </v-row>
                </v-container>


            </v-layout>


            <!-- <img src="~/assets/araisan.png" id="my-image" width="200" height="200" style="display:none"> -->


        </v-card>

    </div>
</template>
<script>
import {fabric} from "fabric"


//stroke を変更した時にサイズが変わる問題
//https://stackoverflow.com/questions/49005241/maintain-strokewidth-while-scaling-in-fabric-js
//lineのfillが効かない
//https://stackoverflow.com/questions/18835580/how-to-draw-a-line-on-a-canvas-using-fabric-js

class UserObject{
    constructor(name,fabricObject){
        this.name=name;
        this.fabricObject=fabricObject;
    }
}


export default {
    mounted(){

        fabric.Object.prototype.getAngleInRadians=function(){
            return this.get("angle")/180*Math.PI;
        }

        this.canvas=new fabric.Canvas("canvas",{
            backgroundColor:"white",
            // selectionColor:"red",
            // selectionLineWidth:2,
        });
    },
    data(){
        return {
            canvas:null,
            userObjects:[],
        }
    },
    methods:{
        onImageChange(file){
            if(file===undefined || file===null){
                return;
            }

            const fr=new FileReader();
            fr.readAsDataURL(file);
            fr.addEventListener("load",()=>{
                this.createImage(fr.result)
            })
        },
        createImage(imgUrl){
            fabric.Image.fromURL(imgUrl,imgObj=>{
                // const canvasImgMaxWidth=600; //canvas内での画像サイズ
                // const canvasImgMaxHeight=600;//canvas内での画像サイズ
                const targetSize=500;

                imgObj.set({
                    selectable:false,
                });

                const width=imgObj.get("width");
                const height=imgObj.get("height");
                
                let scale;
                if(width>height){
                    scale=targetSize/width;
                }else{
                    scale=targetSize/height;
                }

                const canvasElement=document.getElementById("canvas");
                imgObj.set({
                    scaleX:scale,
                    scaleY:scale,
                });
                imgObj.set({
                    left:this.canvas.get("width")/2-imgObj.get("width")*imgObj.get("scaleX")/2,
                    top:this.canvas.get("height")/2-imgObj.get("height")*imgObj.get("scaleY")/2,
                })
                this.canvas.setBackgroundImage(imgObj);
            
                // this.canvas.add(imgObj);
                this.canvas.renderAll();
            });
            
        },
        createLine(){
            const line=new fabric.Line([50,100,200,100],{
                left:100,
                top:100,
                stroke:"red",
            });
            this.userObjects.push(new UserObject(
                "線",
                line
            ));
            this.canvas.add(line);
            this.canvas.renderAll();
        },
        createCircle(){
            const circle=new fabric.Circle({
                left:100,
                top:100,
                fill:"rgba(0,0,0,0)",
                stroke:"red",
                strokeWidth:2,
                strokeUniform:true,
                radius:40
            });
            
            this.userObjects.push(new UserObject(
                "円",
                circle
            ));
            this.canvas.add(circle);
            this.canvas.renderAll();
        },
        createRectangle(){
            const rectangle=new fabric.Rect({
                left:100,
                top:100,
                fill:"rgba(0,0,0,0)",
                stroke:"red",
                strokeWidth:2,
                strokeUniform:true,
                width:200,
                height:50,
            });
            this.userObjects.push(new UserObject(
                "四角形",
                rectangle
            ));
            this.canvas.add(rectangle);
            this.canvas.renderAll();
        },
        createArrow(){

            const arrow = new fabric.Path('M121.32,0L44.58,0C36.67,0,29.5,3.22,24.31,8.41\
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
                fill:"red"
            }).scale(0.5);
            this.userObjects.push(new UserObject(
                "矢印",
                arrow
            ));
            this.canvas.add(arrow);
            this.canvas.renderAll();

            // const url="http://fabricjs.com/assets/1.svg"
            // fabric.loadSVGFromURL(url, function(objects) { 
            //         var group = new fabric.PathGroup(objects, { 
            //         left: 165, 
            //         top: 100, 
            //         width: 295, 
            //         height: 211 
            //         }); 
            //         canvas.add(group); 
            //         canvas.renderAll(); 
            //         }); 
        },
        downloadAsPng(){
            const canvas=document.getElementById("canvas");
            const a=document.createElement("a");
            a.href=canvas.toDataURL("image/png");
            a.download="image.png";
            a.click();
        }
    }
}
</script>
<style scoped>

/* #canvas {
    border: 1px solid lightgrey;
} */

</style>