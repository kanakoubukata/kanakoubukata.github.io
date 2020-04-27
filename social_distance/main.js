document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.querySelector('#canvas-area');
  const context = canvas.getContext('2d');
  initializeCanvas();
  initializeMagicButton();
  
  // 適用ボタンクリック時
  document.querySelector('#params').addEventListener('submit', (event) => {
    // submitのキャンセル
    event.stopPropagation();
    event.preventDefault();
    
    const width = parseFloat(document.querySelector('#width').value);
    const height = parseFloat(document.querySelector('#height').value);
    const people = parseInt(document.querySelector('#people').value);
    const [row, col] = calcMatrix(width, height, people);
    
    // 描画
    drawCanvas(width, height, people, row, col);
  }, {passive: false});
  
  // クリアボタンクリック時
  document.querySelector('#params').addEventListener('reset', (event) => {
    // キャンバスをクリア
    initializeCanvas();
  });
  
  // magicボタンクリック時
  document.querySelector('#btn-magic').addEventListener('click', (event) => {
    const width = parseFloat(document.querySelector('#width').value);
    const height = parseFloat(document.querySelector('#height').value);
    const col = Math.floor(width / 2);
    const row = Math.floor(height / 2);
    const limit = col * row;
    if(isNaN(limit)) {
      document.querySelector('#btn-submit').click();
      return;
    }
    document.querySelector('#people').value = limit;
    drawCanvas(width, height, limit, row, col);
  });
  
  // キャンバスの初期化
  function initializeCanvas() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    canvas.width = 480;
    canvas.height = 480;
  }
  
  // magicボタンのツールチップ設定  
  function initializeMagicButton() {
    tippy('#btn-magic', {
      content: '限界収容人数を算出します',
    });
  }
  
  // 円を何行何列で描画するのが最適かを求める
  function calcMatrix(width, height, people) {
    // 最適列数を計算
    const baseCol = Math.sqrt(width * people / height);
    
    // 最適列数付近の整数を2つ取得
    const tmpCol1 = Math.floor(baseCol) == 0 ? 1 : Math.floor(baseCol);
    const tmpCol2 = Math.ceil(baseCol);
    
    // 最適列数付近の整数から、行数の組み合わせを算出（人数が入り切るように小数点以下繰り上げ）
    const tmpRow1 = Math.ceil(people / tmpCol1);
    const tmpRow2 = Math.ceil(people / tmpCol2);
 
    // 2パターンの行列の合計要素数が少ない方を採用
    const matrix1 = tmpRow1 * tmpCol1;
    const matrix2 = tmpRow2 * tmpCol2;    
    if (matrix1 < matrix2) {
      return [tmpRow1, tmpCol1];
    } else if (matrix1 > matrix2) {
      return [tmpRow2, tmpCol2];
    } else {
      // 合計要素数が同じ場合は、空間の比率に近い方を採用
      const roomRatio = width / height;
      const tmpRatio1 = tmpCol1 / tmpRow1;
      const tmpRatio2 = tmpCol2 / tmpRow2;
      const diff1 = Math.abs(roomRatio - tmpRatio1);
      const diff2 = Math.abs(roomRatio - tmpRatio2);

      if (diff1 < diff2) {
        return [tmpRow1, tmpCol1];
      } else {
        return [tmpRow2, tmpCol2];
      }
    }
  }
  
  // キャンバスに描画する
  function drawCanvas(width, height, people, row, col) {
    // キャンバスをクリア
    initializeCanvas();
    
    // 空間の比率に合わせてキャンバスの比率を変更
    if (width > height) {
      const canvasHeight = height / width * canvas.width;
      canvas.height = canvasHeight;
    } else {
      const canvasWidth = width / height * canvas.height;
      canvas.width = canvasWidth;
    }
    
    // 行列要素の幅と高さ、中心点を算出
    const cellWidth = canvas.width / col;
    const cellHeight = canvas.height / row;
    const centerPointX = cellWidth / 2;
    const centerPointY = cellHeight / 2;    
    
    // 空間の縮尺に対して、半径1m相当の円の半径
    const circleRadius = 1 / width * canvas.width;
    
    // 描画
    context.globalAlpha = 0.5;
    context.fillStyle = 'red';
    let circleCount = 0;
    for(let r = 0; r < row; r++) {
      for(let c = 0; c < col && circleCount < people; c++, circleCount++) {
        let x = (c * cellWidth) + centerPointX;
        let y = (r * cellHeight) + centerPointY;
        context.beginPath();
        context.arc(x, y, circleRadius, 0, Math.PI*2);
        context.fill();                
      }
    }
  }
});