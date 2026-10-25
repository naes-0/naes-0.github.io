// Original vector illustration; museum references inform pose, not traced geometry.
import { colourStages } from './content.js';
// The palette retains several shades within each named family, rather than recolouring
// every red cell with one flat red. The geometry is the same at every stage.
const hues=[
  ['red',['#d94149','#ef6552','#ae2c43','#e87957']],
  ['orange',['#ef8c2f','#d46d2d','#ffc365','#d98139']],
  ['yellow',['#f5d84c','#e9b934','#ffe5a0','#d6b24b']],
  ['green',['#719556','#286d60','#a6b86b','#194d49']],
  ['blue',['#2e9fc0','#267b9f','#73c4cb','#4667ad']],
  ['purple',['#a66bb3','#805499','#c58cbd','#76519b']],
  ['pink',['#e37da3','#f2abc5','#c75b95','#eaa0b3']],
  ['brown',['#866344','#ae8a60','#604d40','#c2a579']]
];
const round=n=>Math.round(n*10)/10;
const pt=p=>p.map(round).join(' ');
const lerp=(a,b,t)=>a.map((v,i)=>v+(b[i]-v)*t);
const tangent=(a,b,c,sign=1)=>b.map((v,i)=>v+(c[i]-a[i])*sign/6);
const vein=(a,b)=>lerp(a,b,.5).map((v,i)=>v+(i===0?(b[1]-a[1]):-(b[0]-a[0]))*.045);
export function butterflyLandscapeMarkup(c,common) {
  const en=common.butterflyAlt.startsWith('Butterfly');
  const stageWords=[c.lightDark,c.red,c.green,c.yellow,c.blue,c.brown,c.all];
  let serial=0;
  function region(d,i,tone=null) {
    const id=++serial,[colour,shades]=hues[i],hex=tone||shades[(id*7+i)%shades.length];
    return `<g class="bl-region bl-colour" data-region="${id}" data-colour="${colour}" style="--region-colour:${hex}"><path d="${d}"/></g>`;
  }
  const layer=(colour,markup)=>`<g class="bl-colour" data-colour="${colour}">${markup}</g>`;
  const quad=(a,b,c,t)=>a.map((v,i)=>(1-t)*(1-t)*v+2*(1-t)*t*b[i]+t*t*c[i]);
  function leaf(x,y,len,angle,i=3,palette=null,venation=null) {
    // Pinnate, brochidodromous loops, reticulate, parallel, and basal
    // acrodromous veins. Twig renderers pass one type for the whole twig.
    const kind=venation??Math.abs(Math.round(x*3+y+angle))%5;
    const h=len*[.22,.29,.25,.16,.32][kind],rib=t=>[len*t,Math.sin(Math.PI*t)*h*.12];
    const top=t=>quad([0,0],[len*(kind===1?.42:.5),-h*1.75],[len,0],t);
    const bottom=t=>quad([0,0],[len*(kind===2?.59:.5),h*1.5],[len,0],t);
    const base=(palette||hues[i][1])[Math.abs(Math.round(x+y+len))%4];
    const shade=amount=>'#'+base.slice(1).match(/../g).map(part=>Math.round(parseInt(part,16)*(1-Math.abs(amount))+(amount>0?255:0)*Math.abs(amount)).toString(16).padStart(2,'0')).join('');
    let cells='';
    const arc=(a,b,k=0)=>pt(lerp(a,b,.5).map((v,j)=>v+(j===0?len*k:0)));
    if(kind>=3){
      // Longitudinal veins are actual continuous curves from base to tip.
      // Sparse cross-veinlets create enclosed elongated cells between them.
      const rails=kind===3?[-1.75,-1.3,-.88,-.45,0,.40,.82,1.18,1.5]:[-1.75,-1.15,-.45,0,.48,1.12,1.5];
      const line=(k,t)=>quad([0,0],[len*.5,h*k],[len,0],t);
      for(let j=0;j<rails.length-1;j++){
        const knots=palette?[0,.42,1]:kind===3?[0,.28,.64,1]:[0,.17,.4,.68,.87,1];
        for(let k=0;k<knots.length-1;k++){
          const t=knots[k],u=knots[k+1],a=line(rails[j],t),b=line(rails[j],u),c=line(rails[j+1],u),d=line(rails[j+1],t);
          const control=(v,p,q)=>pt(line(v,(t+u)/2).map((z,i)=>z*2-(p[i]+q[i])*.5));
          cells+=region(`M${pt(a)}Q${control(rails[j],a,b)} ${pt(b)}Q${arc(b,c,kind===3?0:.012)} ${pt(c)}Q${control(rails[j+1],d,c)} ${pt(d)}Q${arc(d,a,kind===3?0:.012)} ${pt(a)}Z`,i,shade((j%3-1)*.025+(k%2)*.018));
        }
      }
      const main=kind===3?[-1.3,-.45,.4,1.18]:[-1.15,0,1.12];
      return `<g class="bl-colour bl-leaf-${kind}" data-colour="${hues[i][0]}" transform="translate(${x} ${y}) rotate(${angle})">${cells.replaceAll('bl-region bl-colour','bl-region')}<path class="bl-fine-vein" d="${main.map(v=>`M0 0Q${len*.5} ${h*v} ${len} 0`).join('')}"/></g>`;
    }
    for(const [side,edge] of [top,bottom].entries()) {
      const knots=palette?(side?[0,.3,.68,1]:[0,.24,.61,1]):kind===1?(side?[0,.23,.49,.76,1]:[0,.16,.43,.71,1]):(side?[0,.19,.4,.64,.86,1]:[0,.13,.33,.57,.79,1]);
      const margin=t=>lerp(rib(t),edge(t),kind===2?.58:.74);
      for(let k=0;k<knots.length-1;k++) {
        const t=knots[k],u=knots[k+1],m=rib(t),n=rib(u),p=edge(t),q=edge(u),cut=side?-.018:.018;
        const tone=(side?-.055:.02)+[0,.035,-.015,.045,.005][k];
        const edgeArc=pt(edge((t+u)/2).map((v,j)=>v*2-(p[j]+q[j])*.5));
        if(kind===0||palette) {
          cells+=region(`M${pt(m)}Q${arc(m,p,cut)} ${pt(p)}Q${edgeArc} ${pt(q)}Q${arc(n,q,cut)} ${pt(n)}Q${pt(rib((t+u)/2))} ${pt(m)}Z`,i,shade(tone));
        } else {
          const r=margin(t),v=margin(u),mid=margin((t+u)/2);
          // Closed inner areoles + the narrow continuous marginal loop.
          cells+=region(`M${pt(m)}Q${arc(m,r,cut)} ${pt(r)}Q${pt(mid.map((z,j)=>z*2-(r[j]+v[j])*.5))} ${pt(v)}Q${arc(v,n,cut)} ${pt(n)}Q${pt(rib((t+u)/2))} ${pt(m)}Z`,i,shade(tone));
          if(kind===2&&k>0&&k<knots.length-2) {
            const e=edge((t+u)/2);
            cells+=region(`M${pt(r)}Q${arc(r,p,cut)} ${pt(p)}Q${pt(lerp(p,e,.5))} ${pt(e)}Q${arc(e,mid,-cut)} ${pt(mid)}Q${pt(lerp(mid,r,.5))} ${pt(r)}Z`,i,shade(tone+.025));
            cells+=region(`M${pt(mid)}Q${arc(mid,e,-cut)} ${pt(e)}Q${pt(lerp(e,q,.5))} ${pt(q)}Q${arc(q,v,cut)} ${pt(v)}Q${pt(lerp(v,mid,.5))} ${pt(mid)}Z`,i,shade(tone-.025));
          } else cells+=region(`M${pt(r)}Q${arc(r,p,cut)} ${pt(p)}Q${edgeArc} ${pt(q)}Q${arc(q,v,cut)} ${pt(v)}Q${pt(mid.map((z,j)=>z*2-(r[j]+v[j])*.5))} ${pt(r)}Z`,i,shade(tone+.035));
        }
      }
    }
    return `<g class="bl-colour bl-leaf-${kind}" data-colour="${hues[i][0]}" transform="translate(${x} ${y}) rotate(${angle})">${cells.replaceAll('bl-region bl-colour','bl-region')}<path class="bl-fine-vein" d="M0 0Q${len*.5} ${h*.24} ${len} 0"/></g>`;
  }
  function fern(x,y,s,a) {
    // Every opposite pinna begins exactly on the same curved rachis.
    const root=[0,0],bend=[35,-115],tip=[9,-263],count=s<.4?6:11;
    return `<g transform="translate(${x} ${y}) rotate(${a}) scale(${s})"><path class="bl-stem" d="M0 0Q35-115 9-263"/>${Array.from({length:count},(_,i)=>{
      const t=.1+i*(.77/(count-1)),[x,y]=quad(root,bend,tip,t),len=84*(1-t)+8;
      return leaf(round(x),round(y),len,-154+i*.75,3,null,0)+leaf(round(x),round(y),len*.94,-20-i*.7,3,null,0);
    }).join('')}</g>`;
  }
  function palmateLeaf(x,y,len,a) {
    // Broad tropical climber blade with five basal primary veins and finer
    // cross-veins. The petiole enters the basal notch, never the blade tip.
    const rim=[[0,0],[-8,-18],[7,-43],[32,-44],[65,-29],[100,0],[65,32],[31,46],[5,37],[-7,17],[0,0]];
    const rings=[0,.39,.72,1],base=[3,0];let cells='',veins='';
    for(let k=1;k<rim.length-2;k++){
      const p=rim[k],q=rim[k+1],prev=rim[k-1],next=rim[k+2];
      const c1=tangent(prev,p,q),c2=tangent(p,q,next,-1);
      for(let j=0;j<3;j++){
        const t=rings[j],u=rings[j+1],m=lerp(base,p,t),n=lerp(base,q,t),r=lerp(base,p,u),v=lerp(base,q,u);
        cells+=region(`M${pt(m)}Q${pt(lerp(m,r,.5).map((z,i)=>z+(i?2:-1)))} ${pt(r)}C${pt(lerp(base,c1,u))} ${pt(lerp(base,c2,u))} ${pt(v)}Q${pt(lerp(v,n,.5).map((z,i)=>z+(i?2:-1)))} ${pt(n)}C${pt(lerp(base,c2,t))} ${pt(lerp(base,c1,t))} ${pt(m)}Z`,3,['#397f62','#4c926b','#5a9d71','#76ae7c'][(k+j)%4]);
      }
      if([2,4,5,7,8].includes(k))veins+=`M3 0Q${pt(lerp(base,p,.48).map((z,i)=>z+(i?3:0)))} ${pt(p)}`;
    }
    return `<g class="bl-colour bl-leaf-5" data-colour="green" transform="translate(${x} ${y}) rotate(${a}) scale(${len/100})">${cells.replaceAll('bl-region bl-colour','bl-region')}<path class="bl-leaf-rib" d="${veins}"/></g>`;
  }
  function orchid(x,y,s,a) {
    return `<g transform="translate(${x} ${y}) rotate(${a}) scale(${s})">${region('M-2 3C-27-23-38-65-17-99C-10-115 8-111 13-92C21-62 13-25-2 3Z',6)}${region('M-3 2C-39-3-94-7-109-37C-118-53-101-64-88-54C-99-76-72-85-57-65C-56-87-32-70-26-45C-19-27-8-10-3 2Z',5)}${region('M2 2C35-11 65-70 90-72C107-74 109-53 95-47C123-50 126-30 105-20C119-12 105 6 86 7C50 10 22 9 2 2Z',6)}${region('M-3 4C-29 27-40 49-23 60C-14 67-8 50 0 59C11 78 27 56 27 43C42 37 33 21 13 12Z',0)}${region('M-7 9C-18-2-12-18 2-16C18-13 20 4 8 14L1 30Z',2)}<path class="bl-petal-vein" d="M-4-9Q-8-53-5-87M-13-5Q-57-42-87-44M11-2Q55-37 88-52M-16 42Q0 26 17 37M-73-47L-58-34M60-30L74-32"/><g fill="#695e65">${[-1,0,1].map(i=>`<path d="M${i*6} 19l2 3m-2 4l2 2m-2 4l2 2"/>`).join('')}</g></g>`;
  }
  function heliconia(x,y,s,a) {
    return `<g transform="translate(${x} ${y}) rotate(${a}) scale(${s})"><path class="bl-stem" d="M0 100Q9 12-6-100"/>${[-72,-18,38,93].map((y,i)=>`<g transform="translate(0 ${y}) scale(${i%2?-1:1} 1)">${region('M-2 4C18-2 56-24 85-47C72-19 46 16 16 20C4 19-3 13-2 4Z',i%2?1:0)}${region('M-2 4C13-8 36-12 49-10L13 5Z',2)}<path class="bl-petal-vein" d="M3 10Q33 6 68-30"/></g>`).join('')}</g>`;
  }
  function birdFlower(x,y,s,a) {
    return `<g transform="translate(${x} ${y}) rotate(${a}) scale(${s})">${region('M-7 8C31-13 80-10 134-36C101 5 43 23-7 8Z',3)}${region('M4-1C-20-25-31-65-32-106C-9-81 10-43 16-7Z',1)}${region('M14-8C9-42 19-86 38-121C42-77 38-42 28-11Z',0)}${region('M30-11C43-49 61-77 86-99C76-55 59-28 43-11Z',1)}${region('M23-5C43-25 62-38 92-46C73-21 56-8 33 1Z',4)}<path class="bl-petal-vein" d="M3 0L-23-85M22-12L34-102M38-14L73-82M5 10Q64 10 117-26"/></g>`;
  }
  function splitLeaf(x,y,s,a) {
    const shape='M0 0C-8-23-50-29-67-60C-79-83-66-102-40-88L-57-120C-67-143-43-151-20-127C-29-160-4-181 12-151C38-177 61-154 43-131C76-151 87-123 63-100C96-116 104-84 49-56C73-66 53-21 0 0ZM-17-93C-27-108-34-107-34-99C-33-89-24-79-21-82ZM20-111C23-128 16-132 12-122C6-110 8-98 12-100ZM27-64C41-77 45-87 37-86C27-84 18-72 19-68Z';
    const id=`bl-lobed-${++serial}`;
    let cells='';
    for(let side=0;side<2;side++)for(let k=0;k<9;k++){
      const y=-k*20+5,sign=side?1:-1;
      cells+=region(`M2 ${y}Q${40*sign} ${y-10} ${100*sign} ${y-39}L${100*sign} ${y-65}Q${41*sign} ${y-32} 2 ${y-20}Z`,3,['#67935c','#7eaa68','#4a8260','#92b16d'][(k+side)%4]);
    }
    return `<g class="bl-colour" data-colour="green" transform="translate(${x} ${y}) rotate(${a}) scale(${s})"><defs><clipPath id="${id}"><path d="${shape}" clip-rule="evenodd"/></clipPath></defs><g clip-path="url(#${id})">${region(shape,3).replaceAll('bl-region bl-colour','bl-region')}${cells.replaceAll('bl-region bl-colour','bl-region')}</g><path class="bl-leaf-rib" d="M0-2Q-3-57 6-139"/></g>`;
  }
  const cubic=(a,b,c,d,t)=>a.map((v,i)=>(1-t)**3*v+3*(1-t)**2*t*b[i]+3*(1-t)*t*t*c[i]+t**3*d[i]);
  function wingContour(rim) {
    const polygon=[[0,0],rim[0]];
    for(let i=0;i<rim.length-1;i++){
      const a=rim[i],d=rim[i+1],b=tangent(rim[Math.max(0,i-1)],a,d),c=tangent(a,d,rim[Math.min(rim.length-1,i+2)],-1);
      for(let k=1;k<=12;k++)polygon.push(cubic(a,b,c,d,k/12));
    }
    return polygon;
  }
  function insidePolygon(p,polygon) {
    let inside=false;
    for(let i=0,j=polygon.length-1;i<polygon.length;j=i++){
      const a=polygon[i],b=polygon[j];
      if((a[1]>p[1])!==(b[1]>p[1])&&p[0]<(b[0]-a[0])*(p[1]-a[1])/(b[1]-a[1])+a[0])inside=!inside;
    }return inside;
  }
  function wingCells(boundary,box,step,ocelli=[]) {
    const [x0,y0,x1,y1]=box,seeds=[];
    for(let row=0,y=y0+step*.4;y<y1;y+=step,row++)for(let col=0,x=x0+step*.4;x<x1;x+=step,col++)
      seeds.push([x+Math.sin(row*3.1+col*1.7)*step*.28,y+Math.cos(col*2.3+row*1.9)*step*.26]);
    // Small ring-shaped areoles resolve the eye markings; the rest of the
    // wing retains larger irregular cells. Pattern geometry stays coherent.
    for(const [x,y,rx,ry] of ocelli){
      for(let j=seeds.length-1;j>=0;j--)if(((seeds[j][0]-x)/rx)**2+((seeds[j][1]-y)/ry)**2<1.65**2)seeds.splice(j,1);
      seeds.push([x,y]);
      for(const r of [.28,.54,.83,1.16,1.57])for(let k=0;k<14;k++){
        const a=k*Math.PI/7+(r<.5?0:.06);
        seeds.push([x+Math.cos(a)*rx*r,y+Math.sin(a)*ry*r]);
      }
    }
    // Start with the actual inset wing, not a bounding rectangle. Every cell
    // is a geometric intersection of that silhouette and Voronoi halfplanes.
    // No coloured path exists outside the wing, even without SVG clipping.
    return seeds.map((seed,index)=>{
      let polygon=boundary;
      for(let j=0;j<seeds.length&&polygon.length;j++)if(j!==index){
        const other=seeds[j],dx=other[0]-seed[0],dy=other[1]-seed[1],limit=(other[0]**2+other[1]**2-seed[0]**2-seed[1]**2)/2,next=[];
        for(let k=0;k<polygon.length;k++){
          const a=polygon[k],b=polygon[(k+1)%polygon.length],fa=a[0]*dx+a[1]*dy-limit,fb=b[0]*dx+b[1]*dy-limit;
          if(fa<=.000001)next.push(a);
          if((fa<0)!==(fb<0))next.push(lerp(a,b,fa/(fa-fb)));
        }polygon=next;
      }
      polygon=polygon.filter((p,i,a)=>Math.hypot(p[0]-a[(i+a.length-1)%a.length][0],p[1]-a[(i+a.length-1)%a.length][1])>.02);
      if(polygon.length<3)return null;
      const area=Math.abs(polygon.reduce((sum,a,i)=>{const b=polygon[(i+1)%polygon.length];return sum+a[0]*b[1]-b[0]*a[1];},0))/2;
      if(area<1)return null;
      const centre=polygon.reduce((a,p)=>[a[0]+p[0]/polygon.length,a[1]+p[1]/polygon.length],[0,0]);
      // Short quadratic corners stay inside the cell. There is no outward
      // bulge at the silhouette and no differently coloured overlay per cell.
      let d=`M${pt(lerp(polygon[polygon.length-1],polygon[0],.82))}`;
      polygon.forEach((p,i)=>{const next=polygon[(i+1)%polygon.length];d+=`Q${pt(p)} ${pt(lerp(p,next,.18))}L${pt(lerp(p,next,.82))}`;});
      return {d:d+'Z',centre,vertices:polygon};
    }).filter(Boolean);
  }
  function wing(rim,origin,far=false) {
    const isHind=rim===hind,outer=wingContour(rim),centre=isHind?[-102,-34]:[-63,-155];
    const boundary=outer.map(p=>lerp(centre,p,.963)),box=isHind?[-214,-110,4,40]:[-193,-330,59,10];
    const eyes=isHind?[[-143,-35,35,29]]:[[-129,-245,24,22],[-74,-215,12,11]];
    const cells=wingCells(boundary,box,isHind?12:14,eyes),id=`bl-wing-${++serial}`;
    const palettes={
      0:['#ec2650','#ff4161','#dc1651','#f93567'],1:['#ff851c','#ffac2f','#ed6a17','#ff9524'],
      2:['#ffe23e','#fff16b','#f4c729','#ffdb32'],3:['#24bd91','#45d6a5','#0fa47e','#2dc69c'],
      4:['#079ee1','#24c4e9','#1683d6','#50d9ef'],5:['#8950e4','#a36bf0','#713ac8','#b47afa'],
      6:['#f658b3','#ff82ce','#e53c9b','#ff64c2']};
    const ellipse=(p,x,y,rx,ry)=>((p[0]-x)/rx)**2+((p[1]-y)/ry)**2;
    const curve=(a,b,c,d)=>Array.from({length:81},(_,i)=>cubic(a,b,c,d,i/80));
    const distance=(p,path)=>Math.min(...path.map(q=>Math.hypot(p[0]-q[0],p[1]-q[1])));
    const ribbon=isHind?curve([-189,-35],[-158,17],[-86,16],[-31,-8]):curve([-158,-283],[-80,-305],[-47,-180],[34,-155]);
    const greenSweep=curve([-158,-201],[-110,-205],[-28,-114],[-11,-28]);
    function colour(p){
      const [x,y]=p;
      if(isHind){
        const eye=ellipse(p,-143,-35,35,29);
        if(eye<.12)return 4;if(eye<.30)return -1;if(eye<.49)return 2;if(eye<.75)return 1;if(eye<1.12)return 5;
        const d=distance(p,ribbon);
        if(d<9)return 2;if(d<23)return 0;if(d<36)return 6;
        if(y< -63)return 5;
        return x< -95?3:4;
      }
      // Colour follows curving bands and ocelli; a whole closed cell receives
      // one family. Adjacent families meet along the existing cell boundary.
      for(const [ex,ey,rx,ry] of [[-129,-245,24,22],[-74,-215,12,11]]){
        const eye=ellipse(p,ex,ey,rx,ry);
        if(eye<.13)return 4;if(eye<.38)return -1;if(eye<.67)return 2;if(eye<1)return 1;
      }
      const d=distance(p,ribbon);
      if(d<9)return 2;if(d<23)return 1;if(d<38)return 0;if(d<49)return 6;
      if(distance(p,greenSweep)<16)return 3;
      if(x< -80&&y> -210)return 5;
      return 4;
    }
    const markup=cells.map(({d,centre,vertices},i)=>{
      const family=colour(centre);
      if(family<0)return `<path class="bl-wing-pupil" fill="#202e46" d="${d}"/>`;
      const tone=palettes[family][Math.abs(Math.round(centre[0]*.13+centre[1]*.11))%4];
      return region(d,family,tone).replace('class="bl-region bl-colour"',`class="bl-region bl-colour bl-wing-cell" data-wing-cell="${i}" data-cell-centre="${pt(centre)}"`);
    }).join('');
    const marks=(isHind?[[-190,-34],[-180,-5],[-153,16],[-121,22],[-89,17]]:[[-172,-262],[-170,-235],[-153,-201],[-131,-171],[-108,-140],[-83,-111],[-3,-254],[20,-216],[35,-178]])
      .filter(([x,y])=>Array.from({length:32},(_,i)=>insidePolygon([x+Math.cos(i*Math.PI/16)*3.1,y+Math.sin(i*Math.PI/16)*5.1],outer)).every(Boolean)).map(([x,y])=>{
      const d=`M${x-2.5} ${y}a2.5 4.5 0 1 0 5 0a2.5 4.5 0 1 0-5 0Z`;
      return region(d,2,'#fff4a3');
    }).join('');
    return `<defs><clipPath id="${id}" clipPathUnits="userSpaceOnUse"><path d="${outline(rim)}"/></clipPath></defs><g class="bl-organic-wing" data-cell-count="${cells.length}" clip-path="url(#${id})"><path fill="#233344" d="${outline(rim)}"/>${markup}<g class="bl-wing-margin">${marks}</g></g>`;
  }
  const fore=[[50,-95],[49,-165],[17,-237],[-38,-290],[-100,-321],[-148,-311],[-178,-282],[-184,-243],[-170,-196],[-145,-151],[-106,-101],[-64,-49],[-20,-12]];
  const hind=[[-43,-65],[-105,-99],[-160,-92],[-190,-68],[-205,-31],[-189,2],[-153,24],[-113,32],[-75,24],[-35,5]];
  const outline=points=>`M0 0L${pt(points[0])}${points.slice(0,-1).map((p,i)=>`C${pt(tangent(points[Math.max(0,i-1)],p,points[i+1]))} ${pt(tangent(p,points[i+1],points[Math.min(points.length-1,i+2)],-1))} ${pt(points[i+1])}`).join('')}Z`;
  function stalk(root,tip,renderer,s=1,a=0,base=0) {
    const rad=a*Math.PI/180,join=[tip[0]-base*s*Math.sin(rad),tip[1]+base*s*Math.cos(rad)];
    const bend=[root[0]+(join[0]-root[0])*.13,join[1]+(root[1]-join[1])*.54];
    let out=`<path class="bl-stem bl-plant-stalk" d="M${pt(root)}Q${pt(bend)} ${pt(join)}"/>`;
    for(const [t,len,angle] of [[.22,130,-153],[.48,112,-31],[.69,82,-154]]){
      const [x,y]=quad(root,bend,join,t);out+=leaf(round(x),round(y),len*s,angle);
    }
    return out+renderer(tip[0],tip[1],s,a);
  }
  function monstera(root,tips) {
    return tips.map(([x,y,s,a])=>{
      const bend=[root[0]+(x-root[0])*.12,y+(root[1]-y)*.48];
      return `<path class="bl-stem" d="M${pt(root)}Q${pt(bend)} ${x} ${y}"/>`+splitLeaf(x,y,s,a);
    }).join('');
  }
  // A closed-canopy rainforest interior. Every plant is tied to a trunk,
  // bank or stem; a small stream gives depth without an open mountain horizon.
  function trunk(x,y,s=1,flip=1) {
    // Bent column, continuous buttress roots and a single clipped bark field.
    // Cell seams vary in height: no rectangular breaks across the whole trunk.
    const id=`bl-bark-${++serial}`;
    const shape='M-44-820C-78-604-11-442-29-232C-32-115-39-43-101 9L-157 51Q-88 35-37 10L-8 0L-18 63Q9 39 25 6Q70 25 132 30L75 0C40-38 41-106 43-205C56-430 7-626 42-820Z';
    const spine=(y)=>Math.sin((y+180)*.008)*13;
    const edge=(j,k)=>[spine(-840+k*75)+(j-3)*17+Math.sin(j*2.2+k*1.8)*6,-840+k*75+Math.sin(j*1.8+k)*16];
    let cells='';
    for(let j=0;j<7;j++)for(let k=0;k<13;k++){
      const a=edge(j,k),b=edge(j+1,k),c=edge(j+1,k+1),d=edge(j,k+1);
      cells+=region(`M${pt(a)}Q${pt(lerp(a,d,.5).map((v,i)=>v+(i===0?4:0)))} ${pt(d)}L${pt(c)}Q${pt(lerp(b,c,.5).map((v,i)=>v-(i===0?3:0)))} ${pt(b)}Z`,7);
    }
    return `<g class="bl-tree" transform="translate(${x} ${y}) scale(${s*flip} ${s})"><defs><clipPath id="${id}"><path d="${shape}"/></clipPath></defs>${region(shape,7)}<g clip-path="url(#${id})">${cells}</g><path class="bl-bark-line" d="M-26-710q-10 97 7 147t-4 146m38-296q-7 78 7 129t-1 122m-29 55q-5 72 2 111t-25 158m40-260q18 80 1 158t15 133M-14-338q-21 13-13 37q18 18 25-7q0-23-12-30Z"/>${spray(-18,-165,.52,-81)}${spray(18,-117,.42,94)}</g>`;
  }
  function bough(d,width=15) {
    // A taper cut from a curved centre line, not a constant-width capsule.
    const n=d.match(/-?\d+(?:\.\d+)?/g)?.map(Number);
    if(!n||n.length!==6)return '';
    const [x,y,cx,cy,tx,ty]=n,dx=tx-x,dy=ty-y,length=Math.hypot(dx,dy),nx=-dy/length,ny=dx/length;
    const a=[x+nx*width*.5,y+ny*width*.5],b=[x-nx*width*.5,y-ny*width*.5];
    return layer('brown',`<path fill="#77674e" stroke="#5f604c" stroke-width=".7" d="M${pt(a)}Q${cx+nx*width*.32} ${cy+ny*width*.32} ${tx} ${ty}Q${cx-nx*width*.18} ${cy-ny*width*.18} ${pt(b)}Z"/>`);
  }
  function spray(x,y,s,a=0,palette=null) {
    const type=Math.abs(Math.round(x*2+y+a))%5;
    return `<g transform="translate(${x} ${y}) scale(${s}) rotate(${a})"><path class="bl-stem" d="M0 0Q50-38 119-46"/>${[[13,-10,47,-142],[35,-24,60,-108],[61,-34,58,-73],[88,-41,51,-48],[25,-18,52,25],[52,-29,62,18],[80,-39,57,8],[108,-45,48,-18]].map(([x,y,l,a])=>leaf(x,y,l,a,3,palette,type)).join('')}</g>`;
  }
  function berries(x,y,s=1,family=0){
    return `<g transform="translate(${x} ${y}) scale(${s})"><path class="bl-stem" d="M0 0Q16-35 38-53M12-24L-10-38M25-40L44-31M34-48L23-65"/>${leaf(1,-5,65,-154)}${leaf(20,-31,56,-27)}${[[-10,-38],[44,-31],[23,-65],[38,-53],[1,-43],[32,-31]].map(([x,y],i)=>region(`M${x-8} ${y}a8 10 0 1 0 16 0a8 10 0 1 0-16 0Z`,i%3===0?5:family)).join('')}</g>`;
  }
  function mushrooms(x,y,s=1){
    return `<g transform="translate(${x} ${y}) scale(${s})">${[[-31,0,.72],[0,-9,1],[36,5,.61]].map(([x,y,s])=>`<g transform="translate(${x} ${y}) scale(${s})">${region('M-5 0Q-3-20-8-41L5-42Q3-19 8 0Z',7)}${region('M-39-38Q-25-79 0-78L-1-37Z',5)}${region('M0-78Q28-78 43-38L-1-37Z',0)}${region('M-39-38Q0-28 43-38Q9-12-39-38Z',6)}<path class="bl-fine-vein" d="M-29-36L-3-28M-16-35L-2-27M12-34L2-27M28-35L4-28"/><path fill="#eee3b9" d="M-16-55q-5-7 1-10q8-1 7 6q-1 7-8 4m31 0q-4-6 2-8q8 0 5 7Z"/></g>`).join('')}</g>`;
  }
  function toucan(x,y,s=1){
    return `<g transform="translate(${x} ${y}) scale(${s})"><path fill="#333f41" d="M-18 42Q-50 17-34-21Q-29-46 0-47Q25-47 32-25L41 5Q30 21 18 19L13 51L-3 84L-13 79L-5 44Z"/>${region('M-19-26Q-3-37 16-25L27 3Q12 28-4 14Z',2)}${region('M14-35Q72-70 104-33Q70-10 24-12Z',1)}${region('M54-44Q83-47 104-33L76-20Z',0)}${region('M-23 1Q-47 18-18 46L1 35Q-15 28-23 1Z',4)}<path fill="#202e31" d="M5-35a5 5 0 1 0 10 0a5 5 0 1 0-10 0Z"/><circle cx="12" cy="-37" r="1.5" fill="#fff4ce"/><path class="bl-stem" d="M-6 45L0 57L10 56M10 43L17 57L27 55"/></g>`;
  }
  function frog(x,y,s=1){
    return `<g transform="translate(${x} ${y}) scale(${s})">${region('M-18 12Q-36 13-41 33L-14 28L4 11Q16 16 30 32L43 27Q31 4 14 1Z',3)}${region('M-15 11Q-23-7-9-24Q7-36 22-16Q34 8 11 18Z',3)}${region('M-4 12Q17 6 22-7L26 3Q19 25-4 12Z',4)}${region('M-16-19a9 10 0 1 0 18 0a9 10 0 1 0-18 0Z',0)}${region('M11-22a8 9 0 1 0 16 0a8 9 0 1 0-16 0Z',0)}<path fill="#313d38" d="M-9-27l2 14l2-14Zm27-2l2 14l2-14Z"/>${[[-41,33],[-15,28],[31,31],[43,27]].map(([x,y])=>region(`M${x} ${y}l-8 6l-2-3l5-6l-8 1l-1-4l13-1Z`,1)).join('')}</g>`;
  }
  function beetle(x,y,s=1){
    return `<g transform="translate(${x} ${y}) rotate(-25) scale(${s})"><path class="bl-fine-vein" d="M-8-6L-21-14M-10 0L-24 0M-9 8L-21 18M8-6L21-14M10 0L24 0M9 8L21 18M-4-14L-11-23M4-14L11-23"/>${region('M0-14C-22-13-19 22 0 23Z',0,'#cb3046')}${region('M0-14C22-13 19 22 0 23Z',0,'#ee6263')}<g fill="#303c38"><ellipse cx="0" cy="-14" rx="6" ry="5"/><circle cx="-8" cy="-2" r="3"/><circle cx="7" cy="-3" r="3"/><circle cx="-6" cy="12" r="3.3"/><circle cx="6" cy="11" r="3.2"/></g></g>`;
  }
  // Scene map (1100 × 790): enclosed luminous forest / two rooted banks /
  // foreground flower and resting butterfly. Geometry is original interface art.
  // Closed cells follow botanical veins, bark grain and the water's bends.
  function pebble(x,y,w,h,i=7) {
    return `<g transform="translate(${x} ${y})">${region(`M${-w} 0Q${-w*.8} ${-h} 0 ${-h}Q${w*.8} ${-h} ${w} 0Q${w*.4} ${h*.4} ${-w} 0Z`,i)}${region(`M${-w} 0Q${-w*.4} ${-h*.9} ${w*.2} ${-h*.7}L${w*.35} 0Z`,i)}</g>`;
  }
  function rosette(x,y,s=1,a=0) {
    return `<g transform="translate(${x} ${y}) scale(${s}) rotate(${a})">${[[-148,122],[-112,153],[-75,165],[-38,143],[-7,114]].map(([a,l])=>leaf(0,0,l,a,3,null,3)).join('')}</g>`;
  }
  function banana(x,y,s=1,a=0) {
    // A curved central rib with individually enclosed venation on both sides.
    const rib=t=>quad([0,0],[-41,-134],[25,-279],t);
    const edge=(t,side)=>{const p=rib(t),w=Math.sin(Math.PI*t)**.75*53*(side?1:.85);return [p[0]+(side?1:-1)*w,p[1]+Math.sin(t*Math.PI)*11];};
    let cells='';
    for(let side=0;side<2;side++)for(let k=0;k<13;k++){
      const t=k/13,u=(k+1)/13,p=rib(t),q=rib(u),r=edge(t,side),v=edge(u,side);
      cells+=region(`M${pt(p)}Q${pt(lerp(p,r,.6).map((n,i)=>n+(i?10:0)))} ${pt(r)}Q${pt(edge((t+u)/2,side).map((n,i)=>n*2-(r[i]+v[i])/2))} ${pt(v)}Q${pt(lerp(q,v,.6).map((n,i)=>n+(i?10:0)))} ${pt(q)}Z`,3,['#4a8261','#5c8e62','#6c9b69','#85aa71'][k%4]);
    }
    return `<g class="bl-colour bl-banana" data-colour="green" transform="translate(${x} ${y}) rotate(${a}) scale(${s})">${cells.replaceAll('bl-region bl-colour','bl-region')}<path class="bl-leaf-rib" d="M0 0Q-41-134 25-279"/></g>`;
  }
  function bananaPlant(x,y,s=1,a=0) {
    return `<g transform="translate(${x} ${y}) rotate(${a}) scale(${s})"><path class="bl-stem" d="M0 0Q0-83-12-147M0 0Q28-64 62-81M0 0Q-37-44-77-60"/>${banana(-12,-147,.69,-7)}${banana(62,-81,.67,52)}${banana(-77,-60,.74,-67)}${banana(8,-25,.76,24)}</g>`;
  }
  function bromeliad(x,y,s=1,a=0) {
    return `<g transform="translate(${x} ${y}) scale(${s}) rotate(${a})">${rosette(0,12,.7)}<path class="bl-stem" d="M0 12Q1-50-8-97"/>${[-70,-44,-18].map((y,i)=>`${region(`M-6 ${y+15}Q-34 ${y-3}-39 ${y-30}Q-12 ${y-24}-6 ${y}Z`,i%2?6:0)}${region(`M-6 ${y+15}Q19 ${y-2} 25 ${y-26}Q0 ${y-21}-6 ${y}Z`,i%2?0:1)}`).join('')}${region('M-8-69Q-21-98-8-120Q7-97-8-69Z',2)}</g>`;
  }
  function branchGarden(x,y,s=1,flip=1) {
    const type=Math.abs(Math.round(x+y*2+s*10))%5;
    return `<g transform="translate(${x} ${y}) scale(${s*flip} ${s})">${bough('M0 5Q125-55 298-21',22)}${[[30,-9,110,-140],[76,-24,128,-109],[130,-32,125,-76],[190,-29,117,-53],[249,-24,97,-23],[52,-18,103,38],[113,-29,110,58],[172,-30,99,64],[229,-25,80,50]].map(([x,y,l,a])=>leaf(x,y,l,a,3,null,type)).join('')}</g>`;
  }
  function blossom(x,y,s=1,family=6,a=0) {
    const petalTones=family===4?['#3968d5','#5288ef','#80b5f3','#5c78db']:family===5?['#9552c1','#ad6bd0','#8446b2','#bf8bdf']:family===6?['#ee84bd','#f6a4d0','#db65ad','#f2a0cf']:null;
    return `<g transform="translate(${x} ${y}) rotate(${a}) scale(${s})">${Array.from({length:5},(_,i)=>`<g transform="rotate(${i*72})">${region('M0 3C-8-1-21-12-17-24C-14-35-1-34 0-25C4-35 18-30 16-20C14-9 5-2 0 3Z',family,petalTones?.[i%4])}<path class="bl-petal-vein" d="M0 0Q-5-12 0-24"/></g>`).join('')}${region('M-6 0a6 6 0 1 0 12 0a6 6 0 1 0-12 0Z',2)}<path class="bl-flower-stamen" d="M0 0Q12-11 21-12"/><circle cx="21" cy="-12" r="2.8" fill="#edcf67"/></g>`;
  }
  function floweringPlant(x,y,s=1,family=6,a=0) {
    // Whole plant, drawn at its soil/root depth. All petioles join this stem.
    return `<g class="bl-rooted-plant" data-base="${x},${y}" transform="translate(${x} ${y}) rotate(${a}) scale(${s})"><path class="bl-stem" d="M0 0Q-4-61 7-151M-2-61Q-28-99-43-105M0-89Q30-116 44-128"/>${leaf(-2,-38,74,-156)}${leaf(-1,-65,72,-26)}${leaf(1,-95,62,-150)}${leaf(5,-125,43,-27)}${blossom(7,-151,.71,family,-12)}${blossom(-43,-105,.60,family,25)}${blossom(44,-128,.54,family,8)}<path class="bl-root-etch" d="M-13 3Q0-6 15 3M-8 6L0 0L8 8"/></g>`;
  }
  function anthurium(x,y,s=1,a=0) {
    const spathe=(x,y,s,a)=>`<g transform="translate(${x} ${y}) rotate(${a}) scale(${s})">${region('M0 0C-18-14-39-31-35-49C-32-68-9-63 0-46L-8-24Z',0,'#b72e49')}${region('M0 0L-8-24L0-46C9-63 32-68 35-49C39-31 18-14 0 0Z',0,'#e34858')}${region('M0-46C9-63 32-68 35-49Q17-49-8-24Z',0,'#f26b66')}<path class="bl-petal-vein" d="M0 0Q-8-24 0-46M-8-24Q-23-38-27-51M-4-30Q13-42 27-49"/>${region('M-3-21Q-10-47-4-63Q0-69 3-62Q8-43 2-21Z',2)}<path class="bl-fine-vein" d="M-4-55L3-56M-4-48L4-49M-4-41L4-42M-3-34L3-35"/></g>`;
    return `<g class="bl-anthurium" data-base="${x},${y}" transform="translate(${x} ${y}) rotate(${a}) scale(${s})"><path class="bl-stem" d="M0 0Q-18-45-15-89M0 0Q23-30 31-59M0 0Q-39-20-47-46"/>${leaf(-3,-19,82,-159)}${leaf(1,-9,75,-31)}${leaf(-8,-35,67,-125)}${spathe(-15,-89,.81,-8)}${spathe(31,-59,.62,25)}${spathe(-47,-46,.48,-33)}<path class="bl-root-etch" d="M-11 3Q0-5 12 3"/></g>`;
  }
  function cordyline(x,y,s=1,a=0) {
    return `<g class="bl-cordyline" transform="translate(${x} ${y}) rotate(${a}) scale(${s})"><path class="bl-stem" d="M0 0L0-36"/>${[[-4,-16,101,-159,0],[-2,-22,124,-129,0],[0,-31,135,-94,0],[2,-23,116,-60,6],[3,-16,95,-27,0],[-1,-29,106,-111,6]].map(args=>leaf(...args)).join('')}<path class="bl-root-etch" d="M-11 4Q0-5 13 4"/></g>`;
  }
  function hangingRaceme(x,y,s=1,flip=1) {
    return `<g class="bl-hanging-flowers" transform="translate(${x} ${y}) scale(${s*flip} ${s})"><path class="bl-stem" d="M0 0Q48 35 26 118M26 23L3 36M35 51L55 61M34 78L13 91M29 101L48 112"/>${leaf(3,6,61,-154)}${leaf(12,13,58,-34)}${[[3,36],[55,61],[13,91],[48,112]].map(([x,y],i)=>`<g transform="translate(${x} ${y}) rotate(${i%2?-18:18})">${region('M-10 0Q0-13 10 0L14 25Q9 38 1 32Q-8 37-13 25Z',0,['#cc334c','#ea5360','#b52d48','#e24a52'][i])}${region('M-13 25Q-5 20 1 26Q8 20 14 25Q5 37-5 33Z',2)}<path class="bl-petal-vein" d="M-5 0L-5 24M4 0L5 24"/></g>`).join('')}</g>`;
  }
  function epiphyte(x,y,s=1,family=5,a=0) {
    // Root fibres remain on bark; flower stalks arise from the attached rosette.
    return `<g class="bl-epiphyte" transform="translate(${x} ${y}) rotate(${a}) scale(${s})"><path class="bl-root-etch" d="M0 0Q-20 5-25 33M0 0Q11 18 3 41M0 0Q28 5 19 29M0 0Q-5 20-13 27"/>${rosette(0,0,.55)}<path class="bl-stem" d="M0 0Q16-44 46-57Q73-66 96-48M44-56L51-83M74-56L82-77"/>${blossom(51,-83,.44,family,20)}${blossom(82,-77,.39,family,-20)}${blossom(97,-48,.40,family,40)}</g>`;
  }
  function songbird(x,y,s=1,flip=1,family=0) {
    // (0,0) is the perch; toes curl over it, tail and belly stay above it.
    return `<g class="bl-songbird" transform="translate(${x} ${y}) scale(${s*flip} ${s})">${region('M-12-13L-45 11L-34 14L-2-7Z',4)}${region('M-23-29Q-29-51-10-61Q1-69 16-60Q26-56 25-42L39-35L24-29Q18-7-4-9Q-19-10-23-29Z',family)}${region('M-17-41Q-38-29-13-13Q0-14 9-27Z',4)}${region('M-10-55Q4-63 13-48L16-34Q7-27-1-35Z',2)}<path fill="#33443b" d="M24-43L39-35L25-32Z"/><circle cx="12" cy="-49" r="3.2" fill="#273c38"/><circle cx="13" cy="-50" r=".9" fill="#fff8d8"/><path class="bl-stem" d="M-7-9L-7-1L-12 1M5-11L6-1L12 0M-8 0L-3 1M5 0L2 2"/><path class="bl-fine-vein" d="M-16-33L-7-22M-20-27L-13-20"/></g>`;
  }
  function caterpillar(x,y,s=1) {
    return `<g transform="translate(${x} ${y}) scale(${s})"><path class="bl-stem" d="M-5 4l-2 5M3 4l-2 5M11 4l-2 5M19 4l-2 5M27 4l-2 5"/>${[-6,2,10,18,26].map((x,i)=>region(`M${x-6} 0a6 7 0 1 0 12 0a6 7 0 1 0-12 0Z`,i%2?2:3)).join('')}${region('M30-6a7 8 0 1 0 14 0a7 8 0 1 0-14 0Z',1)}<path class="bl-fine-vein" d="M35-13l-2-6M40-13l3-6"/><circle cx="40" cy="-8" r="1.5" fill="#30453c"/></g>`;
  }
  function lemur(x,y,s=1,flip=1) {
    const id=`bl-lemur-tail-${++serial}`;
    const tail='M-15-18C-58-17-70 4-57 38C-48 62-26 75-40 99C-45 108-55 109-60 104C-37 113-28 94-40 76C-62 46-83 15-69-10Q-50-34-15-31Z';
    return `<g class="bl-lemur" transform="translate(${x} ${y}) scale(${s*flip} ${s})"><defs><clipPath id="${id}"><path d="${tail}"/></clipPath></defs>${region(tail,7,'#8e7a69')}<g clip-path="url(#${id})" fill="#34403d"><path d="M-75-17L-44-3L-36-15L-64-31ZM-84 6L-49 15L-48 1L-80-8ZM-74 31L-45 31L-44 43L-69 47ZM-58 55L-32 49L-24 62L-48 70ZM-43 77L-21 80L-27 92L-47 87ZM-47 101L-25 98L-30 110L-56 115Z"/></g>
      ${region('M-24-12C-37-28-31-63-11-68C10-78 25-54 22-31L13-5L-8-2Z',7,'#a4937f')}${region('M-8-60Q14-64 16-38L7-15L-9-15Q-18-37-8-60Z',7,'#c9baa0')}
      <path fill="#37403c" d="M-24-19Q-43-9-29 0H-3Q7-7-5-10L-16-9Q-29-12-24-19ZM13-28Q24-17 21-6L34-3Q42 4 32 4L10 1Q5-12 7-24Z"/>
      <path fill="#c5b9a2" stroke="#586052" stroke-width=".8" d="M-4-51Q7-45 13-25L22-8L31-3L28 1L16-3Q5-16-1-28L-13-42Z"/>
      <path fill="#ddd1b4" stroke="#626657" stroke-width=".7" d="M-19-68Q-37-77-30-91Q-22-101-14-86Q5-99 19-86Q34-97 37-83Q40-71 27-68Q26-47 9-43Q-11-43-19-68Z"/>
      <path fill="#48504a" d="M-23-83Q-30-92-28-79L-22-74ZM25-82Q34-90 33-77L26-72ZM-14-73Q-7-86 0-74L-1-61Q-12-57-14-73ZM8-74Q19-84 23-70Q23-58 10-59Z"/>
      ${region('M-10-71a3.5 4 0 1 0 7 0a3.5 4 0 1 0-7 0ZM13-71a3.5 4 0 1 0 7 0a3.5 4 0 1 0-7 0Z',1)}<path fill="#2b3835" d="M-7-74h2v7h-2ZM16-74h2v7h-2ZM-2-59Q5-63 10-58L4-53Z"/><path class="bl-fine-vein" d="M4-53V-49M-18-41L-21-30M-12-38L-15-26M-3-37L-5-23"/></g>`;
  }
  function snake(x,y,s=1,flip=1) {
    // Back arcs go behind this exact branch, front coils over its upper edge.
    const back='M-71 4C-65-32-35-32-29-4S3 24 10-3S42-27 52-4';
    const front='M-71 4C-61 22-34 25-29-4M10-3C20 18 44 20 52-4Q61-25 78-20';
    const tube=d=>`<path d="${d}" fill="none" stroke="#3e5945" stroke-width="11" stroke-linecap="round"/><path d="${d}" fill="none" stroke="#75a15c" stroke-width="8" stroke-linecap="round"/><path d="${d}" fill="none" stroke="#bec97c" stroke-width="2" stroke-dasharray="3 9" stroke-linecap="round"/>`;
    return `<g class="bl-snake" transform="translate(${x} ${y}) scale(${s*flip} ${s})">${layer('green',tube(back))}${bough('M-115 4Q-14-7 106 8',18)}${layer('green',tube(front))}${region('M69-24Q81-32 93-24Q99-19 90-13L73-13Q64-16 69-24Z',3)}${region('M75-13Q87-9 94-19L88-14Z',2)}<circle cx="85" cy="-23" r="2.3" fill="#2a3b33"/><path class="bl-tongue" d="M94-17L105-16L110-20M105-16L109-13"/></g>`;
  }
  function rearTree(x,y,h,w,flip=1) {
    // Individual rooted tree, with attached forks and leaf-bearing twigs.
    const stem=`M${-w} 3Q-3-70-8 ${-h*.45}Q-22 ${-h*.75} -9 ${-h}H${w*.55}Q-4 ${-h*.7} 10 ${-h*.43}Q4-67 ${w} 2L${w+23} 16L2 7L-25 19L-12 4Z`;
    const id=`bl-rear-bark-${++serial}`;
    const bark=Array.from({length:10},(_,k)=>{
      const y=-h+k*h/10,y2=y+h/10,mid=Math.sin(k*.8)*3;
      return region(`M-30 ${y}Q-7 ${y+8} ${mid} ${y-3}Q${mid+4} ${y+h/20} ${mid+1} ${y2}Q-10 ${y2-7}-30 ${y2+5}Z`,7,['#919779','#a1a583','#8e9679','#a4a789'][k%4]);
    }).join('');
    return `<g class="bl-rear-tree" transform="translate(${x} ${y}) scale(${flip} 1)"><defs><clipPath id="${id}"><path d="${stem}"/></clipPath></defs>${region(stem,7,'#a8ab88')}<g clip-path="url(#${id})">${bark}</g>${region(`M-9 ${-h}Q-22 ${-h*.75}-8 ${-h*.45}Q-3-70 ${-w} 3L-12 4Q-11-90-13 ${-h*.46}Q-27 ${-h*.8}-16 ${-h}Z`,7,'#858c6c')}
      ${bough(`M0 ${-h*.48}Q-50 ${-h*.62}-104 ${-h*.59}`,w*.8)}${bough(`M-7 ${-h*.7}Q40 ${-h*.8} 96 ${-h*.78}`,w*.65)}${bough(`M-4 ${-h*.86}Q-57 ${-h*.94}-77 ${-h*1.05}`,w*.55)}
      ${bough(`M2 ${-h*.32}Q41 ${-h*.44} 77 ${-h*.41}`,w*.55)}
      ${spray(76,-h*.41,.56,-18)}${spray(-102,-h*.59,.56,-169)}${spray(94,-h*.78,.57,-13)}${spray(-77,-h*1.05,.55,-110)}${spray(-22,-h*.9,.48,-12)}
      <path class="bl-bark-line" d="M-2 ${-h*.95}Q-11 ${-h*.8}-3 ${-h*.65}M1 ${-h*.4}Q7 ${-h*.24} 0-31M-8-37Q-13-10-24 1"/></g>`;
  }
  function floweringCrown(x,y,s,a,family) {
    // A flowering crown belongs to the distal end of this tree's bough.
    // Five inflorescences share visible branching, with papery coloured bracts.
    const palettes={0:['#e94467','#fa6480','#ce335b'],1:['#fa993e','#ffba61','#e8772d'],2:['#f3d949','#ffe57a','#e5b835'],4:['#5086dc','#6fa8ef','#3868c7'],5:['#a064cc','#bc8ee0','#864fba'],6:['#e77fba','#f3a0d0','#ce5da4']};
    const tones=palettes[family];let petals='',centres='';
    for(const [n,[x,y,scale]] of [[18,-29,.87],[45,-46,1.02],[69,-27,.92],[91,-52,1],[113,-32,.79]].entries()){
      petals+=`<g transform="translate(${x} ${y}) rotate(${n*31}) scale(${scale})">${[0,120,240].map((angle,j)=>`<g transform="rotate(${angle})">${region('M0 3C-19-2-29-13-26-27C-13-31 3-23 9-8Q7-1 0 3Z',family,tones[j])}<path class="bl-petal-vein" d="M0 1Q-13-10-26-27M-10-10L-20-12M-12-13L-11-22"/></g>`).join('')}</g>`;
      centres+=region(`M${x-2.5} ${y}a2.5 3 0 1 0 5 0a2.5 3 0 1 0-5 0Z`,2,'#ffe891');
    }
    return `<g class="bl-flowering-crown" data-colour-family="${hues[family][0]}" transform="translate(${x} ${y}) rotate(${a}) scale(${s})"><path class="bl-stem" d="M0 0Q56-34 113-32M18-13V-29M43-23L45-46M65-29L69-27M87-32L91-52"/>${leaf(14,-10,57,-145)}${leaf(58,-28,49,16)}<g class="bl-colour" data-colour="${hues[family][0]}">${petals.replaceAll('bl-region bl-colour','bl-region')}</g><g class="bl-colour" data-colour="yellow">${centres.replaceAll('bl-region bl-colour','bl-region')}</g></g>`;
  }
  function deepForestTree(x,y,s,flip=1) {
    // A complete tree behind the existing rear trees. Each crown grows from
    // a branch, and each branch meets the trunk; no floating leaf scatter.
    const tones=['#78977e','#87a284','#668b76','#94ac8c'];
    const crownFamilies=[5,4,6,0,2,1,4,5];
    const colourOffset=Math.abs(Math.round(x/60))%crownFamilies.length;
    const crownPhase=x*.013;
    const forks=[[-8,-422,65,-465,122,-450,.75,-12],[-9,-345,-71,-387,-135,-362,.83,-164],[-2,-265,72,-309,138,-282,.88,-9],[1,-172,-55,-218,-121,-195,.91,-168],[0,-96,55,-143,116,-120,.77,-15]];
    return `<g class="bl-deep-tree" transform="translate(${x} ${y}) scale(${s*flip} ${s})">${region('M-14 0Q-1-110-9-258T-13-520H3Q-1-402 6-265Q17-102 9 0L24 12L0 6L-24 14Z',7,'#7e8d73')}${region('M-13-520Q-24-392-9-258Q-1-110-14 0L-5 2Q8-133-1-270T-5-520Z',7,'#6d7f6b')}
      ${forks.map(([x,y,cx,cy,tx,ty,k,a],j)=>{
        const offset=Math.sin(crownPhase+j*1.9)*36;ty+=offset;cy+=offset*.5;
        return bough(`M${x} ${y}Q${cx} ${cy} ${tx} ${ty}`,10)+spray(tx,ty,k,a,tones)+(j===0?spray(tx,ty,k*.8,a-78,tones):floweringCrown(tx,ty,k*.94,a,crownFamilies[(colourOffset+j)%crownFamilies.length]));
      }).join('')}
      <path class="bl-bark-line" d="M-4-489q-8 80 0 143t1 121M3-196q8 63-1 143"/>
      ${spray(-12,-32,.73,-143,tones)}${floweringCrown(5,-31,.64,-26,crownFamilies[(colourOffset+2)%crownFamilies.length])}</g>`;
  }
  const background=layer('green','<rect width="1100" height="790" fill="#7e9b85"/>');
  const deepForest=`<g class="bl-deep-forest">${[
    [111,446,1.0,1],[238,452,.94,-1],[365,449,1.03,1],[487,450,.96,-1],
    [641,449,1.04,1],[756,453,.95,-1],[884,447,1.02,1],[1025,451,.96,-1]
  ].map(args=>deepForestTree(...args)).join('')}</g>`;
  const farForest=`<g class="bl-distant">${[
    [176,451,504,15,1],[427,465,512,16,1],[584,453,520,14,-1],
    [680,463,495,17,1],[937,456,508,15,-1]
  ].map(args=>rearTree(...args)).join('')}</g>`;
  const distantGround=region('M0 424Q151 386 281 434Q420 404 545 444Q701 400 840 432Q985 393 1100 424V790H0Z',3);
  const soil='M0 485Q161 441 320 477Q438 456 543 453Q632 454 762 479Q905 448 1100 483V790H0Z';
  // A softly tessellated floor, clipped to the bank outline; no dotted filler.
  const floorEdges=(j,k)=>[j*52-60+Math.sin(k*1.7+j*.8)*13,458+k*32+Math.cos(j*1.3+k)*9];
  let floor='';
  for(let j=0;j<24;j++)for(let k=0;k<12;k++){
    const a=floorEdges(j,k),b=floorEdges(j+1,k),c=floorEdges(j+1,k+1),d=floorEdges(j,k+1);
    floor+=region(`M${pt(a)}Q${pt(lerp(a,d,.5).map((v,i)=>v+(i?0:7)))} ${pt(d)}Q${pt(lerp(d,c,.5).map((v,i)=>v+(i?6:0)))} ${pt(c)}Q${pt(lerp(c,b,.5).map((v,i)=>v-(i?0:5)))} ${pt(b)}Q${pt(lerp(b,a,.5).map((v,i)=>v-(i?5:0)))} ${pt(a)}Z`,7,['#85875c','#909064','#7c8058','#9a956a'][(j+k*3)%4]);
  }
  const ground=`<defs><clipPath id="bl-soil"><path d="${soil}"/></clipPath></defs><g class="bl-floor" clip-path="url(#bl-soil)">${region(soil,7)}${floor}</g>`;
  const stream='M550 448C528 474 611 487 619 511C636 540 527 557 513 588C488 625 606 643 612 677C620 719 492 756 476 790H897C891 757 738 723 713 682C685 645 681 635 693 609C719 568 754 554 722 524C695 498 590 472 567 448Z';
  let waterCells='';
  // Small nested eddies: discrete closed areas, aligned with the S-bend.
  const eddies=[[566,478,21,6],[609,505,30,8],[660,527,43,10],[683,548,34,9],[598,566,44,10],[553,589,31,12],[591,617,40,13],[639,646,33,14],[659,681,32,15],[645,713,49,15],[587,742,51,13],[717,754,65,13],[747,784,70,16]];
  for(const [n,[x,y,w,h]] of eddies.entries()){
    waterCells+=region(`M${x-w} ${y}Q${x-w*.4} ${y-h} ${x+w} ${y-h*.2}Q${x+w*.5} ${y+h*.7} ${x-w} ${y}Z`,n%4===0?3:4,['#559c9a','#79b7af','#9ad0bd','#427e86'][n%4]);
    waterCells+=region(`M${x-w*.55} ${y+5}Q${x} ${y+h*.6} ${x+w*.65} ${y+3}Q${x} ${y+h*1.6} ${x-w*.55} ${y+5}Z`,4,'#c6dfc3');
  }
  const water=`<defs><clipPath id="bl-stream-clip"><path d="${stream}"/></clipPath></defs><g class="bl-stream">${region(stream,4,'#87bdb5')}<g clip-path="url(#bl-stream-clip)">${waterCells}</g></g>`;
  // Painter's order is derived from ground contact, not object type.
  // A plant is one group (stem + foliage + flowers); another plant cannot be
  // inserted midway through that group. Epiphytes belong to their host tree.
  const groundItems=[];
  const place=(base,name,markup)=>groundItems.push({base,name,markup});
  const farBanks=[[287,478,.37,-22],[349,481,.31,17],[416,472,.25,-18],[484,460,.17,9],[622,474,.21,-5],[744,490,.30,16],[795,483,.34,-14],[857,490,.39,17]];
  for(const [x,y,s,a] of farBanks)place(y,'bank-ferns',fern(x,y,s,a)+rosette(x+19,y+4,s*.68));
  const backCanopy=`${branchGarden(414,135,.62)}${branchGarden(676,137,.57,-1)}`;
  place(491,'middle-banana-left',bananaPlant(412,491,.57,-9));
  place(493,'middle-banana-right',bananaPlant(723,493,.52,18));
  place(482,'ground-flowers-left',floweringPlant(361,482,.37,2,-8));
  place(496,'ground-flowers-right',floweringPlant(754,496,.35,6,11));
  place(484,'heliconia-middle',stalk([404,484],[399,353],heliconia,.32,-6,100));
  place(492,'orchid-middle',stalk([745,492],[745,376],orchid,.27,12));
  place(512,'middle-tree-left',trunk(309,512,.65)+branchGarden(305,260,.58)+epiphyte(307,337,.46,5,-13)
    +bough('M309 238Q371 206 445 238',15)+lemur(395,223,.83)
    +bough('M310 395Q355 373 388 390',10)+songbird(362,385,.46,1,0)
    +anthurium(303,399,.55,-17)
    +epiphyte(304,448,.79,6,12)+epiphyte(304,286,.65,4,-25));
  place(548,'middle-tree-right',trunk(797,548,.73,-1)+branchGarden(800,246,.6,-1)+epiphyte(798,326,.43,6,24)
    +hangingRaceme(781,181,.64,-1));
  place(502,'berry-left',berries(312,502,.58));
  place(520,'berry-right',berries(837,520,.56));
  place(532,'bank-heliconia',stalk([452,532],[452,454],heliconia,.24,5,100));
  place(566,'fallen-log-left',bough('M199 585Q311 529 447 566',30)+mushrooms(292,558,.42));
  place(606,'left-bank-fern',fern(209,606,.49,-17));
  place(568,'log-bromeliad',bromeliad(396,568,.46,11));
  place(622,'bank-monstera-left',monstera([398,622],[[370,583,.44,-48],[430,566,.40,24]]));
  place(610,'bank-monstera-right',monstera([777,610],[[743,564,.47,-37],[811,555,.43,30]]));
  place(630,'fallen-log-right',bough('M1008 630Q929 577 817 607',27)+mushrooms(931,599,.46));
  place(649,'right-bank-fern',fern(992,649,.57,16));
  for(const args of [[482,545,12,7],[491,560,17,10],[499,581,14,9],[506,609,21,12],[540,637,23,12],[699,621,23,13],[710,592,14,9],[733,563,18,10],[707,660,27,14],[726,687,25,13],[725,704,13,7]])place(args[1],'shore-stone',pebble(...args));
  place(625,'frog-host-plant',monstera([674,625],[[662,579,.46,-12]])+`<path class="bl-stem" d="M674 625Q658 603 662 579"/>`+leaf(662,579,130,-16)+frog(721,555,.45));
  // Host leaf and its insects share the same transform, so they cannot drift
  // onto a neighbouring leaf when the composition is rearranged.
  const inhabitedLeaf=(x,y,l,a,occupant)=>leaf(x,y,l,a)+`<g class="bl-leaf-resident" transform="translate(${x} ${y}) rotate(${a})">${occupant}</g>`;
  place(708,'front-tree-left',trunk(84,708,1.09)
    +bough('M76 162Q204 72 400 128',49)+branchGarden(77,157,1.07)
    +bough('M111 271Q192 254 290 273',17)+toucan(239,232,.55)
    +epiphyte(91,382,.66,6,-20)+epiphyte(87,562,.53,2,8)
    +epiphyte(94,276,.86,4,-8)+epiphyte(85,642,.92,5,-23)
    +inhabitedLeaf(132,143,83,-26,caterpillar(25,-4,.57))
    +bough('M94 460Q157 425 204 444',14)+songbird(173,436,.57,-1,0)
    +hangingRaceme(201,115,.86,1)+berries(104,264,.80)
    +anthurium(95,595,.69,-15));
  place(744,'front-tree-right',trunk(1036,744,1.22,-1)
    +bough('M1039 188Q894 69 712 115',52)+branchGarden(1028,186,1.03,-1)
    +bough('M1014 281Q920 239 831 271',18)+songbird(865,260,.72,1,0)
    +snake(944,323,.75,-1)
    +bough('M1035 436Q969 378 889 402',21)+lemur(932,394,.68,-1)
    +epiphyte(1025,455,.62,5,14)+epiphyte(1041,596,.60,0,-10)
    +inhabitedLeaf(976,267,89,-151,beetle(44,1,.39))
    +hangingRaceme(959,169,.82,-1)+anthurium(1023,515,.76,13));
  place(770,'foreground-fern-left',fern(11,770,.85,-6));
  place(780,'foreground-fern-right',fern(1090,780,.96,4));
  place(775,'rosette-left',rosette(132,775,.98));
  place(760,'banana-front',bananaPlant(176,760,.79,-18));
  place(790,'monstera-front-left',monstera([242,790],[[171,706,.91,-43],[274,685,.84,19],[215,612,.71,-9]])
    +`<g transform="translate(215 612) rotate(-9) scale(.71)">${beetle(-26,-89,.48)}</g>`);
  place(763,'heliconia-front-left',stalk([30,763],[77,502],heliconia,.62,-16,100));
  place(779,'orchid-front-left',stalk([350,779],[344,606],orchid,.48,-16));
  place(603,'berry-front-left',berries(163,603,.75));
  place(735,'mushrooms-front',mushrooms(83,735,.70));
  place(733,'bromeliad-front',bromeliad(410,733,.47,22));
  place(786,'butterfly-flower',stalk([864,786],[797,510],birdFlower,.80,-12));
  place(795,'heliconia-front-right',stalk([984,795],[952,564],heliconia,.69,14,100));
  place(783,'orchid-front-right',stalk([1080,783],[1050,541],orchid,.46,15));
  place(796,'monstera-front-right',monstera([1034,796],[[950,741,.81,-48],[1074,679,.86,28]])+`<g transform="translate(1074 679) rotate(28) scale(.86)">${beetle(-24,-94,.46)}</g>`);
  place(792,'rosette-front-right',rosette(911,792,.6));
  place(753,'mushrooms-centre',mushrooms(443,753,.46));
  place(798,'fern-centre',fern(441,798,.52,-17));
  place(671,'crimson-foliage-left',cordyline(262,671,.70,-9));
  place(694,'crimson-foliage-right',cordyline(926,694,.73,14));
  place(575,'anthurium-bank-left',anthurium(465,575,.64,-12));
  place(623,'anthurium-bank-right',anthurium(860,623,.68,10));
  place(726,'violet-flowers-front',floweringPlant(390,726,.64,5,-9));
  place(678,'gold-flowers-front',floweringPlant(988,678,.59,2,15));
  place(470,'violet-flowers-distance',floweringPlant(520,470,.45,5,-7));
  place(527,'blue-flowers-bank',floweringPlant(882,527,.49,4,9));
  place(519,'pink-flowers-left',floweringPlant(239,519,.66,6,-14));
  place(610,'blue-flowers-left',floweringPlant(190,610,.68,4,-9));
  place(716,'violet-flowers-left',floweringPlant(292,716,.72,5,13));
  place(679,'pink-flowers-left-front',floweringPlant(101,679,.65,6,-6));
  for(const [x,y,s,f,a] of [[228,545,.43,0,-12],[873,551,.42,2,8],[194,653,.56,5,-16],[451,639,.42,4,-14],[920,673,.53,6,11],[321,737,.47,0,9],[1010,715,.48,2,-15],[395,757,.40,6,-7],[480,566,.43,6,-10],[266,590,.41,0,-6],[463,606,.44,2,-9],[806,680,.54,5,8],[904,606,.48,0,9]])place(y,'flowering-bank',floweringPlant(x,y,s,f,a));
  const vines=`<g class="bl-liana-lines"><path d="M155-20C137 101 231 198 181 300S151 410 174 468M229 31C245 116 278 164 251 246S225 343 266 404M916-20C951 98 867 214 901 306S955 411 912 501M981-20C940 47 996 106 973 172"/><path d="M181 299q-29-8-28 18q4 24 24 8M903 302q27-3 25 19q-3 21-23 3"/></g>${leaf(179,305,65,-116)}${palmateLeaf(174,351,74,12)}${leaf(251,243,48,-157)}${leaf(909,334,58,-30)}${palmateLeaf(936,447,66,-26)}`;
  const canopy=`${branchGarden(-36,20,1.16)}${branchGarden(1143,40,1.19,-1)}${branchGarden(321,-12,.93)}${branchGarden(756,-49,.97,-1)}
    ${bough('M329 40Q437 39 510 71',19)}${songbird(474,61,.49,-1,0)}
    ${epiphyte(320,100,.58,5,25)}${epiphyte(797,135,.54,6,-17)}
    ${berries(430,127,.70,4)}
    ${hangingRaceme(523,55,.66,-1)}${berries(897,112,.73)}
    <path class="bl-stem" d="M530 44Q550 38 568 42M770 158Q765 152 763 145"/>
    ${inhabitedLeaf(568,42,94,-133,beetle(47,0,.38))}${inhabitedLeaf(763,145,92,-24,caterpillar(29,-4,.61))}`;
  const spider=`<g class="bl-spider"><path d="M652 73Q646 140 658 213M654 223l-11-9-7 14m18 0l-13 5-2 11m19-21l11-9 7 14m-18 0l13 5 2 11"/><ellipse cx="658" cy="226" rx="5" ry="8"/><circle cx="658" cy="217" r="3"/></g>`;
  const rearLife=`${bough('M427 282Q468 262 513 285',9)}${songbird(482,276,.40,-1,2)}${bough('M680 322Q641 298 607 310',9)}${songbird(629,307,.41,1,0)}
    ${snake(544,194,.37,-1)}${hangingRaceme(585,270,.51,-1)}${berries(431,423,.48)}${floweringPlant(667,456,.38,6,3)}
    ${epiphyte(422,203,.64,5,-17)}${epiphyte(583,363,.62,4,12)}${epiphyte(672,269,.57,6,-12)}
    ${floweringPlant(373,446,.49,4,-9)}${floweringPlant(480,452,.52,6,-7)}${floweringPlant(626,448,.47,5,10)}
    ${berries(360,389,.65,4)}`;
  const land=groundItems.sort((a,b)=>a.base-b.base).map(({base,name,markup})=>`<g class="bl-depth-object" data-base-y="${base}" data-object="${name}">${markup}</g>`).join('');
  const scenery=`${background}${distantGround}${deepForest}${farForest}${backCanopy}${rearLife}${ground}${water}${land}${vines}${canopy}${spider}`;

  return `<svg class="bl-botanical" viewBox="0 0 1100 790" preserveAspectRatio="xMidYMid meet" role="group" aria-label="${common.butterflyAlt}">${scenery}<g class="bl-resting-butterfly" transform="translate(795 474) rotate(-18) scale(.56)"><g class="bl-far-wing" transform="translate(14 -8) rotate(15) scale(.85 .92)">${wing(fore,[0,0],true)}<path class="bl-wing-outline" d="${outline(fore)}"/></g><g class="bl-near-wing">${wing(hind,[-5,-3])}${wing(fore,[0,0])}<path class="bl-wing-outline" d="${outline(fore)}${outline(hind)}"/></g><g class="bl-insect-body" fill="#3c4140" stroke="#3c4140" stroke-linecap="round"><path stroke-width="6" d="M0 0Q6 16 15 35"/><path stroke-width="8" d="M0-3L-4-9"/><path stroke-width="1.6" fill="none" d="M-5-11Q-32-29-28-50M-3-12Q4-39 14-47M0 6L-14 24L1 43M5 17L26 32L35 51M8 22L-3 42L16 55"/><path stroke="#d6d5cc" stroke-width="1" d="M4 15l7-3M7 22l7-3M10 29l5-2"/></g></g></svg><div class="bl-palette"><div class="colour-stages" role="group" aria-label="${en?'Colour stages':'Цветовые стадии'}">${stageWords.map((name,i)=>`<button type="button" data-stage="${i}" aria-pressed="${i===0}" aria-label="${name}" title="${name}" style="--bl-swatch:${['#e8e8e3','#ff2853','#0ec46b','#ffdf18','#147eff','#bc642d','transparent'][i]}">${i===0?'<span class="bl-monochrome" aria-hidden="true"></span>':i===6?'<span class="bl-multicolour" aria-hidden="true">'+['#ff2451','#ff961c','#ffde16','#18d774','#168cff','#ad39ee','#ff5cbb','#10d7e5','#ffe92f','#f72b84','#36d9a0','#6947f2','#ff7722','#127cff','#ef3dba','#8ee326'].map(colour=>'<span style="background:'+colour+'"></span>').join('')+'</span>':''}${i===1?'<span class="bl-red-tap" aria-hidden="true"><svg viewBox="0 0 36 42" fill="none"><path d="M14 22V8a3 3 0 0 1 6 0v11l2-2a3 3 0 0 1 4 1l2 2a3 3 0 0 1 4 3v9c0 5-3 8-8 8h-5c-3 0-5-2-7-5L5 25a3 3 0 0 1 5-3l4 4" fill="#fff8df" stroke="#315449" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/><path d="M6 9 3 7M8 3 7 0M26 5l3-3" stroke="#315449" stroke-width="1.5" stroke-linecap="round"/></svg></span>':''}</button>`).join('')}</div><p class="colour-name" role="status">${c.lightDark}</p></div>`;

}
export function mountButterflyLandscape(scene,c,{signal}) {
  const words=[c.lightDark,c.red,c.green,c.yellow,c.blue,c.brown,c.all];
  let colourClicks=0,descriptionOpened=false;
  const colours=[...scene.querySelectorAll('.bl-colour[data-colour]')];
  const status=scene.querySelector('.colour-name'),buttons=[...scene.querySelectorAll('button[data-stage]')];
  function choose(index){
    if(!Number.isInteger(index)||index<0||index>=colourStages.length)return;
    const revealed=new Set(colourStages[index]);
    scene.dataset.colourStage=String(index);
    colours.forEach(part=>part.classList.toggle('is-coloured',revealed.has(part.dataset.colour)));
    buttons.forEach(button=>button.setAttribute('aria-pressed',String(Number(button.dataset.stage)===index)));
    status.textContent=words[index];
  }
  scene.addEventListener('click',event=>{
    const button=event.target.closest('button[data-stage]');
    if(button&&scene.contains(button)){
      scene.dataset.colourTouched='true';
      const stage=Number(button.dataset.stage);
      choose(stage);
      if(stage>0 && ++colourClicks===6 && !descriptionOpened){
        descriptionOpened=true;
        document.dispatchEvent(new CustomEvent('projectrequest',{detail:{id:'butterfly',opener:button}}));
      }
    }
  },{signal});
  choose(0);
}
