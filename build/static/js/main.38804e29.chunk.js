(this.webpackJsonpgrid=this.webpackJsonpgrid||[]).push([[0],{300:function(e,t,a){e.exports=a(391)},305:function(e,t,a){},345:function(e,t){},389:function(e,t,a){},391:function(e,t,a){"use strict";a.r(t);var n=a(0),l=a.n(n),r=a(13),i=a.n(r),c=(a(305),a(306),a(18)),o=a(19),s=a(20),u=a(21),m=a(452),d=a(29),h=a(54),v=a(432),p=a(426),f=a(427),g=a(428),E=a(453),b=a(429),y=a(430),k=a(431),x=function(e){var t=Object(n.useState)(!1),a=Object(h.a)(t,2),r=a[0],i=a[1];return l.a.createElement("div",{style:{fontFamily:"Proxima Bold,sans-serif"}},l.a.createElement(p.a,{style:{backgroundColor:"inherit"},light:!0,expand:"md"},l.a.createElement(f.a,{href:"/",style:{color:"#E00420"}},"INTER - IIT TECH MEET 9.0"),l.a.createElement(g.a,{onClick:function(){return i(!r)}}),l.a.createElement(E.a,{isOpen:r,navbar:!0},l.a.createElement(b.a,{className:"ml-auto",navbar:!0},[{path:"/augment",name:"AUGMENT"},{path:"/validate",name:"VALIDATE"}].map((function(e,t){return l.a.createElement(y.a,{className:"ml-auto",key:t,style:{marginLeft:"10px"}},l.a.createElement(k.a,{href:e.path,style:{color:"#E00420"}},e.name))}))))),l.a.createElement(v.a,{style:{backgroundColor:"black"}}))},C=a(438),j=a(441),O=a(454),w=a(436),S=a(449),L=function(e){Object(s.a)(a,e);var t=Object(u.a)(a);function a(e){var n;return Object(c.a)(this,a),(n=t.call(this,e)).steps=["Select directory","Choose Augmentations","Summary"],n.state={active:n.props.active},n}return Object(o.a)(a,[{key:"render",value:function(){return l.a.createElement("div",{style:{display:"flex",justifyContent:"center"}},l.a.createElement(O.a,{activeStep:this.state.active,style:{width:"40%",padding:0,marginLeft:"30px",marginRight:"30px"}},this.steps.map((function(e,t){return l.a.createElement(w.a,{key:t},l.a.createElement(S.a,null,e))}))))}}]),a}(l.a.Component),I=a(35),R=a(30),A=a(437),T=a(439),D=a(393),F=a(455),B=a(451),M=a(440),P=a(448),N=a(447),U=a(442),z=a(392),H=a(443),Y=a(444),W=a(445),q=a(450),G=a(446),V=a(87),J=a.n(V),$=a(5),K=a(162),Q=a.n(K)()("http://localhost:5000/");function X(){var e,t=[],a=Object.assign([],this.state.dir),n=0;if(""!==this.state.filcol)if("item"===this.state.filcol){var l=this.state.filval.toLowerCase();for(n=0;n<a.length;n++)a[n].name.toLowerCase().includes(l)&&t.push(a[n]);this.setState({dir2:t})}else{var r=parseInt(this.state.filval),i=this.state.filcon;for(e=this.state.filcol,n=0;n<a.length;n++)switch(i){case"lt":a[n][e]<r&&t.push(a[n]);break;case"gt":a[n][e]>r&&t.push(a[n]);break;case"leq":a[n][e]<=r&&t.push(a[n]);break;case"geq":a[n][e]>=r&&t.push(a[n]);break;default:console.log("error")}}var c=Object.assign([],t);c.sort((function(e,t){return e.num-t.num}));var o=c[0];c.reverse();var s=c[0];""!==this.state.orderval&&(e=this.state.ordercol,0===t.length&&(t=a),"item"!==e?t.sort((function(t,a){return t[e]-a[e]})):t.sort((function(e,t){return e.name.localeCompare(t.name)})),"desc"===this.state.orderval&&t.reverse()),this.setState({dir2:t,lmax:s,lmin:o,checked:[]})}var Z=Object($.a)((function(e){return{head:{backgroundColor:"#E00420",fontSize:20,color:e.palette.common.white},body:{fontFamily:"Proxima Reg, sans-serif"}}}))(A.a),_=function(e){Object(s.a)(a,e);var t=Object(u.a)(a);function a(e){var n;return Object(c.a)(this,a),(n=t.call(this,e)).getDirData=function(e){var t=Object.assign([],e).sort((function(e,t){return e.num-t.num})),a=t[0];t.reverse();var l=t[0];n.setState({dir:e,dir2:e,gmax:l,gmin:a,lmax:l,lmin:a})},n.handleCheck=function(e){var t=e.target.getAttribute("aria-label");if("allCheck"===t)if(n.state.checked.length!==n.state.dir2.length){for(var a=[],l=0;l<n.state.dir2.length;l++)a.push(n.state.dir2[l].dir);n.setState({checked:a})}else n.setState({checked:[]});else{var r=parseInt(t.substring(5)),i=Object.assign([],n.state.checked);if(n.state.checked.includes(r)){var c=i.indexOf(r),o=i[i.length-1];i[c]=o,i[i.length-1]=r,i.pop(),n.setState({checked:i})}else i.push(r),n.setState({checked:i})}},n.handleControls=function(e){"filcol"===e.target.getAttribute("name")?n.setState({filcol:e.target.value,filcon:""}):n.setState(Object(I.a)({},e.target.getAttribute("name"),e.target.value))},n.handleClick=function(){var e=!0,t=!0;""!==n.state.filcol&&(""!==n.state.filcon&&""===n.state.filval?(alert("Fill the limiting value"),e=!1):""===n.state.filcon&&(alert("Select the condition"),e=!1)),""!==n.state.ordercol&&""===n.state.orderval&&(alert("Select the sorting order"),t=!1),e&&t&&n.process()},n.state={filcol:"",filcon:"",filval:"",ordercol:"",orderval:"",dir2:[],checked:[]},n.process=X.bind(Object(R.a)(n)),n}return Object(o.a)(a,[{key:"componentDidMount",value:function(){Q.on("dirlist",this.getDirData),Q.emit("dirlist")}},{key:"componentWillUnmount",value:function(){Q.off("dirlist")}},{key:"render",value:function(){var e=this;return l.a.createElement(C.a,{container:!0,style:{marginTop:"10px"},spacing:0,justify:"center"},l.a.createElement(C.a,{item:!0,xs:3,style:{maxHeight:"80vh",overflowY:"auto"}},l.a.createElement(T.a,{style:{padding:"30px",marginTop:"10px"}},l.a.createElement(D.a,null,"Filter",""!==this.state.filcol&&l.a.createElement(J.a,{onClick:function(){e.setState({filcol:"",filcon:"",filval:""})},style:{cursor:"pointer"}})),l.a.createElement(F.a,{component:"fieldset",style:{justifyContent:"center"}},l.a.createElement(B.a,{row:!0,"aria-label":"filcol",name:"filcol",value:this.state.filcol,onChange:this.handleControls},l.a.createElement(M.a,{value:"dir",control:l.a.createElement(P.a,null),label:"Dir"}),l.a.createElement(M.a,{value:"item",control:l.a.createElement(P.a,null),label:"Item"}),l.a.createElement(M.a,{value:"num",control:l.a.createElement(P.a,null),label:"Count"})),"item"===this.state.filcol&&l.a.createElement(B.a,{row:!0,"aria-label":"filcon",name:"filcon",value:this.state.filcon,onChange:this.handleControls},l.a.createElement(M.a,{value:"substr",control:l.a.createElement(P.a,null),label:"substring"})),"item"!==this.state.filcol&&""!==this.state.filcol&&l.a.createElement(B.a,{row:!0,"aria-label":"filcon",name:"filcon",value:this.state.filcon,onChange:this.handleControls},l.a.createElement(M.a,{value:"lt",control:l.a.createElement(P.a,null),label:"<"}),l.a.createElement(M.a,{value:"gt",control:l.a.createElement(P.a,null),label:">"}),l.a.createElement(M.a,{value:"leq",control:l.a.createElement(P.a,null),label:"<="}),l.a.createElement(M.a,{value:"geq",control:l.a.createElement(P.a,null),label:">="})),"item"===this.state.filcol&&this.state.filcon&&l.a.createElement(N.a,{id:"standard-number",label:"String",name:"filval",type:"text",variant:"outlined",onChange:this.handleControls}),!("item"===this.state.filcol)&&this.state.filcon&&l.a.createElement(N.a,{id:"standard-number",label:"Limit",name:"filval",type:"number",variant:"outlined",onChange:this.handleControls})),l.a.createElement(D.a,{style:{marginTop:"30px"}},"Sort",""!==this.state.ordercol&&l.a.createElement(J.a,{onClick:function(){e.setState({ordercol:"",orderval:""})},style:{cursor:"pointer"}})),l.a.createElement(F.a,{component:"fieldset"},l.a.createElement(B.a,{row:!0,"aria-label":"ordercol",name:"ordercol",value:this.state.ordercol,onChange:this.handleControls},l.a.createElement(M.a,{value:"dir",control:l.a.createElement(P.a,null),label:"Dir"}),l.a.createElement(M.a,{value:"item",control:l.a.createElement(P.a,null),label:"Item"}),l.a.createElement(M.a,{value:"num",control:l.a.createElement(P.a,null),label:"Count"})),""!==this.state.ordercol&&l.a.createElement(B.a,{row:!0,"aria-label":"orderval",name:"orderval",value:this.state.orderval,onChange:this.handleControls},l.a.createElement(M.a,{value:"asc",control:l.a.createElement(P.a,null),label:"Ascending"}),l.a.createElement(M.a,{value:"desc",control:l.a.createElement(P.a,null),label:"Descending"})))),l.a.createElement("div",{style:{display:"flex",marginTop:"20px",justifyContent:"center"}},l.a.createElement(j.a,{variant:"outlined",onClick:this.handleClick,disabled:""===this.state.orderval&&""===this.state.filval}," Apply "),l.a.createElement(j.a,{variant:"outlined",style:{marginLeft:"20px"},onClick:function(){e.setState({dir2:e.state.dir})},disabled:this.state.dir===this.state.dir2}," Reset "))),l.a.createElement(C.a,{item:!0,xs:5,style:{padding:"10px"}},l.a.createElement(U.a,{component:z.a,style:{maxHeight:"80vh"}},l.a.createElement(H.a,{stickyHeader:!0},l.a.createElement(Y.a,null,l.a.createElement(W.a,null,l.a.createElement(Z,null,l.a.createElement(q.a,{checked:this.state.checked.length===this.state.dir2.length,onChange:this.handleCheck,inputProps:{"aria-label":"allCheck"}})),l.a.createElement(Z,null,"Dir"),l.a.createElement(Z,null,"Item"),l.a.createElement(Z,null,"Count"))),l.a.createElement(G.a,null,this.state&&this.state.dir2&&this.state.dir2.map((function(t,a){return l.a.createElement(W.a,{key:a},l.a.createElement(Z,null,l.a.createElement(q.a,{checked:e.state.checked.includes(t.dir),onChange:e.handleCheck,inputProps:{"aria-label":"check".concat(t.dir)}})),l.a.createElement(Z,{component:"th"},t.dir),l.a.createElement(Z,null," ",t.name," "),l.a.createElement(Z,null,t.num))})))))),l.a.createElement(C.a,{item:!0,xs:4,style:{maxHeight:"80vh",overflowY:"auto",padding:"10px"}},l.a.createElement(T.a,{style:{padding:"30px"}},this.state.gmax&&this.state.gmin&&l.a.createElement("div",null,l.a.createElement(D.a,null,"Global Maximum : ",this.state.gmax.name," (",this.state.gmax.num,")"),l.a.createElement(D.a,null,"Global Minimum : ",this.state.gmin.name," (",this.state.gmin.num,")")),this.state.lmax&&this.state.lmin&&this.state.dir!==this.state.dir2&&l.a.createElement("div",null,l.a.createElement("br",null),l.a.createElement(D.a,null,"Local Maximum : ",this.state.lmax.name," (",this.state.lmax.num,")"),l.a.createElement(D.a,null,"Local Minimum : ",this.state.lmin.name," (",this.state.lmin.num,")")),l.a.createElement("br",null),0===this.state.checked.length&&l.a.createElement(D.a,null,"Please select a directory to resume"),this.state.checked.length>0&&l.a.createElement("div",null,l.a.createElement(D.a,null,"You have selected ",1===this.state.checked.length?"a directory":"".concat(this.state.checked.length," directories"),"."),l.a.createElement(j.a,{variant:"contained",color:"primary",style:{marginLeft:"20px"},onClick:function(){e.props.switch(1)}}," Confirm ")))))}}]),a}(l.a.Component),ee=a(456),te=[{categ:"Translational",list:[{disp:"Scaling",name:"scale",min:0,max:1,step:.01,def:0},{disp:"Rotating",name:"rotate",min:-359,max:359,step:1,def:0}]}],ae=function(e){Object(s.a)(a,e);var t=Object(u.a)(a);function a(e){var n;return Object(c.a)(this,a),(n=t.call(this,e)).handleChange=function(e){var t=e.target.parentNode.id,a=e.target.getAttribute("aria-valuetext");n.setState(Object(I.a)({},t,a))},n.handleChange=n.handleChange.bind(Object(R.a)(n)),n}return Object(o.a)(a,[{key:"render",value:function(){var e=this;function t(e){return e}return l.a.createElement("div",null,l.a.createElement("div",{style:{padding:"10%",paddingLeft:"20%",paddingRight:"20%"}},te.map((function(a,n){return l.a.createElement(T.a,{key:n,style:{padding:"10%"},variant:"outlined"},l.a.createElement(D.a,{style:{fontFamily:"Proxima Reg, sans-serif",fontSize:"30px",color:"#E00420"}},a.categ),l.a.createElement("br",null),a.list.map((function(a,n){return l.a.createElement("div",{key:n},l.a.createElement(D.a,{style:{fontFamily:"Proxima Reg, sans-serif"}},a.disp," : ",e.state&&e.state[a.name],!e.state&&a.def,e.state&&!e.state[a.name]&&a.def),l.a.createElement(ee.a,{getAriaValueText:t,"aria-labelledby":"discrete-slider-small-steps",step:a.step,defaultValue:a.def,min:a.min,max:a.max,id:a.name,onChangeCommitted:e.handleChange,valueLabelDisplay:"auto",marks:[{value:a.min,label:a.min},{value:a.max,label:a.max}]}))})))}))))}}]),a}(l.a.Component),ne=function(e){Object(s.a)(a,e);var t=Object(u.a)(a);function a(e){var n;return Object(c.a)(this,a),(n=t.call(this,e)).getData=function(e){if("string"===typeof e)alert(e),window.location.href="/auth";else{var t=new Blob([e],{type:"image/png"}),a=n.state.images;a.push(t),n.setState({images:a})}},n.state={images:[]},n}return Object(o.a)(a,[{key:"componentDidMount",value:function(){Q.on("auglist",this.getData),Q.emit("auglist")}},{key:"componentWillUnmount",value:function(){Q.off("auglist")}},{key:"render",value:function(){return l.a.createElement(C.a,{container:!0,spacing:0,style:{padding:"20px"}},this.state.images&&this.state.images.map((function(e,t){return l.a.createElement(C.a,{item:!0,key:t,style:{flexBasis:"20%"}},l.a.createElement("img",{src:URL.createObjectURL(e),style:{position:"inherit",height:"100%",width:"100%"},alt:t}))})))}}]),a}(l.a.Component),le=function(e){Object(s.a)(a,e);var t=Object(u.a)(a);function a(e){var n;return Object(c.a)(this,a),(n=t.call(this,e)).handleActive=function(e){n.setState({active:n.state.active+e})},n.state={images:[],active:localStorage.getItem("page")?parseInt(localStorage.getItem("page")):0},n}return Object(o.a)(a,[{key:"render",value:function(){var e=this;return l.a.createElement("div",null,l.a.createElement(L,{active:this.state.active}),0===this.state.active&&l.a.createElement(_,{switch:this.handleActive}),1===this.state.active&&l.a.createElement(C.a,{style:{marginTop:"10px"},container:!0},l.a.createElement(j.a,{variant:"outlined",style:{marginLeft:"20px"},onClick:function(){e.handleActive(-1)}}," Back "),l.a.createElement(C.a,{item:!0,xs:4,style:{height:"500px",overflowY:"scroll"}},l.a.createElement(ae,null)),l.a.createElement(C.a,{item:!0,xs:8,style:{height:"500px",overflowY:"scroll"}},l.a.createElement(ne,null))))}}]),a}(l.a.Component),re=a(23),ie=a(163),ce=(a(386),function(e){Object(s.a)(a,e);var t=Object(u.a)(a);function a(e){var n;return Object(c.a)(this,a),(n=t.call(this,e)).selectFile=n.selectFile.bind(Object(R.a)(n)),n.upload=n.upload.bind(Object(R.a)(n)),n.state={currentFile:void 0,previewImage:void 0,progress:0,message:"",isError:!1,loader:!0},n}return Object(o.a)(a,[{key:"componentDidMount",value:function(){Q.on("predict",(function(e){console.log(e)}))}},{key:"selectFile",value:function(e){this.setState({currentFile:e.target.files[0],previewImage:URL.createObjectURL(e.target.files[0]),progress:0,message:""})}},{key:"upload",value:function(){this.setState({progress:0}),document.getElementById("loader").classList.remove("close"),document.getElementById("loader").classList.add("open"),console.log(this.state.currentFile);var e=new FileReader,t=this.state.currentFile;e.readAsDataURL(t),e.onload=function(){var a=e.result;Q.emit("predict",{name:t.name,type:t.type,size:t.size,binary:a})},setTimeout((function(){document.getElementById("loader").classList.remove("open"),document.getElementById("loader").classList.add("close")}),3e3)}},{key:"getImgData",value:function(){return new Promise((function(e){setTimeout((function(){e({})}),3e3)}))}},{key:"render",value:function(){var e=this.state,t=e.currentFile,a=e.previewImage;return l.a.createElement("div",{className:"mg20"},l.a.createElement("label",{htmlFor:"btn-upload"},l.a.createElement("input",{id:"btn-upload",name:"btn-upload",style:{display:"none"},type:"file",accept:"image/*",onChange:this.selectFile}),l.a.createElement(j.a,{className:"btn-choose",variant:"outlined",component:"span"},"Choose Image")),l.a.createElement("div",{className:"file-name"},t?t.name:null),l.a.createElement(j.a,{className:"btn-upload",color:"primary",variant:"contained",component:"span",disabled:!t,onClick:this.upload},"Upload"),l.a.createElement("div",{id:"loader",class:"close"},l.a.createElement(ie.BoxLoading,null)),a&&l.a.createElement("div",null,l.a.createElement("img",{className:"preview my20",src:a,alt:""})))}}]),a}(n.Component)),oe=(a(389),function(e){Object(s.a)(a,e);var t=Object(u.a)(a);function a(){return Object(c.a)(this,a),t.apply(this,arguments)}return Object(o.a)(a,[{key:"componentDidMount",value:function(){this.drawPieChart([{name:"speed (80)",value:"1500"},{name:"speed (70)",value:"1200"},{name:"speed (60)",value:"900"},{name:"speed (50)",value:"800"},{name:"speed (90)",value:"300"},{name:"U Turn",value:"495"},{name:"No Parking",value:"150"},{name:"Signal1",value:"795"},{name:"Signal 2",value:"540"},{name:"Police",value:"122"},{name:"Signal 3",value:"1100"},{name:"Left",value:"340"},{name:"Right",value:"640"},{name:"Side",value:"874"}])}},{key:"drawPieChart",value:function(e){var t=Math.min(1500,500)/2*.8,a=re.a().innerRadius(0).outerRadius(Math.min(1500,500)/2-1),n=re.a().innerRadius(t).outerRadius(t),l=(Math.min(1500,500),re.f().sort(null).value((function(e){return e.value}))),r=re.k().domain(e.map((function(e){return e.name}))).range(re.g((function(e){return re.d(.8*e+.1)}),e.length).reverse()),i=l(e),c=re.l(this.refs.canvas).append("svg").attr("viewBox",[-750,-250,1500,500]);return c.append("g").attr("stroke","white").selectAll("path").data(i).join("path").attr("fill",(function(e){return r(e.data.name)})).attr("d",a).append("title").text((function(e){return"".concat(e.data.name,": ").concat(e.data.value.toLocaleString())})),c.append("g").attr("font-family","sans-serif").attr("font-size",12).attr("text-anchor","middle").selectAll("text").data(i).join("text").attr("transform",(function(e){return"translate(".concat(n.centroid(e),")")})).call((function(e){return e.append("tspan").attr("y","-0.4em").attr("font-weight","bold").text((function(e){return e.data.name}))})).call((function(e){return e.filter((function(e){return e.endAngle-e.startAngle>.25})).append("tspan").attr("x",0).attr("y","0.7em").attr("fill-opacity",.7).text((function(e){return e.data.value.toLocaleString()}))})),c.node()}},{key:"render",value:function(){return l.a.createElement("div",{ref:"canvas"})}}]),a}(l.a.Component)),se=function(e){Object(s.a)(a,e);var t=Object(u.a)(a);function a(){return Object(c.a)(this,a),t.apply(this,arguments)}return Object(o.a)(a,[{key:"componentDidMount",value:function(){for(var e=["title 1","title 2","title 3"],t=0,a=[[{name:"E",value:.12702},{name:"T",value:.09056},{name:"A",value:.08167},{name:"O",value:.07507},{name:"I",value:.06966},{name:"N",value:.06749},{name:"S",value:.06327},{name:"H",value:.06094},{name:"R",value:.05987},{name:"D",value:.04253},{name:"L",value:.04025},{name:"C",value:.02782},{name:"U",value:.02758},{name:"M",value:.02406},{name:"W",value:.0236},{name:"F",value:.02288},{name:"G",value:.02015},{name:"Y",value:.01974},{name:"P",value:.01929},{name:"B",value:.01492}],[{name:"Left",value:.92},{name:"Right",value:.09056},{name:"Signal",value:.08167},{name:"Parking",value:.07507},{name:"U Turn",value:.06966},{name:"Speed",value:.06749}],[{name:"Left",value:.1},{name:"Right",value:.09056},{name:"Signal",value:.08167},{name:"Parking",value:.07507},{name:"U Turn",value:.96966},{name:"Speed",value:.06749}]];t<a.length;t++){var n=a[t];n=this.pyramid(n),this.drawBarChart(n,e)}}},{key:"pyramid",value:function(e){var t=[];for(e.sort((function(e,t){return e-t})),t.push(e.pop());e.length;)t[e.length%2===0?"push":"unshift"](e.pop());return t}},{key:"drawBarChart",value:function(e,t){var a=30,n=0,l=0,r=40,i=re.i().domain(re.h(e.length)).range([r,600-n]).padding(.1),c=re.j().domain([0,re.e(e,(function(e){return e.value}))]).nice().range([400-l,a]),o=re.l(this.refs.canvas).append("svg").attr("width",600).attr("height",400).attr("class","tile").attr("viewBox",[0,0,600,400]);o.append("g").attr("fill","red").selectAll("rect").data(e).join("rect").attr("x",(function(e,t){return i(t)})).attr("y",(function(e){return c(e.value)})).attr("height",(function(e){return c(0)-c(e.value)})).attr("width",i.bandwidth()).append("title").text((function(e){return"".concat(e.value," ")})),o.append("text").attr("x",300).attr("y",0-a/2).attr("text-anchor","middle").style("font-size","16px").style("text-decoration","underline").text("title"),o.append("g").call((function(t){return t.attr("transform","translate(0,".concat(400-l,")")).call(re.b(i).tickFormat((function(t){return e[t].name})).tickSizeOuter(0))})),o.append("g").call((function(t){return t.attr("transform","translate(".concat(r,",0)")).call(re.c(c).ticks(null,e.format)).call((function(e){return e.select(".domain").remove()})).call((function(t){return t.append("text").attr("x",-r).attr("y",10).attr("fill","currentColor").attr("text-anchor","start").text(e.y)}))}))}},{key:"render",value:function(){return l.a.createElement("div",{ref:"canvas"})}}]),a}(l.a.Component),ue=function(){return l.a.createElement("div",null,l.a.createElement("div",{class:"top"},l.a.createElement("div",{className:"container"},l.a.createElement("div",{className:"mg20"},l.a.createElement(D.a,{variant:"h5"},"Upload Images to Test")),l.a.createElement(ce,null))),l.a.createElement("div",{class:"bottom"},l.a.createElement("div",{class:"centered"},l.a.createElement("h1",null,"Results"),l.a.createElement(oe,null),l.a.createElement("div",{class:"grid-layout"},l.a.createElement(se,null)))))},me=Object(d.a)(),de=[{path:"/",component:le},{path:"/augment",component:le},{path:"/validate",component:ue}],he=function(e){Object(s.a)(a,e);var t=Object(u.a)(a);function a(){return Object(c.a)(this,a),t.apply(this,arguments)}return Object(o.a)(a,[{key:"render",value:function(){return l.a.createElement("div",null,l.a.createElement(x,null),l.a.createElement("div",{style:{marginTop:"10px"}},l.a.createElement(m.b,{history:me},l.a.createElement(m.c,null,de.map((function(e,t){return l.a.createElement(m.a,{exact:!0,path:e.path,key:t,component:e.component})}))))))}}]),a}(l.a.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));i.a.render(l.a.createElement(he,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()}))}},[[300,1,2]]]);
//# sourceMappingURL=main.38804e29.chunk.js.map