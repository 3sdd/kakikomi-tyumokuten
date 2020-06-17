<template>
    <div>
        <v-card min-height="800" min-width="800" class="mx-auto">
            <v-layout justify-center>
                <v-container>
                    <v-row>
                        <canvas id="canvas" width="600" height="600">
                        </canvas>
                    </v-row>
                    <v-row>
                        <v-card>
                            <v-container>
                                <v-row>
                                    <div>
                                        <v-btn color="primary">
                                            <img src="~/assets/icon-line.svg" width="32" height="32">
                                        </v-btn>
                                    </div>
                                    <div>
                                        <v-btn color="primary">
                                            <img src="~/assets/icon-circle.svg" width="32" height="32">
                                        </v-btn>
                                    </div>
                                    <div>
                                        <v-btn color="primary">
                                            <img src="~/assets/icon-rectangle.svg" width="32" height="32">
                                        </v-btn>
                                    </div>
                                    <div>
                                        <v-btn color="primary">
                                            <img src="~/assets/icon-arrow.svg" width="32" height="32">
                                        </v-btn>
                                    </div>
                                </v-row>
                            </v-container>
                        </v-card>
                    </v-row>
                    <v-row>
                        <v-col class="text-center" cols="6">
                            <v-file-input filled prepend-icon="mdi-camera" label="元画像" accept="image/*" placeholder="画像を選択">
                            </v-file-input>
                        </v-col>
                        <v-col class="text-center" cols="6">
                            <v-btn>
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
        const rect=new fabric.Rect({
            left:100,
            top:100,
            fill:"red",
            width:20,
            height:20,
            angle:45
        })
        rect.set({
            strokeWidth:5,
            stroke:"white"
        })
        console.log(rect.getAngleInRadians())
        this.canvas.add(rect);

        const circle=new fabric.Circle({
            radius:20,
            fill:"red",
            left:200,
            top:200,
        })
        console.log(circle.getAngleInRadians())
        this.canvas.add(circle);

        // console.log(this.canvas.item(0));
        // console.log(this.canvas.getObjects())
        // this.canvas.remove(rect);
        // console.log(this.canvas.item(0));
        // console.log(this.canvas.getObjects())
        // rect.set({
        //     left:20,
        //     top:50
        // });
        // this.canvas.renderAll();
        // const imgElement=document.getElementById("my-image");
        // const imgInstance=new fabric.Image(imgElement,{
        //     left:100,
        //     top:100,
        //     height:100,
        //     width:100,
        //     angle:30,
        //     opacity:0.85
        // });
        // this.canvas.add(imgInstance);

        // const canvas=this.canvas;
        // fabric.Image.fromURL("araisan.png",function(oImg){
        //     // oImg.scale(0.5)
        //     canvas.add(oImg);
        // })

        const path=new fabric.Path("M 0 0 L 200 100 L 170 200 z");
        path.set({left:120,top:120})
        path.set({
            fill:"red",
            stroke:"green",
            opacity:0.5
        })
        this.canvas.add(path);
    },
    data(){
        return {
            canvas:null
        }
    }
}
</script>
<style scoped>

#canvas {
    border: 1px solid lightgrey;
}

</style>