'use strict';
const data=window.RINGWATCH_DATA;
const $=s=>document.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt=d=>d?d.replaceAll('-','.'): '未核实';
const number=p=>'US '+(p.startsWith('D')?'D'+p.slice(1).replace(/\B(?=(\d{3})+(?!\d))/g,','):p.replace(/\B(?=(\d{3})+(?!\d))/g,','));
const state={type:'全部',company:'',role:'any',search:'',patent:'',page:1,sort:'date'};
const groups=['全部','ITC','CAFC','District Court','PTAB','IPR','PGR','EPR'];
const labels={'全部':'全部案件','ITC':'ITC / 337','CAFC':'上诉 / CAFC','District Court':'地区法院','PTAB':'PTAB 全部','IPR':'IPR','PGR':'PGR','EPR':'EPR'};
const pageSize=8;
const programCount=rows=>new Set(rows.map(c=>c.investigationId||c.id)).size;
const isClosed=c=>/撤诉|拒绝|不立案|撤回上诉|被驳回/.test(c.status);
function isFinished(c){
const ended=['已结案','和解后撤诉 / 结案','已自愿撤诉 / 结案','无偏见撤诉','已撤诉','已撤诉 / 结案','自愿撤回上诉','未立案；无实体FWD','立案决定撤销，拒绝立案','确认之诉被驳回'];
return ended.includes(c.status)&&!(data.appealLinks||[]).some(e=>e.from===c.id&&(e.pending||data.cases.find(a=>a.id===e.to)?.status!=='自愿撤回上诉'));
}

function caseOutcome(c){
 const outcomes={
 '337-TA-1398':['Oura胜；RingConn、Ultrahuman败','限337终裁；RingConn后续和解，上诉另列'],
 'IPR2024-00928':['Samsung胜；Oura败','限被挑战权利要求；上诉状态待核实'],
 'PGR2024-00030':['双方各有胜负','17、18被认定不可专利；其余争议结果见详情，上诉中'],
 'IPR2024-01077':['Oura胜；Samsung败','限本次专利挑战；上诉对应关系待核实'],
 'IPR2024-01078':['Oura胜；Samsung败','限本次专利挑战；上诉中'],
 'PGR2024-00039':['Oura胜；Samsung败','限本次专利挑战；上诉中'],
 'IPR2025-00147':['Oura胜；Samsung败','限本次专利挑战；上诉中']};
 if(outcomes[c.id])return {label:outcomes[c.id][0],note:outcomes[c.id][1],decided:true};
 if(c.recordKind==='立案前投诉')return {label:'见正式调查',note:c.investigationId};
 if(/和解/.test(c.status))return {label:'和解结束',note:'未据此判定实体胜败'};
 if(/撤诉|撤回上诉|已结案/.test(c.status))return {label:'撤诉 / 结案',note:'未据此判定实体胜败'};
 if(c.id==='3:24-cv-03245')return {label:'Samsung起诉被驳回',note:'程序性驳回，未判定侵权或专利有效性'};
 if(/未立案|拒绝立案/.test(c.status))return {label:'未进入实体审理',note:'不标记实体胜败'};
 return {label:'尚未确认胜败',note:'未收录可确认的实体终局结果'};
}
function outcomeCell(c){const o=caseOutcome(c);return '<strong>'+esc(o.label)+'</strong><div class="date-sub">'+esc(o.note)+'</div>';}

function filtered(ignorePatent=false,ignoreType=false){return data.cases.filter(c=>{
 const roles=state.role==='plaintiff'?c.plaintiff:state.role==='defendant'?c.defendant:state.role==='intervenor'?c.intervenor:[...c.plaintiff,...c.defendant,...c.intervenor];
 return(ignoreType||state.type==='全部'||c.type===state.type||(state.type==='PTAB'&&['IPR','PGR'].includes(c.type)))&&(!state.company||roles.includes(state.company))&&(!state.patent||ignorePatent||c.patents.includes(state.patent))&&(!state.search||[c.id,...c.plaintiff,...c.defendant,...c.intervenor,...c.patents,...c.patents.map(number),c.status,c.displayStatus].join(' ').toLowerCase().includes(state.search.toLowerCase()));
 }).sort((a,b)=>(b.filed||'').localeCompare(a.filed||''));}
function caseButton(c,label){return `<button class="case-title" data-case="${esc(c.id)}">${esc(label||[c.plaintiff[0],c.defendant[0]].join(' v. '))}${c.plaintiff.length+c.defendant.length>2&&!label?' 等':''}</button>`}

