// Original hand-plotted display alphabet for the beach illustration, not a font.
// Open printed forms keep Cyrillic Т distinct from М. Coordinates are in pen units.
const letters={
 А:[19,'M2 27Q6 11 11 3Q15 14 18 28M5 20Q10 18 15 20'],
 Б:[18,'M16 4Q9 2 3 5L3 27Q20 30 17 19Q15 14 4 16'],
 В:[18,'M3 28L4 4Q19 0 16 11Q14 16 5 16Q19 12 18 22Q18 30 3 28'],
 Г:[16,'M3 28L4 4Q10 3 16 4'],
 Д:[22,'M2 31L2 25Q7 23 8 5L16 4L18 25M2 26L21 26L21 32'],
 Е:[16,'M16 4L4 5L3 28L16 27M4 16L13 15'],
 Ё:[16,'M16 6L4 7L3 28L16 27M4 17L13 16M6 1L6 2M13 1L13 2'],
 Ж:[26,'M2 5Q8 8 13 16L12 28M13 4L13 16Q20 8 24 4M13 16Q6 18 2 28M14 16Q21 18 25 27'],
 З:[18,'M2 6Q15-1 17 7Q19 15 8 16Q21 14 17 24Q13 32 2 26'],
 И:[21,'M3 4L3 28Q13 17 18 4L19 28'],
 Й:[21,'M3 7L3 28Q13 19 18 7L19 28M7 1Q11 7 16 1'],
 К:[19,'M3 4L3 28M18 3Q13 12 4 17M8 14Q15 20 19 28'],
 Л:[20,'M1 28Q6 28 8 5L16 3L19 28'],
 М:[25,'M2 28L4 4Q9 11 13 20Q17 9 21 3L24 28'],
 Н:[20,'M3 3L3 28M18 4L18 28M4 16Q11 14 18 15'],
 О:[21,'M11 3C-1 2 0 29 10 29C24 30 24 3 11 3Z'],
 П:[21,'M3 28L4 4Q11 3 18 4L19 28'],
 Р:[18,'M3 28L4 4C22-2 23 20 4 17'],
 С:[18,'M18 6C2-6-4 31 17 27'],
 Т:[20,'M1 5Q11 3 20 4M11 5L10 28'],
 У:[20,'M2 4Q5 15 12 18M19 3Q15 27 5 29'],
 Ф:[25,'M13 2L12 31M13 7C-3 3-3 26 12 25C30 28 29 5 13 7Z'],
 Х:[20,'M2 4Q12 15 19 28M19 3Q13 17 2 28'],
 Ц:[22,'M3 4L3 27L18 27L18 4M18 27L22 27L22 32'],
 Ч:[20,'M3 4L3 14Q7 21 17 15M18 3L18 28'],
 Ш:[28,'M3 4L3 28L25 27L25 3M14 5L14 27'],
 Щ:[30,'M3 4L3 27L25 27L25 3M14 5L14 27M25 27L29 27L29 32'],
 Ъ:[22,'M1 5L8 4L7 27C28 32 27 12 8 16'],
 Ы:[26,'M3 4L3 27C24 32 23 12 4 16M24 4L24 28'],
 Ь:[18,'M3 4L3 27C24 32 23 12 4 16'],
 Э:[19,'M2 6C22-5 24 32 2 26M8 16L18 16'],
 Ю:[29,'M3 4L3 28M3 16L12 15M20 3C8 2 8 29 19 29C32 29 32 3 20 3Z'],
 Я:[20,'M18 28L18 4C0-2-3 18 16 17M12 17L2 28'],
 A:null,B:null,C:null,D:[21,'M3 28L4 4C25-1 27 30 3 28Z'],E:null,
 F:[16,'M3 28L4 4L16 4M4 16L14 15'],G:[21,'M19 6C1-5-3 31 19 27L19 17L12 17'],
 H:null,I:[10,'M3 4L9 4M6 5L5 28M1 28L9 28'],J:[15,'M14 4L13 22Q12 33 2 26'],K:null,L:[16,'M4 3L3 28L16 27'],M:null,N:[21,'M3 28L4 4Q12 17 18 27L18 3'],O:null,P:null,Q:[22,'M11 3C-1 2 0 29 10 29C24 30 24 3 11 3ZM13 23L22 32'],R:[20,'M3 28L4 4C22-2 23 20 4 17M10 17L20 28'],S:[18,'M18 6C1-5-4 13 9 16C27 19 13 36 1 25'],T:null,U:[21,'M3 4L3 20C2 33 20 32 18 20L19 4'],V:[20,'M2 4Q5 20 11 29Q17 16 19 3'],W:[28,'M2 4L7 28Q13 20 14 10L20 28Q25 16 27 3'],X:null,Y:[21,'M2 4L11 17L19 3M11 17L10 28'],Z:[19,'M2 5L18 4L2 28L19 27'],
 '!':[7,'M4 3L3 20M3 27L3 28'], '?':[16,'M1 8C1-2 19 1 15 11Q14 15 8 17L8 21M8 28L8 29'],
 ',':[7,'M4 26Q5 30 1 33'], '.':[7,'M3 27L3 28'], ':':[7,'M3 10L3 11M3 24L3 25'],
 '—':[24,'M2 16L23 15'], '-':[13,'M2 16L12 15'], '’':[7,'M4 3L2 9'], "'":[7,'M4 3L2 9']
};
for(const [latin,cyrillic] of Object.entries({A:'А',B:'В',C:'С',E:'Е',H:'Н',K:'К',M:'М',O:'О',P:'Р',T:'Т',X:'Х'}))letters[latin]=letters[cyrillic];

