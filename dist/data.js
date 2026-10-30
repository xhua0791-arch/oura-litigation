/* Public-record research snapshot. Null means unverified, never inferred. */
const SOURCE = {
 related:'https://ptacts.uspto.gov/ptacts/public-informations/petitions/1556908/download-documents?artifactId=NG_2u6-1BrWAo_P2G5IA9mBAtVmvDn6LhqxtIZyLJhqrrCj7H6dTMTg',
 disclaimer:'https://ptacts.uspto.gov/ptacts/public-informations/petitions/1556908/download-documents?artifactId=nm4eAwV5xyxFE7rci4cGosJLZcNL0HmailCMGyCxi4NYK_wohvW2IYg',
 og:'https://www.uspto.gov/web/offices/com/sol/og/2024/week35/TOC.htm',
 reexam:'https://exampat.com/owners/ouraring-inc',
 omni:'https://www.uspto.gov/sites/default/files/documents/IPR2025-01253_Samsung_v_Omni_MedSci_DR_Decision.pdf',
 itc1398:'https://www.usitc.gov/secretary/fed_reg_notices/337/337_1398_notice12152025sgl.pdf',
 itc1468:'https://www.usitc.gov/secretary/fed_reg_notices/337/337_1468_notice04282026sgl.pdf',
 itc1478:'https://www.usitc.gov/sites/default/files/secretary/fed_reg_notices/337/337_1478_notice01142026sgl.pdf',
 ringconn:'https://ptacts.uspto.gov/ptacts/public-informations/petitions/1557202/download-documents?artifactId=Ry_Lc3YfXt2yVXbzM7WZfpw7jjo8c_rrp9EZ5uT5jfG5KmM56W4h8QE',
 circular:'https://app.midpage.ai/document/oura-health-oy-v-circular-1000401710863'
};
const cases=[];
function add(id,type,plaintiff,defendant,patents,filed,status,asOf,conclusion,url,extra={}){
 cases.push({id,type,plaintiff:plaintiff.split('|'),defendant:defendant.split('|'),intervenor:[],patents:patents?patents.split('|'):[],filed,status,asOf,conclusion,sources:[{label:/usitc.gov|uspto.gov|govinfo.gov/.test(url)?'官方文件 / 案卷材料':/justia.com/.test(url)?'Justia 案卷索引（非实时）':'公开来源（待原始案卷复核）',url}],risk:'待评估',riskReason:'尚未进行逐项侵权、有效性与救济评估。程序状态不自动转换为风险等级。',claimChange:'未核实修改申请、获准替代权利要求或再审证书；不等同于没有变化。',nextDate:null,nextLabel:'待核实下一关键日期',verified:'案号已收录',related:[],events:[],...extra});
}
const O='Oura', S='Samsung', U='Ultrahuman', R='RingConn', M='Omni MedSci';
add('337-TA-1398','ITC',O,'Ultrahuman|RingConn|Circular','11868178|11868179|10842429','2024-03-13','已作终裁 / 救济后续','2025-12-15','委员会认定违反337并发出排除及停止令；RingConn因和解获撤销相关救济。Ultrahuman的暂缓申请被拒绝。',SOURCE.itc1398,{related:['26-1083','2:23-cv-00396','1:24-cv-01020'],claimChange:'最终救济涉及 ’178 权利要求1、2、12–14。其他原始主张退出不等同于专利文本修改。',events:[['2025-08-21','委员会终裁：违反337'],['2025-12-09','RingConn相关救济撤销'],['2025-12-15','拒绝暂缓救济申请']]});
add('337-TA-1468','ITC',O,'Samsung|Zepp / Amazfit|Reebok|Noise / Nexxbase','11868178|12353244|12346159|12222759','2025-11-18','部分权利要求退出','2026-04-28','已核实部分撤回获准；本次来源未显示全案实体终裁。Nexxbase另以同意令退出。',SOURCE.itc1468,{claimChange:'撤回 ’178 的2、13、14；’244 的3、6、12、13、16；’159的全部涉案权利要求；’759的19。保留 ’178的1、12；’244的1、2、4、5、10、11、14、15；’759的17、18。这是主张范围缩减，不是修改授权文本。',related:['2:25-cv-01064','2:25-cv-01126','2:25-cv-01127','2:25-cv-01129'],events:[['2025-12-22','调查立案（联邦公报）'],['2026-04-28','22项权利要求退出调查']]});
add('337-TA-1478','ITC',S,O,'','2025-12-15','立案已核实 / 后续待更新','2026-01-14','Samsung针对Oura提起337调查；立案不构成侵权或有效性结论。',SOURCE.itc1478,{related:['2:25-cv-01181'],events:[['2026-01-14','委员会决定立案']]});
const dc=(id,p,d,pat,date,status,asOf,result,url,extra={})=>add(id,'District Court',p,d,pat,date,status,asOf,result,url,{court:id.startsWith('6:')?'W.D. Tex.':id.startsWith('3:')?'N.D. Cal.':id.startsWith('1:')?'D. Del.':'E.D. Tex.',...extra});
dc('6:22-cv-00478',O,'Circular','10893833|10842429','2022-05-11','停审动议已核实 / 后续待查','2024-04-22','双方申请因1398调查停审；后续终结状态须以法院案卷核实。',SOURCE.circular,{related:['337-TA-1398']});
dc('6:23-cv-00421','ConnectQuest',O,'9219979|9998906|9674688|8831642','2023-06-06','索引报告有偏见撤诉','2024-04-30','公开索引报告 dismissed with prejudice；未取得终结命令全文。','https://www.patsnap.com/resources/blog/litigation/connectquest-v-oura-health-proximity-patent-dispute-settled-patsnap-eureka/');
dc('6:23-cv-00422','ConnectQuest',O,'','2023-06-06','已立案 / 后续待查','2023-07-05','与00421是不同案号；不能合并或把另一案结论移植至本案。','https://dockets.justia.com/docket/texas/txwdce/6%3A2023cv00422/1172743561');
dc('2:23-cv-00396',O,U,'10893833|10842429|11868178|11868179','2023-09-01','关联337 / 后续待查','2024-08-02','法院公开意见讨论与1398调查相关的停审问题；最新案卷尚待复核。','https://www.govinfo.gov/content/pkg/USCOURTS-txed-2_23-cv-00396/pdf/USCOURTS-txed-2_23-cv-00396-0.pdf',{related:['337-TA-1398']});
dc('3:24-cv-03245',S,O,'11868178|11868179|11599147|10893833|10842429','2024-05-30','确认之诉被驳回','2025-03-27','因未建立实际争议而驳回；不应解读为侵权或专利有效性的实体胜诉。','https://cases.justia.com/federal/district-courts/california/candce/3%3A2024cv03245/430276/57/0.pdf',{related:['25-1871'],events:[['2025-03-27','法院准许驳回动议']]});
dc('1:24-cv-01020',O,R,'11868178|11188124','2024-09-10','关联和解 / 法院结案待核','2025-12-09','案号与专利关联由PTAB通知确认；RingConn和解不自动替代地区法院结案命令。',SOURCE.ringconn,{related:['337-TA-1398','IPR2025-00147']});
dc('2:24-cv-01070',M,'Samsung|Fossil|OnePlus|Oura','9055868|9651533|10517484|10874304|11160455|12193790|12268475','2024-12-20','Oura后续分案','2026-03-31','法院采纳有关Oura驳回动议的报告；后续独立案号00289须一并追踪。','https://www.govinfo.gov/app/details/USCOURTS-txed-2_24-cv-01070/context',{related:['2:26-cv-00289','2:25-cv-00483']});
dc('2:25-cv-00483',M,'Samsung|Fossil|OnePlus|Oura','12268475','2025-05-05','索引显示终结记录','2025-06-18','案卷索引有终结AO120记录；终结原因与合并关系须核对命令。','https://dockets.justia.com/docket/texas/txedce/2%3A2025cv00483/237713',{related:['2:24-cv-01070']});
dc('2:25-cv-00928',O,'Ultrahuman|SVTronics','12393228|12393229|12399530|12399531|12222759','2025-09-03','侵权起诉 / 后续待查','2025-09-03','针对Ultrahuman及SVTronics的独立诉讼；起诉附件列出五件专利。','https://dockets.justia.com/docket/texas/txedce/2%3A2025cv00928/240247',{related:['2:26-cv-00953']});
dc('2:25-cv-01064',O,S,'','2025-10-23','已提出停审动议','2026-01-13','Samsung提出等待ITC裁决的停审动议；动议本身不代表法院已准许。','https://dockets.justia.com/docket/texas/txedce/2%3A2025cv01064/241366',{related:['337-TA-1468','2:25-cv-01181']});
dc('2:25-cv-01107','Encelion',O,'','2025-11-06','无偏见撤诉','2025-12-10','法院命令 dismissed without prejudice。未记录实体侵权裁判。','https://dockets.justia.com/docket/texas/txedce/2%3A2025cv01107/241623',{events:[['2025-12-10','无偏见撤诉命令']]});
dc('2:25-cv-01126',O,'Zepp / Amazfit','','2025-11-17','侵权起诉 / 后续待查','2025-11-17','针对Helio Ring的专利案件；另有Zepp反向起诉。','https://npe.law.stanford.edu/party/ouraring-inc',{related:['337-TA-1468','2:26-cv-00316']});
dc('2:25-cv-01127',O,'Noise / Nexxbase','','2025-11-17','侵权起诉 / 后续待查','2025-11-18','地区法院程序须单独核查，不能以ITC同意令推定其终结。','https://dockets.justia.com/docket/texas/txedce/2%3A2025cv01127/241842',{related:['337-TA-1468']});
dc('2:25-cv-01129',O,'Reebok','','2025-11-17','侵权起诉 / 后续待查','2025-11-17','针对Reebok等当事方的独立地区法院案件。','https://dockets.justia.com/docket/texas/txedce/2%3A2025cv01129/241844',{related:['337-TA-1468']});
dc('2:25-cv-01181',S,O,'7662065|9008973|12324655','2025-12-01','部分驳回动议已提出','2026-02-27','Oura对三件专利提出适格性驳回动议；此处专利列表仅为已核实部分。','https://dockets.justia.com/docket/texas/txedce/2%3A2025cv01181/242113',{related:['337-TA-1478','2:25-cv-01064']});
dc('2:26-cv-00289',M,'Oura|Fossil|OnePlus','','2026-04-10','审前程序（索引截至10月5日）','2026-10-05','案卷记载审前动议裁定及最终审前会议安排；后续改期或裁判需再核查。','https://dockets.justia.com/docket/texas/txedce/2%3A2026cv00289/244991',{related:['2:24-cv-01070'],nextDate:'2026-11-17',nextLabel:'最终审前会议 · 13:30（法院当地时间；待复核改期）',events:[['2026-09-29','召开初次审前会议'],['2026-10-05','公开审前会议笔录及动议记录']]});
dc('2:26-cv-00316','Zepp / Amazfit',O,'8781610|8989441|9729693|10959649|11806120|10624575','2026-04-21','已撤诉','2026-07-14','Zepp自愿撤诉，法院于7月13日签署命令，7月14日登记；不等于双方全部争议结束。','https://dockets.justia.com/docket/texas/txedce/2%3A2026cv00316/245237',{related:['2:25-cv-01126'],events:[['2026-07-14','撤诉命令登记']]});
dc('2:26-cv-00953',O,'Ultrahuman|SVTronics','D804471|12769363','2026-10-22','新起诉 / 尚无实体结论','2026-10-22','新案针对Ring Pro。案号见法院索引；专利号见公开报道，尚待起诉状原件逐项复核。','https://dockets.justia.com/docket/texas/txedce/2%3A2026cv00953/250470',{related:['2:25-cv-00928'],sources:[{label:'Justia 案卷索引',url:'https://dockets.justia.com/docket/texas/txedce/2%3A2026cv00953/250470'},{label:'Wareable：专利号线索（非裁判）',url:'https://www.wareable.com/wearable-tech/oura-ultrahuman-smart-ring-pro-lawsuit-alleged-patent-infringement'}],events:[['2026-10-22','Ring Pro专利侵权案起诉']]});
const ptab=[
 ['IPR2024-00928','9582034','2024-05-31','已立案 / 终局待复核'],
 ['IPR2024-00929','10893833','2024-05-31','放弃被挑战权利要求 / 不立案','1–12'],
 ['IPR2024-00930','11599147','2024-05-31','放弃被挑战权利要求 / 不立案','1–22'],
 ['PGR2024-00030','11868178','2024-05-31','终局决定 / 已上诉'],
 ['PGR2024-00031','11868179','2024-05-31','放弃被挑战权利要求 / 不立案','1–16'],
 ['IPR2024-01077','10139859','2024-06-28','终局决定 / 细节待复核'],
 ['IPR2024-01078','10281953','2024-06-28','已立案 / 修改程序待核'],
 ['IPR2024-01079','10281953','2024-06-28','放弃被挑战权利要求 / 不立案','16–18、20–21、23–24、30–35、37'],
 ['IPR2024-01080','10842429','2024-06-28','放弃被挑战权利要求 / 不立案','1–6'],
 ['PGR2024-00038','11874701','2024-06-28','放弃被挑战权利要求 / 不立案','1–20'],
 ['PGR2024-00039','11874702','2024-06-28','终局决定 / 已上诉'],
 ['IPR2025-00147','11188124',null,'终局决定 / 原文待复核']
];
for(const [id,pat,filed,status,disclaimed] of ptab){add(id,id.slice(0,3),S,O,pat,filed,status,null,disclaimed?'官方案卷所载关联决定确认：因放弃全部被挑战权利要求而不立案，不应计为专利有效性胜诉。':'官方关联案件记录确认本程序存在；完整终局、上诉及证书状态须按本案原始记录复核。',SOURCE.related,{claimChange:disclaimed?`法定放弃权利要求 ${disclaimed}。详见所链申请书对Ex.2001的引用；不属于以替代文本修改。`:'未核实获准替代文本及证书；需要核对该案Motion to Amend与最终命令。',sources:[{label:'USPTO托管：关联程序与决定',url:SOURCE.related},{label:'USPTO托管：法定放弃范围引用',url:SOURCE.disclaimer}]});}
function amend(id,values){Object.assign(cases.find(c=>c.id===id),values)}
amend('PGR2024-00039',{asOf:'2025-12-05',conclusion:'最终书面决定：未证明被挑战权利要求1–17不可专利。公开版本登记于12月10日；上诉另案记录。',related:['26-1413'],events:[['2025-12-05','最终书面决定：未证明被挑战权利要求不可专利']]});
amend('PGR2024-00030',{related:['26-1258','337-TA-1398'],conclusion:'公开索引确认最终书面决定已被上诉；逐项权利要求结论待终局原文复核。',sources:[{label:'USPTO关联记录',url:SOURCE.related},{label:'公开程序索引',url:'https://ai-lab.exparte.com/case/ptab/PGR2024-00030/samsung-electronics-co-ltd-v-ouraring-inc'}]});
amend('IPR2024-01078',{sources:[{label:'USPTO：涉及替代权利要求的程序文件',url:'https://ptacts.uspto.gov/ptacts/public-informations/petitions/1556250/download-documents?artifactId=c4uTEgcP7H1AHN_wPEffv8-l2efOtjXcRELR0GMjeVzAmgGiNU1V5Xg'},{label:'USPTO申请公告',url:SOURCE.og}],claimChange:'检索到涉及proposed substitute claims的程序文件。尚未核实最终获准文本，不把拟议替代权利要求标为生效。'});
for(const [id,p] of [['IPR2025-00411',U],['IPR2025-00412',R],['PGR2025-00018',R]])add(id,id.slice(0,3),p,O,'11868178',null,'酌情拒绝立案','2025-06-25','关联终局决定记载三项请求于2025年6月25日被酌情拒绝。并非对全部专利有效性的实体判决。',SOURCE.related,{related:['337-TA-1398','PGR2024-00030'],events:[['2025-06-25','酌情拒绝立案']]});
const omniPetitions=[['IPR2025-01249','9055868','1558164','fd5c4TTmUwfDE6trruLeONNA8Wcplm0YUiLAZcLkWT5Ol9gSBFC6Ksg'],['IPR2025-01250','9651533','1558163','QRIRNyvxKjWB_GXDzD3-B2KPWlNQnLrkzT14VHaXiEFXcm55LoxtcDg'],['IPR2025-01251','10874304','1558165','tGRybMNISdT7Lh7JODsfvHM-XpTUq8kQe-ameHNTLLlyaPAxwhE2kys'],['IPR2025-01252','11160455','1558166','osFIeyxY6cwn7av98HcbRvoXwKKjxXsadICWjmEL2Hx-M_1nQF0v48A'],['IPR2025-01254','12268475','1558166','HBXQOfJ1wME-IttA0hZzDdjjIgFVSfZTy3lLwjuswTR7NNpYF-cH5Ug'],['PGR2025-00063','12268475','1558191','Ir-cZXQlmajCJrgPOcF-QL-mdlqix9OehSfeKyLCXTK6iaKzsllcKC4']];
for(const [id,pat,n,a] of omniPetitions)add(id,id.slice(0,3),'Samsung|Fossil|Oura|OnePlus',M,pat,null,'请求已核实 / 最新决定待核',null,'Oura为联合申请人。已核实申请人、案号与专利；不据申请书推定立案或最终结论。',`https://ptacts.uspto.gov/ptacts/public-informations/petitions/${n}/download-documents?artifactId=${a}`,{related:['2:24-cv-01070','2:26-cv-00289']});
add('IPR2025-01253','IPR','Samsung|Fossil|Oura|OnePlus',M,'12193790',null,'撤销立案 / 拒绝请求','2026-05-14','Director因涉案专利具备PGR适格性撤销IPR立案并拒绝请求；与另一申请人的PGR2026-00003有关，后者不作为Oura当事方案件计数。',SOURCE.omni,{related:['PGR2025-00064','2:24-cv-01070'],events:[['2026-05-14','Director撤销IPR立案并拒绝请求']]});
add('PGR2025-00064','PGR','Samsung|Fossil|Oura|OnePlus',M,'12193790',null,'拒绝立案','2026-05-14','Director文件记载此前按申请人排序准许IPR、拒绝平行PGR；IPR后被撤销并不意味着本PGR自动恢复。',SOURCE.omni,{related:['IPR2025-01253']});
for(const [id,date,status,asOf,related] of [['25-1871','2025-06-18','自愿撤回上诉','2025-08-15',['3:24-cv-03245']],['26-1258','2025-12-17','书面审理 / 后续待核','2026-05-18',['PGR2024-00030','26-1413']],['26-1410','2026-02-05','合并上诉 / 后续待核','2026-07-16',['26-1411','26-1083']],['26-1411','2026-02-05','并入26-1410','2026-03-18',['26-1410']],['26-1413','2026-02-05','并入26-1258','2026-03-17',['26-1258','PGR2024-00039']]])add(id,'CAFC',S,O,'',date,status,asOf,id==='25-1871'?'法院准许依FRAP 42(b)撤回上诉并签发mandate；不是实体维持判决。':'公开案卷显示上述程序进展；本快照未核实最新实体裁判。合并案仍按原案号列示。',`https://dockets.justia.com/docket/circuit-courts/cafc/${id}`,{related});
add('26-1083','CAFC',U,'USITC','11868178','2025-10-22','上诉 / 暂缓申请被拒','2026-03-31','挑战1398终裁；Oura是介入人。与26-1258、26-1410交由同一合议庭处理。','https://dockets.justia.com/docket/circuit-courts/cafc/26-1083',{intervenor:[O],related:['337-TA-1398','26-1258','26-1410'],events:[['2025-10-22','Ultrahuman提起上诉'],['2026-03-11','指定关联上诉共同审理']]});
const eprs=[['90/016,588','12393229','2026-09-15',U],['90/016,561','12399530','2026-09-03',U],['90/016,560','12399531','2026-09-02',U],['90/016,519','12429909','2026-08-10',S],['90/016,517','12393227','2026-08-10',S],['90/016,518','12422889','2026-08-10',S],['90/016,516','12346160','2026-08-10',S],['90/016,512','12393228','2026-08-06',U],['90/016,380','12222759','2026-06-05',U],['90/016,261','12222759','2026-05-08',S],['90/016,260','12346159','2026-05-08',S],['90/016,231','12353244','2026-05-01',S],['90/015,985','11868178','2026-02-23',U]];
for(const [id,pat,date,p] of eprs)add(id,'EPR',p,O,pat,date,'再审索引收录 / 原件待核',null,'公开索引所列单方再审；属于USPTO审查程序，不等同PTAB的IPR/PGR。尚未核实官方最新审查意见、修改答复及再审证书。',SOURCE.reexam,{verified:'二级索引线索',sources:[{label:'ExamPat：再审案号与请求人索引',url:SOURCE.reexam},{label:'USPTO Patent Center：按控制号复核',url:'https://patentcenter.uspto.gov/'}]});

