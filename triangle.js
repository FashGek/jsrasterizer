

class Triangle {


    constructor() {
        this.v = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
        this.color = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
        this.uv = [[0, 0], [0, 0], [0, 0]];
        this.n = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
    }


    set_vertext(ind, ver) {
        // console.log(ind, ver);
        this.v[ind] = ver;
    }

    set_normal(ind, n) {
        this.n[ind] = n;
    }

    set_color(ind, r, g, b) {
        this.color[ind][0] = r / 255;
        this.color[ind][1] = g / 255;
        this.color[ind][2] = b / 255;
    }

    get_color() {

    }

    set_uv(ind, s, t) {
        this.uv[ind] = [s, t];
    }

    to_vec4() {
        // triang has 3 point, each point has 3 component
        let res = [];

        for (const i in this.v) {
            res.push([this.v[i][0], this.v[i][1], this.v[i][2], 1.0]);
        }


        return res;
    }
}