// Lowercase has a round, open bowl and a quiet x-height; т uses a crossbar.
Object.assign(letters,{
 а:[16,'M13 15C3 6-3 29 8 28Q14 28 14 16L14 28'],
 б:[17,'M15 3Q8 8 4 7Q0 11 3 23C5 33 19 28 15 17Q10 9 3 18'],
 в:[16,'M3 28L4 13Q16 8 15 17L7 20Q20 16 15 26Q12 30 3 28'],
 г:[13,'M3 28L3 14Q8 12 13 14'],
 д:[19,'M4 26Q7 22 8 13L14 13L16 26M2 31L2 26L18 26L18 31'],
 е:[16,'M3 21Q18 22 14 15C8 5-5 29 15 27'],
 ё:[16,'M3 21Q18 22 14 15C8 5-5 29 15 27M5 6L5 7M12 5L12 6'],
 ж:[23,'M2 13Q5 20 11 21L11 28M12 12L11 21Q18 18 21 12M11 21Q4 21 2 28M12 21Q19 21 22 28'],
 з:[15,'M2 14Q13 8 14 16Q13 20 7 20Q18 20 12 27Q7 31 1 26'],
 и:[18,'M3 13L3 24Q4 34 15 15L15 28'],
 й:[18,'M3 13L3 24Q4 34 15 15L15 28M5 5Q9 11 14 5'],
 к:[16,'M3 12L3 28M15 12Q11 20 4 21M7 20Q13 23 16 28'],
 л:[17,'M1 28Q5 29 8 13L13 12L16 28'],
 м:[22,'M2 28L4 13Q9 18 11 25L17 12L21 28'],
 н:[17,'M3 12L3 28M14 13L15 28M4 21Q9 19 14 20'],
 о:[17,'M9 12C-1 10-2 29 8 29C19 30 21 12 9 12Z'],
 п:[18,'M3 28L3 13Q10 11 15 13L15 28'],
 р:[17,'M3 36L3 14Q15 8 16 19Q17 31 4 27'],
 с:[15,'M14 14C1 5-4 32 14 27'],
 т:[17,'M1 14Q9 12 17 13M9 14L8 28'],
 у:[17,'M2 13Q4 25 11 25M15 12Q14 35 4 36'],
 ф:[22,'M12 4L11 36M11 14C-3 7-3 32 11 27C26 32 26 8 11 14Z'],
 х:[17,'M2 13Q9 18 16 28M15 12Q10 22 2 28'],
 ц:[19,'M3 12L3 27L15 27L15 12M15 27L18 27L17 33'],
 ч:[17,'M2 12L3 20Q8 25 14 19M15 12L15 28'],
 ш:[24,'M3 12L3 28L21 27L21 12M12 13L12 27'],
 щ:[27,'M3 12L3 28L21 27L21 12M12 13L12 27M21 27L25 27L25 33'],
 ъ:[18,'M1 13L6 12L6 27Q19 31 17 22Q14 16 6 20'],
 ы:[23,'M3 12L3 27Q16 32 15 22Q12 17 4 20M21 13L21 28'],
 ь:[16,'M3 12L3 27Q18 32 16 22Q13 17 4 20'],
 э:[16,'M2 14C18 5 20 33 2 27M7 20L15 20'],
 ю:[25,'M3 12L3 28M4 21L11 20M18 12C7 9 6 30 17 29C28 30 28 12 18 12Z'],
 я:[17,'M15 28L15 13Q0 7 2 19Q4 24 14 21M10 22L2 28'],
 b:[17,'M3 4L3 28M3 17Q15 6 16 20Q17 33 3 27'],
 d:[17,'M14 3L14 28M14 16C3 5-3 30 9 28L14 25'],
 f:[13,'M4 35L5 11Q5 0 14 5M1 15L12 14'],
 g:[17,'M14 15C2 6-2 28 9 27L14 23M15 13L14 30Q12 39 3 32'],
 h:[18,'M3 4L3 28M3 21Q16 3 15 22L15 28'],
 i:[7,'M4 13L3 28M4 5L4 6'],
 j:[9,'M6 13L5 30Q5 38-1 34M6 5L6 6'],
 l:[8,'M4 3L3 26Q3 30 7 27'],
 n:[18,'M3 28L3 13M3 21Q16 3 15 22L15 28'],
 q:[17,'M14 15C2 6-2 28 9 27L14 23M15 13L14 36'],
 r:[13,'M3 28L3 13M3 20Q9 9 13 14'],
 s:[14,'M13 14Q1 8 2 17L10 22Q19 30 1 27'],
 t:[12,'M6 5L5 24Q5 31 12 26M1 14L12 13'],
 u:[18,'M3 13L3 23Q3 35 15 20M15 13L15 28'],
 v:[16,'M2 13Q5 23 9 29Q14 21 15 12'],
 w:[23,'M2 13L6 28L12 17L17 28Q22 20 22 12'],
 y:[17,'M2 13Q4 25 11 25M15 12Q14 35 4 36'],
 z:[15,'M2 14L14 13L2 28L15 27']
});
for(const [latin,cyrillic] of Object.entries({a:'а',c:'с',e:'е',k:'к',m:'м',o:'о',p:'р',x:'х'}))letters[latin]=letters[cyrillic];

