<template>
    <div>
        <v-card min-height="800" min-width="1400" class="mx-auto">
            <v-layout>
                <v-container>
                    <v-row>
                        <v-col cols="7">  
                                <div style="width:700px;height:700px" @keydown.delete="onDeleteButtonDown" tabindex="0">
                                    <v-card tile>
                                        <div  @drop.prevent="onImageDrop" @dragover.prevent>
                                            <canvas id="canvas" width="700" height="700" >
                                            </canvas>
                                        </div>
                                        <v-overlay absolute v-if="imageInput===null">
                                            <v-container fill-height style="width:680px;height:680px;"
                                                v-bind:class="{isDragOver}"
                                                v-bind:style="{border:isDragOver?'dashed 5px red':'dashed 5px white'}"
                                                @drop.prevent="onImageDrop" @dragover.prevent @dragenter="onDragEnter" @dragleave="onDragLeave"
                                                >
                                                <v-row>
                                                    <v-col  justify="center">
                                                        <div class="text-center" style="font-size:2rem">
                                                                <p>画像をドロップしてください<br>
                                                                    または<br>
                                                                    画像を貼り付けてください(ctr+v)
                                                                </p>
                                                        </div>
                                                    </v-col>
                                                </v-row>
                                            </v-container>
                                        </v-overlay>
                                    </v-card>
                                </div>

                                <div id="virtualCanvas">
  
                                </div>
                        </v-col>
                        <v-col cols="3">
                            <v-card height="700" class="pa-2">
                                <v-card-title>
                                    オブジェクト設定
                                </v-card-title>
                                <div v-if="selectedObject!==undefined&&selectedObjectListItem!==undefined">

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
                                        <v-slider label="線のサイズ" v-model="strokeWidth" min="1" max="10" thumb-label="always" :thumb-size="24" class="mt-4">

                                        </v-slider>
                                    </v-card>
                                </div>
                            </v-card>
                        </v-col>
                        <v-col cols="2">
                            <v-card height="700">
                                <v-card-title>
                                    オブジェクト一覧
                                </v-card-title>
                                <v-list>
                                    <v-list-item-group
                                        color="primary" 
                                        :multiple="false"
                                        v-model="selectedObjectListItem">
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
                        <v-col cols="6" justify-center> 
                            <v-card class="pa-1 mx-auto" width="350">
                                <v-container>
                                    <v-row>
                                        <div>
                                            <v-btn color="grey" @click="createLine" class="mr-4 ml-2" outlined="">
                                                <img src="~/assets/icon-line.svg" width="32" height="32" alt="線アイコン">
                                            </v-btn>
                                        </div>
                                        <div>
                                            <v-btn color="grey" @click="createCircle" class="mr-4" outlined="">
                                                <img src="~/assets/icon-circle.svg" width="32" height="32" alt="円アイコン">
                                            </v-btn>
                                        </div>
                                        <div>
                                            <v-btn color="grey" @click="createRectangle" class="mr-4" outlined="">
                                                <img src="~/assets/icon-rectangle.svg" width="32" height="32" alt="四角形アイコン">
                                            </v-btn>
                                        </div>
                                        <div>
                                            <v-btn color="grey" @click="createArrow" class="mr-4" outlined="">
                                                <img src="~/assets/icon-arrow.svg" width="32" height="32" alt="矢印アイコン">
                                            </v-btn>
                                        </div>
                                    </v-row>
                                </v-container>
                            </v-card>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col class="text-center" cols="6">
                            <v-file-input filled prepend-icon="mdi-image" label="元画像" accept="image/*" placeholder="画像を選択" @change="onImageChange" v-model="imageInput" v-bind:clearable="false">
                            </v-file-input>
                        </v-col>
                        <v-col class="text-center" cols="6">
                            <v-btn color="primary" @click="downloadAsPng">
                                画像を保存(png)
                            </v-btn>
                            <v-btn color="primary" class="ml-2" @click="copyToClipboard">
                                クリップボードに保存
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

                    <v-row>
                        <v-dialog v-model="copyDialog" width="500">
                            <v-card>
                                <v-card-title>
                                    クリップボードへコピーしました。
                                    <v-spacer></v-spacer>
                                    <v-btn @click="copyDialog=false" icon color="pink">
                                        <v-icon>mdi-close-circle-outline</v-icon>
                                    </v-btn>
                                </v-card-title>
                            </v-card>
                        </v-dialog>
                    </v-row>
                    <v-row class="my-5">
                        <v-card class="pa-2" width="100%">
                            <v-card-text>
                                シェアして下さるとうれしいです！<br>
                            </v-card-text>
                            <v-card-actions>
                                <v-btn 
                                    color="blue"
                                    class="white--text"
                                    @click="tweet"
                                >
                                    ツイートする
                                </v-btn>
                                <!-- <v-btn>
                                    a
                                </v-btn> -->
                                <span class="pt-2 ml-5">
                                <a href="https://b.hatena.ne.jp/entry/s/kakikomi-tyumokuten.vercel.app" class="hatena-bookmark-button" data-hatena-bookmark-layout="basic-label-counter" data-hatena-bookmark-lang="ja" data-hatena-bookmark-width="140" data-hatena-bookmark-height="35" title="このエントリーをはてなブックマークに追加"><img src="https://b.st-hatena.com/images/v4/public/entry-button/button-only@2x.png" alt="このエントリーをはてなブックマークに追加" width="20" height="20" style="border: none;" /></a><script type="text/javascript" src="https://b.st-hatena.com/js/bookmark_button.js" charset="utf-8" async="async"></script>
                                </span>
                            </v-card-actions>
                        </v-card>

                           <!-- <v-btn
                                absolute
                                dark
                                fab
                                top
                                right
                                color="pink"
                            > -->
                    </v-row>
                </v-container>


            </v-layout>


            <!-- <img src="~/assets/araisan.png" id="my-image" width="200" height="200" style="display:none"> -->


        </v-card>

    </div>
