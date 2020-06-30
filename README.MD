# CanvasBarrage.js

barrage canvas video

### [demo](http://wuweierwei.com/demo/canvas-barrage/demo.html)

### Installation

```bash
$ npm install canvas-barrage.js
```

```bash
 import CanvasBarrage from "canvas-barrage.js";
```

or

```html
<style>
.video-wrap{position:relative;}
.video-wrap>video{width:100%;}
.canvas-barrage{position:absolute;z-index:5;left:0;top:0;width:100%;pointer-events: none;}
</style>

<div class="video-wrap">
    <video controls src="" />
</div>

<script src="./CanvasBarrage.js"></script>
```

### Usage
```js
var video=document.querySelector("video");    // dom

var barrage=new CanvasBarrage(video, 800);    // (dom, maxWidth)

/*
    barrage.color = "#FFF";
    barrage.fontSize = 20;                   // 字号
    barrage.lineHeight = barrage.fontSize * 1.5;             // 行高像素
    barrage.opacity=1;
    barrage.speed = 200;
*/

barrage.push([
    {
        during:0,
        text:"hello world!"
    },
    {
        during:1.5,
        text:"After 1.5 seconds...",
        color:"#0F0"
    }
]);

```

## METHODS
```ts
interface IBarrageItem {
    during: number,
    text: string,

    color?: string,
    speed?: number,
    opacity?: number
};

declare class CanvasBarrage {
    video: HTMLElement;
    width: number;
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    height: number;
    
    color: string;
    fontSize: number;
    lineHeight: number;
    opacity: number;
    speed: number;
    constructor(video: HTMLElement, width?: number);
    push(records: IBarrageItem | IBarrageItem[]): CanvasBarrage;
    show(): this;
    hide(): this;
}
```