const startLabel=c=>c.type==='District Court'?'向法院起诉':c.type==='ITC'?'向贸易委员会投诉':c.type==='CAFC'?'上诉登记':c.type==='EPR'?'申请重新审查专利':'申请审查专利';
const eventNames={'委员会终裁：违反337':'贸易委员会最终认定违反进口贸易规定','RingConn相关救济撤销':'撤销针对RingConn的进口限制等措施','拒绝暂缓救济申请':'拒绝暂停执行进口限制等措施','调查立案（联邦公报）':'正式启动调查（公告日期）','22项权利要求退出调查':'不再调查22项专利保护内容','委员会决定立案':'决定正式启动调查','解除停审并结案':'解除暂停审理状态，案件结束','法院准许驳回动议':'法院同意驳回请求','自愿撤诉并结案':'主动撤回起诉，案件结束','准许修订侵权争点陈述':'允许调整关于哪些行为侵权的主张','准许修订无效争点陈述':'允许调整关于专利为何无效的主张','Oura侵权请求停审':'暂停审理Oura提出的侵权请求','Samsung侵权反请求停审':'暂停审理Samsung提出的侵权反诉','无偏见撤诉命令':'法院准许撤诉，仍可能再次起诉','无偏见撤诉':'已撤诉，仍可能再次起诉','召开初次审前会议':'召开第一次审判准备会议','公开审前会议笔录及动议记录':'公开审判准备会议及双方请求的记录','撤诉命令登记':'法院登记撤诉决定','Ring Pro专利侵权案起诉':'就Ring Pro产品提起专利侵权诉讼','最终书面决定：部分不可专利':'最终决定：部分专利保护内容不符合授权条件','提交上诉通知':'正式提出上诉','最终书面决定：未证明被挑战权利要求不可专利':'最终决定：挑战方未证明相关专利保护内容应被撤销','酌情拒绝立案':'决定不进入正式审理，未判断专利是否有效','Director撤销IPR立案并拒绝请求':'专利局撤销原来的审理决定，不再受理该申请','Ultrahuman提起上诉':'Ultrahuman提出上诉','指定关联上诉共同审理':'决定将相关上诉合在一起审理','首次公开修正投诉':'首次公开修改后的投诉文件','回复公共利益意见':'回复有关公众利益的意见','首次公开修正投诉及附件':'首次公开修改后的投诉及附件','投诉补充文件':'提交投诉补充材料','首次修正公开投诉':'首次修改公开投诉文件','拒绝逾期提交请求的函件':'发函拒绝逾期提交的请求'};
function plainEvent(c,date,text){if(!text.startsWith('工作簿所列'))return eventNames[text]||text;
 if(c.workbook?.institutionDate===date){if(c.type==='EPR')return '同意重新审查专利';return /否/.test(c.workbook.institution)?'决定不进入正式审理':'决定进入正式审理';}
 if(c.type==='EPR'){if(/非终局/.test(c.status))return '发出初步审查意见，尚非最终决定';if(/合并/.test(c.status))return '发出合并审查通知';if(/分配/.test(c.status))return '安排审查员判断是否启动重新审查';}
 if(/FWD|最终书面/.test(c.status))return '对专利审查作出最终决定';return '案卷列出的重要日期，具体事项待核对';}
function milestones(c){return keyEvents(c).slice().reverse();}
function milestoneCell(c){const es=milestones(c);return es.slice(0,2).map(e=>'<div class="milestone"><time>'+fmt(e.date)+'</time><div>'+esc(e.text)+'</div></div>').join('')+(es.length>2?'<span class="date-sub">更多节点见详情</span>':'')||'<span class="date-sub">尚未核实重要节点</span>';}


function appealButton(id){return '<button class="appeal-link" data-case="'+esc(id)+'">'+esc(id)+'</button>';}
function rowAppeals(c){const edges=data.appealLinks.filter(e=>e.from===c.id||e.to===c.id);return edges.length?'<div class="row-appeals">'+edges.map(e=>(e.pending?'待核对：':e.from===c.id?'上诉案：':'来自：')+appealButton(e.from===c.id?e.to:e.from)).join('')+'</div>':'';}
function appealPath(e){const origin=data.cases.find(c=>c.id===e.from),appeal=data.cases.find(c=>c.id===e.to);return '<article class="appeal-path '+(e.pending?'pending':'')+'"><div class="appeal-chain"><div><small>'+esc(origin.type==='District Court'?'地区法院原案':origin.type==='ITC'?'贸易委员会调查':'专利局审查')+'</small>'+appealButton(e.from)+'</div><span class="appeal-arrow">'+(e.pending?'可能上诉至 →':'上诉至 →')+'</span><div><small>联邦巡回上诉法院</small>'+appealButton(e.to)+'</div></div><p>'+esc(appeal.displayStatus)+'</p><p class="subtle">'+esc(e.label)+' · '+esc(e.evidence)+'</p></article>';}
function appealDetail(c){const edges=data.appealLinks.filter(e=>e.from===c.id||e.to===c.id);return '<h3>原案与上诉的关系</h3>'+ (edges.length?edges.map(appealPath).join(''):'<p class="detail-copy">尚未核实本案对应的上诉；这不表示没有上诉。</p>');}
function renderAppeals(rows){const shown=data.appealLinks.filter(e=>rows.some(c=>c.id===e.from||c.id===e.to));$('#appeal-paths').innerHTML=shown.map(appealPath).join('')||'<div class="empty">当前筛选下没有已记录的原案与上诉对应关系。</div>';}



