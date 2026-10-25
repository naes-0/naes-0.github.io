import { getLocale } from './i18n.js';
import {decorateTitleLetter} from './playful-glyphs.js';
export const titleFinish=(index,character,locale='ru')=>{
 if(locale==='en')return index===4&&character==='i'?'solid':({0:'donut',1:'volume',3:'solid',4:'neon',5:'pixel'})[index]||'solid';
 return character==='д'?'solid':({0:'solid',2:'volume',3:'donut',4:'neon',5:'solid',6:'handwritten',8:'solid',10:'pixel',11:'glow',12:'solid'})[index]||'solid';
};

const colours = ['#ec3155','#8941db','#f25d26','#a84b14','#14a843','#6321c6','#8c3428','#cc167f','#ff551b','#a7b90a','#c81a78','#ffb000','#7134cc'];
const segmenter = new Intl.Segmenter(undefined, { granularity: 'grapheme' });
const letters = text => [...segmenter.segment(text)].map(item => item.segment);

// Frames contain complete graphemes, so deleting the manicure never leaves a broken emoji.
// Injecting random makes the editorial sequence inspectable without a browser or real timers.
function* typingFrames(locale = 'ru', random = Math.random) {
  const state = { name: '', role: '', school: '', title: '' };
  const range = (low, high) => low + random() * (high - low);
  function* hold(field, duration) { yield { field, text: state[field], delay: duration }; }
  function* type(field, target) {
    const content = letters(target);
    for (let length = letters(state[field]).length + 1; length <= content.length; length++) {
      state[field] = content.slice(0, length).join('');
      const character = content[length - 1];
      const pause = character === ' ' ? range(150, 275) : range(65, 155);
      yield { field, text: state[field], delay: pause + (random() < .08 ? range(150, 310) : 0) };
    }
  }
  function* erase(field, keep = '', quick = false) {
    const content = letters(state[field]), stop = letters(keep).length;
    for (let length = content.length - 1; length >= stop; length--) {
      state[field] = content.slice(0, length).join('');
      yield { field, text: state[field], quick, delay: quick ? range(20, 34) : range(60, 100) + (content[length] === ' ' ? range(90, 160) : 0) };
    }
  }
  function* attempt(field, text, keep = '') {
    yield* type(field, text);
    yield* hold(field, range(650, 1050));
    yield* erase(field, keep);
    yield* hold(field, range(190, 370));
  }

  function* prefix(field, text) {
    const original=state[field], content=letters(text);
    yield {field,text:original,caret:0,delay:650};
    for(let length=1;length<=content.length;length++){
      state[field]=content.slice(0,length).join('')+original;
      yield {field,text:state[field],caret:length,delay:range(100,200)};
    }
    yield {field,text:state[field],caret:content.length,delay:1100};
  }
  yield* hold('name', 500);
  if (locale === 'en') {
    yield* attempt('name', 'Nastya');
    yield* attempt('name', 'Zamaraeva');
    yield* attempt('name', 'Anastasia Zamaraeva', 'Anastasia');
    yield* attempt('role', 'Media artist');
    yield* attempt('role', 'author');
    yield* attempt('role', 'creator');
    yield* type('role', 'media artist');
    yield* hold('role', 1750);
    yield* erase('role', 'media');
    yield* hold('role', 1400);
    yield* erase('role', 'me');
    yield* type('role', 'megatron');
    yield* hold('role', 1100);
    yield* erase('role', 'm');
    yield* type('role', 'may');
    yield* hold('role', 900);
    yield* type('role', 'may do something');
    yield* hold('role',1100);
    yield* attempt('school', 'Artek');
    yield* attempt('school', 'Artech');
    yield* type('school', 'ArtTECH MISIS');
  } else {
    yield* attempt('name', 'Настя');
    yield* attempt('name', 'Замараева');
    yield* attempt('name', 'Анастасия Замараева', 'Анастасия');
    yield* attempt('role', 'Медиахудожница');
    yield* attempt('role', 'автор');
    yield* attempt('role', 'креатор');
    yield* type('role', 'медиахудожница');
    yield* hold('role', 850);
    yield* erase('role', 'медиахудожни');
    yield* type('role', 'медиахудожник');
    yield* hold('role', 850);
    yield* erase('role', 'медиахудожни');
    yield* hold('role', 1900);
    yield* erase('role', 'медиа');
    yield* hold('role', 1400);
    yield* erase('role', 'ме');
    yield* type('role', 'мегатрон');
    yield* hold('role', 1100);
    yield* erase('role', 'м');
    yield* type('role', 'может');
    yield* hold('role', 900);
    yield* prefix('role', 'что-то ');
    yield* attempt('school', 'Артек');
    yield* attempt('school', 'Артех');
    yield* type('school', 'ArtTECH МИСИС');
  }
  yield* hold('school', 800);
  const school = state.school;
  yield* type('school', school + ' 💅');
  yield* hold('school', 1000);
  yield* erase('school', school);
  yield* hold('school', 650);
  yield* type('title', locale === 'en' ? 'Or nit' : 'А модет и нет');
  yield* hold('title', 1550);
  const typoIndex=4;
  yield {field:'title',text:state.title,caret:typoIndex+1,typoMove:true,delay:650};
  const before=letters(state.title);
  before.splice(typoIndex,1);state.title=before.join('');
  yield {field:'title',text:state.title,caret:typoIndex,typoDelete:true,delay:220};
  before.splice(typoIndex,0,locale==='en'?'o':'ж');state.title=before.join('');
  yield {field:'title',text:state.title,caret:typoIndex+1,delay:1500};
  for(const selection of (locale==='en'?[1]:[1,2])){
    const editIndex=locale==='en'?3:(selection===1?0:5);
    yield {field:'title',text:state.title,hover:true,editIndex,caret:editIndex+1,delay:450};
    yield {field:'title',text:state.title,selection,editIndex,caret:editIndex+1,delay:750};
    yield {field:'title',text:state.title,selection,recolour:selection,editIndex,caret:editIndex+1,delay:550};
    yield {field:'title',text:state.title,click:selection,editIndex,caret:editIndex+1,delay:250};
    yield {field:'title',text:state.title,caret:editIndex+1,delay:1900};
  }
  yield {field:'title',text:state.title,caret:locale==='en'?4:6,delay:9600};
  for (const field of ['title', 'school', 'role', 'name']) yield* erase(field, '', true);
  yield* hold('name', 1050);
}

