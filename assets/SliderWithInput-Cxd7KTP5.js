import{j as e}from"./index-BPkqOf23.js";function u(l,t,s){return Math.min(s,Math.max(t,l))}function p({label:l,min:t,max:s,step:i,value:a,onChange:d,units:r,description:c,accentClass:b="accent-sky-400",inputClassName:o="w-20 rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-right text-xs text-slate-100 outline-none"}){const m=(a-t)/(s-t)*100;return e.jsxs("div",{className:"space-y-1.5",children:[e.jsxs("div",{className:"flex items-baseline justify-between gap-2",children:[e.jsx("p",{className:"text-slate-200 text-xs",children:l}),r&&e.jsxs("span",{className:"text-[0.7rem] text-slate-400",children:[a.toFixed(2)," ",r]})]}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("input",{type:"range",min:t,max:s,step:i,value:a,onChange:n=>d(Number(n.target.value)),style:{background:`linear-gradient(to right, #38bdf8 ${m}%, #1e293b ${m}%)`},className:`h-1 flex-1 cursor-pointer appearance-none rounded-full bg-slate-800 disabled:cursor-not-allowed ${b}
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:h-3
            [&::-webkit-slider-thumb]:w-3
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:bg-sky-400
            [&::-moz-range-thumb]:h-3
            [&::-moz-range-thumb]:w-3
            [&::-moz-range-thumb]:rounded-full
            [&::-moz-range-thumb]:bg-sky-400`}),e.jsxs("div",{className:"flex items-center gap-1",children:[e.jsx("input",{type:"number",min:t,max:s,step:i,value:a,onChange:n=>{const x=Number(n.target.value);Number.isNaN(x)||d(u(x,t,s))},className:o}),r&&e.jsx("span",{className:"text-[0.65rem] text-slate-400",children:r})]})]}),c&&e.jsx("p",{className:"text-[0.65rem] text-slate-500",children:c})]})}export{p as S};