function eventKind(c,date,text){
 if(/上诉/.test(text))return '上诉';
 if(/终裁|救济|进口限制/.test(text)&&c.type==='ITC')return '337终裁 / 委员会复审';
 if(/初裁/.test(text)&&c.type==='ITC')return '337实体初裁';
 if(/最终书面|最终决定|终局|判决|FWD/.test(text))return '终局判决 / 最终决定';
 if(/立案|正式启动|正式审理|重新审查专利|安排审查员/.test(text))return '立案 / 是否受理';
 if(/撤诉|结案|结束/.test(text))return '撤诉 / 结束';
 if(/投诉|起诉/.test(text))return '起诉 / 答辩';
 if(/审前|排期|案件管理|合并|共同审理/.test(text))return '案件管理 / 排期';
 if(/听证|会议/.test(text))return '听证 / 会议';
 if(/意见|回复/.test(text))return '意见 / 证据';
 return '法院 / 机构决定';
}
function caseEvents(c){
 const detail=window.RINGWATCH_TIMELINE||{cases:{},sources:[]};
 const verified=c.verifiedMilestones||[];
 const start=c.filed&&!verified.some(e=>e.kind==='开始日期')?[{date:c.filed,text:startLabel(c),kind:'开始日期',key:true,dateBasis:'案件主表记载的开始日期'}]:[];
 const curated=c.events.map(([date,text])=>({date,text:plainEvent(c,date,text),kind:eventKind(c,date,plainEvent(c,date,text)),key:true,dateBasis:'已收录的案件关键节点'})).filter(e=>!verified.some(v=>v.date===e.date));
 const w=c.workbook;
 const institution=w?.institutionDate&&/^\d{4}-\d{2}-\d{2}$/.test(w.institutionDate)&&!curated.some(e=>e.date===w.institutionDate)?[{date:w.institutionDate,text:plainEvent(c,w.institutionDate,'工作簿所列'),kind:'立案 / 是否受理',key:true,dateBasis:'工作簿 '+w.sheet+' 第'+w.row+'行'}]:[];
 return [...start,...curated,...institution,...verified.map(e=>({...e,key:true})),...(detail.cases[c.id]||[]).map(e=>({...e,dateBasis:'案卷登记日，可能不同于听证或裁判实际日期'}))].filter(e=>e.date&&e.date<=data.asOf).map(e=>({...e,c})).sort((a,b)=>b.date.localeCompare(a.date)||Number(b.number||0)-Number(a.number||0));
}
function keyEvents(c){
 return caseEvents(c).filter(e=>!(e.key&&e.kind==='撤诉 / 结束'&&(window.RINGWATCH_TIMELINE?.cases[c.id]||[]).some(d=>d.date===e.date&&/^ORDER DISMISSING CASE WITHOUT PREJUDICE/i.test(d.original||'')))).filter(e=>e.key||/^(?:Notice of )?(?:Final )?Initial Determination on Violation|^(?:Markman Hearing|Claim Construction Hearing|Evidentiary Hearing|Pre-Trial Conference)|^(?:Final Judgment|Judgment|Final Written Decision|Scheduling Order|Docket Control Order|Case Management Order|Order of Dismissal|Order Dismissing|Stipulation of Dismissal|Notice of Voluntary Dismissal)|^(?:Order.*(?:Scheduling|Case Management|Docket Control|Motion to Stay))|^(?:F\.?\s*R\.?\s*Notice of )?Institution of Investigation/i.test(e.original||'')).filter(e=>!(c.verifiedMilestones||[]).some(v=>!e.key&&v.kind===e.kind&&['337实体初裁','立案 / 是否受理'].includes(e.kind))).sort((a,b)=>a.date.localeCompare(b.date));
}
function eventSource(e){const file=window.RINGWATCH_TIMELINE?.sources[e.source]?.file;return '<details class="event-source"><summary>查看依据与日期说明</summary>'+(e.original?'<p>'+esc(e.original)+'</p>':'')+(file?'<p>'+esc(file)+(e.number?' · 案卷第'+esc(e.number)+'项':'')+'</p>':'')+'<p>'+esc(e.dateBasis||'案卷登记日期')+'</p>'+(e.url?'<a class="source-link" target="_blank" rel="noopener noreferrer" href="'+esc(e.url)+'">官方来源 ↗</a>':!file?(e.c.sources||[]).map(s=>'<a class="source-link" target="_blank" rel="noopener noreferrer" href="'+esc(s.url)+'">'+esc(s.label)+' ↗</a>').join(''):'')+'</details>';}
function keyTimeline(c){const es=keyEvents(c);return '<section class="key-timeline"><h3>'+esc(c.id)+' · 关键程序</h3><p class="subtle">按发生顺序查看；案卷登记日与实际程序日期分别注明。仅展示重要节点，展开每条可查看原始依据。</p>'+es.map(e=>'<article class="event"><time>'+fmt(e.date)+'</time><h4>'+esc(e.text)+'</h4><p>'+esc(e.kind)+'</p>'+eventSource(e)+'</article>').join('')+(!es.length?'<p>尚未取得可核实的关键节点。</p>':'')+'</section>';}
function fullCaseTimeline(c){return keyTimeline(c);}

