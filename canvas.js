

class Canvas {


    constructor(resW, resH, canvasW, canvasH) {
        
        this.resWidth = resW;
        this.resHeight = resH;
        this.canvasWidth = canvasW;
        this.canvasHeight = canvasH;

    }

    init(ctx, id) {
        //this.canvas = document.getElementById(id);
        //this.ctx = this.canvas.getContext('2d');
        this.ctx = ctx;
        this.id = id;
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        this.ctx.clearRect(0, 0, this.resW, this.resH);
    }

    set_pixel(x, y, c) {
        console.log(id);
                var off = (y * this.id.width + x) * 4;
                this.id.data[off] = c[0];
                this.id.data[off + 1] = c[1];
                this.id.data[off + 2] = c[2];
                this.id.data[off + 3] = 255;
    }

    write_pixels(data) {

        this.clear();

        let id = this.ctx.getImageData(0, 0, this.width, this.height);
        let ptr = id.data;

        console.log(id);



        // 一共800*600个点，但是每个点中含有4个数据
 /*
        for (var i = 0; i < 100000; ++i) {
            var x = Math.floor(Math.random() * this.width);
            var y = Math.floor(Math.random() * this.height);
            var r = Math.floor(Math.random() * 256);
            var g = Math.floor(Math.random() * 256);
            var b = Math.floor(Math.random() * 256);
            var off = (y * id.width + x) * 4;
            ptr[off] = r;
            ptr[off + 1] = g;
            ptr[off + 2] = b;
            ptr[off + 3] = 255;
          }*/

          for (let x = 0; x <= this.width; ++x) {
              for (let y = 0; y < this.height; ++y) {
                var r = Math.floor(Math.random() * 256);
                var g = Math.floor(Math.random() * 256);
                var b = Math.floor(Math.random() * 256);
                var off = (y * id.width + x) * 4;
                if (x > 300 && x < 400 && y > 300 && y < 400) { 
                   
                    ptr[off] = r;
                    ptr[off + 1] = g;
                    ptr[off + 2] = b;
                    ptr[off + 3] = 255;
                }
                else {
                    ptr[off] = 0;
                    ptr[off + 1] = 0;
                    ptr[off + 2] = 0;
                    ptr[off + 3] = 0;
                }

                // console.log(x, y, off);
                //console.log(off, ptr[off], ptr[off+1]);
              }
          }

          //console.log(id);

          this.ctx.putImageData(id, 0, 0);
/*
        for (let x = 10; x < 400; ++x) {
            for (let y = 10; y < 400; ++y) {

                var r = Math.floor(Math.random() * 256);
                var g = Math.floor(Math.random() * 256);
                var b = Math.floor(Math.random() * 256);

                let idx = (y * id.width + x) * 4;
                ptr[idx] = r;
                ptr[idx+1] = g;
                ptr[idx+2] = b;
                ptr[idx+3] = 255;

                    // var r = Math.floor(Math.random() * 256);
                    // var g = Math.floor(Math.random() * 256);
                    // var b = Math.floor(Math.random() * 256);
                    // var off = (y * id.width + x) * 4;
                    // ptr[off] = r;
                    // ptr[off + 1] = g;
                    // ptr[off + 2] = b;
                    // ptr[off + 3] = 255;

                this.ctx.putImageData(id, x, y);
            }
        }

        */
    }


}