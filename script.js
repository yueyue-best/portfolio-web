const $=(s,c=document)=>c.querySelector(s);const $$=(s,c=document)=>[...c.querySelectorAll(s)];
const header=$('.site-header');addEventListener('scroll',()=>header.classList.toggle('scrolled',scrollY>40),{passive:true});
const menu=$('.menu-toggle'),nav=$('#main-nav');menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open))});$$('#main-nav a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false')}));
const reveal=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible')}),{threshold:.12});$$('.reveal').forEach(el=>reveal.observe(el));
const sections=$$('main>section[id]');const spy=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){$$('#main-nav a').forEach(a=>a.classList.toggle('active',a.getAttribute('href')===`#${e.target.id}`))}}),{rootMargin:'-35% 0px -55%'});sections.forEach(s=>spy.observe(s));
function openProject(name){$$('.project-tabs button').forEach(b=>{const on=b.dataset.project===name;b.classList.toggle('active',on);b.setAttribute('aria-selected',String(on))});$$('.project-panel').forEach(p=>{const on=p.dataset.panel===name;p.hidden=!on;p.classList.toggle('active',on)})}
$$('.project-tabs button').forEach(b=>b.addEventListener('click',()=>openProject(b.dataset.project)));$$('[data-open-project]').forEach(a=>a.addEventListener('click',()=>openProject(a.dataset.openProject)));
const skills=[['产品设计与需求管理','需求拆解、功能规划、业务流程设计、PRD 撰写、原型设计、需求评审与项目推进；熟悉 Axure、Figma、墨刀。','用户调研 · 用户测试 · 竞品分析 · 用户旅程'],['AI 产品能力','熟悉 Prompt Engineering、AI Agent 工作流、Harness / Skill 应用，具备 AI 原型生成、结构化 Brief 与多工具效果评测实践。','Codex · ChatGPT · Figma AI · Cursor · V0'],['数据分析与产品数据','具备埋点设计、事件与字段定义、指标拆解、统计口径设计及数据字典建设经验。','DataFinder · 埋点方案 · 指标口径 · 测试验收'],['语言与跨职能协作','CET-6，能够阅读英文资料，并与研发、设计、测试和运营共同完成需求评审与交付。','英语 CET-6 · 需求评审 · 研发协作 · 测试验收']];let skillIndex=0;const card=$('.skill-card');$('.draw-button').addEventListener('click',()=>{card.classList.add('flip');setTimeout(()=>{skillIndex=(skillIndex+1)%skills.length;const [name,copy,proof]=skills[skillIndex];$('small',card).textContent=`PRODUCT SKILL 0${skillIndex+1}`;$('h3',card).textContent=name;$('p',card).textContent=copy;$('.skill-proof',card).textContent=proof;card.classList.remove('flip')},280)});
document.addEventListener('click',e=>{const img=e.target.closest('.project-gallery img,.carousel-track img,.config-evidence img');if(!img)return;const box=document.createElement('div');box.className='lightbox';box.innerHTML=`<img src="${img.src}" alt="${img.alt}">`;box.addEventListener('click',()=>box.remove());document.body.append(box)});
const copyBtn=$('[data-copy]'),toast=$('.toast');copyBtn.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(copyBtn.dataset.copy)}catch{const t=document.createElement('textarea');t.value=copyBtn.dataset.copy;document.body.append(t);t.select();document.execCommand('copy');t.remove()}toast.classList.add('show');setTimeout(()=>toast.classList.remove('show'),1800)});

function openProject(name){const target=$(`[data-project-card="${name}"]`);if(target)target.scrollIntoView({behavior:'smooth',block:'center'})}

$$('.work-carousel').forEach(carousel=>{
  const slides=$$('.carousel-track figure',carousel),dots=$$('.carousel-dots i',carousel);let index=0;
  const show=next=>{index=(next+slides.length)%slides.length;slides.forEach((slide,i)=>slide.classList.toggle('active',i===index));dots.forEach((dot,i)=>dot.classList.toggle('active',i===index))};
  $('.prev',carousel).addEventListener('click',()=>show(index-1));
  $('.next',carousel).addEventListener('click',()=>show(index+1));
});