let timelineCase='',timelineKind='',timelineView='key',timelineLimit=12;
function setTimelineOptions(el,options,value){
 const signature=JSON.stringify(options);
 if(el.dataset.options!==signature){el.innerHTML=options.map(([v,label])=>'<option value="'+esc(v)+'">'+esc(label)+'</option>').join('');el.dataset.options=signature;}
 el.value=value;
}
function renderTimeline(rows){
 if(timelineCase&&!rows.some(c=>c.id===timelineCase)){timelineCase='';timelineKind='';}
 if(rows.length===1)timelineCase=rows[0].id;
 setTimelineOptions($('#timeline-case'),[['','全部匹配案件'],...rows.map(c=>[c.id,c.id+' · '+c.plaintiff[0]+' / '+c.defendant[0]])],timelineCase);

 const selected=timelineCase?rows.filter(c=>c.id===timelineCase):rows;
 const events=selected.flatMap(keyEvents),all=events;
 const required=['开始日期','立案 / 是否受理','证据交换 / Discovery','权利要求解释 / Markman','案件管理 / 排期','终局判决 / 最终决定',...(selected.some(c=>c.type==='ITC')?['337实体初裁','337程序性初裁及相关材料','337终裁 / 委员会复审']:[])];
 const kinds=[...new Set([...required,...all.map(e=>e.kind)])];if(!kinds.includes(timelineKind))timelineKind='';
 // A stage selection always searches all records, including submissions outside the key overview.
 const pool=timelineKind?all:events;
 setTimelineOptions($('#timeline-kind'),[['','全部重要节点'],...kinds.map(k=>[k,k+'（'+all.filter(e=>e.kind===k).length+'）'])],timelineKind);
 $('#timeline-stages').textContent='仅展示起诉、重要排期、听证、暂停审理、裁判及结案等重要节点，按时间先后排列。';
 const chosen=pool.filter(e=>!timelineKind||e.kind===timelineKind).sort((a,b)=>a.date.localeCompare(b.date));
 const visible=timelineCase?chosen:chosen.slice(0,timelineLimit);
 $('#timeline-summary').textContent=(timelineCase||'全部匹配案件')+' · '+(timelineKind|| (timelineView==='key'?'关键程序':'全部记录'))+' · '+chosen.length+'条'+(visible.length<chosen.length?' · 已显示'+visible.length+'条':'');
 $('#timeline-key').innerHTML='';
 $('#events').innerHTML=visible.map(e=>'<article class="event"><time>'+fmt(e.date)+(e.number?' · 案卷第'+esc(e.number)+'项':'')+'</time><button data-case="'+esc(e.c.id)+'"><h3>'+esc(e.text)+'</h3></button><p>'+esc(e.c.id)+' · '+esc(e.kind)+'</p>'+eventSource(e)+'</article>').join('')||'<div class="empty">'+(timelineKind?'该案件范围内尚未提取到“'+esc(timelineKind)+'”记录。':'暂无已记录的程序。')+'</div>';
 $('#timeline-more').hidden=visible.length>=chosen.length;
}


