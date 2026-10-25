// Start-gate styling comes from CASINO 2/app/globals.css; chat is a local parody.
const handles=['Mortgage_Enjoyer_777','mamont_na_udachu','xX_cash_karas_Xx','bogataya_planktonka','ne_bot_100proc','admin_maminoy_podrugi','ostrov_za_pyat_minut'];
const messages=c=>[c.reviewWin,c.reviewMortgage,c.reviewSurprise,c.reviewFour,c.reviewFive,c.reviewSix,c.reviewSeven];
export function casinoMarkup(c,url){
  return `<div class="casino-gate"><div class="casino-rays" aria-hidden="true"></div><a class="casino-earning" href="${url}" aria-label="${c.cta}"><span>${c.start}</span><strong>${c.earn}</strong></a></div><aside class="casino-chat" aria-label="${c.chatLabel}"><h3>${c.chatTitle}<span class="casino-live" aria-hidden="true"></span></h3><div class="casino-stream" role="log" aria-label="${c.chatLabel}" aria-live="off"></div><form class="casino-form"><label class="casino-nickname"><span>${c.nickname}</span><input name="nickname" maxlength="32" autocomplete="off" placeholder="${c.you}"></label><input name="message" maxlength="220" required autocomplete="off" aria-label="${c.messageLabel}"><button type="submit">${c.send}</button></form></aside>`;
}
export function mountCasino(scene,c,{signal,isActive}){
  const stream=scene.querySelector('.casino-stream'),form=scene.querySelector('.casino-form');
  const reviews=messages(c);let cursor=0;
  function append(text,index,own=false,animate=true,nickname=''){
    const atBottom=stream.scrollHeight-stream.scrollTop-stream.clientHeight<55;
    const entry=document.createElement('div');entry.className=`casino-message${own?' casino-own':''}${animate?' casino-new':''}`;
    const picture=document.createElement('span');picture.className='casino-avatar';picture.setAttribute('aria-hidden','true');if(own){
      picture.classList.add('casino-avatar-empty');
      picture.innerHTML='<svg viewBox="0 0 40 40" aria-hidden="true"><path fill="currentColor" d="M14 9 17 4l3 3 3-3 3 5a13 13 0 0 1 5 5 6 6 0 1 1 1 12 13 13 0 0 1-24 0 6 6 0 1 1 1-12 13 13 0 0 1 5-5Z"/><path fill="#352039" d="M12 18c0-5 5-6 8-2 3-4 8-3 8 2 0 3-2 4-2 6 0 7-12 7-12 0 0-2-2-3-2-6Z"/></svg>';
    }else picture.style.backgroundPosition=`${index%3*50}% ${Math.floor(index/3)*50}%`;
    const content=document.createElement('div'),name=document.createElement('b'),message=document.createElement('p');
    name.textContent=own?(nickname||c.you):handles[index%handles.length];message.textContent=text;
    content.append(name,message);entry.append(picture,content);stream.append(entry);
    while(stream.children.length>12)stream.firstElementChild.remove();
    if(atBottom||own)stream.scrollTop=stream.scrollHeight;
  }
  for(let i=0;i<3;i++)append(reviews[i],i,false,false);cursor=3;
  const timer=setInterval(()=>{
    if(!isActive())return;
    append(reviews[cursor%reviews.length],cursor%handles.length);cursor++;
  },4200);
  signal.addEventListener('abort',()=>clearInterval(timer),{once:true});
  form.addEventListener('submit',event=>{
    event.preventDefault();const input=form.elements.message,text=input.value.trim();
    if(!text)return;
    append(text,7,true,true,form.elements.nickname.value.trim());input.value='';input.focus();
  },{signal});
}
