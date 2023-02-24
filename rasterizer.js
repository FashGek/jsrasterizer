

class Rasteriszer {



    constructor(w, h) {

        this.width = w;
        this.height = h;
        this.model = math.identity(4, 4);
        this.view = math.identity(4, 4);
        this.projection = math.identity(4, 4);
        this.pos_buf = new Map();
        this.ind_buf = new Map();
        this.col_buf = new Map();
        this.frame_buf = new Array(w * h);
        this.depth_buf = new Array(w * h);
        this.next_id = 0;



    }

    get_nextid() {
        this.next_id = this.next_id + 1
        return this.next_id
    }

    get_index(x, y) {
        // return (this.height - 1 - y)*this.width + x;
        return y * this.width + x;
    }

    load_pos(positions) {
        const id = this.get_nextid();
        this.pos_buf[id] = positions;
        return id;
    }

    load_indicies(indices) {
        const id = this.get_nextid()
        this.ind_buf[id] = indices;
        return id;
    }

    load_colors(colors) {
        const id = this.get_nextid()
        this.col_buf[id] = colors;
        return id;
    }

    set_model(m) {
        this.model = m;
    }

    set_view(v) {
        this.view = v;
    }

    set_projection(p) {
        this.projection = p;
    }

    set_pixel(point, color) {
        // 这里只是一种把x,y映射成一个整数的办法而已,只要能保证它的唯一性就是可以了
        const ind = point[1] * this.width + point[0]; //(this.height - point[1] - 1) * this.width + point[0];

        //console.log(ind, point, color);

        const off = ind * 4;
        // this.frame_buf[off] = [0, 0, 0, 0];
        this.frame_buf[off] = color[0];
        this.frame_buf[off + 1] = color[1];
        this.frame_buf[off + 2] = color[2];
        this.frame_buf[off + 3] = 255;

        //console.log(ind, point, color, this.frame_buf[off], this.frame_buf[off+1], this.frame_buf[off+2], this.frame_buf[off+3]);

    }

    clear() {
        // this.frame_buf.length = 0;
        for (let i = 0; i < this.frame_buf.length; ++i) {

            this.frame_buf[i] = [0, 0, 0, 255];
        }

        for (let i = 0; i < this.depth_buf.length; ++i) {
            this.depth_buf[i] = Number.MAX_VALUE; //[Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE];
        }
    }

    to_vec4(v3, w) {
        return [v3[0], v3[1], v3[2], w];
    }

    draw3(pos_id, ind_id, col_id, primitive_type) {



        for (let i = 0; i < this.frame_buf.length; ++i) {
            let x = i / this.width;
            let y = i % this.width;

            var r = Math.floor(Math.random() * 256);
            var g = Math.floor(Math.random() * 256);
            var b = Math.floor(Math.random() * 256);

            if (x > 0 && x < 100 && y > 0 && y < 100) {
                this.frame_buf[i][0] = r;
                this.frame_buf[i][1] = g;
                this.frame_buf[i][2] = b;
                this.frame_buf[i][3] = 255;
            }

            if (x > 400 && x < 500 && y > 400 && y < 500) {
                this.frame_buf[i][0] = r;
                this.frame_buf[i][1] = g;
                this.frame_buf[i][2] = b;
                this.frame_buf[i][3] = 255;
            }
        }

        /*
        for (let p of this.frame_buf) {
            var r = Math.floor(Math.random() * 256);
            var g = Math.floor(Math.random() * 256);
            var b = Math.floor(Math.random() * 256);

            p[0] = r;
            p[1] = g;
            p[2] = b;
            p[3] = 255;

            
        }*/
    }

    draw(pos_id, ind_id, col_id, primitive_type) {

        const buf = this.pos_buf[pos_id];
        const ind = this.ind_buf[ind_id];
        const col = this.col_buf[col_id];

        const f1 = (50 - 0.1) / 2.0;
        const f2 = (50 + 0.1) / 2.0;

        // const mvp = math.identity(4, 4); 
        const mvp = math.multiply(math.multiply(this.projection, this.view), this.model);

        // console.log(this.view._data, this.projection._data, this.model._data);
        // console.log((this.height - 1 * this.width + this.width - 1) * 4, this.frame_buf.length);


        for (const id of ind) {
            //console.log(id, '  begin');

            let t = new Triangle();


            let x = math.multiply(mvp, [buf[id[0]][0], buf[id[0]][1], buf[id[0]][2], 1.]);
            let y = math.multiply(mvp, [buf[id[1]][0], buf[id[1]][1], buf[id[1]][2], 1.]);
            let z = math.multiply(mvp, [buf[id[2]][0], buf[id[2]][1], buf[id[2]][2], 1.]);
            let v = [
                //math.multiply(mvp, [buf[id[0]][0], buf[id[0]][1], buf[id[0]][2], 1.]),
                //math.multiply(mvp, [buf[id[1]][0], buf[id[1]][1], buf[id[1]][2], 1.]),
                //math.multiply(mvp, [buf[id[2]][0], buf[id[2]][1], buf[id[2]][2], 1.])
                x._data,
                y._data,
                z._data
            ];

            for (let vec in v) {
                v[vec] = math.divide(v[vec], v[vec][3]);
            }

            // console.log(v);

            // viewport transform
            for (let vert of v) {
                vert[0] = 0.5 * this.width * (vert[0] + 1);
                vert[1] = 0.5 * this.height * (vert[1] + 1);
                vert[2] = -vert[2] * f1 + f2;
            }

            for (let i = 0; i < 3; ++i) {
                t.set_vertext(i, [v[i][0], v[i][1], v[i][2]]);
                // t.set_vertext(i, v[i])
            }


            // const col_x = col
            const col_x = col[id[0]];
            const col_y = col[id[1]];
            const col_z = col[id[2]];

            t.set_color(0, col_x[0], col_x[1], col_x[2]);
            t.set_color(1, col_y[0], col_y[1], col_z[2]);
            t.set_color(2, col_z[0], col_z[1], col_z[2]);

            // console.log(t);
            this.rasterize_triangle(t);

            //console.log(id, '  end');

        }

    }

