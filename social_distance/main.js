document.addEventListener("DOMContentLoaded", () => {
  
  const canvas = document.querySelector('#canvas-area');
  const context = canvas.getContext('2d');
  canvas.width = 800;
  canvas.height = 400;
  
  document.querySelector('#params').addEventListener('submit', (event) => {
    // submitのキャンセル
    event.stopPropagation();
    event.preventDefault();
    
    let row, col;
    const roomWidth = document.querySelector('#room-width').value;
    const roomHeight = document.querySelector('#room-height').value;
    const workPeople = document.querySelector('#work-people').value;
    
    // 最適列数を計算
    const baseCol = Math.abs(Math.sqrt(roomWidth * workPeople / roomHeight));
    
    // 最適列数付近の整数を2つ取得
    const tmpCol1 = Math.floor(baseCol) == 0 ? 1 : Math.floor(baseCol);
    const tmpCol2 = Math.ceil(baseCol);
    
    // 最適列数付近の整数から、行数の組み合わせを算出（人数が入り切るように小数点以下繰り上げ）
    const tmpRow1 = Math.ceil(workPeople / tmpCol1);
    const tmpRow2 = Math.ceil(workPeople / tmpCol2);
    
    // 2パターンの行列数の組み合わせから、部屋の比率に近い方を採用
    const roomRatio = roomWidth / roomHeight;
    const tmpRatio1 = tmpCol1 / tmpRow1;
    const tmpRatio2 = tmpCol2 / tmpRow2;
    const diff1 = Math.abs(roomRatio - tmpRatio1);
    const diff2 = Math.abs(roomRatio - tmpRatio2)    
    if (diff1 < diff2) {
      row = tmpRow1;
      col = tmpCol1;
    } else {
      row = tmpRow2;
      col = tmpCol2;
    }
    
    // 部屋の比率に合わせてキャンバスの比率を変更
    const canvasHeight = roomHeight / roomWidth * canvas.width;
    canvas.height = canvasHeight;
    
    // 行列要素の幅と高さ、中心点を算出
    const cellWidth = canvas.width / col;
    const cellHeight = canvas.height / row;
    const centerPointX = cellWidth / 2;
    const centerPointY = cellHeight / 2;    
    
    // 部屋の縮尺に対して、半径1m相当の円の半径
    const circleRadius = 1 / roomWidth * canvas.width;
    
    // 描画
    context.globalAlpha = 0.5;
    context.fillStyle = 'red';
    let drawCount = 0;
    for(let r = 0; r < row; r++) {
      for(let c = 0; c < col && drawCount < workPeople; c++, drawCount++) {
        let x = (c * cellWidth) + centerPointX;
        let y = (r * cellHeight) + centerPointY;
        context.beginPath();
        context.arc(x, y, circleRadius, 0, Math.PI*2);
        context.fill();                
      }
    }
  }, {passive: false});
});