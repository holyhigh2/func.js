import{T as f,_ as y}from"./DocsAsideTree.a565868b.js";import"./index.fe3a04f2.js";import{h as C,d as h}from"./Container.b35cb856.js";import{u as B}from"./index.7db84080.js";import{c as w,r as k,l as t,m as v,D as l,G as x,A as b,z as i,u as r,q as I,L as z,M as S}from"./runtime-core.esm-bundler.3287b943.js";/* empty css                      */import"./cookie.57c23d6d.js";const T=o=>(z("data-v-5fa3121e"),o=o(),S(),o),g=T(()=>l("span",{class:"sr-only"},"Copy to clipboard",-1)),A={class:"icon-wrapper"},N=w({__name:"ProseCodeCopyButton",props:{content:{type:String,default:""},show:{type:Boolean,default:!1}},setup(o){const d=o,{copy:u}=B(),{prose:a}=C(),e=k("init"),m=_=>{u(d.content).then(()=>{e.value="copied",setTimeout(()=>{e.value="init"},1e3)}).catch(s=>{console.warn("Couldn't copy to clipboard!",s)})};return(_,s)=>{const n=y;return t(),v("button",{class:I([(o.show||e.value==="copied")&&"show"]),onClick:m},[g,l("span",A,[x(f,{name:"fade"},{default:b(()=>{var c,p;return[e.value==="copied"?(t(),i(n,{key:0,name:(c=r(a).copyButton)==null?void 0:c.iconCopied,size:"18",class:"copied"},null,8,["name"])):(t(),i(n,{key:1,name:(p=r(a).copyButton)==null?void 0:p.iconCopy,size:"18"},null,8,["name"]))]}),_:1})])],2)}}}),P=h(N,[["__scopeId","data-v-5fa3121e"]]);export{P as default};