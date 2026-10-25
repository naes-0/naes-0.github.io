import {getLocale} from '../i18n.js';

// Actual project stimuli; provenance is recorded in site/docs/SOURCES.md.
export const worldviewPrompts=[{ru:'Ворона',en:'Crow'},{ru:'Ворон',en:'Raven'},{ru:'Журавль',en:'Crane'}];

const words={ru:{word:'Ворона',label:'Полотно для рисунка',help:'Рисуйте карандашом. Каждая новая черта меняет цвет. С клавиатуры: пробел начинает и заканчивает черту, стрелки рисуют.',stroke:'Нарисовано черт',failed:'Полотно недоступно. Описание работы доступно по ссылке ниже.'},en:{word:'Crow',label:'Drawing canvas',help:'Draw with the pencil. Each new stroke changes colour. Keyboard: Space starts and ends a stroke; arrow keys draw.',stroke:'Strokes drawn',failed:'The canvas is unavailable. Use the project link below.'}};

// A separate, non-interactive overlay: this gesture never enters the drawing data.
const headCurve='M220 230 C195 195 214 145 255 143 C285 141 302 159 303 177 L322 186 L301 191';
const drawHint=`<svg class="worldview-draw-hint" viewBox="0 0 600 400" aria-hidden="true" focusable="false"><g class="worldview-hint-gesture"><path class="worldview-hint-stroke" d="${headCurve}" pathLength="100"/><g class="worldview-hint-pencil"><path d="M0 0L3-15L35-47L47-35L15-3Z" fill="#dfb762" stroke="#6f5a37" stroke-width="1.4"/><path d="M0 0L3-15L15-3Z" fill="#e4d7bd"/><path d="M0 0L1.2-5.5L5.5-1.2Z" fill="#34312a"/><path d="M9-14L35-40M14-9L40-35" fill="none" stroke="#a5813d" stroke-width="1.3"/><path d="M35-47L39-51Q41-53 44-50L50-44Q53-41 51-39L47-35Z" fill="#bb8c88" stroke="#6f5a37" stroke-width="1.3"/></g></g></svg>`;

export function worldviewMarkup(c={}){
  const language=c.mediaLocale||getLocale(),t=words[language];
  return `<div class="worldview-paper" data-drawing-language="${language}"><div class="worldview-prompt"><h3 aria-live="polite">${t.word}</h3><button type="button" class="worldview-next-word" aria-label="${language==='en'?'Change word':'Другое слово'}"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20 10a8 8 0 1 0-2 8M20 4v6h-6"/></svg></button></div><canvas class="worldview-canvas" tabindex="0" aria-label="${t.label}" aria-describedby="worldview-drawing-help">${t.help}</canvas>${drawHint}<span class="worldview-key-point" aria-hidden="true"></span><p id="worldview-drawing-help" class="visually-hidden">${t.help}</p><p class="worldview-drawing-status visually-hidden" role="status"></p></div>`;
}

