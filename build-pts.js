const fs=require("fs");
const folder="../pts-dhammakaya/data/";
const {createbuilder}=require("dengine");

const booknames=[
	'mv','cv','vb1'	,'vb2','pvr'
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
const LASTBOOK='pt1';//pt is not complete in dhammakaya database 
const rawtext=[];

const dofile=(fn,builder)=>{
	console.log("processing",fn);
	let content=fs.readFileSync(fn,"utf8").split(/\r?\n/);
	let prevbk=0,page=0,line=0;
	const MAXLINE=content.length;
	for (var i=0;i<MAXLINE;i++) {
		const arr=content[i].split("\t");
		let bkseq=parseInt(arr[0])-1;
		if (bkseq>52)bkseq=52;
		const bk=booknames[bkseq],page=parseInt(arr[1]);

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
	builder.addbook(LASTBOOK);
}

const outputrawtext=true;

const build=(tsv,name)=>{
	const out=[],footnote=[];
	const builder=createbuilder({name});
	dofile(folder+tsv,builder);
	builder.done();

	if (outputrawtext) {
		fs.writeFileSync("pts-raw.txt",rawtext.join("\n"),"utf8");
	}
}

build('palipg1.tsv','pts');