import{A as s,o as y}from"./index.fe3a04f2.js";import{a as u}from"./entry.a3a63ac1.js";import g from"./ContentRenderer.7be91088.js";import v from"./ContentQuery.ea5bf72d.js";import{c as w,ab as C,h as o}from"./runtime-core.esm-bundler.3287b943.js";import"./DocsAsideTree.a565868b.js";import"./cookie.57c23d6d.js";import"./Container.b35cb856.js";import"./_commonjsHelpers.75136db6.js";import"./ContentRendererMarkdown.67275348.js";import"./asyncData.cf1dd798.js";const A=w({name:"ContentDoc",props:{tag:{type:String,required:!1,default:"div"},excerpt:{type:Boolean,default:!1},path:{type:String,required:!1,default:void 0},query:{type:Object,required:!1,default:void 0},head:{type:Boolean,required:!1,default:!0}},render(f){const e=C(),{tag:m,excerpt:i,path:d,query:r,head:a}=f,c={...r||{},path:d||(r==null?void 0:r.path)||s(y().path),find:"one"},l=(t,n)=>o("pre",null,JSON.stringify({message:"You should use slots with <ContentDoc>",slot:t,data:n},null,2));return o(v,c,{default:e!=null&&e.default?({data:t,refresh:n,isPartial:h})=>{var p;return a&&u(t),(p=e.default)==null?void 0:p.call(e,{doc:t,refresh:n,isPartial:h,excerpt:i,...this.$attrs})}:({data:t})=>(a&&u(t),o(g,{value:t,excerpt:i,tag:m,...this.$attrs},{empty:n=>e!=null&&e.empty?e.empty(n):l("default",t)})),empty:t=>{var n;return((n=e==null?void 0:e.empty)==null?void 0:n.call(e,t))||o("p",null,"Document is empty, overwrite this content with #empty slot in <ContentDoc>.")},"not-found":t=>{var n;return((n=e==null?void 0:e["not-found"])==null?void 0:n.call(e,t))||o("p",null,"Document not found, overwrite this content with #not-found slot in <ContentDoc>.")}})}});export{A as default};