function stageFields(c){
 if(c.type==='ITC'){
  const formal=c.recordKind==='立案前投诉'?data.cases.find(x=>x.id===c.investigationId):c;
  const ref=formal||c;
  const entry=(ref.verifiedMilestones||[]).find(e=>e.kind==='立案 / 是否受理')||ref.events.filter(e=>/立案/.test(e[1])).map(([date,text])=>({date,text}))[0];
  const first=entry?{title:fmt(entry.date),note:(c.recordKind==='立案前投诉'?'对应'+c.investigationId+'；':'')+(/公报/.test(entry.text)?'立案公告日期':'正式调查立案日期')}:{title:'未核实',note:'未取得明确立案日期'};
  const initial=(ref.verifiedMilestones||[]).find(e=>e.kind==='337实体初裁');
  const second=initial?{title:fmt(initial.date)+' · 实体初裁',note:initial.text}:{title:'未核实实体初裁',note:ref.id==='337-TA-1478'?'已记录部分专利退出的程序性初裁；不等于全案实体初裁':ref.id==='337-TA-1468'?'已记录部分权利要求退出；尚未取得实体初裁结果':'后续见正式调查'};
  return [first,second];
 }
 if(c.type==='District Court'){
  const records=(window.RINGWATCH_TIMELINE?.cases[c.id]||[]).filter(e=>/Markman.*Hearing|Claim Construction Hearing/i.test(e.original||'')).sort((a,b)=>b.date.localeCompare(a.date));
  let mark={title:'未核实',note:'未取得听证日期或结果'};
  for(const e of records){const t=e.original;const m=t.match(/(?:Markman(?:\/Claim Construction)?|Claim Construction) Hearing.{0,35}?(?:held on|set for|RESET for|Scheduled for)\s*(\d{1,2})\/(\d{1,2})\/(\d{4})/i);if(!m)continue;
   const day=m[3]+'-'+m[1].padStart(2,'0')+'-'+m[2].padStart(2,'0');
   const cancelled=/cancelled|canceled/i.test(t),held=/held on/i.test(t);
   mark={title:fmt(day),note:cancelled?'原定听证已取消':held?'已举行：解释专利保护范围':isFinished(c)?'原定排期；案件已结束，未确认举行':'排期所载听证日；是否举行待核实',source:e};break;
  }
  return [{title:'未核实',note:'未取得明确Discovery开始日'},mark];
 }
 return [{title:'—',note:'不适用'},{title:'—',note:'不适用'}];
}
function stageCell(c,index){const e=stageFields(c)[index];const label=c.type==='ITC'?(index?'初裁情况':'立案日'):c.type==='District Court'?(index?'Markman听证':'Discovery开始日'):'';return '<span class="stage-label">'+label+'</span><strong>'+esc(e.title)+'</strong><div class="date-sub">'+esc(e.note)+'</div>';}

