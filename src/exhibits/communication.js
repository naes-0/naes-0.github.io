import {getLocale} from '../i18n.js';
import {communicationParts} from './communication-parts.js';
import {analyzeCircuit,traceShortCircuit} from './communication-circuit.js';
import {createCommunicationSession} from './communication-session.js';

const componentDamage={battery:false,led:false,switch:false};

const copy={
  ru:{switchOn:'Включить переключатель',switchOff:'Выключить переключатель',opened:'Переключатель разомкнут.',closed:'Переключатель замкнут.',title:'Установи связь',contact:'Контакт',names:{'battery-plus':'батарейка, плюс','battery-minus':'батарейка, минус','resistor-in':'резистор, первый вывод','resistor-out':'резистор, второй вывод','led-anode':'светодиод, анод','led-cathode':'светодиод, катод','switch-in':'выключатель, первый вывод','switch-out':'выключатель, второй вывод'},start:'Выберите два контакта. Повторный выбор той же пары убирает провод.',selected:'Выберите любой другой контакт.',retry:'Эти выводы не образуют соединение. Выберите подсвеченный контакт.',removed:'Провод удалён.',progress:'Связей установлено',short:'Короткое замыкание питания. Светодиод погас.',burnout:'Светодиод перегорел: резистор обойдён.',reset:'Собрать заново',success:'Мы на связи.',cancel:'Выбор отменён.',board:'Соединяйте любые пары контактов. Для замыкания цепи соедините плюс батарейки с резистором, резистор со светодиодом, светодиод с выключателем и выключатель с минусом батарейки, затем нажмите на переключатель.'},
  en:{switchOn:'Turn switch on',switchOff:'Turn switch off',opened:'Switch is open.',closed:'Switch is closed.',title:'Make a connection',contact:'Terminal',names:{'battery-plus':'battery, positive','battery-minus':'battery, negative','resistor-in':'resistor, first lead','resistor-out':'resistor, second lead','led-anode':'LED, anode','led-cathode':'LED, cathode','switch-in':'switch, first terminal','switch-out':'switch, second terminal'},start:'Choose two terminals. Choose the same pair again to remove the wire.',selected:'Choose any other terminal.',retry:'These leads do not form a connection. Choose a highlighted terminal.',removed:'Wire removed.',progress:'Connections made',short:'The power supply is shorted. The LED is off.',burnout:'The LED burned out: the resistor was bypassed.',reset:'Start again',success:'We are connected.',cancel:'Selection cleared.',board:'Connect any pair of terminals. To close the circuit, connect battery positive to resistor, resistor to LED, LED to switch, and switch to battery negative, then press the switch.'}
};
// Every point is the actual end of a component lead. Component bodies are not contacts.
const terminals=[['battery-plus',110,246],['battery-minus',180,248],['resistor-in',310,208],['resistor-out',490,208],['led-anode',600,300],['led-cathode',680,300],['switch-in',640,440],['switch-out',460,440]];
const connections=[
 {id:'positive',a:'battery-plus',b:'resistor-in',d:'M110 246V137Q110 125 122 125H298Q310 125 310 137V208',colour:'#d62222'},
 {id:'anode',a:'resistor-out',b:'led-anode',d:'M490 208H558Q570 208 570 220V288Q570 300 582 300H600',colour:'#d62222'},
 {id:'cathode',a:'led-cathode',b:'switch-in',d:'M680 300H712Q724 300 724 312V428Q724 440 712 440H640',colour:'#208140'},
 {id:'return',a:'switch-out',b:'battery-minus',d:'M460 440H278Q266 440 266 428V260Q266 248 254 248H180',colour:'#252525'}
];

export function communicationMarkup(c={}){
 const t=copy[c.mediaLocale||getLocale()];
 return `<header class="communication-heading"><h3>${t.title}</h3><button type="button" class="communication-reset" aria-label="${t.reset}"><span aria-hidden="true">↻</span></button></header><div class="communication-workbench" role="group" aria-label="${t.board}"><svg class="communication-art" viewBox="40 70 730 500" aria-hidden="true"><g class="communication-wires" fill="none" stroke-linecap="round" stroke-linejoin="round">${connections.map(w=>`<path class="communication-wire" data-comm-wire="${w.id}" d="${w.d}" stroke="${w.colour}"/>`).join('')}</g>${communicationParts()}</svg><span class="communication-tap" aria-hidden="true"><span></span><svg viewBox="0 0 32 42"><path d="M11 21V6Q11 2 14 2Q17 2 17 6V18Q19 14 22 18Q25 15 27 20Q31 19 30 25L28 35Q27 39 23 39H17Q14 39 12 36L3 26Q1 23 4 21Q6 20 11 25Z"/></svg></span><button type="button" class="communication-switch-toggle" aria-label="${t.switchOn}" aria-pressed="false"></button>${terminals.map(([id,x,y])=>`<button type="button" class="communication-contact" style="--contact-x:${(x-40)/7.3}%;--contact-y:${(y-70)/5}%" data-comm-contact="${id}" aria-label="${t.contact}: ${t.names[id]}" aria-pressed="false"></button>`).join('')}</div><p class="communication-status" role="status" aria-live="polite">${t.start}</p>`;
}