    inside_triangle(x, y, _v) {
        let v0 = math.subtract(_v[1], _v[0]);
        let v1 = math.subtract(_v[2], _v[1]);
        let v2 = math.subtract(_v[0], _v[2]);

        const v = [x, y, 0];

        // console.log(v, _v[0],  math.subtract(v, _v[0]));

        const t0 = math.cross(math.subtract(v, _v[0]), v0)[2];
        const t1 = math.cross(math.subtract(v, _v[1]), v1)[2];
        const t2 = math.cross(math.subtract(v, _v[2]), v2)[2];

        if ((t0 > 0 && t1 > 0 && t2 > 0) || (t0 < 0 && t1 < 0 && t2 < 0)) {
            return true;
        }

        return false;
    }


    compute_barycentric2d(x, y, v) {
        const c1 = (x * (v[1][1] - v[2][1]) + (v[2][0] - v[1][0]) * y + v[1][0] * v[2][1] - v[2][0] * v[1][1]) / (v[0][0] * (v[1][1] - v[2][1]) + (v[2][0] - v[1][0]) * v[0][1] + v[1][0] * v[2][1] - v[2][0] * v[1][1]);
        const c2 = (x * (v[2][1] - v[0][1]) + (v[0][0] - v[2][0]) * y + v[2][0] * v[0][1] - v[0][0] * v[2][1]) / (v[1][0] * (v[2][1] - v[0][1]) + (v[0][0] - v[2][0]) * v[1][1] + v[2][0] * v[0][1] - v[0][0] * v[2][1]);
        const c3 = (x * (v[0][1] - v[1][1]) + (v[1][0] - v[0][0]) * y + v[0][0] * v[1][1] - v[1][0] * v[0][1]) / (v[2][0] * (v[0][1] - v[1][1]) + (v[1][0] - v[0][0]) * v[2][1] + v[0][0] * v[1][1] - v[1][0] * v[0][1]);
        return [c1, c2, c3];
    }


    rasterize_triangle(t) {
        const v = t.to_vec4();


        const a = t.v[0];
        const b = t.v[1];
        const c = t.v[2];


        const xmin = math.ceil(math.min(math.min(a[0], b[0]), c[0]));
        const ymin = math.ceil(math.min(math.min(a[1], b[1]), c[1]));
        const xmax = math.floor(math.max(math.max(a[0], b[0]), c[0]));
        const ymax = math.floor(math.max(math.max(a[1], b[1]), c[1]));
        // console.log(xmin, ymin, xmax, ymax);
        //console.log('begin loop');

        //for (let x = xmin; x <= xmax; ++x) {
        //    for (let y = ymin; y <= ymax; ++y) {
        for (let x = 0; x < this.width; ++x) {
            for (let y = 0; y < this.height; ++y) {

                var r1 = Math.floor(Math.random() * 256);
                var g1 = Math.floor(Math.random() * 256);
                var b1 = Math.floor(Math.random() * 256);

                if (x >= xmin && x <= xmax && y >= ymin && y <= ymax) {
                    //let ind = y * this.width + x;
                    //this.frame_buf[ind] = [r1, g1, b1, 255];


                    if (this.inside_triangle(x, y, t.v)) {


                        const bary_res = this.compute_barycentric2d(x, y, t.v);
                        let alpha = bary_res[0];
                        let beta = bary_res[1];
                        let gamma = bary_res[2];

                        let w_reciprocal = 1.0 / (alpha / v[0][3] + beta / v[1][3] + gamma / v[2][3]);
                        let z_interpolated = alpha * v[0][2] / v[0][3] + beta * v[1][2] / v[1][3] + gamma * v[2][2] / v[2][3];

                        let col_r = alpha * t.color[0][0] + beta * t.color[1][0] + gamma * t.color[2][0];
                        let col_g = alpha * t.color[0][1] + beta * t.color[1][1] + gamma * t.color[2][1];
                        let col_b = alpha * t.color[0][2] + beta * t.color[1][2] + gamma * t.color[2][2];

                        z_interpolated *= w_reciprocal;



                        const ind = y * this.width + x;
                        // console.log(x, y, ind, z_interpolated, this.depth_buf[ind]);
                        if (z_interpolated < this.depth_buf[ind]) {
                            // console.log(x, y);
                            // console.log(ind, col_r, col_g, col_b);
                            this.depth_buf[ind] = z_interpolated;
                            // this.set_pixel([x, y, 0], [col_r, col_g, col_b]);
                            this.frame_buf[ind] = [col_r * 256, col_g * 256, col_b * 256, 255];
                        }
                    }

                }

            }
        }

        // console.log('end loop');
    }

}