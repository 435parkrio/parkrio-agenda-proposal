(function(root){
const W=595.28,H=841.89,M=42;
const escapeXml=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
async function create(d,fontBytes,libs){
  const {PDFLib,fontkit}=libs||root;
  const pdf=await PDFLib.PDFDocument.create();pdf.registerFontkit(fontkit);
  const font=await pdf.embedFont(fontBytes,{subset:false});
  const chars=new Set(font.getCharacterSet());
  const clean=s=>Array.from(String(s||'').replace(/\r\n?/g,'\n').replace(/\t/g,'    ')).map(c=>c==='\n'||chars.has(c.codePointAt(0))?c:'?').join('');
  const width=(s,size)=>font.widthOfTextAtSize(s,size);
  const wrap=(str,max,size)=>clean(str).split('\n').flatMap(par=>{
    if(!par)return [''];let rows=[],line='';for(const c of Array.from(par)){if(line&&width(line+c,size)>max){rows.push(line);line=c;}else line+=c;}rows.push(line);return rows;
  });
  const pages=[];let ops=[],y=M;
  function page(){ops=[];pages.push(ops);y=M;}
  function text(s,x,top,size=11){if(s)ops.push({type:'text',s:clean(s),x,top,size});}
  function line(x1,t1,x2,t2,dash=false){ops.push({type:'line',x1,t1,x2,t2,dash});}
  function rect(x,top,w,h){ops.push({type:'rect',x,top,w,h});}
  function center(s,x,top,w,size=11){text(s,x+(w-width(clean(s),size))/2,top,size);}
  function centeredRows(s,x,top,w,h,size=11){const rows=wrap(s,w-14,size);const lead=size*1.5;rows.forEach((r,i)=>center(r,x,top+(h-rows.length*lead)/2+i*lead,w,size));}
  function ensure(h){if(y+h>H-M-18){page();}}
  page();text('[별지 제7호서식](제37조제1항 관련)',M,y,9);y+=23;
  const outerTop=y,outerW=W-M*2,x=M+25,innerW=outerW-50;
  const cols=[innerW*.30,innerW*.29,innerW*.21,innerW*.20];const xs=[x];cols.forEach(v=>xs.push(xs.at(-1)+v));
  const tableTop=y+6,row=31;rect(x,tableTop,innerW,row*2);
  [xs[1],xs[2],xs[3]].forEach(v=>line(v,tableTop,v,tableTop+row*2));
  line(x,tableTop+row,xs[2],tableTop+row);line(xs[2],tableTop+row,xs[3],tableTop+row,true);
  centeredRows('의안번호',x,tableTop,cols[0],row);centeredRows('제        호',xs[1],tableTop,cols[1],row);
  centeredRows('의    결\n연 월 일',x,tableTop+row,cols[0],row,10);
  centeredRows('20    .    .    .\n(제      차)',xs[1],tableTop+row,cols[1],row,10);
  centeredRows('의결사항',xs[3],tableTop,cols[3],row*2);
  const titleRows=wrap(d.title,innerW-20,13),titleTop=tableTop+row*2+16,titleH=Math.max(27,titleRows.length*19+10);
  rect(x,titleTop,innerW,titleH);titleRows.forEach((s,i)=>center(s,x,titleTop+5+i*19,innerW,13));
  const submitTop=titleTop+titleH+16,submitX=x+15,submitW=innerW-30,labW=86;
  const name=clean(d.name)+(d.unit?' ('+clean(d.unit)+')':'');const nameRows=wrap(name,submitW-labW-16,11),nameH=Math.max(27,nameRows.length*16+10);
  rect(submitX,submitTop,submitW,nameH+27);line(submitX+labW,submitTop,submitX+labW,submitTop+nameH+27);line(submitX,submitTop+nameH,submitX+submitW,submitTop+nameH);
  centeredRows('제 출 자',submitX,submitTop,labW,nameH);centeredRows(name,submitX+labW,submitTop,submitW-labW,nameH);
  centeredRows('제출연월일',submitX,submitTop+nameH,labW,27);centeredRows(String(d.date||'').replaceAll('-','. '),submitX+labW,submitTop+nameH,submitW-labW,27);
  y=submitTop+nameH+27+10;rect(M,outerTop,outerW,y-outerTop);y+=20;
  function section(title,value){const rows=wrap(value||'—',W-M*2-18,11);ensure(44);text(title,M+6,y,12);y+=24;for(const row of rows){ensure(17);text(row,M+12,y,11);y+=17;}y+=17;}
  section('1. 의결주문',d.resolution);section('2. 제안이유',d.reason);section('3. 주요내용',d.details);section('4. 비용추계서',d.cost);
  ensure(65);text('5. 참고사항',M+6,y,12);y+=27;section('가. 근거규정',d.basis);section('나. 기타',d.other);
  pages.forEach((commands,i)=>{commands.push({type:'text',s:`${i+1} / ${pages.length}`,x:W/2-10,top:H-30,size:9});const p=pdf.addPage([W,H]);for(const op of commands){if(op.type==='text')p.drawText(op.s,{x:op.x,y:H-op.top-op.size,font,size:op.size,color:PDFLib.rgb(0,0,0)});else if(op.type==='rect')p.drawRectangle({x:op.x,y:H-op.top-op.h,width:op.w,height:op.h,borderWidth:.6,borderColor:PDFLib.rgb(0,0,0)});else p.drawLine({start:{x:op.x1,y:H-op.t1},end:{x:op.x2,y:H-op.t2},thickness:.6,color:PDFLib.rgb(0,0,0),...(op.dash?{dashArray:[1,2]}:{})});}});
  pdf.setTitle(clean(d.title));pdf.setSubject('파크리오아파트 안건 제안서');pdf.setAuthor(clean(d.name));
  return {bytes:await pdf.save(),pages};
}
function previewHtml(pages){return pages.map((ops,i)=>`<div class="pdf-page"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="제안서 ${i+1}쪽">${ops.map(o=>o.type==='text'?`<text xml:space="preserve" style="white-space:pre" x="${o.x}" y="${o.top+o.size}" font-family="ProposalKorean" font-size="${o.size}" fill="#000">${escapeXml(o.s)}</text>`:o.type==='rect'?`<rect x="${o.x}" y="${o.top}" width="${o.w}" height="${o.h}" fill="none" stroke="#000" stroke-width="0.6"/>`:`<line x1="${o.x1}" y1="${o.t1}" x2="${o.x2}" y2="${o.t2}" stroke="#000" stroke-width="0.6"${o.dash?' stroke-dasharray="1 2"':''}/>`).join('')}</svg></div>`).join('');}
root.ProposalPDF={create,previewHtml};if(typeof module!=='undefined')module.exports=root.ProposalPDF;
})(typeof globalThis!=='undefined'?globalThis:this);

