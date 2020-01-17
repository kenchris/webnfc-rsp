import{a as t,e,j as s}from"./lit-html-e3979997.js";
/**
 * @license
 * Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */const a=new WeakMap,n=t(t=>n=>{if(!(n instanceof e)||n instanceof s||"class"!==n.committer.name||n.committer.parts.length>1)throw new Error("The `classMap` directive must be used in the `class` attribute and must be the only part in the attribute.");const{committer:o}=n,{element:i}=o;a.has(n)||(i.className=o.strings.join(" "));const{classList:r}=i,c=a.get(n);for(const e in c)e in t||r.remove(e);for(const e in t){const s=t[e];if(!c||s!==c[e]){r[s?"add":"remove"](e)}}a.set(n,t)});export{n as c};
//# sourceMappingURL=class-map-6ab3b156.js.map