</template>
<script>
import {fabric} from "fabric"
import {createDefaultLine,createDefaultCircle,createDefaultRect,createDefaultArrow} from "~/assets/js/defaultGeometry"
import {UserObject} from "~/assets/js/userObject"
//stroke を変更した時にサイズが変わる問題
//https://stackoverflow.com/questions/49005241/maintain-strokewidth-while-scaling-in-fabric-js
//lineのfillが効かない
//https://stackoverflow.com/questions/18835580/how-to-draw-a-line-on-a-canvas-using-fabric-js



function rgbaToFabricColorText(rgba){
    return `rgba(${rgba.r},${rgba.g},${rgba.b},${rgba.a})`;
}

function colorTextToRgba(colorText){
    const s=colorText.split(/[(,)]/);
    const obj={
        r:s[1],
        g:s[2],
        b:s[3],
        a:s[4],
    }
    return obj;
}

function downloadCanvas(canvasElement){
    const canvas=canvasElement;
    const a=document.createElement("a");
    a.href=canvas.toDataURL("image/png");
    a.download="image.png";
    a.click();
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

        //canvasの選択解除した時、オブジェクト一覧の選択解除
        const self=this;
        this.canvas.on("selection:cleared",function(){
            self.selectedObjectListItem=undefined;
        })

        //text fieldに画像をペーストすると画像を読み込むようにする
        //元コード
        //https://stackoverflow.com/questions/6333814/how-does-the-paste-image-from-clipboard-functionality-work-in-gmail-and-google-c
        document.onpaste=function(event){
            // console.log(event);
            var items = (event.clipboardData  || event.originalEvent.clipboardData).items;
            // console.log(items); // will give you the mime types
            // find pasted image among pasted items
            let blob = null;
            for (var i = 0; i < items.length; i++) {
                // console.log(items[i]);
                if (items[i].type.indexOf("image") === 0) {
                    console.log(items[i].getAsFile())
                    self.imageInput=items[i].getAsFile();
                    blob = self.imageInput;
                    break
                }
            }
            // load image if there is a pasted image
            if (blob !== null) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    // console.log(event.target.result); // data url!
                    // document.getElementById("pastedImage").src = event.target.result;
                    self.createImage(event.target.result);
                };
                reader.readAsDataURL(blob);
            }
        }
    },
    watch:{
        canvasBackgroundColor(){
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
        strokeWidth(){
            //arrow用
            //TODO:応急措置みたいな感じで修正。直さねば
            //arrowはstrokeWidthないので、何もしない
            if(this.selectedObject.get("type")==="path"){
                return;
            }
            
            this.selectedObject.set({
                strokeWidth:this.strokeWidth,
            });
            this.canvas.renderAll();
        },
        strokeColor(){
            //arrow用
            //TODO:応急措置みたいな感じで修正。直さねば
            //arrowだけstrokeではなく、fill
            if(this.selectedObject.get("type")==="path"){
                this.selectedObject.set({
                    fill:rgbaToFabricColorText(this.strokeColor),
                });
                this.canvas.renderAll();
                return;
            }
            this.selectedObject.set({
                stroke:rgbaToFabricColorText(this.strokeColor),
            });
            //arrow用
            this.canvas.renderAll();
        },
        selectedObjectListItem(){
            if(this.selectedObjectListItem===undefined){
                this.canvas.discardActiveObject();
                this.canvas.renderAll();
                return;
            }
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
            selectedObject:undefined,
            strokeWidth:2,
            strokeColor:{r:255,g:0,b:0,a:1},

            selectedObjectListItem:undefined,//オブジェクトリスト用

            imageInput:null,
            isDragOver:false,

            copyDialog:false,
        }
    },
    methods:{
        //DRAG
        onDragEnter(){
            this.isDragOver=true;
        },
        onDragLeave(){
            this.isDragOver=false;
        },
        onImageDrop(event){
            const files=event.dataTransfer.files;
            if(files===null || files.length===0){
                return;
            }
            const file=files[0];//1つのみドラッグ可能

            this.onImageChange(file);
        },
        onImageChange(file){
            if(file===undefined || file===null){
                return;
            }
            this.imageInput=file;

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
                const targetSize=700;

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

                this.canvas.setBackgroundImage(imgObj);

                this.canvas.setWidth(imgObj.get("width")*imgObj.get("scaleX"));
                this.canvas.setHeight(imgObj.get("height")*imgObj.get("scaleY"));
                imgObj.set({
                    left:this.canvas.get("width")/2-imgObj.get("width")*imgObj.get("scaleX")/2,
                    top:this.canvas.get("height")/2-imgObj.get("height")*imgObj.get("scaleY")/2,
                })
                // this.canvas.add(imgObj);
                this.canvas.renderAll();
            });
            
        },
        createLine(){
            const line=createDefaultLine();
            this.userObjects.push(new UserObject(
                "線",
                "line",
                line
            ));
            this.setEventOnSelect(line);
            this.selectObject(line);

            this.canvas.add(line);
            this.canvas.renderAll();
        },
        createCircle(){
            const circle=createDefaultCircle();
            
            this.userObjects.push(new UserObject(
                "円",
                "circle",
                circle
            ));
            this.setEventOnSelect(circle);
            this.selectObject(circle);


            this.canvas.add(circle);
            this.canvas.renderAll();
        },
        createRectangle(){
            const rectangle=createDefaultRect();

            this.userObjects.push(new UserObject(
                "四角形",
                "rect",
                rectangle
            ));
            this.setEventOnSelect(rectangle);
            this.selectObject(rectangle);

            this.canvas.add(rectangle);
            this.canvas.renderAll();
        },
        createArrow(){

            const arrow = createDefaultArrow();
            this.userObjects.push(new UserObject(
                "矢印",
                "arrow",
                arrow
            ));
            this.setEventOnSelect(arrow);
            this.selectObject(arrow);

            this.canvas.add(arrow);
            this.canvas.renderAll();


        },
        downloadAsPng(){
            this.canvasCommonProcess(this.downloadCanvas);
        },
        canvasCommonProcess(actionFunc){
            this.canvas.discardActiveObject();
            this.canvas.renderAll();
            //元の画像のサイズを見て、キャンバスサイズより大きい時に
            //元の大きさと同じ仮想キャンバスを作り、そこからダウンロードする
            const file=this.imageInput;
            if(file===undefined || file===null){
                return;
            }

            const fr=new FileReader();
            fr.readAsDataURL(file);
            fr.addEventListener("load",()=>{
                const imgUrl=fr.result;
                fabric.Image.fromURL(imgUrl,imgObj=>{
                    // const canvasImgMaxWidth=600; //canvas内での画像サイズ
                    // const canvasImgMaxHeight=600;//canvas内での画像サイズ

                    imgObj.set({
                        selectable:false,
                    });

                    const width=imgObj.get("width");
                    const height=imgObj.get("height");
                    
                    if(width>700 || height>700){
                        //キャンバス作成
                        const canvasElement=document.createElement("canvas");
                        canvasElement.id="canvasForDownload"
                        document.getElementById("virtualCanvas").appendChild(canvasElement);
                        //fabric のキャンバス作成
                        const canvas=new fabric.Canvas("canvasForDownload",{
                            backgroundColor:this.toRGBA,
                        });
                    
                        canvas.setWidth(width);
                        canvas.setHeight(height);

                        let scale=1;
                        if(width>height){
                            scale=width/700;
                        }else{
                            scale=height/700;
                        }
                        canvas.setBackgroundImage(imgObj);

                        //オブジェクトをコピーしてキャンバス上に表示
                        //キャンバス上のサイズを考慮する
                        canvas.discardActiveObject();

                        for(let i=0;i<this.userObjects.length;i++){
                            const clonedObj=fabric.util.object.clone(this.userObjects[i].fabricObject)
                            canvas.add(clonedObj);
                        }

                        canvas.setZoom(scale)
                        canvas.backgroundImage.scaleX=1/scale;
                        canvas.backgroundImage.scaleY=1/scale;

                        canvas.renderAll();
                        // downloadCanvas(canvasElement)
                        actionFunc(canvasElement);
                        document.getElementById("virtualCanvas").innerHTML="";
                    }else{
                        actionFunc(document.getElementById("canvas"));
                        
                    }
                });

            })
        },
        copyToClipboard(){
            this.canvasCommonProcess(this.copyToClipboardFromCanvas);
        },
        copyToClipboardFromCanvas(canvas){
            //https://stackoverflow.com/questions/60400589/copy-image-to-clipboard-using-javascript
            canvas.toBlob(blob=>{
                navigator.clipboard.write([
                    new ClipboardItem({
                        [blob.type]:blob
                    })
                ]).then(()=>{
                    this.copyDialog=true;
                    console.log(this.copyDialog)
                })
            })
        },
        deleteObject(index){
            const userObject=this.userObjects[index];

            this.canvas.remove(userObject.fabricObject);
            this.userObjects.splice(index,1);
        },
        onListItemClick(index){

            //canvasのobjectを選択する
            // this.canvas.discardActiveObject();
            // this.canvas.setActiveObject(this.userObjects[index].fabricObject);
            // this.canvas.renderAll();
            this.selectActiveObjectOnCanvas(index);

            //object設定を表示する objectnの情報を取得して設定しておく
            // this.selectedObject=this.userObjects[index].fabricObject;
            // if(this.userObjects[index].type==="arrow"){
            //     // this.strokeWidth=this.selectedObject.get("strokeWidth");
            //     this.strokeColor=colorTextToRgba(this.selectedObject.get("fill"));
            // }else{
            //     this.strokeWidth=this.selectedObject.get("strokeWidth");
            //     this.strokeColor=colorTextToRgba(this.selectedObject.get("stroke"));
            // }
            this.updateObjectSettings(index);

        },
        //選択状態のキャンバス上のオブジェクトをコントローラーを表示されている状態にする
        selectActiveObjectOnCanvas(index){
            this.canvas.discardActiveObject();
            this.canvas.setActiveObject(this.userObjects[index].fabricObject);
            this.canvas.renderAll();
        },
        onDeleteButtonDown(){
            const selected=this.selectedObject;
            if(selected===null){
                return;
            }
            const index=this.userObjects.findIndex(v=>v.fabricObject===selected);
            if(index===-1){
                return;
            }
            this.deleteObject(index);
        },
        setEventOnSelect(fabricObject){
            const self=this;
            fabricObject.on("selected",function(){
                const index=self.userObjects.findIndex((v)=>v.fabricObject===this);
                self.selectedObjectListItem=index;
                self.selectedObject=self.userObjects[index].fabricObject;
                self.updateObjectSettings(index);
            })
        },
        selectObject(fabricObject){
            // console.log(this.userObjects)
            const index=this.userObjects.findIndex((v)=>v.fabricObject===fabricObject);
            // console.log(index);
            this.selectedObjectListItem=index;
            this.selectedObject=this.userObjects[index].fabricObject;
            this.selectActiveObjectOnCanvas(index);
            this.updateObjectSettings(index);
        },
        updateObjectSettings(index){
            this.selectedObject=this.userObjects[index].fabricObject;
            if(this.userObjects[index].type==="arrow"){
                // this.strokeWidth=this.selectedObject.get("strokeWidth");
                this.strokeColor=colorTextToRgba(this.selectedObject.get("fill"));
            }else{
                this.strokeWidth=this.selectedObject.get("strokeWidth");
                this.strokeColor=colorTextToRgba(this.selectedObject.get("stroke"));
            }
        },
        tweet(){
            const link=document.createElement("a");

            const text=encodeURI("楽々！画像中に注目点を書き込み！\n\n");
            const websiteUrl=encodeURI("https://kakikomi-tyumokuten.vercel.app\n");
            const hashtags="書き込み注目点";
            
            let url=`https://twitter.com/intent/tweet?text=${text}&url=${websiteUrl}&hashtags=${hashtags}`;
            link.href=url;
            link.target="_blank"
            link.click();
        }

    },
    computed:{
        toRGBA(){
            // return `rgba(${this.canvasBackgroundColor.r},${this.canvasBackgroundColor.g},${this.canvasBackgroundColor.b},${this.canvasBackgroundColor.a})`;
            return rgbaToFabricColorText(this.canvasBackgroundColor);
        },
        
    }
}
</script>
<style scoped>

#canvas {
    border: 1px solid lightgrey;
}

.isDragOver{
    border:2px dashed blue;
}

</style>