cat > quiz.js <<'EOF'
console.log("[quiz] quiz.js loaded"); // 调试：看控制台是否打印

// 题库
const BANK = [
  // AR
  { m:'AR', q:"一件商品打八折后是 $56，原价是多少？", c:["$64","$68","$70","$72"], a:2, e:"八折=0.8；原价=56/0.8=70。" },
  { m:'AR', q:"3 小时行驶 180 英里，平均速度？", c:["50 mph","55 mph","60 mph","65 mph"], a:2, e:"180/3=60 mph。" },
  { m:'AR', q:"1 加仑=4 夸脱。5 夸脱等于几加仑？", c:["1.0","1.25","1.5","2.0"], a:1, e:"5÷4=1.25 加仑。" },
  { m:'AR', q:"价格从 $40 涨到 $50，涨幅百分比？", c:["20%","22%","25%","28%"], a:2, e:"(50-40)/40=25%。" },
  { m:'AR', q:"长 12 宽 8 的矩形面积？", c:["80","88","92","96"], a:3, e:"12×8=96。" },

  // MK
  { m:'MK', q:"若 2x + 6 = 18，则 x = ？", c:["4","5","6","7"], a:2, e:"2x=12→x=6。" },
  { m:'MK', q:"三角形面积公式？", c:["bh","πr²","1/2·bh","2πr"], a:2, e:"面积=½·底·高。" },
  { m:'MK', q:"25% 等于？", c:["1/2","1/3","1/4","1/5"], a:2, e:"25%=1/4。" },
  { m:'MK', q:"圆的周长公式？", c:["2πr","πr²","r²/2","π/2"], a:0, e:"C=2πr。" },
  { m:'MK', q:"5x-15=0，x=?", c:["-3","0","3","15"], a:2, e:"x=15/5=3。" },

  // WK / PC
  { m:'WK', q:"'benevolent' 的意思是？", c:["恶意的","友善的","懒惰的","冷漠的"], a:1, e:"bene- 表示 '好'，benevolent=善良的。" },
  { m:'WK', q:"'antonym' 意思是？", c:["同义词","反义词","名词","形容词"], a:1, e:"antonym = opposite meaning。" },
  { m:'WK', q:"'The sun dipped below the horizon' 的含义是？", c:["太阳升起","太阳下山","天气炎热","夜晚来临"], a:1, e:"dipped below horizon=下山。" },
  { m:'WK', q:"词根 'bio' 的含义？", c:["生命","时间","地球","声音"], a:0, e:"bio=life。" },
  { m:'WK', q:"'reluctant' 的意思？", c:["渴望的","害怕的","不情愿的","兴奋的"], a:2, e:"reluctant=unwilling。" },

  // GS
  { m:'GS', q:"水的化学式？", c:["H₂O","CO₂","O₂","NaCl"], a:0, e:"水=H₂O。" },
  { m:'GS', q:"地球绕太阳一圈约？", c:["1 天","1 周","1 月","1 年"], a:3, e:"约 1 年。" },
  { m:'GS', q:"呼吸系统主要器官？", c:["心脏","肺","肾","胃"], a:1, e:"肺负责气体交换。" },
  { m:'GS', q:"植物制造食物的过程？", c:["消化","光合作用","蒸发","氧化"], a:1, e:"光合作用。" },
  { m:'GS', q:"能量单位？", c:["米","焦耳","升","克"], a:1, e:"J（焦耳）。" },
];

function shuffle(a){for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a;}
function sample(arr,n){return shuffle([...arr]).slice(0,n);}

let picked=[], onlyWrong=false, userAnswers=[], wrongList=[];

function renderQuiz(){
  const quiz=document.getElementById('quiz');
  quiz.innerHTML=picked.map((item,idx)=>{
    const name=`q${idx}`;
    const choices=item.c.map((t,i)=>`
      <label style="display:block;margin:6px 0;">
        <input type="radio" name="${name}" value="${i}"> ${String.fromCharCode(65+i)}. ${t}
      </label>`).join('');
    return `
      <div class="card" data-idx="${idx}">
        <div style="font-weight:600;margin-bottom:6px;">${idx+1}. ${item.q}</div>
        <div>${choices}</div>
        <div id="exp-${idx}" class="small" style="display:none;margin-top:8px;"></div>
      </div>`;
  }).join('');
  document.getElementById('actions').style.display='flex';
  document.getElementById('result').style.display='none';
  document.getElementById('toggleWrong').style.display='none';
  document.getElementById('exportWrong').style.display='none';
  document.getElementById('retry').style.display='none';
  onlyWrong=false;
}

function generate(){
  const mod=document.getElementById('module').value;
  const cnt=Number(document.getElementById('count').value);
  const pool=BANK.filter(x=>x.m===mod);
  picked=sample(pool,Math.min(cnt,pool.length));
  userAnswers=Array(picked.length).fill(null);
  wrongList=[];
  renderQuiz();
}

window.addEventListener('DOMContentLoaded', ()=>{
  console.log("[quiz] DOM ready");
  const genBtn=document.getElementById('gen');
  genBtn?.addEventListener('click', generate);
  document.getElementById('submit').addEventListener('click', ()=>{
    let score=0; wrongList=[];
    picked.forEach((item,idx)=>{
      const chosen=document.querySelector(`input[name="q${idx}"]:checked`);
      const exp=document.getElementById(`exp-${idx}`);
      const user=chosen?Number(chosen.value):-1;
      const ok=user===item.a;
      if(ok)score++; else wrongList.push({...item,user});
      exp.style.display='block';
      exp.innerHTML= ok
        ? `✅ 正确：${String.fromCharCode(65+item.a)}。${item.e}`
        : `❌ 你的答案：${user>=0?String.fromCharCode(65+user):"未作答"}；正确：${String.fromCharCode(65+item.a)}。${item.e}`;
    });
    const result=document.getElementById('result');
    result.style.display='block';
    result.innerHTML=`<b>得分：${score}/${picked.length}</b> · 正确率 ${(score/picked.length*100).toFixed(0)}%`;
    document.getElementById('toggleWrong').style.display='inline-block';
    document.getElementById('exportWrong').style.display=wrongList.length?'inline-block':'none';
    document.getElementById('retry').style.display='inline-block';
    window.scrollTo({top:document.body.scrollHeight,behavior:'smooth'});
  });
  document.getElementById('toggleWrong').addEventListener('click', ()=>{
    onlyWrong=!onlyWrong;
    picked.forEach((_,idx)=>{
      const card=document.querySelector(`.card[data-idx="${idx}"]`);
      const isWrong=wrongList.some(w=>w.q===picked[idx].q);
      card.style.display=(onlyWrong&&!isWrong)?'none':'block';
    });
    document.getElementById('toggleWrong').textContent=onlyWrong?'显示全部':'只看错题';
  });
  document.getElementById('exportWrong').addEventListener('click', ()=>{
    const data=wrongList.map(w=>({module:w.m,question:w.q,choices:w.c,correctIndex:w.a,userIndex:w.user,explanation:w.e}));
    const blob=new Blob([JSON.stringify({exportedAt:new Date().toISOString(),items:data},null,2)],{type:'application/json'});
    const url=URL.createObjectURL(blob);
    const a=document.createElement('a'); a.href=url; a.download='asvab_wrong_questions.json'; a.click();
    URL.revokeObjectURL(url);
  });
  document.getElementById('retry').addEventListener('click', generate);
});
EOF