// A move is its own frame: never change lines and remove/type a letter at once.
export function* playfulTypingFrames(locale='ru',random=Math.random){
  const state={name:'',role:'',school:'',title:''};
  let field='name',lastAction='hold',lastDelay=500;
  for(const frame of typingFrames(locale,random)){
    if(frame.field!==field){
      field=frame.field;
      if(!frame.quick)yield {field,text:state[field],caret:letters(state[field]).length,action:'move',delay:460+random()*220};
      lastDelay=500;
    }
    const old=state[field],delta=letters(frame.text).length-letters(old).length;
    const action=frame.recolour?'recolour':delta<0?'delete':delta>0?'type':'hold';
    if(!frame.quick&&action==='delete'&&lastAction!=='delete'&&lastDelay<350){
      yield {field,text:old,action:'hold',delay:380+random()*180};
    }
    yield {...frame,action};
    state[field]=frame.text;lastAction=action;lastDelay=frame.delay;
  }
}

export const buildTypingScript = (locale = 'ru', random = Math.random) => [...playfulTypingFrames(locale, random)];

export function initPlayfulTyping() {
  const box = document.querySelector('.playful-typing');
  if (!box) return;
  const root = document.documentElement;
  const fields = Object.fromEntries(['name', 'role', 'school', 'title'].map(key => [key, box.querySelector('.typing-' + key)]));
  if (Object.values(fields).some(node => !node)) return;
  root.classList.add('typing-ready');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const caret=document.createElement('i');caret.className='typing-live-caret';
  let caretPosition=0,editing=false,selecting=false;
  let frames, timer, nextAt = 0, remaining = 0, inView = false, activeField = 'name';

  function render(frame) {
    activeField = frame.field;
    const node = fields[frame.field];
    caret.remove();
    box.querySelectorAll('.is-selected,.is-edit-click,.is-hover-edit').forEach(letter=>letter.classList.remove('is-selected','is-edit-click','is-hover-edit'));
    if (!frame.recolour) {
      const wanted=letters(frame.text),existing=[...node.children];
      let prefix=0,suffix=0;
      while(prefix<existing.length&&prefix<wanted.length&&existing[prefix].textContent===wanted[prefix])prefix++;
      while(suffix<existing.length-prefix&&suffix<wanted.length-prefix&&existing[existing.length-1-suffix].textContent===wanted[wanted.length-1-suffix])suffix++;
      for(let i=prefix;i<existing.length-suffix;i++)existing[i].remove();
      const anchor=existing[existing.length-suffix]||null;
      for(let index=prefix;index<wanted.length-suffix;index++){
        const letter=document.createElement('span');letter.className='typing-letter';letter.textContent=wanted[index];
        const colour=colours[index%colours.length];letter.style.color=frame.field==='title'?colour:frame.field==='school'?'#b1bbc0':'#20222b';
        if(frame.field==='title'){letter.style.setProperty('--letter-colour',colour);letter.dataset.texture=titleFinish(index,wanted[index],getLocale());decorateTitleLetter(letter,wanted[index],letter.dataset.texture);}
        node.insertBefore(letter,anchor);
      }
    } else {
      const letter=node.children[frame.editIndex];
      if(letter&&letter.dataset.texture==='solid'){const colour=frame.recolour===1?'#ff114f':'#e600a9';letter.style.color=colour;letter.style.setProperty('--letter-colour',colour);}
    }
    if(frame.field==='school')for(const letter of node.children)letter.style.color='#b1bbc0';
    if(frame.editIndex!==undefined){
      const letter=node.children[frame.editIndex];
      if(letter){
        if(frame.selection||frame.selectTypo)letter.classList.add('is-selected');
        else if(frame.click)letter.classList.add('is-edit-click');
        else if(frame.hover)letter.classList.add('is-hover-edit');
      }
    }
    caretPosition=frame.caret??letters(frame.text).length;
    selecting=Boolean(frame.selection||frame.selectTypo);
    editing=frame.action==='type'||frame.action==='delete';
    caret.classList.toggle('is-editing',editing);
  }

  function canRun() {
    return root.dataset.theme === 'playful' && (!root.dataset.page || root.dataset.page === 'home') &&
      !document.hidden && inView && !reduced.matches && !document.querySelector('#project-dialog[open]');
  }
  function cursor(on) {
    for (const [key, node] of Object.entries(fields)) node.classList.toggle('is-typing-target', on && key === activeField);
    box.dataset.running=String(on);
    box.closest('.hero').dataset.motionActive=String(on);
    if(!on||selecting){caret.remove();return;}
    const node=fields[activeField];caret.remove();node.insertBefore(caret,node.children[caretPosition]||null);
  }
  function tick() {
    timer = undefined;
    if (!canRun()) return;
    let frame = frames.next();
    if (frame.done) { frames = playfulTypingFrames(getLocale()); frame = frames.next(); }
    render(frame.value);
    cursor(true);
    remaining = frame.value.delay;
    schedule();
  }
  function schedule() {
    nextAt = performance.now() + remaining;
    timer = setTimeout(tick, remaining);
  }
  function sync() {
    const run = canRun();
    if (!run && timer !== undefined) {
      remaining = Math.max(0, nextAt - performance.now());
      clearTimeout(timer); timer = undefined;
    }
    cursor(run);
    if (run && timer === undefined) schedule();
  }
  function restart() {
    clearTimeout(timer); timer = undefined; remaining = 0; activeField = 'name';
    for (const node of Object.values(fields)) node.replaceChildren();
    frames = playfulTypingFrames(getLocale());
    if (reduced.matches) {
      const english = getLocale() === 'en';
      render({ field: 'name', text: english ? 'Anastasia' : 'Анастасия' });
      render({ field: 'role', text: english ? 'may do something' : 'что-то может' });
      render({ field: 'school', text: english ? 'ArtTECH MISIS' : 'ArtTECH МИСИС' });
      render({ field: 'title', text: english ? 'Or not' : 'А может и нет' });
    }
    sync();
  }
  const observer = new IntersectionObserver(entries => {
    inView = entries[0].isIntersecting; sync();
  });
  observer.observe(box.closest('.hero'));
  document.addEventListener('visibilitychange', sync);
  document.addEventListener('themechange', sync);
  document.addEventListener('pagechange', sync);
  document.addEventListener('languagechange', restart);
  reduced.addEventListener('change', restart);
  const dialog = document.querySelector('#project-dialog');
  if (dialog) new MutationObserver(sync).observe(dialog, { attributes: true, attributeFilter: ['open'] });
  restart();
}
