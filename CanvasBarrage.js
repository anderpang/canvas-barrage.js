(function (context,factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        exports.__esModule = true;
        exports["default"] = CanvasBarrage;
    }
    else if (typeof define === "function" && define.amd) {
        define(factory);
    }
    else{
       context.CanvasBarrage=factory();
    }
})(this,function () {
    "use strict";

    var CanvasBarrage = /** @class */ (function () {
        function CanvasBarrage(video, width) {
            if (width === void 0) { width = 1040; }
            this.video = video;
            this.width = width;
            this._data = []; // 全部数据
            this._visible = true;
            this._index = 0;
            this._showList = []; // 显示数据
            this._rowCount = 1; // 总行数（用高度除以行高得出)
            this._rows = [];
            this.color = "#FFF";
            this.fontSize = 20; // 字号
            this.lineHeight = this.fontSize * 1.5; // 行高(像素)
            this.opacity = 1;
            this.speed = 200; // 秒速度
            this._timer = 0;
            this._isReady = false;
            this._isStart = false;
            video.addEventListener('canplaythrough', this, false);
            video.addEventListener('playing', this, false);
            video.addEventListener('ended', this, false);
            // video.addEventListener('timeupdate',this,false);
            // 进度条已经移动到了新的位置
            video.addEventListener('seeked', this, false);
            this._loop = this._loop.bind(this);
        }
        CanvasBarrage.prototype._ready = function () {
            var _a;
            if (this._isReady) {
                return;
            }
            this._isReady = true;
            var canvas = document.createElement("canvas"), video = this.video, bound = video.getBoundingClientRect();
            this.height = bound.height / bound.width * this.width;
            this._rowCount = this.height / this.lineHeight | 0;
            canvas.className = "canvas-barrage";
            canvas.width = this.width;
            canvas.height = this.height;
            this.ctx = canvas.getContext("2d");
            this.ctx.font = this.fontSize + "px null";
            // this.ctx.shadowBlur    = 4;
            // this.ctx.shadowColor   = "#000";
            (_a = video.parentNode) === null || _a === void 0 ? void 0 : _a.appendChild(canvas);
            video.addEventListener('canplaythrough', this, false);
            this.canvas = canvas;
        };
        CanvasBarrage.prototype.handleEvent = function (e) {
            switch (e.type) {
                case "canplaythrough":
                    // 调整尺寸
                    this._ready();
                    break;
                case "playing":
                    this.start();
                    break;
                case "ended":
                    this.stop();
                    break;
                case "seeked":
                    this._showList.length = this._index = 0;
                    break;
            }
        };
        // 进行时间排序，就不用每次都循环整个数组
        CanvasBarrage.prototype._sort = function () {
            this._data.sort(function (a, b) {
                return a.during - b.during;
            });
        };
        // 计算宽
        CanvasBarrage.prototype._calc = function (item) {
            var textWidth = item.text.length * this.fontSize;
            item._width = textWidth;
            item.speed = item.speed || this.speed;
            item.color = item.color || this.color;
            item.opacity = item.opacity || this.opacity;
        };
        CanvasBarrage.prototype._setRowIndex = function (item, lineHeight) {
            var _rows = this._rows, i = 0, result = -1, _rowCount = this._rowCount;
            for (; i < _rowCount; i++) {
                if (_rows[i] === 0) {
                    result = i;
                    item._y = (result + 1) * lineHeight;
                    _rows[i] = 1;
                    break;
                }
            }
            // 如果全占满了，随机一个位置
            if (result === -1) {
                result = Math.random() * _rowCount | 0;
                _rows[result]++;
                item._y = Math.max(lineHeight, (result - 0.5) * lineHeight);
            }
            item._rowIndex = result;
            item._locked = true;
        };
        CanvasBarrage.prototype._loop = function () {
            if (!this._visible) {
                return;
            }
            var ctx = this.ctx, width = this.width, height = this.height, index = this._index, data = this._data, len = data.length, currentTime = this.video.currentTime, showList = this._showList, item, lineHeight = this.lineHeight;
            this._timer = requestAnimationFrame(this._loop);
            ctx.clearRect(0, 0, width, height);
            for (; index < len; index++) {
                item = data[index];
                if (item.during < currentTime) {
                    if (showList.indexOf(item) === -1) {
                        this._setRowIndex(item, lineHeight);
                        showList.push(item);
                    }
                }
                else {
                    break;
                }
            }
            this._index = index;
            this._draw(ctx, showList, currentTime);
        };
        CanvasBarrage.prototype._draw = function (ctx, showList, currentTime) {
            var i = showList.length, item, duration, speed, distance, width = this.width, _rows = this._rows;
            //console.log(showList)
            while (i--) {
                item = showList[i];
                duration = currentTime - item.during;
                speed = item.speed;
                distance = speed * duration;
                // console.log(distance,width + item._width!,distance > width + item._width!)
                // 清出轨道
                if (item._locked && distance > item._width) {
                    item._locked = false;
                    _rows[item._rowIndex]--;
                }
                if (distance > width + item._width) {
                    showList.splice(i, 1);
                }
                else {
                    ctx.fillStyle = item.color;
                    ctx.globalAlpha = item.opacity;
                    ctx.beginPath();
                    ctx.fillText(item.text, width - distance, item._y);
                }
            }
        };
        // 添加记录
        CanvasBarrage.prototype.push = function (records) {
            var data = this._data;
            if (Array.isArray(records)) {
                records.forEach(this._calc.bind(this));
                data.push.apply(data, records);
                this._sort();
            }
            else {
                var i = 0, ii = data.length, isInserted = false;
                this._calc.call(this, records);
                for (; i < ii; i++) {
                    if (records.during < data[i].during) {
                        data.splice(i, 0, records);
                        isInserted = true;
                        break;
                    }
                }
                if (!isInserted) {
                    data.push(records);
                }
            }
            return this;
        };
        // 开启
        CanvasBarrage.prototype.show = function () {
            this.canvas.style.visibility = "";
            this._visible = true;
            this._loop();
            return this;
        };
        // 隐藏
        CanvasBarrage.prototype.hide = function () {
            this.canvas.style.visibility = "hidden";
            this._visible = false;
            this.stop(true);
            return this;
        };
        CanvasBarrage.prototype.start = function () {
            if (this._isStart) {
                return this;
            }
            var i = this._rowCount, _rows = this._rows;
            this._isStart = true;
            this._index = 0;
            while (i--) {
                _rows[i] = 0;
            }
            this._loop();
            return this;
        };
        CanvasBarrage.prototype.stop = function (isHide) {
            if (isHide === void 0) { isHide = false; }
            this._isStart = false;
            if (!isHide) {
                this._showList.length = 0; // 可能有些超出时间长度的
            }
            cancelAnimationFrame(this._timer);
        };
        return CanvasBarrage;
    }());
    return CanvasBarrage;
});