export function mountCommunication(scene,{signal,route,isActive}){
  const syncHint=()=>scene.style.setProperty('--comm-play',isActive()?'running':'paused');
  const hintObserver=new MutationObserver(syncHint);
  hintObserver.observe(scene.closest('.portfolio-ad')||scene,{attributes:true,attributeFilter:['class']});
  const dialog=document.querySelector('#project-dialog');
  if(dialog)hintObserver.observe(dialog,{attributes:true,attributeFilter:['open']});
  document.addEventListener('visibilitychange',syncHint,{signal});
  signal.addEventListener('abort',()=>hintObserver.disconnect(),{once:true});
  syncHint();
  const t=copy[getLocale()],contacts=[...scene.querySelectorAll('[data-comm-contact]')],status=scene.querySelector('.communication-status'),reset=scene.querySelector('.communication-reset'),switchButton=scene.querySelector('.communication-switch-toggle');
  const edges=new Map(),session=createCommunicationSession(componentDamage);
  let selected=null,switchClosed=false,timer;
  if(componentDamage.battery)scene.classList.add('communication-overheated','communication-short','communication-battery-settled');
  if(componentDamage.led)scene.classList.add('communication-burned','communication-led-settled');
  if(componentDamage.switch)scene.classList.add('communication-switch-damaged','communication-switch-settled');
  const syncCount=()=>{scene.dataset.connectionAttempts=String(session.count);};
  const openDescription=opener=>{
    if(signal.aborted||!isActive())return;
    clearTimeout(timer);session.resetRound();syncCount();route('communication',opener);
  };
  syncCount();
  const edgeFor=(a,b)=>{
    const known=connections.find(w=>(w.a===a&&w.b===b)||(w.a===b&&w.b===a));
    if(known)return known;
    const [,ax,ay]=terminals.find(t=>t[0]===a),[,bx,by]=terminals.find(t=>t[0]===b),lane=Math.min(ay,by)-42;
    return {id:[a,b].sort().join('--'),a,b,d:`M${ax} ${ay}V${lane}H${bx}V${by}`};
  };
  function clear(){selected=null;contacts.forEach(n=>{n.setAttribute('aria-pressed','false');n.classList.remove('is-neighbour');});}
  function damageShortPath(switchClosed){
    const fault=traceShortCircuit([...edges.values()],{switchClosed});
    scene.classList.add('communication-overheated');
    if(fault.throughSwitch){componentDamage.switch=true;scene.classList.add('communication-switch-damaged');}
    for(const id of fault.wireIds){
      const wire=scene.querySelector(`[data-comm-wire="${id}"]`);
      if(wire.dataset.damaged)continue;
      wire.dataset.damaged='true';
      // Effects are separate SVG strokes: the original wire color stays fixed.
      const group=document.createElementNS('http://www.w3.org/2000/svg','g');
      group.setAttribute('class','communication-wire-fault');group.dataset.faultWire=id;
      for(const cls of ['heat','char','cracks']){
        const overlay=document.createElementNS('http://www.w3.org/2000/svg','path');
        overlay.setAttribute('class',`communication-wire-${cls}`);
        overlay.setAttribute('d',wire.getAttribute('d'));group.append(overlay);
      }
      scene.querySelector('.communication-wires').append(group);
    }
  }
  function evaluate(opener){
    clearTimeout(timer);
    const result=analyzeCircuit([...edges.values()],{switchClosed});
    const effective=session.observe(result.state);
    scene.classList.toggle('communication-switch-closed',switchClosed);
    switchButton.setAttribute('aria-pressed',String(switchClosed));
    switchButton.setAttribute('aria-label',switchClosed?t.switchOff:t.switchOn);
    for(const [id,colour] of Object.entries(result.wireColors)){
      const wire=scene.querySelector(`[data-comm-wire="${id}"]`);
      if(!wire.dataset.fixedColour){wire.setAttribute('stroke',colour);wire.dataset.fixedColour=colour;}
    }
    if(effective.ledFailedNow)scene.classList.add('communication-burned');
    const lit=effective.lit;
    scene.classList.toggle('communication-lit',lit);
    if(effective.batteryFailedNow){scene.classList.add('communication-short');damageShortPath(switchClosed);}
    scene.dataset.circuitState=effective.state;
    scene.dataset.batteryDead=String(componentDamage.battery);

    status.textContent=componentDamage.battery?(getLocale()==='en'?'The battery burned out. Reload the page to replace it.':'Батарейка перегорела. Перезагрузите страницу, чтобы заменить её.'):componentDamage.led?t.burnout:lit?t.success:`${t.progress}: ${edges.size}. ${t.start}`;
    if(lit)timer=setTimeout(()=>openDescription(opener),2200);
  }
  scene.addEventListener('click',event=>{
    const target=event.target.closest('[data-comm-contact]');if(!target)return;
    scene.classList.add('communication-started');
    const next=target.dataset.commContact;
    if(selected===null){clearTimeout(timer);selected=next;target.setAttribute('aria-pressed','true');contacts.forEach(n=>{if(n!==target)n.classList.add('is-neighbour');});status.textContent=t.selected;return;}
    if(selected===next){clear();status.textContent=t.cancel;return;}
    const edge=edgeFor(selected,next);clear();
    if(edges.has(edge.id)){
      edges.delete(edge.id);
      const wire=scene.querySelector(`[data-comm-wire="${edge.id}"]`);
      scene.querySelector(`[data-fault-wire="${edge.id}"]`)?.remove();
      if(connections.some(item=>item.id===edge.id)){
        wire.classList.remove('is-connected');delete wire.dataset.fixedColour;delete wire.dataset.damaged;
      }else wire.remove();
      evaluate(target);status.textContent=t.removed;return;
    }
    edges.set(edge.id,edge);
    let wire=scene.querySelector(`[data-comm-wire="${edge.id}"]`);
    if(!wire){wire=document.createElementNS('http://www.w3.org/2000/svg','path');wire.setAttribute('class','communication-wire');wire.dataset.commWire=edge.id;wire.setAttribute('d',edge.d);scene.querySelector('.communication-wires').append(wire);}
    wire.classList.add('is-connected');evaluate(target);
    const roundComplete=session.connect(edge.a,edge.b);syncCount();
    if(roundComplete)openDescription(target);
  },{signal});
  switchButton.addEventListener('click',()=>{
    scene.classList.add('communication-started');
    clear();switchClosed=!switchClosed;evaluate(switchButton);
    status.textContent=`${switchClosed?t.closed:t.opened} ${status.textContent}`;
  },{signal});
  reset.addEventListener('click',()=>{
    clearTimeout(timer);clear();edges.clear();switchClosed=false;
    switchButton.setAttribute('aria-pressed','false');switchButton.setAttribute('aria-label',t.switchOn);
    componentDamage.battery=false;componentDamage.led=false;componentDamage.switch=false;
    session.resetRound();syncCount();
    scene.classList.remove('communication-lit','communication-switch-closed','communication-overheated','communication-short','communication-burned','communication-switch-damaged','communication-battery-settled','communication-led-settled','communication-switch-settled','communication-started');
    scene.querySelectorAll('.communication-wire-fault').forEach(group=>group.remove());
    scene.querySelectorAll('[data-comm-wire]').forEach(wire=>{if(connections.some(edge=>edge.id===wire.dataset.commWire)){wire.classList.remove('is-connected');delete wire.dataset.fixedColour;delete wire.dataset.damaged;}else wire.remove();});
    evaluate(reset);reset.focus({preventScroll:true});
  },{signal});
  scene.addEventListener('keydown',event=>{if(event.key==='Escape'&&selected!==null){clear();status.textContent=t.cancel;}},{signal});
  signal.addEventListener('abort',()=>clearTimeout(timer),{once:true});
  window.addEventListener('hashchange',()=>{
    if(location.hash==='#project/communication'){clearTimeout(timer);session.resetRound();syncCount();}
  },{signal});
  reset.setAttribute('aria-label',getLocale()==='en'?'Reset game':'Сбросить игру');
  evaluate(reset);
}
