// Code goes here

var canvas;
var ctx;
var canvasWidth;
var canvasHeight;
var id;
var canvasWrapper;
var rst;
var frame_count = 0;
var angle = 0;


function imageData() {

  startTestWarn();
  var cycles = document.getElementById('cycles');
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  ctx.clearRect(0, 0, 500, 500);

  //canvasWrapper.clear();
  var id = ctx.getImageData(0, 0, 500, 500);
  var pixels = id.data;

  var t0 = new Date().getTime();


  for (var x = 0; x < canvasWidth; ++x) {
    for (var y = 0; y < canvasHeight; ++y) {


      let col = rst.frame_buf[y * id.width + x];


      var off = (y * id.width + x) * 4;
      pixels[off] = col[0];
      pixels[off + 1] = col[1];
      pixels[off + 2] = col[2];
      pixels[off + 3] = col[3];
    }
  }



  ctx.putImageData(id, 0, 0);

  var t1 = new Date().getTime();
  displayPerfStats('imageData method: ', (t1 - t0) / 1000);
}


function get_model_matrix(angle) {

  
  angle = angle * math.pi / 180.0;

  // 绕y轴旋转
  let rotation = math.matrix([
      [math.cos(angle), 0, math.sin(angle), 0],
      [0, 1, 0, 0],
      [-math.sin(angle), 0, math.cos(angle), 0],
      [0, 0, 0, 1]
  ]
  );

  let s = 1.0;
  let scale = math.matrix([
      [s,0, 0, 0],
      [0, s, 0, 0],
      [0, 0, s, 0],
      [0, 0, 0, 1]
  ]
  );

  let translate = math.matrix([
      [1, 0, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 1, 0],
      [0, 0, 0, 1]
  ]
  );

  return math.multiply(translate, math.multiply(rotation, scale));

  // return math.identity(4, 4);
}

function get_view_matrix(eye_pos) {


  let view = math.identity(4, 4);

  let translate = math.matrix([
    [1, 0, 0, -eye_pos[0]],
    [0, 1, 0, -eye_pos[1]],
    [0, 0, 1, -eye_pos[2]],
    [0, 0, 0, 1]
  ]
  )

  return math.multiply(translate, view);
}


function get_projection_matrix(eye_fov, aspect_ratio, zNear, zFar) {


  let projection = math.identity(4, 4);

  let t = zNear * math.tan(eye_fov / 2);
  let b = -t;
  let r = t * aspect_ratio;
  let l = -r;

  let ortho = math.matrix([
    [2 / (r - l), 0, 0, (r + l) / (l - r)],
    [0, 2 / (t - b), 0, (t + b) / (b - t)],
    [0, 0, 2. / (zFar - zNear), (zFar + zNear) / (zNear - zFar)],
    [0, 0, 0, 1]
  ]
  );

  let proj_to_ortho = math.matrix([
    [-zNear, 0, 0, 0],
    [0, -zNear, 0, 0],
    [0, 0, -(zNear + zFar), -zNear * zFar],
    [0, 0, 1, 0]
  ]
  );

  return math.multiply(ortho, proj_to_ortho)
}



function render() {
  frame_count += 1;

  angle += 3;

  eye_pos = [0, 0, 5];

  let pos = [];
  let ind = [];
  let cols = [];


  const cube = true;

  if (cube) {
    pos = [
      [0, 0, 0],
      [1, 0, 0],
      [0, 1, 0],
      [1, 1, 0],
      [0, 0, -1],
      [1, 0, -1],
      [0, 1, -1],
      [1, 1, -1],
    ];
  
    ind = [
      // front
      [0, 1, 2],
      [2, 1, 3],
      // back
      [4, 5, 6],
      [6, 5, 7],
      //top
      [2, 3, 6],
      [6, 3, 7],
      //bottom
      [0, 1, 4],
      [4, 1, 5],
      //left
      [0, 4, 2],
      [4, 2, 6],
      //right
      [1, 5, 3],
      [3, 5, 7]
    ];
  
    cols = [
      [217.0, 28.0, 185.0],
      [217.0, 238.0, 35.0],
      [217.0, 255.0, 185.0],
      [185.0, 217.0, 238.0],
      [132.0, 17.0, 23.0],
      [15.0, 217.0, 38.0],
      [12.0, 217.0, 36.0],
      [15.0, 75.0, 38.0],
    ]
  } else {
    pos = [
      [2, 0, -2],
      [0, 2, -2],
      [-2, 0, -2],
      [3.5, -1, -5],
      [2.5, 1.5, -5],
      [-1, 0.5, -5]
    ];
  
    ind = [
      [0, 1, 2],
      [3, 4, 5]
    ];
  
    cols = [
      [217.0, 28.0, 185.0],
      [217.0, 238.0, 35.0],
      [217.0, 255.0, 185.0],
      [185.0, 217.0, 238.0],
      [132.0, 17.0, 23.0],
      [15.0, 217.0, 38.0],
    ]
  }
/*
  
*/



  let pos_id = rst.load_pos(pos);
  let ind_id = rst.load_indicies(ind);
  let col_id = rst.load_colors(cols);

  rst.clear();
  rst.set_model(get_model_matrix(angle));
  rst.set_view(get_view_matrix(eye_pos));
  rst.set_projection(get_projection_matrix(45.0, 1, 0.1, 50));

  rst.draw(pos_id, ind_id, col_id, 0);

  imageData();
  
      setTimeout(() => {
          render();
      }, 1000);
}

function InitTests() {
  canvas = document.getElementById('canvas');
  ctx = canvas.getContext('2d');
  canvasWidth = canvas.width;
  canvasHeight = canvas.height;
  id = ctx.getImageData(0, 0, 1, 1);

  //canvasWrapper = new Canvas(500, 500, canvasWidth, canvasHeight);
  //canvasWrapper.init(ctx, id);

  rst = new Rasteriszer(canvasWidth, canvasHeight);

  render();

}

function startTestWarn() {
  var output = document.getElementById('output');
  output.innerHTML = 'Calculating...';
}

function displayPerfStats(outText, outValue) {
  var output = document.getElementById('output');
  output.innerHTML = outText + outValue + ' seconds';
}