export function paintBeachText(node,text,maxPixels){
  node.dataset.beachText=text;
  const fontSize=parseFloat(getComputedStyle(node).fontSize),limit=Math.max(90,maxPixels)*32/fontSize;
  const advance=char=>char===' '?10:(letters[char]||letters['?'])[0]+5;
  const words=text.split(/\s+/),lines=[];
  let line='',width=0;
  for(const word of words){const w=[...word].reduce((sum,c)=>sum+advance(c),0);if(line&&width+10+w>limit){lines.push({text:line,width});line='';width=0;}if(line){line+=' ';width+=10;}line+=word;width+=w;}
  if(line)lines.push({text:line,width});
  const w=Math.max(...lines.map(l=>l.width),1)+8,h=lines.length*37+8;
  const ns='http://www.w3.org/2000/svg',svg=document.createElementNS(ns,'svg');
  svg.setAttribute('viewBox',`0 0 ${w} ${h}`);svg.setAttribute('aria-hidden','true');svg.classList.add('bvp-lettering');
  svg.style.width=`${w/32}em`;svg.style.height=`${h/32}em`;
  let index=0;
  for(const [row,l] of lines.entries()){
    let x=node.matches('h3,.bvp-heading p')?4:(w-l.width)/2;
    for(const char of l.text){
      if(char!==' '){const [,d]=letters[char]||letters['?'],g=document.createElementNS(ns,'g');
        g.setAttribute('transform',`translate(${x} ${row*37+4+[0,.8,-.5,.4][index%4]}) rotate(${[-2,1.3,-.7,2][index%4]} 10 18)`);
        for(const cls of ['bvp-letter-edge','bvp-letter-ink']){const p=document.createElementNS(ns,'path');p.setAttribute('d',d);p.setAttribute('class',cls);g.append(p);}svg.append(g);index++;
      }x+=advance(char);
    }
  }
  const accessible=document.createElement('span');accessible.className='bvp-lettering-text';accessible.textContent=text;
  node.replaceChildren(accessible,svg);
}