function render(){const rows=filtered();const patents=[...new Set(rows.flatMap(c=>c.patents))];const counts=groups.map(t=>filtered(false,true).filter(c=>t==='全部'||t===c.type||t==='PTAB'&&['IPR','PGR'].includes(c.type)).length);
 $('#type-filters').innerHTML=groups.map((t,i)=>`<button data-type="${t}" class="${state.type===t?'selected':''}" aria-pressed="${state.type===t}">${labels[t]} <small>${counts[i]}</small></button>`).join('');
 $('#result-count').textContent=`${rows.length} 份记录 · ${programCount(rows)} 项程序`;
 $('#kpis').innerHTML=[['已收录案卷',rows.length,`${programCount(rows)} 项程序 · ITC投诉阶段去重`,'◫'],['涉诉 / 被挑战专利',patents.length,'已识别专利去重 · 含部分列表','▧'],['PTAB 审查程序',rows.filter(c=>['IPR','PGR'].includes(c.type)).length,'IPR + PGR · EPR单列','⌘'],['已记录实体裁判',rows.filter(c=>caseOutcome(c).decided).length,'按本程序裁判 · 上诉及和解另列','◷']].map(([t,v,n,i])=>`<article class="kpi"><span class="kpi-label">${t}</span><span class="kpi-icon">${i}</span><strong>${String(v).padStart(2,'0')}</strong><small>${n}</small></article>`).join('');
 const pages=Math.max(1,Math.ceil(rows.length/pageSize));state.page=Math.min(state.page,pages);
 const showITCStages=state.type==='ITC';$('#stage-start-heading').hidden=!showITCStages;$('#stage-hearing-heading').hidden=!showITCStages;$('#cases').classList.toggle('without-itc-stages',!showITCStages);
 $('#case-rows').innerHTML=rows.slice((state.page-1)*pageSize,state.page*pageSize).map((c,i)=>`<tr><td class="row-number">${(state.page-1)*pageSize+i+1}</td><td>${caseButton(c)}<div class="case-meta"><span class="type-tag">${c.type==='District Court'?'地区法院':c.type}</span>${esc(c.id)}${c.recordKind?` · ${esc(c.recordKind)}`:''}</div>${rowAppeals(c)}</td><td><time class="date">${c.filed?fmt(c.filed):'日期待核实'}</time><div class="date-sub">${startLabel(c)}</div></td>${showITCStages?`<td class="stage-cell">${c.type==='ITC'?stageCell(c,0):'—'}</td><td class="stage-cell">${c.type==='ITC'?stageCell(c,1):'—'}</td>`:''}<td><span class="status ${isClosed(c)?'done':''}">${esc(c.displayStatus||c.status)}</span><div class="date-sub">信息记录到 ${fmt(c.asOf)}</div></td><td class="case-outcome">${outcomeCell(c)}</td><td><button class="row-arrow" data-case="${esc(c.id)}" aria-label="查看 ${esc(c.id)} 详情">查看</button></td></tr>`).join('')||'<tr><td colspan="'+(showITCStages?8:6)+'"><div class="empty">没有匹配的案件。请调整筛选或点击重置。</div></td></tr>';
 $('#table-total').innerHTML=`共 ${rows.length} 项 <button id="prev-page" ${state.page===1?'disabled':''} aria-label="上一页">‹</button> ${state.page} / ${pages} <button id="next-page" ${state.page===pages?'disabled':''} aria-label="下一页">›</button>`;
 renderTimeline(rows);
 renderGraph(rows);renderAppeals(rows);
 $('#patent-list').innerHTML=patents.sort((a,b)=>rows.filter(c=>c.patents.includes(b)).length-rows.filter(c=>c.patents.includes(a)).length).map(p=>{const related=rows.filter(c=>c.patents.includes(p));return `<article class="patent-card"><div class="patent-id">${number(p)}</div><h3>${p==='10842429'?'准备度评分':p==='10893833'?'可穿戴电子设备':p==='11868178'?'戒指结构与组件布置':''}</h3><p>${related.length} 份关联案卷 · ${[...new Set(related.map(c=>c.type))].join(' / ')}</p><p>权利要求变化以各程序详情及原件为准</p>${related.map(c=>`<button data-case="${esc(c.id)}">${esc(c.id)} ↗</button>`).join('')}</article>`}).join('')||'<div class="empty">当前案件暂无已核实专利号。</div>';
 $('#patent-list').querySelectorAll('h3').forEach(h=>{if(!h.textContent.trim())h.remove();});
 $('#clear-patent').hidden=!state.patent;
 $('#clear-patent').textContent=state.patent?`${number(state.patent)} ×`:'清除选择 ×';
 history.replaceState(null,'',location.pathname+queryString()+location.hash);
}
function queryString(){const p=new URLSearchParams();for(const [k,v] of Object.entries(state))if(v&&v!==({type:'全部',role:'any',page:1,sort:'date'}[k]))p.set(k,String(v));return p.size?'?'+p:''}
function renderGraph(rows){const p=[...new Set(rows.flatMap(c=>c.patents))].sort((a,b)=>rows.filter(c=>c.patents.includes(b)).length-rows.filter(c=>c.patents.includes(a)).length).slice(0,5);const cs=rows.filter(c=>c.patents.some(x=>p.includes(x))).slice(0,7);if(!p.length){$('#graph').innerHTML='<div class="empty">暂无可绘制的专利关联。未核实的关联不会自动补齐。</div>';return}
 const py=i=>35+i*47,cy=i=>23+i*34;let svg='<svg viewBox="0 0 530 266" role="group" aria-label="专利与案件关系图">';
 cs.forEach((c,j)=>p.forEach((pat,i)=>{if(c.patents.includes(pat))svg+=`<path d="M155 ${py(i)} C255 ${py(i)},255 ${cy(j)},345 ${cy(j)}" fill="none" stroke="#d8c9ac" stroke-width="1.2"/>`}));
 p.forEach((pat,i)=>{svg+=`<g class="graph-node" tabindex="0" role="button" data-patent="${pat}" aria-label="筛选 ${number(pat)}"><rect x="14" y="${py(i)-14}" width="141" height="29" rx="4" fill="${state.patent===pat?'#e5d5b5':'#faf7ef'}" stroke="#c6ae80"/><circle cx="28" cy="${py(i)}" r="3" fill="#b59860"/><text x="40" y="${py(i)+4}" fill="#8c7346" font-size="10">${number(pat)}</text></g>`});
 cs.forEach((c,i)=>{svg+=`<g class="graph-node" tabindex="0" role="button" data-case="${esc(c.id)}" aria-label="打开 ${esc(c.id)}"><rect x="345" y="${cy(i)-13}" width="170" height="27" rx="4" fill="#f2f4f5" stroke="#ccd3d6"/><text x="356" y="${cy(i)+4}" fill="#657780" font-size="10">${esc(c.id)}</text></g>`});
 svg+='</svg>';$('#graph').innerHTML=svg+`<div class="graph-caption">显示关联最多的 ${p.length} 项专利及 ${cs.length} 份案卷；完整关联见下方专利库。</div>`;
}
let returnFocus=null;
function workbookDetail(c){const w=c.workbook;if(!w)return c.recordKind?'<h3>ITC编号与阶段</h3><div class="detail-block">'+esc(c.recordKind)+' · DN '+esc(c.docketNumber)+' → '+esc(c.investigationId)+'</div>':'';return '<h3>工作簿核对记录</h3><p class="detail-copy">'+esc(w.file)+' · '+esc(w.sheet)+' 第'+w.row+'行 · 截至 '+w.asOf+'。以下为工作簿记录，本次未逐一重新验证全部原件。</p><dl class="detail-grid">'+[['Oura角色 / 具名主体',w.role+' / '+w.ouraEntity],['对方具名当事人',w.counterparty],['立案 / 再审批准',w.institution],['立案或拒绝日期',fmt(w.institutionDate)],['涉及权利要求',w.claims],['工作簿状态',w.status],['结果 / 决定',w.conclusion],['关键事件日期',fmt(w.eventDate)],['上诉情况',w.appeal+' / '+w.appealNumber],['关联诉讼（含待核实）',w.litigation],['核验限制',w.notes||'未另列'],['来源编号',w.sourceIds]].map(([k,v])=>'<div><dt>'+esc(k)+'</dt><dd>'+esc(v)+'</dd></div>').join('')+'</dl>';}
function openDetail(id){const c=data.cases.find(c=>c.id===id);if(!c)return;const title=[c.plaintiff.join(' / '),c.defendant.join(' / ')].join(' v. ');const samePat=data.cases.filter(x=>x.id!==c.id&&x.patents.some(p=>c.patents.includes(p)));const related=[...new Set([...c.related,...samePat.map(x=>x.id)])];
 $('#detail-content').innerHTML=`<span class="type-tag">${c.type}</span><span class="subtle"> ${esc(c.court||(['IPR','PGR'].includes(c.type)?'USPTO · PTAB':c.type==='EPR'?'USPTO · 单方再审':c.type==='CAFC'?'Federal Circuit':'USITC'))}</span><h2 id="detail-title">${esc(title)}</h2><div class="case-meta">${esc(c.id)}</div><dl class="detail-grid"><div><dt>原告 / 申请人 / 上诉人</dt><dd>${esc(c.plaintiff.join('、'))}</dd></div><div><dt>被告 / 权利人 / 被上诉人</dt><dd>${esc(c.defendant.join('、'))}</dd></div>${c.intervenor.length?`<div><dt>介入人</dt><dd>${esc(c.intervenor.join('、'))}</dd></div>`:''}<div><dt>提交 / 立案日期</dt><dd>${fmt(c.filed)}</dd></div><div><dt>记录截至日期</dt><dd>${fmt(c.asOf)}</dd></div><div><dt>目前进展</dt><dd>${esc(c.displayStatus||c.status)}</dd></div><div><dt>案卷原始状态表述</dt><dd>${esc(c.status)}</dd></div><div><dt>风险等级</dt><dd>${c.risk}</dd></div></dl>${['District Court','ITC'].includes(c.type)?'<h3>审理阶段</h3><div class="detail-grid"><div>'+stageCell(c,0)+'</div><div>'+stageCell(c,1)+'</div></div>':''}<h3>程序动态</h3>${fullCaseTimeline(c)}<h3>案件胜败方</h3><div class="detail-block">${outcomeCell(c)}</div><h3>裁判 / 机构结论</h3><div class="detail-block">${esc(c.conclusion)}</div><h3>权利要求修改与主张变化</h3><div class="detail-block">${esc(c.claimChange)}</div><h3>风险评估依据</h3><p class="detail-copy">${esc(c.riskReason)}</p><h3>涉诉专利 <span class="subtle">已识别部分</span></h3>${c.patents.map(p=>`<div class="drawer-patent">${number(p)} <a class="patent-source" href="https://patents.google.com/patent/US${p}/en" target="_blank" rel="noopener noreferrer">专利文本 ↗</a></div>`).join('')||'<p class="detail-copy">尚未逐项核实专利清单。</p>'}${appealDetail(c)}<h3>其他关联程序与共同专利</h3><div class="related-buttons">${related.map(id=>`<button data-case="${esc(id)}">${esc(id)} ↗</button>`).join('')||'<span class="subtle">暂无已记录关联</span>'}</div><p class="subtle">下面这些案件可能涉及共同专利或其他程序联系，不表示它们是本案的原审或上诉，也不表示已合并。</p>${workbookDetail(c)}<h3>本地证据索引</h3>${(c.localEvidence||[]).map(e=>`<div class="detail-block local-source">${esc(e.file)}<small>共 ${e.pages} 页 · ${esc(e.note)}</small></div>`).join('')||'<p class="subtle">本案未匹配已读取的本地案卷。</p>'}<h3>在线证据 / 复核入口</h3>${c.sources.map(s=>`<a class="source-link" href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.label)} ↗<small>${esc(new URL(s.url).hostname)}</small></a>`).join('')}<p class="detail-copy">检索日：${data.asOf}。记录截至日期与检索日期不同；公开索引可能滞后。公司名按集团归一，正式名称以原件为准。</p>`;
 if(!$('#detail').open){returnFocus=document.activeElement;$('#detail').showModal();}$('#detail').scrollTop=0;$('#close-detail').focus();
}
function reset(){timelineCase='';timelineKind='';timelineView='key';timelineLimit=12;Object.assign(state,{type:'全部',company:'',role:'any',search:'',patent:'',page:1,sort:'date'});syncControls();render()}
function syncControls(){['search','company','role','sort'].forEach(k=>$('#'+k).value=state[k]);}
function toast(text){$('#toast').textContent=text;$('#toast').style.display='block';setTimeout(()=>$('#toast').style.display='none',2800)}
function download(){const rows=filtered();const payload={...data,cases:rows,filters:{...state},exportedAt:new Date().toISOString()};const url=URL.createObjectURL(new Blob([JSON.stringify(payload,null,2)],{type:'application/json;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='oura-us-patent-cases-'+data.asOf+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);toast(`已导出 ${rows.length} 份案卷，包含来源与核验限制`)}
function init(){
 document.title='Oura 美国专利诉讼 · RINGWATCH';
 $('.eyebrow').textContent='OURA · U.S. PATENT LITIGATION';
 $('h1').innerHTML='Oura 美国专利诉讼<span>研究看板</span>';
 $('.page-heading p').textContent='连接 PTAB、337、地区法院与上诉，追踪每一项专利争议。';
 $('.topbar>div').innerHTML='知识产权情报 <span>/</span> 美国专利 <span>/</span> <b>Oura</b>';
 $('.top-status').innerHTML='<i></i> 案卷研究快照 · 2026.10.30';
 $('.profile small').textContent='本地案卷 + 公开来源';
 $('footer span').textContent='美国专利争议 / 公开记录研究快照';
 $('#info').innerHTML=`<h2 id="info-title">检索范围与数据边界</h2><p>${esc(data.scope)}</p>${data.limitations.map(t=>`<p>• ${esc(t)}</p>`).join('')}<p>风险均为待评估，未用案件胜负自动打分。页面无需登录即可在本机运行；本站没有自动抓取或后台更新服务。</p><button class="primary" id="close-info">关闭说明</button>`;
 $('#role').insertAdjacentHTML('beforeend','<option value="intervenor">介入人</option>');
 const companies=[...new Set(data.cases.flatMap(c=>[...c.plaintiff,...c.defendant,...c.intervenor]))].sort();$('#company').innerHTML='<option value="">全部公司</option>'+companies.map(c=>`<option>${esc(c)}</option>`).join('');
 const params=new URLSearchParams(location.search);for(const k of ['type','company','role','search','patent','sort'])if(params.has(k))state[k]=params.get(k);if(!groups.includes(state.type))state.type='全部';if(!companies.includes(state.company))state.company='';if(!['any','plaintiff','defendant','intervenor'].includes(state.role))state.role='any';state.sort='date';
 const leads=document.createElement('section');leads.className='panel';leads.id='related-leads';leads.innerHTML='<div class="panel-heading"><div><h2>关联程序与待核实线索</h2><p>工作簿另列3条；不计入Oura直接角色程序及上方筛选统计。</p></div></div><div class="patent-list">'+data.relatedLeads.map(c=>'<article class="patent-card"><div class="patent-id">'+esc(c.type)+' · '+esc(c.id)+'</div><h3>'+esc(c.patent)+'</h3><p>'+esc(c.role)+' · '+esc(c.requester)+'</p><p>状态：'+esc(c.displayStatus||c.status)+'</p><p>关联：'+esc(c.litigation)+'</p><p>'+esc(c.reason)+'</p><p>来源：工作簿 '+esc(c.sheet)+' 第'+c.row+'行</p>'+c.sources.map((url,i)=>'<a class="source-link" href="'+esc(url)+'" target="_blank" rel="noopener noreferrer">来源 '+(i+1)+' ↗</a>').join('')+'</article>').join('')+'</div>';document.querySelector('footer').before(leads);
 syncControls();render();
 ['search','company','role','sort'].forEach(k=>$('#'+k).addEventListener(k==='search'?'input':'change',e=>{state[k]=e.target.value;state.page=1;timelineKind='';timelineLimit=12;render()}));
 document.addEventListener('click',e=>{const t=e.target.closest('[data-type],[data-case],[data-patent]');if(t?.dataset.type){state.type=t.dataset.type;state.page=1;timelineKind='';timelineLimit=12;render()}else if(t?.dataset.case)openDetail(t.dataset.case);else if(t?.dataset.patent){state.patent=state.patent===t.dataset.patent?'':t.dataset.patent;state.page=1;render()}if(e.target.closest('#prev-page')){state.page--;render()}if(e.target.closest('#next-page')){state.page++;render()}});
 document.addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&e.target.matches('g[role=button]')){e.preventDefault();e.target.dispatchEvent(new MouseEvent('click',{bubbles:true}))}});
 $('#timeline-more').onclick=()=>{timelineLimit+=24;renderTimeline(filtered());};
 $('#timeline-case').onchange=e=>{timelineCase=e.target.value;timelineKind='';renderTimeline(filtered());};$('#timeline-kind').onchange=e=>{timelineKind=e.target.value;renderTimeline(filtered());};
 $('#reset').onclick=reset;$('#clear-patent').onclick=()=>{state.patent='';state.page=1;render()};$('#export').onclick=download;
 $('#close-info').onclick=()=>$('#info').close();$('#close-detail').onclick=()=>$('#detail').close();$('#detail').addEventListener('close',()=>returnFocus?.isConnected&&returnFocus.focus());
 for(const d of document.querySelectorAll('dialog'))d.addEventListener('click',e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close()}});
 document.querySelectorAll('nav a').forEach(a=>a.addEventListener('click',()=>{document.querySelectorAll('nav a').forEach(x=>x.classList.toggle('active',x===a))}));
}
init();


