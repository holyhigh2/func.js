/* empty css                         */import{d as h}from"./Container.b35cb856.js";import{i as v}from"./index.fe3a04f2.js";import{a as f}from"./DocsAsideTree.a565868b.js";import{r as d,a as _,ac as g,o as y,c as k,l as r,m,F as B,y as b,q as p,D as x,I as C,u as H,z as S,B as q}from"./runtime-core.esm-bundler.3287b943.js";import"./cookie.57c23d6d.js";const A=()=>{const n=d(),s=d([]),c=d([]),a=e=>e.forEach(t=>{const u=t.target.id;t.isIntersecting?s.value.push(u):s.value=s.value.filter(l=>l!==u)}),i=e=>e.forEach(t=>{n.value.observe(t)});return _(s,(e,t)=>{e.length===0?c.value=t:c.value=e},{deep:!0}),g(()=>n.value=new IntersectionObserver(a)),y(()=>{var e;return(e=n.value)==null?void 0:e.disconnect()}),{visibleHeadings:s,activeHeadings:c,updateHeadings:i}},D={class:"docs-toc-links"},I=["href","onClick"],T=k({__name:"DocsTocLinks",props:{links:{type:Array,default:()=>[]}},emits:["move"],setup(n,{emit:s}){const c=v(),{activeHeadings:a,updateHeadings:i}=A();setTimeout(()=>{i([...document.querySelectorAll(".document-driven-page h1, .docus-content h1"),...document.querySelectorAll(".document-driven-page h2, .docus-content h2"),...document.querySelectorAll(".document-driven-page h3, .docus-content h3"),...document.querySelectorAll(".document-driven-page h4, .docus-content h4")])},300);function e(t){c.push(`#${t}`),s("move",t)}return(t,u)=>{const l=$;return r(),m("ul",D,[(r(!0),m(B,null,b(n.links,o=>(r(),m("li",{key:o.text,class:p([`depth-${o.depth}`])},[x("a",{href:`#${o.id}`,class:p([H(a).includes(o.id)&&"active"]),onClick:f(w=>e(o.id),["prevent"])},C(o.text),11,I),o.children?(r(),S(l,{key:0,links:o.children},null,8,["links"])):q("",!0)],2))),128))])}}}),$=h(T,[["__scopeId","data-v-8d68a659"]]);export{$ as default};