export function mountWorldview(scene,{signal,route,isActive}){
  const paper=scene.querySelector('.worldview-paper'),canvas=paper.querySelector('canvas'),context=canvas.getContext('2d');
  const t=words[paper.dataset.drawingLanguage],status=paper.querySelector('.worldview-drawing-status'),keyPoint=paper.querySelector('.worldview-key-point');
  if(!context){status.classList.remove('visually-hidden');status.textContent=t.failed;return;}
  const strokes=[];let draft=null,pointer=null,keyboard=false,descriptionScheduled=false,timer,width=1,height=1,wordIndex=0;
  let keyboardPoint={x:.5,y:.5};
  const on=(node,type,fn)=>node.addEventListener(type,fn,{signal});
  function syncHint(){paper.dataset.hintRunning=String(isActive());}
  const hintObserver=new MutationObserver(syncHint);
  hintObserver.observe(scene.closest('.portfolio-ad'),{attributes:true,attributeFilter:['class']});
  const dialog=document.querySelector('#project-dialog');
  if(dialog)hintObserver.observe(dialog,{attributes:true,attributeFilter:['open']});
  on(document,'visibilitychange',syncHint);syncHint();
  function draw(stroke){
    context.strokeStyle=stroke.colour;context.fillStyle=stroke.colour;context.lineWidth=2.6;context.lineCap='round';context.lineJoin='round';
    context.beginPath();stroke.points.forEach((p,i)=>i?context.lineTo(p.x*width,p.y*height):context.moveTo(p.x*width,p.y*height));context.stroke();
  }
  function redraw(){context.clearRect(0,0,width,height);strokes.forEach(draw);if(draft)draw(draft);}
  on(paper.querySelector('.worldview-next-word'),'click',()=>{
    clearTimeout(timer);draft=null;keyboard=false;descriptionScheduled=false;
    const activePointer=pointer;pointer=null;
    if(activePointer!==null&&canvas.hasPointerCapture(activePointer))canvas.releasePointerCapture(activePointer);
    strokes.length=0;paper.dataset.strokes='0';paper.classList.remove('worldview-keyboard');
    paper.classList.remove('worldview-has-drawn');
    keyboardPoint={x:.5,y:.5};status.textContent='';
    wordIndex=(wordIndex+1)%worldviewPrompts.length;
    paper.querySelector('h3').textContent=worldviewPrompts[wordIndex][paper.dataset.drawingLanguage];redraw();
  });
  function resize(){
    const r=canvas.getBoundingClientRect(),ratio=Math.min(devicePixelRatio||1,2);width=r.width;height=r.height;
    canvas.width=Math.max(1,Math.round(width*ratio));canvas.height=Math.max(1,Math.round(height*ratio));context.setTransform(ratio,0,0,ratio,0,0);redraw();
  }
  function begin(point){
    if(!isActive())return false;
    paper.classList.add('worldview-has-drawn');
    const colour=strokes.length===0?'#151515':`hsl(${Math.floor(Math.random()*360)} 72% 36%)`;
    draft={colour,points:[point]};return true;
  }
  function extend(point){if(!draft||draft.points.length>=6000)return;draft.points.push(point);draw({...draft,points:draft.points.slice(-2)});}
  function finish(cancel=false){
    if(!draft)return;
    const length=draft.points.reduce((sum,p,i,points)=>i?sum+Math.hypot((p.x-points[i-1].x)*width,(p.y-points[i-1].y)*height):0,0);
    if(!cancel&&length>=3){strokes.push(draft);paper.dataset.strokes=String(strokes.length);status.textContent=`${t.stroke}: ${strokes.length}`;}
    draft=null;redraw();
    if(strokes.length>=4&&!descriptionScheduled){descriptionScheduled=true;timer=setTimeout(()=>{if(!signal.aborted&&isActive())route('worldview',canvas);},1000);}
  }
  function position(event){const r=canvas.getBoundingClientRect();return {x:Math.max(0,Math.min(1,(event.clientX-r.left)/r.width)),y:Math.max(0,Math.min(1,(event.clientY-r.top)/r.height))};}
  on(canvas,'pointerdown',event=>{
    if(event.button!==0||!event.isPrimary||pointer!==null||keyboard)return;
    if(begin(position(event))){pointer=event.pointerId;canvas.setPointerCapture(pointer);canvas.focus({preventScroll:true});event.preventDefault();}
  });
  on(canvas,'pointermove',event=>{if(event.pointerId===pointer)extend(position(event));});
  function endPointer(event,cancel){if(event.pointerId!==pointer)return;pointer=null;finish(cancel);}
  on(canvas,'pointerup',event=>endPointer(event,false));
  on(canvas,'pointercancel',event=>endPointer(event,true));
  on(canvas,'lostpointercapture',event=>endPointer(event,true));
  on(canvas,'keydown',event=>{
    if(event.key===' '){event.preventDefault();if(pointer!==null)return;if(keyboard){keyboard=false;finish();}else keyboard=begin({...keyboardPoint});return;}
    if(event.key==='Escape'&&keyboard){keyboard=false;finish(true);return;}
    const directions={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]};
    if(!directions[event.key])return;event.preventDefault();
    const [x,y]=directions[event.key];keyboardPoint={x:Math.max(0,Math.min(1,keyboardPoint.x+x*12/width)),y:Math.max(0,Math.min(1,keyboardPoint.y+y*12/height))};
    keyPoint.style.left=`${keyboardPoint.x*100}%`;keyPoint.style.top=`${keyboardPoint.y*100}%`;paper.classList.add('worldview-keyboard');if(keyboard)extend({...keyboardPoint});
  });
  on(canvas,'blur',()=>{if(keyboard){keyboard=false;finish();}paper.classList.remove('worldview-keyboard');});
  const observer=new ResizeObserver(resize);observer.observe(canvas);resize();
  signal.addEventListener('abort',()=>{observer.disconnect();hintObserver.disconnect();clearTimeout(timer);strokes.length=0;draft=null;},{once:true});
}
