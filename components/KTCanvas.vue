<template>
    <div>
        <v-card min-height="800" min-width="1400" class="mx-auto">
            <v-layout>
                <v-container>
                    <v-row>
                        <v-col cols="7">                
                            <div>
                                <canvas id="canvas" width="700" height="700">
                                </canvas>
                            </div>
                        </v-col>
                        <v-col cols="3">
                            <v-card height="700" class="pa-2">
                                <v-card-title>
                                    オブジェクト設定
                                </v-card-title>
                                <div v-if="selectedObject!==null">

                                    <v-card>
                                        <v-card-title>
                                            色
                                        </v-card-title>
                                        <v-color-picker v-model="strokeColor">
                                        </v-color-picker>
                                    </v-card>
                                    <v-card class="mt-2">
                                        <v-card-title>
                                            線のサイズ
                                        </v-card-title>
                                        <v-slider label="線のサイズ" v-model="strokeSize" min="1" max="5" thumb-label="always" :thumb-size="24" class="mt-4">

                                        </v-slider>
                                    </v-card>
                                </div>
                            </v-card>
                        </v-col>
                        <v-col cols="2">
                            <v-card height="700">
                                <v-list>
                                    <v-list-item-group
                                        color="primary" :multiple="false">
                                        <v-list-item v-for="(userObject,index) in userObjects" :key="index" @click="onListItemClick(index)">
                                            <v-list-item-content>
                                                {{userObject.name}}
                                            </v-list-item-content>
                                            <v-list-item-action>
                                            </v-list-item-action>
                                            <v-list-item-icon @click="deleteObject(index)">
                                                <v-icon>mdi-delete</v-icon>
                                            </v-list-item-icon>
                                        </v-list-item>
                                    </v-list-item-group>
                                </v-list>
                            </v-card>
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
                    <v-row>

                        <v-expansion-panels>
                            <v-expansion-panel>
                                <v-expansion-panel-header>
                                    キャンバス設定
                                </v-expansion-panel-header>
                                <v-expansion-panel-content>
                                    <div>
                                        <h2>
                                            背景色
                                        </h2>
                                        <v-color-picker v-model="canvasBackgroundColor">
                                        </v-color-picker>
                                    </div>
                                    <div>
                                        <h2>
                                            サイズ
                                        </h2>
                                        <v-container>
                                            <v-row>
                                                <v-col cols="6">
                                                    <v-text-field v-model="canvasHeight" label="縦" suffix="px" :rules="canvasHeightRules"></v-text-field>
                                                </v-col>
                                                <v-col cols="6">
                                                    <v-text-field v-model="canvasWidth" label="横" suffix="px" :rules="canvasWidthRules"></v-text-field>
                                                </v-col>
                                            </v-row>
                                        </v-container>
                                    </div>
                                </v-expansion-panel-content>
                            </v-expansion-panel>
                        </v-expansion-panels>
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

function rgbaToFabricColorText(rgba){
    console.log("rgbatofabric")
    console.log(rgba)
    return `rgba(${rgba.r},${rgba.g},${rgba.b},${rgba.a})`;
}

function colorTextToRgba(colorText){
    const s=colorText.split(/[(,)]/);
    console.log(colorText);
    console.log(s);
    const obj={
        r:s[1],
        g:s[2],
        b:s[3],
        a:s[4],
    }
    console.log(obj);
    return obj;
}

export default {
    mounted(){

        fabric.Object.prototype.getAngleInRadians=function(){
            return this.get("angle")/180*Math.PI;
        }

        this.canvas=new fabric.Canvas("canvas",{
            backgroundColor:this.toRGBA,//名前おかしいから変えたい
            // selectionColor:"red",
            // selectionLineWidth:2,
        });
    },
    watch:{
        canvasBackgroundColor(){
            console.log(this.canvasBackgroundColor)
            console.log(this.toRGBA)
            this.canvas.backgroundColor=this.toRGBA
            this.canvas.renderAll()
        },
        canvasWidth(){
            if(this.canvasWidth!=Number(this.canvasWidth)){
                return;
            }
            if(this.canvasWidth<100 || this.canvasWidth>700){
                return;
            }
            this.canvas.setWidth(this.canvasWidth);
            this.canvas.renderAll();

        },
        canvasHeight(){
            if(this.canvasHeight!=Number(this.canvasHeight)){
                return;
            }
            if(this.canvasHeight<100 || this.canvasHeight>700){
                return;
            }
            this.canvas.setHeight(this.canvasHeight);
            this.canvas.renderAll();
        },
        strokeSize(){
            this.selectedObject.set({
                strokeWidth:rgbaToFabricColorText(this.strokeSize),
            });
            this.canvas.renderAll();
        },
        strokeColor(){
            console.log(this.selectedObject)
            console.log(this.selectedObject.strokeColor)
            this.selectedObject.set({
                stroke:rgbaToFabricColorText(this.strokeColor),
            });
            this.canvas.renderAll();
        }
    },
    data(){
        return {
            canvas:null,
            canvasBackgroundColor:{r:255,g:255,b:255,a:1},
            canvasWidth:0,
            canvasHeight:0,
            canvasHeightRules:[
                value=>!!value || "値を入力してください",
                value=> (value&& value==Number(value))||"数字を入力してください",
                value=> (value && value>=100 && value <=700) || "100px以上700px以下の値を入力してください"
            ],
            canvasWidthRules:[
                value=>!!value || "値を入力してください",
                value=> (value&& value==Number(value))||"数字を入力してください",
                value=> (value && value>=100 && value <=700) || "100px以上700px以下の値を入力してください"
            ],
            userObjects:[],
            selectedObject:null,
            strokeSize:2,
            strokeColor:{r:255,g:0,b:0,a:1},


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
                stroke:"rgba(255,0,0,1)",
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
                stroke:"rgba(255,0,0,1)",
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
                stroke:"rgba(255,0,0,1)",
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
                fill:"rgba(255,0,0,1)"
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
        },
        deleteObject(index){
            const userObject=this.userObjects[index];

            this.canvas.remove(userObject.fabricObject);
            this.userObjects.splice(index,1);
        },
        onListItemClick(index){

            //canvasのobjectを選択する
            this.canvas.discardActiveObject();
            this.canvas.setActiveObject(this.userObjects[index].fabricObject);
            this.canvas.renderAll();

            //object設定を表示する objectnの情報を取得して設定しておく
            this.selectedObject=this.userObjects[index].fabricObject;
            this.strokeSize=this.selectedObject.get("strokeWidth");
            this.stroke=colorTextToRgba(this.selectedObject.get("stroke"));
        }
    },
    computed:{
        toRGBA(){
            // return `rgba(${this.canvasBackgroundColor.r},${this.canvasBackgroundColor.g},${this.canvasBackgroundColor.b},${this.canvasBackgroundColor.a})`;
            return rgbaToFabricColorText(this.canvasBackgroundColor);
        }
    }
}
</script>
<style scoped>

#canvas {
    border: 1px solid lightgrey;
}

</style>