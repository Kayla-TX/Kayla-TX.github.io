cat > quiz.js <<'EOF'
// ==== 题库（m: 模块标签 'AR' 或 'MK'；a: 正确选项索引）====
const BANK = [
  // AR
  { m:'AR', q:"一件商品打八折后是 $56，原价是多少？", c:["$64","$68","$70","$72"], a:2, e:"八折=0.8；原价=56/0.8=70。" },
  { m:'AR', q:"一辆车 3 小时行驶 180 英里，平均速度？", c:["50 mph","55 mph","60 mph","65 mph"], a:2, e:"速度=距离/时间=180/3=60 mph。" },
  { m:'AR', q:"1 加仑 = 4 夸脱。5 夸脱等于几加仑？", c:["1.0","1.25","1.5","2.0"], a:1, e:"5/4=1.25 加仑。" },
  { m:'AR', q:"一个班 24 人，男生:女生=3:5。女生有几人？", c:["9","12","15","18"], a:2, e:"总份=8；女生=24×5/8=15。" },
  { m:'AR', q:"1 英尺=12 英寸。2.5 英尺等于几英寸？", c:["24","28","30","36"], a:2, e:"2.5×12=30 英寸。" },
  { m:'AR', q:"一件物品九折后 $81，原价？", c:["$88","$90","$92","$95"], a:1, e:"81/0.9=90。" },
  { m:'AR', q:"价格从 $40 涨到 $50，涨幅百分比？", c:["20%","22%","25%","28%"], a:2, e:"(50-40)/40=25%。" },

  // MK
  { m:'MK', q:"若 2x + 6 = 18，则 x = ？", c:["4","5","6","7"], a:0, e:"2x=12→x=6？小心：18-6=12；12/2=6 → 正确是 6（选 C）。" },
  { m:'MK', q:"一个长方形长 12、宽 8，面积？", c:["80","88","92","96"], a:3, e:"面积=l×w=12×8=96。" },
  { m:'MK', q:"圆的周长公式？", c:["πr²","2πr","πd²","r²/2"], a:1, e:"周长 C=2πr；面积 A=πr²。" },
  { m:'MK', q:"百分比与分数互化：25% 等于？", c:["1/2","1/3","1/4","2/5"], a:2, e:"25%=25/100=1/4。" },
  { m:'MK', q:"三角形面积：底 b=10，高 h=6，面积？", c:["16","24","28","30"], a:3, e:"A=1/2·b·h=1/2·10·6=30。" },
  { m:'MK', q:"解一元一次方程：5x-15=0，x=?", c:["-3","0","3","15"], a:2, e:"5x=15 → x=3。" },
];

// ==== 工具 ====
function shuffle(a){for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a;}
function sample(arr,n){return shuffle([...arr]).slice(0, n);}

// ==== 状态 ====
let picked = [];        // 当前抽取的题
let onlyWrong = false;  // 是否仅显示错题
let userAnswers = [];   // 用户作答
let wrongList = [];     // 错题（提交后生成）

// ==== 渲染试卷 ====
function renderQuiz(){ 
  const quiz = document.getElementById('quiz');
  quiz.innerHTML = picked.map((item, idx) => {
    const name = `q${idx}`;
    const choices = item.c.map((text, i) => `
      <label style="display:block;margin:6px 0;">
        <input type="radio" name="${name}" value="${i}"> ${String.fromCharCode(65+i)}. ${text}
      </label>
    `).join('');
    return `
      <div class="card" data-idx="${idx}">
        <div style="font-weight:600;margin-bottom:6px;">${idx+1}. ${item.q}</div>
        <div>${choices}</div>
        <div id="exp-${idx}" class="small" style="display:none;margin-top:8px;"></div>
      </div>
    `;
  }).join('');
  document.getElementById('actions').style.display = 'flex';
  document.getElementById('result').style.display = 'none';
  document.getElementById('toggleWrong').style.display = 'none';
  document.getElementById('exportWrong').style.display = 'none';
  document.getElementById('retry').style.display = 'none';
  onlyWrong = false;
}

// ==== 生成新试卷 ====
function generate(){
  const mod = document.getElementById('module').value;
  const cnt = Number(document.getElementById('count').value);
  const pool = BANK.filter(x => x.m === mod);
  picked = sample(pool, Math.min(cnt, pool.length));
  userAnswers = Array(picked.length).fill(null);
  wrongList = [];
  renderQuiz();
}

document.getElementById('gen').addEventListener('click', generate);

// ==== 提交判分 ====
document.getElementById('submit').addEventListener('click', () => {
  let score = 0;
  wrongList = [];
  picked.forEach((item, idx) => {
    const chosen = document.querySelector(`input[name="q${idx}"]:checked`);
    const exp = document.getElementById(`exp-${idx}`);
    const correct = item.a;
    const user = chosen ? Number(chosen.value) : -1;
    userAnswers[idx] = user;
    const ok = user === correct;
    if (ok) score++; else wrongList.push({ ...item, user });
    exp.style.display = 'block';
    exp.innerHTML = ok
      ? `✅ 正确：${String.fromCharCode(65+correct)}。${item.e}`
      : `❌ 你的答案：${user>=0?String.fromCharCode(65+user):"未作答"}；正确：${String.fromCharCode(65+correct)}。${item.e}`;
  });

  // 结果
  const result = document.getElementById('result');
  result.style.display = 'block';
  result.innerHTML = `<b>得分：${score} / ${picked.length}</b> · 正确率 ${(score/picked.length*100).toFixed(0)}%`;

  // 控制按钮
  document.getElementById('toggleWrong').style.display = 'inline-block';
  document.getElementById('toggleWrong').textContent = '只看错题';
  document.getElementById('exportWrong').style.display = wrongList.length ? 'inline-block' : 'none';
  document.getElementById('retry').style.display = 'inline-block';

  // 滚动到底部
  window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
});

// ==== 只看错题 / 切回全部 ====
document.getElementById('toggleWrong').addEventListener('click', () => {
  onlyWrong = !onlyWrong;
  // 显示/隐藏
  picked.forEach((_, idx) => {
    const card = document.querySelector(`.card[data-idx="${idx}"]`);
    const isWrong = wrongList.some(w => w.q === picked[idx].q);
    card.style.display = (onlyWrong && !isWrong) ? 'none' : 'block';
  });
  document.getElementById('toggleWrong').textContent = onlyWrong ? '显示全部' : '只看错题';
});

// ==== 导出错题 JSON ====
document.getElementById('exportWrong').addEventListener('click', () => {
  const data = wrongList.map(w => ({
    module: w.m,
    question: w.q,
    choices: w.c,
    correctIndex: w.a,
    userIndex: w.user,
    explanation: w.e,
  }));
  const blob = new Blob([JSON.stringify({ exportedAt: new Date().toISOString(), items: data }, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'asvab_wrong_questions.json';
  a.click();
  URL.revokeObjectURL(url);
});

// ==== 重抽 ====
document.getElementById('retry').addEventListener('click', generate);

// 页面初始默认生成一套（AR/5）
generate();
EOF