// Reconciled with user-provided local docket exports; no source PDFs are hosted.
dc('6:22-cv-00868','Healthness',O,'6445298|6696957','2022-08-19','已撤诉 / 结案','2022-10-25','10月24日提交自愿撤诉通知，25日法院签署结案命令；案卷未提供实体侵权裁判。','https://pacer.uscourts.gov/');
dc('2:23-cv-00598','Gamehancement',O,'7849619','2023-12-13','无偏见撤诉','2024-03-07','法院依据Rule 41(a)(1)(A)(i)确认全部请求无偏见撤诉。','https://pacer.uscourts.gov/');
dc('6:23-cv-00423','ConnectQuest',O,'9219980|9219981|9628949|9693190','2023-06-06','和解后撤诉 / 结案','2024-04-30','3月通知和解，4月30日法院准许共同撤诉；独立案号单独计数。','https://pacer.uscourts.gov/');
add('26-2079','CAFC',S,O,'11188124','2026-07-27','上诉书面程序','2026-09-08','公开案卷记载9月8日接收认证记录清单；尚未核实实体裁判。','https://dockets.justia.com/docket/circuit-courts/cafc/26-2079',{related:['IPR2025-00147']});
amend("1:24-cv-01020",{"status": "已自愿撤诉 / 结案", "asOf": "2025-10-14", "conclusion": "案卷第12项记载Oura自愿撤诉，同日登记CASE CLOSED。未据此推定实体侵权或有效性结论。", "events": [["2025-10-14", "自愿撤诉并结案"]]});
amend("6:22-cv-00478",{"status": "已结案", "asOf": "2024-06-28", "conclusion": "法院解除停审并准许双方终结案件：Oura请求以有偏见方式撤销，Circular反请求以无偏见方式撤销；各自承担费用。", "events": [["2024-06-28", "解除停审并结案"]]});
amend("6:23-cv-00421",{"status": "和解后撤诉 / 结案", "asOf": "2024-04-30", "conclusion": "3月通知和解，4月30日法院准许共同撤诉动议。"});
amend("6:23-cv-00422",{"status": "和解后撤诉 / 结案", "asOf": "2024-04-30", "patents": ["9219990", "9681264"], "conclusion": "独立案号；3月通知和解，4月30日法院准许共同撤诉动议。"});
amend("2:25-cv-01126",{"status": "无偏见撤诉", "asOf": "2026-07-29", "conclusion": "案卷第25项记载法院于7月29日准许无偏见撤诉；此前因337程序停审。", "events": [["2026-07-29", "无偏见撤诉"]]});
amend("2:25-cv-01129",{"status": "无偏见撤诉", "asOf": "2026-07-29", "conclusion": "案卷第26项记载法院于7月29日准许无偏见撤诉；不将此结果移植到其他当事方案件。", "events": [["2026-07-29", "无偏见撤诉"]]});
amend("2:25-cv-01064",{"status": "双方侵权请求均停审", "asOf": "2026-02-12", "conclusion": "法院1月14日准许暂停Oura侵权请求，2月12日准许暂停Samsung侵权反请求，等待相关ITC程序。", "events": [["2026-01-14", "Oura侵权请求停审"], ["2026-02-12", "Samsung侵权反请求停审"]]});
amend("2:25-cv-01181",{"status": "证据开示 / 部分驳回动议待决", "asOf": "2026-07-22", "conclusion": "修正起诉及答辩反诉已提交，4月修订排期；续行适格性动议针对7662065及9008973。所读案卷未见实体终局。"});
amend("2:25-cv-00483",{"status": "无偏见撤诉", "asOf": "2025-06-18", "conclusion": "6月17日签署、6月18日登记准许无偏见撤诉的命令。"});
amend("2:26-cv-00289",{"asOf": "2026-10-13", "status": "审前程序", "conclusion": "本地案卷已更新至10月13日；记载审前会议、证据相关动议及补充证言通知。尚未核实实体终局。"});
amend("2:23-cv-00396",{"asOf": "2026-07-01", "patents": ["10893833", "10842429"], "status": "停审 / 听证及陪审团日期已取消或延期", "conclusion": "2024年专利停审命令后，2025年3月版权请求也停审；5月权利要求解释听证取消，11月陪审团选择延期。地区法院专利列表不混入关联337的另外两项专利。"});
amend("2:25-cv-00928",{"asOf": "2026-10-23", "status": "证据开示 / 争点陈述获准修订", "conclusion": "8月31日准许修订侵权争点陈述，10月23日准许修订无效争点陈述；这些程序决定不构成实体胜诉。", "claimChange": "案卷记录修订侵权及无效争点陈述获准；属于诉讼主张变化，不能视为授权专利权利要求文本已修改。", "events": [["2026-08-31", "准许修订侵权争点陈述"], ["2026-10-23", "准许修订无效争点陈述"]]});
amend("337-TA-1468",{"asOf": "2026-10-20", "status": "听证后书面陈述阶段", "conclusion": "本地案卷记载9月2日双方提交听证后答复；10月20日仍有代理人变更记录。未取得全案终裁；部分权利要求撤回见4月28日官方公告。"});
amend("337-TA-1478",{"asOf": "2026-10-22", "status": "听证后 / 部分专利退出", "patents": ["10642359", "10945677", "10231675", "10978789"], "conclusion": "10月7日委员会不复审终止全部677涉案权利要求的初裁；本地案卷10月22日记载Samsung提交听证后开篇陈述。未取得全案实体终裁。", "claimChange": "全部10945677涉案权利要求退出；其他专利也存在部分主张撤回。调查主张缩减不等于修改专利文本。"});
amend("IPR2025-00147",{"filed": "2025-01-23", "asOf": "2026-07-22", "status": "最终书面决定 / 已提起上诉", "related": ["26-2079", "1:24-cv-01020"], "conclusion": "7月10日最终书面决定：未证明被挑战权利要求1–6、8–20不可专利。7月22日提交上诉通知。"});
amend("IPR2025-00411",{"filed": "2025-01-06"});
amend("IPR2025-00412",{"filed": "2025-01-06"});
amend("PGR2025-00018",{"filed": "2025-01-03"});
amend("IPR2024-01078",{"claimChange": "排期命令列出拟议替代权利要求的通用程序；该记载不能证明实际提出修改，更不能证明获准。最终文本及证书待核。", "status": "终局及上诉线索 / 原文待核"});
amend("1:24-cv-01020",{"localEvidence": [{"file": "1_24cv1020_ Ouraring_ Inc. V. Ringconn Llc\\Ouraring, Inc. V. Ringconn Llc.pdf", "pages": 3, "note": "用户提供的CourtLink案卷导出；未上传原始文件。"}]});
amend("2:23-cv-00598",{"localEvidence": [{"file": "223cv598_ Gamehancement Llc V. Oura Health Oy\\Gamehancement Llc V. Oura Health Oy.pdf", "pages": 2, "note": "用户提供的CourtLink案卷导出；未上传原始文件。"}]});
amend("2:25-cv-01107",{"localEvidence": [{"file": "225cv1107, Encelion Lic V. Oura Health Oy\\Encelion Llc V. Oura Health Oy.pdf", "pages": 2, "note": "用户提供的CourtLink案卷导出；未上传原始文件。"}]});
amend("2:26-cv-00289",{"localEvidence": [{"file": "226cv289, Omni Medsci, Inc. V. Oura Health Oy\\Omni Medsci, Inc. V. Oura Health Oy.pdf", "pages": 25, "note": "用户提供的CourtLink案卷导出；未上传原始文件。"}]});
amend("2:26-cv-00316",{"localEvidence": [{"file": "226cv316, Zepp Inc. Et Al V. Oura Health Oy\\Zepp Inc. Et Al V. Oura Health Oy.pdf", "pages": 6, "note": "用户提供的CourtLink案卷导出；未上传原始文件。"}]});
amend("2:25-cv-01126",{"localEvidence": [{"file": "2_25cv1126_ Ouraring Inc. V. Zepp Health Corporation\\Ouraring Inc. V. Zepp Health Corporation.pdf", "pages": 5, "note": "用户提供的CourtLink案卷导出；未上传原始文件。"}]});
amend("2:25-cv-01127",{"localEvidence": [{"file": "2_25cv1127_ Ouraring Inc. V. Nexxbase Marketing Pvt. Ltd\\Ouraring Inc. V. Nexxbase Marketing Pvt. Ltd.pdf", "pages": 4, "note": "用户提供的CourtLink案卷导出；未上传原始文件。"}]});
amend("2:25-cv-01129",{"localEvidence": [{"file": "2_25cv1129_ Ouraring Inc. V. Reebok International Limited Et Al\\Ouraring Inc. V. Reebok International Limited Et Al.pdf", "pages": 6, "note": "用户提供的CourtLink案卷导出；未上传原始文件。"}]});
amend("6:22-cv-00478",{"localEvidence": [{"file": "622cv478, Oura Health Oy V. Circular Sas\\Oura Health Oy V. Circular Sas.pdf", "pages": 11, "note": "用户提供的CourtLink案卷导出；未上传原始文件。"}]});
amend("6:22-cv-00868",{"localEvidence": [{"file": "622cv868Healthness Llc V. Oura Health Oy\\Healthness Llc V. Oura Health Oy.pdf", "pages": 2, "note": "用户提供的CourtLink案卷导出；未上传原始文件。"}]});
amend("6:23-cv-00421",{"localEvidence": [{"file": "Connectquest\\623cv421, Connectquest LIC V. Oura Health Oy\\Connectquest Llc V. Oura Health Oy(2).pdf", "pages": 10, "note": "用户提供的CourtLink案卷导出；未上传原始文件。"}]});
amend("6:23-cv-00422",{"localEvidence": [{"file": "Connectquest\\623cy422, Connectquest LIC V. Oura Health Oy\\Connectquest Llc V. Oura Health Oy.pdf", "pages": 10, "note": "用户提供的CourtLink案卷导出；未上传原始文件。"}]});
amend("6:23-cv-00423",{"localEvidence": [{"file": "Connectquest\\623cy423, Connectquest LIC V. Oura Health Oy\\Connectquest Llc V. Oura Health Oy(3).pdf", "pages": 10, "note": "用户提供的CourtLink案卷导出；未上传原始文件。"}]});
amend("IPR2024-01080",{"localEvidence": [{"file": "IPR\\IPR2024-01080_ Samsung Electronics Co._ Ltd. et al. Vs. Oura Health Oy et al\\Samsung Electronics Co., Ltd. et al. Vs. Oura Health Oy et al.pdf", "pages": 6, "note": "用户提供的CourtLink案卷导出；未上传原始文件。"}]});
amend("IPR2025-00147",{"localEvidence": [{"file": "IPR\\IPR2025-00147_ Samsung Electronics Co._ Ltd. et al. Vs. Ouraring_ Inc. et al\\Samsung Electronics Co., Ltd. et al. Vs. Ouraring, Inc. et al.pdf", "pages": 75, "note": "用户提供的CourtLink案卷导出；未上传原始文件。"}]});
amend("IPR2025-00411",{"localEvidence": [{"file": "IPR\\IPR2025-00411_ Ultrahuman Healthcare PVT. LTD et al. Vs. Ouraring Inc. et al\\Ultrahuman Healthcare PVT. LTD et al. Vs. Ouraring Inc. et al.pdf", "pages": 14, "note": "用户提供的CourtLink案卷导出；未上传原始文件。"}]});
amend("IPR2025-00412",{"localEvidence": [{"file": "IPR\\IPR2025-00412_ RingConn LLC Vs. Ouraring Inc. et al\\RingConn LLC Vs. Ouraring Inc. et al.pdf", "pages": 13, "note": "用户提供的CourtLink案卷导出；未上传原始文件。"}]});
amend("PGR2024-00030",{"localEvidence": [{"file": "IPR\\PGR2024-00030_ Samsung Electronics Co._ Ltd. et al. Vs. Oura Health Oy et al\\PGR2024-00030, Samsung Electronics Co., Ltd. et al. Vs. Oura Health Oy et al.pdf", "pages": 69, "note": "用户提供的CourtLink案卷导出；未上传原始文件。"}]});
amend("PGR2024-00039",{"localEvidence": [{"file": "IPR\\PGR2024-00039_ Samsung Electronics Co._ Ltd. et al. Vs. Oura Health Oy et al\\PGR2024-00039, Samsung Electronics Co., Ltd. et al. Vs. Oura Health Oy et al.pdf", "pages": 72, "note": "用户提供的CourtLink案卷导出；未上传原始文件。"}]});
amend("PGR2025-00018",{"localEvidence": [{"file": "IPR\\PGR2025-00018_ RingConn_ LLC Vs. Ouraring Inc. et al\\RingConn, LLC Vs. Ouraring Inc. et al.pdf", "pages": 13, "note": "用户提供的CourtLink案卷导出；未上传原始文件。"}]});
amend("337-TA-1398",{"localEvidence": [{"file": "ITC\\337-TA-1398_ Smart Wearable Devices_ Systems_ and Components Thereof\\Smart Wearable Devices, Systems, and Components Thereof.pdf", "pages": 85, "note": "用户提供的CourtLink案卷导出；未上传原始文件。"}]});
amend("337-TA-1478",{"localEvidence": [{"file": "ITC\\337-TA-1478_ Certain Wearable Devices\\Certain Wearable Devices.pdf", "pages": 35, "note": "用户提供的CourtLink案卷导出；未上传原始文件。"}]});
amend("2:24-cv-01070",{"localEvidence": [{"file": "samsung\\224cv1070_ Omni Medsci_ Inc. V. Samsung Electronics_ Co. Ltd. Et Al\\Omni Medsci, Inc. V. Samsung Electronics, Co. Ltd. Et Al.pdf", "pages": 61, "note": "用户提供的CourtLink案卷导出；未上传原始文件。"}]});
amend("2:25-cv-01064",{"localEvidence": [{"file": "samsung\\225cv1064, Ouraring Inc. V. Samsung Electronics America, Inc\\Ouraring Inc. V. Samsung Electronics America, Inc.pdf", "pages": 14, "note": "用户提供的CourtLink案卷导出；未上传原始文件。"}]});
amend("2:25-cv-01181",{"localEvidence": [{"file": "samsung\\225cv1181, Samsung Electronics Co., Ltd. Et Al V.Oura Health Oy\\Samsung Electronics Co., Ltd.  Et Al V. Oura Health Oy.pdf", "pages": 22, "note": "用户提供的CourtLink案卷导出；未上传原始文件。"}]});
amend("2:25-cv-00483",{"localEvidence": [{"file": "samsung\\225cv483_ Omni Medsci_ Inc. V. Samsung Electronics_ Co. Ltd. Et Al\\Omni Medsci, Inc. V. Samsung Electronics, Co. Ltd. Et Al.pdf", "pages": 2, "note": "用户提供的CourtLink案卷导出；未上传原始文件。"}]});
amend("25-1871",{"localEvidence": [{"file": "samsung\\25-1871_ Samsung Electronics Corporation_ Ltd. v. Oura Health Oy\\Samsung Electronics Corporation, Ltd. v. Oura Health Oy.pdf", "pages": 5, "note": "用户提供的CourtLink案卷导出；未上传原始文件。"}]});
amend("3:24-cv-03245",{"localEvidence": [{"file": "samsung\\324cv3245_ Samsung Electronics Corporation_ Ltd. Et Al V. Oura Health Oy Et Al\\Samsung Electronics Corporation, Ltd. Et Al V. Oura Health Oy Et Al.pdf", "pages": 11, "note": "用户提供的CourtLink案卷导出；未上传原始文件。"}]});
amend("26-1083",{"localEvidence": [{"file": "ultrahuman\\26-1083_ Ultrahuman Healthcare Pvt. Ltd. v. ITC\\Ultrahuman Healthcare Pvt. Ltd. v. ITC.pdf", "pages": 14, "note": "用户提供的CourtLink案卷导出；未上传原始文件。"}]});
amend("337-TA-1468",{"localEvidence": [{"file": "ITC\\337-TA-1468_ Certain Smart Wearable Devices_ Systems_ and Components Thereof\\337-TA-1468, Certain Smart Wearable Devices, Systems, and Components Thereof.pdf", "pages": 46, "note": "用户提供的CourtLink案卷导出；未上传原始文件。"}]});
amend("2:23-cv-00396",{"localEvidence": [{"file": "ultrahuman\\2_23cv396_ Oura Health Oy Et Al V. Ultrahuman Healthcare Pvt._ Ltd. Et Al\\2_23cv396_ Oura Health Oy Et Al V. Ultrahuman Healthcare Pvt._ Ltd. Et Al.pdf", "pages": 26, "note": "用户提供的CourtLink案卷导出；未上传原始文件。"}]});
amend("2:25-cv-00928",{"localEvidence": [{"file": "ultrahuman\\2_25cv928_ Ouraring_ Inc. V. Ultrahuman Healthcare Llc Et Al\\2_25cv928_ Ouraring_ Inc. V. Ultrahuman Healthcare Llc Et Al.pdf", "pages": 31, "note": "用户提供的CourtLink案卷导出；未上传原始文件。"}]});
amend("2:26-cv-00953",{"localEvidence": [{"file": "ultrahuman\\2_26cv953_ Ouraring Inc. V. Ultrahuman Healthcare Inc. Et Al\\2_26cv953_ Ouraring Inc. V. Ultrahuman Healthcare Inc. Et Al.Pdf", "pages": 2, "note": "用户提供的CourtLink案卷导出；未上传原始文件。"}]});
cases.find(c=>c.id==='337-TA-1478').sources.unshift({label:'USITC：2026-10-07部分终止公告',url:'https://www.usitc.gov/sites/default/files/secretary/fed_reg_notices/337/337_1478_notice10072026sgl.pdf'});

