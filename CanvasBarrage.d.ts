interface IBarrageItem {
    during: number;
    text: string;
    color?: string;
    speed?: number;
    opacity?: number;
}
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
export default CanvasBarrage;