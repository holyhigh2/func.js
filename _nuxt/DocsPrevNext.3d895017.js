import{_ as v}from"./DocsAsideTree.071ef18c.js";import{z as y,_ as k}from"./index.538b13da.js";import{e as g,b as w,d as B}from"./Container.92acc38e.js";import{c as C,u as t,l as c,m as l,z as m,A as d,D as s,I as r,G as h,B as u}from"./runtime-core.esm-bundler.3287b943.js";/* empty css                         */import"./cookie.e49212f9.js";const N={key:0,class:"docs-prev-next"},D={class:"directory"},b={class:"title-wrapper"},I={class:"title"},V={key:1},z={class:"directory"},F={class:"title-wrapper"},P={class:"title"},j=C({__name:"DocsPrevNext",setup(A){const{prev:o,next:n,navigation:f}=g(),{navDirFromPath:x}=w(),p=_=>{const a=x(_._path,f.value||[]);if(a&&a[0])return a[0]._path;{const e=_.split("/");return(e.length>1?e[e.length-2]:"").split("-").map(y).join(" ")}};return(_,a)=>{const e=v,i=k;return t(o)||t(n)?(c(),l("div",N,[t(o)?(c(),m(i,{key:0,to:t(o)._path,class:"prev"},{default:d(()=>[s("span",D,r(p(t(o)._path)),1),s("span",b,[h(e,{name:"heroicons-outline:arrow-sm-left",class:"icon"}),s("span",I,r(t(o).title),1)])]),_:1},8,["to"])):(c(),l("span",V)),t(n)?(c(),m(i,{key:2,to:t(n)._path,class:"next"},{default:d(()=>[s("span",z,r(p(t(n)._path)),1),s("span",F,[s("span",P,r(t(n).title),1),h(e,{name:"heroicons-outline:arrow-sm-right",class:"icon"})])]),_:1},8,["to"])):u("",!0)])):u("",!0)}}}),q=B(j,[["__scopeId","data-v-52bebc51"]]);export{q as default};