amend("2:25-cv-01126",{patents:["11868178", "12353244", "12346159", "12393227", "12346160", "12422889", "12429909", "12222759"]});
cases.find(c=>c.id==="2:25-cv-01126").localEvidence.push({"file": "2_25cv1126_ Ouraring Inc. V. Zepp Health Corporation\\Ouraring Inc. V. Zepp Health Corporation_Attachment1.pdf", "pages": 88, "note": "起诉状原件：仅据各项COUNT核对原始涉诉专利；不是侵权认定。"});
amend("2:25-cv-01127",{patents:["11868178", "12353244", "12346159", "12393227", "12346160", "12422889", "12429909", "12222759"]});
cases.find(c=>c.id==="2:25-cv-01127").localEvidence.push({"file": "2_25cv1127_ Ouraring Inc. V. Nexxbase Marketing Pvt. Ltd\\Ouraring Inc. V. Nexxbase Marketing Pvt. Ltd._Attachment1.pdf", "pages": 86, "note": "起诉状原件：仅据各项COUNT核对原始涉诉专利；不是侵权认定。"});
amend("2:25-cv-01129",{patents:["11868178", "12353244", "12346159", "12393227", "12346160", "12422889", "12429909", "12222759"]});
cases.find(c=>c.id==="2:25-cv-01129").localEvidence.push({"file": "2_25cv1129_ Ouraring Inc. V. Reebok International Limited Et Al\\Ouraring Inc. V. Reebok International Limited Et Al_Attachment1.pdf", "pages": 143, "note": "起诉状原件：仅据各项COUNT核对原始涉诉专利；不是侵权认定。"});
amend("2:25-cv-01064",{patents:["11868178", "12353244", "12346159", "12393227", "12346160", "12422889", "12429909", "12222759"]});
cases.find(c=>c.id==="2:25-cv-01064").localEvidence.push({"file": "samsung\\225cv1064, Ouraring Inc. V. Samsung Electronics America, Inc\\Ouraring Inc. V. Samsung Electronics America, Inc._Attachment1.pdf", "pages": 83, "note": "起诉状原件：仅据各项COUNT核对原始涉诉专利；不是侵权认定。"});
amend("2:26-cv-00953",{patents:["D804471", "12769363"]});
cases.find(c=>c.id==="2:26-cv-00953").localEvidence.push({"file": "ultrahuman\\2_26cv953_ Ouraring Inc. V. Ultrahuman Healthcare Inc. Et Al\\US_DIS_TXED_2_26cv953_d8618251e326_COMPLAINT_against_SVTronics_Inc_Ultrahuman_Healthc.pdf", "pages": 29, "note": "起诉状原件：仅据各项COUNT核对原始涉诉专利；不是侵权认定。"});
amend('2:25-cv-01181',{patents:['7662065','9008973','12260672','12279849','12324655','12383152']});
cases.find(c=>c.id==='2:25-cv-01181').localEvidence.push({"file": "samsung\\225cv1181, Samsung Electronics Co., Ltd. Et Al V.Oura Health Oy\\Samsung Electronics Co., Ltd.  Et Al V. Oura Health Oy_Attachment1.pdf", "pages": 29, "note": "2025-12-01起诉状第1页列出六件专利；历史主张清单。"});
amend('2:26-cv-00953',{conclusion:'2026年10月22日新案，起诉状两项COUNT分别主张D804471及12769363；尚无实体侵权结论。'});
amend('PGR2024-00030',{asOf:'2025-12-11',conclusion:'2025年11月25日Paper 57：权利要求17、18因不当从属形式被认定不可专利；1–10、12–16未被证明不可专利。12月11日提交上诉通知。',claimChange:'权利要求11已法定放弃；17、18终局认定不可专利。未核实替代文本获准或最终取消证书；上诉仍须独立追踪。',events:[['2025-11-25','最终书面决定：部分不可专利'],['2025-12-11','提交上诉通知']]});
amend("PGR2024-00030",{});cases.find(c=>c.id==="PGR2024-00030").sources.unshift({"label": "PTAB决定全文（公开镜像）", "url": "https://www.casemine.com/judgement/us/69263572d1246a53d608c311"});
amend("IPR2024-00928",{"asOf": "2025-12-02", "status": "最终书面决定", "conclusion": "Paper 36认定被挑战权利要求1–5、11–13、16–18不可专利；后续证书及上诉仍需核对。"});cases.find(c=>c.id==="IPR2024-00928").sources.unshift({"label": "PTAB决定全文（公开镜像）", "url": "https://www.casemine.com/judgement/us/69302ad626590b243424fd06"});
amend("IPR2024-01077",{"asOf": "2025-12-17", "status": "最终书面决定 / 后续上诉待核", "conclusion": "12月15日作出、17日公开的Paper 47未认定被挑战权利要求1、11、13–20不可专利。"});cases.find(c=>c.id==="IPR2024-01077").sources.unshift({"label": "PTAB决定全文（公开镜像）", "url": "https://www.casemine.com/judgement/us/6943f2b2c92f54bb3c631fce"});
amend("IPR2025-00147",{});cases.find(c=>c.id==="IPR2025-00147").sources.unshift({"label": "PTAB决定全文（公开镜像）", "url": "https://app.midpage.ai/document/samsung-electronics-co-ltd-et--6d93f53b-9cba-4b00-89fc-9d9a338b0ce9"});
cases.find(c=>c.id==='IPR2024-01078').sources.push({label:'代理律所：终局结果线索（非裁判原件）',url:'https://www.afslaw.com/attorneys/ehsun-forghany'});
window.RINGWATCH_DATA={asOf:'2026-10-30',cases,scope:'Oura Health Oy / Ouraring Inc. 美国专利争议；含原告、被告、申请人、专利权人及介入人。',limitations:['本地目录含2528份文件；本次读取主要案卷及选定证据，并非逐页审阅全部附件。5个上诉ZIP内的10份文件带非标准TSD文件头，未成功解析；以公开索引补核。','已结合公开检索与本地案卷目录核对，补录独立案号并合并重复目录。尚未完成PACER、EDIS与USPTO全库穷尽检索，不能保证绝无遗漏。','独立案号计数；合并、分案、上诉不去掉原案号，因此不等同独立商业争议数量。','当事方筛选按公司集团归一，正式法人名称与全部共同当事方以所链案卷为准。','部分专利列表只含已核实项目；缺项不代表无涉诉专利。','EPR部分来自二级索引，需按控制号逐一核对原始文件；未将其当作PTAB审判。','排除商标、消费者集体诉讼、印度等非美国案件，以及仅具技术关联但Oura不是当事方的案件。']};
