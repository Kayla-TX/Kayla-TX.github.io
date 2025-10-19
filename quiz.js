// 简单 AR 题库（单选）：question, choices[], answer(索引), explanation
const BANK = [
  { q: "一件商品打八折后是 $56，原价是多少？", c:["$64","$68","$70","$72"], a:2, e:"八折=0.8；原价=56/0.8=70。" },
  { q: "一辆车 3 小时行驶 180 英里，平均速度？", c:["50 mph","55 mph","60 mph","65 mph"], a:2, e:"速度=距离/时间=180/3=60 mph。" },
  { q: "1 加仑 = 4 夸脱。5 夸脱等于几加仑？", c:["1.0","1.25","1.5","2.0"], a:1, e:"5/4=1.25 加仑。" },
  { q: "一个班 24 人，男生:女生=3:5。女生有几人？", c:["9","12","15","18"], a:2, e:"总份=3+5=8；女生=24×5/8=15。" },
  { q: "某数的 25% 是 18，该数是？", c:["54","62","70","72"], a:0, e:"x×0.25=18 → x=72，但注意：18/0.25=72 → 选 72（看清选项！）" },
  { q: "一个矩形长 12 宽 8，面积？", c:["80","88","92","96"], a:3, e:"面积=l×w=12×8=96。" },
  { q: "1 英尺=12 英寸。2.5 英尺等于几英寸？", c:["24","28","30","36"], a:2, e:"2.5×12=30 英寸。" },
  { q: "价格从 $40 涨到 $50，涨幅百分比？", c:["20%","22%","25%","28%"], a:2, e:"(50-40)/40=0.25=25%。" },
  { q: "混合溶液：A 含盐 10%，B 含盐 20%，等量混合后浓度？", c:["12%","14%","15%","18%"], a:2, e:"等量平均：(10%+20%)/2=15%." },
  { q: "一件物品九折后 $81，原价？", c:["$88","$90","$92","$95"], a:1, e:"81/0.9=90。" },
];

// 随机取 n 题
function sample(arr, n) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a.slice(0, n);
}

let picked = [];

function render() {
  picked = sample(BANK, 5);
  const quiz = document.getElementById('quiz');
  quiz.innerHTML = picked.map((item, idx) => {
    const name = `q${idx}`;
    const choices = item.c.map((text, i) => `
      <label style="display:block;margin:6px 0;">
        <input type="radio" name="${name}" value="${i}"> ${String.fromCharCode(65+i)}. ${text}
      </label>
    `).join('');
    return `
      <div class="card">
        <div style="font-weight:600;margin-bottom:6px;">${idx+1}. ${item.q}</div>
        <div>${choices}</div>
        <div id="exp-${idx}" class="small" style="display:none;margin-top:8px;"></div>
      </div>
    `;
  }).join('');
  document.getElementById('result').style.display = 'none';
  document.getElementById('retry').style.display = 'none';
}
render();

document.getElementById('submit').addEventListener('click', () => {
  let score = 0;
  picked.forEach((item, idx) => {
    const chosen = document.querySelector(`input[name="q${idx}"]:checked`);
    const exp = document.getElementById(`exp-${idx}`);
    const correct = item.a;
    const user = chosen ? Number(chosen.value) : -1;
    const ok = user === correct;
    if (ok) score++;
    exp.style.display = 'block';
    exp.innerHTML = ok
      ? `✅ 正确：${String.fromCharCode(65+correct)}。${item.e}`
      : `❌ 正确答案：${String.fromCharCode(65+correct)}。${item.e}`;
  });
  const result = document.getElementById('result');
  result.style.display = 'block';
  result.innerHTML = `<b>得分：${score} / ${picked.length}</b> · 正确率 ${(score/picked.length*100).toFixed(0)}%`;
  document.getElementById('retry').style.display = 'inline-block';
  window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
});

document.getElementById('retry').addEventListener('click', () => render());
