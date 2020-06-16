const fs=require("fs");
const folder="../pts-dhammakaya/data/";
const {createbuilder}=require("pengine");

const booknames=[
	'','mv','cv','vb1'	,'vb2','pvr' //1~5
	,'dn1','dn2','dn3'//6~8
	,'mn1','mn2','mn3'//9~11
	,'sn1','sn2','sn3','sn4','sn5'//12~16
	,'an1','an2','an3','an4','an5'//17~21
	,'kp','dhp','ud','iti','snp'  // 26
	,'vv','pv', 'thag'            //27,28,29
	,'ja1','ja2','ja3','ja4','ja5','ja6'  //30~35
	,'mnd','cnd','ps1','ps2'              //36,37,38,39
	,'ap'  ,'bv','cp',                  //40,41,42
	,'ds','vb','dt','pp','kv'         //43,44,45,46,47
	,'ya1','ya2'                       // 48,49
	,'pt1','pt2','pt3','pt4','pt5','pt6'//50,51,52,53,54,55
]

const booknames_a={
	1:'vin-a',2:'vin-a',3:'vin-a',4:'vin-a',5:'vin-a',6:'vin-a',7:'vin-a',
	8:'dn-a',9:'dn-a',10:'dn-a',
	12:'mn-a1',13:'mn-a2',14:'mn-a3',15:'mn-a4',16:'mn-a5',
	17:'sn-a1',18:'sn-a2',19:'sn-a3',
	20:'an-a1',21:'an-a2',22:'an-a3',23:'an-a4',24:'an-a5',
	25:'kp-a',26:'dhp-a1',27:'dhp-a2',28:'dhp-a3',29:'dhp-a4',
	30:'ud-a',31:'iti-a1' ,32:'iti-a2', 33:'snp-a',34:'snp-a',
	35:'vv-a',36:'pv-a',37:'thag-a1',38:'thag-a2',39:'thag-a3',
	40:'thig-a', 41:'mnd-a',42:'mnd-a',43:'cnd-a',44:'ps-a',45:'ps-a',46:'ps-a',
	47:'ap-a',48:'bv-a',49:'cp-a',50:'ds-a',51:'vb-a',
	57:'mil',58:'vism'
}
const LASTBOOK='pt2';//pt is not complete in dhammakaya database 
const rawtext=[];

const dofile=(fn,builder,att)=>{
	console.log("processing",fn);
	let content=fs.readFileSync(fn,"utf8").split(/\r?\n/);
	let prevbk='',bk='',page=0,line=0;
	const MAXLINE=content.length;
	for (var i=0;i<MAXLINE;i++) {
		const arr=content[i].split("\t");
		if (att) {
			bk=booknames_a[arr[0]];
		} else {
			let bkseq=parseInt(arr[0]);
			if (bkseq>52)bkseq=52;
			bk=booknames[bkseq]		
		}
		page=parseInt(arr[1]);

		if (arr.length<3) continue;
		const lines=arr[2].split("\\n");
		if (lines[lines.length-1]=="") lines.pop();

		if (prevbk&&prevbk!==bk) {
			builder.addbook(prevbk);
		}
		for (var j=0;j<lines.length;j++){
			builder.addline(lines[j]);
			if (outputrawtext) {
				rawtext.push(bk+":"+page+"."+(j+1)+"\t"+lines[j]);
			}
		}
		builder.addpage(page);
		prevbk=bk;
	}
	builder.addbook(prevbk);
}

const outputrawtext=true;

const build=(name)=>{
	const out=[],footnote=[];
	const builder=createbuilder({name});

	dofile(folder+'palipg1.tsv',builder,);
	dofile(folder+'palipg2.tsv',builder,true);

	const extra={
		snp:require('./snp'),
		thag:require('./thag'),
		thig:require('./thig'),
		dhp:require('./dhp')
	}
	builder.done(null,extra);

	if (outputrawtext) {
		fs.writeFileSync(name+"-raw.txt",rawtext.join("\n"),"utf8");
	}
}

build('pts');