(this["webpackJsonpbananagrams-helper"]=this["webpackJsonpbananagrams-helper"]||[]).push([[0],{14:function(t,e,a){},19:function(t,e,a){"use strict";a.r(e);var n=a(2),r=a(0),i=(a(14),a(1)),s=a.n(i),o=a(10),c=a.n(o),u=a(3),l=a(4),d=a(7),h=function(){function t(e,a,n){Object(u.a)(this,t),this.board=a||new Map,this.columns=n||1,this.tray=e}return Object(l.a)(t,[{key:"getBoard",value:function(){var t=this,e=Math.max.apply(Math,Object(d.a)(this.board.keys())),a=0;return Array(e).fill(!0).map((function(e,n){var r=t.board.get(n+1);if(r){var i=Math.max.apply(Math,[a].concat(Object(d.a)(r.keys())));i>a&&(a=i);var s=Array(a).fill(" ");return r.forEach((function(t,e){s[e-1]=t})),s}return Array(a).fill(" ")}))}},{key:"getSegments",value:function(){}},{key:"getStateAfterPlacement",value:function(e,a){var n=this,r=e.row,i=e.col,s=e.down,o=e.word,c=new Map;this.board.forEach((function(t,e){var a=new Map;t.forEach((function(t,e){a.set(e,t)})),c.set(e,a)}));var u=this.columns,l=this.tray,h=!1;if(s)o.split("").forEach((function(t,e){if(!h){var s=c.get(r+e),o=s.get(i);if(o){if(o!==t)return void(h=!0)}else{var u=!1;if(Array(n.columns).fill(!0).map((function(t,e){var a=s.get(e+1);if(a)return u&&(u=!1),a;var n=" ";return u?n="":u=!0,n})).trim().split(" ").forEach((function(t){a.isAWord(t)||(h=!0)})),h)return;l=l.replace(t,"")}s.set(i,t)}}));else{var f=c.get(r);o.split("").forEach((function(t,e){if(!h){var r=i+e,s=f.get(r);if(s){if(s!==t)return void(h=!0)}else{var o=Math.max.apply(Math,Object(d.a)(n.board.keys())),c=!1;if(Array(o).fill(!0).map((function(t,e){var a=n.board.get(e+1).get(r);if(a)return c&&(c=!1),a;var i=" ";return c?i="":c=!0,i})).trim().split(" ").forEach((function(t){a.isAWord(t)||(h=!0)})),h)return;l=l.replace(t,"")}f.set(r,t),r>u&&(u=r)}}))}return!h&&new t(l,c,u)}},{key:"getTray",value:function(){return this.tray}},{key:"isSolution",value:function(){return!this.tray}}]),t}(),f=a(9),v=a.n(f),b=a(11),p=a.p+"static/media/words.cc212d38.txt",y=function(){function t(){var e=this;Object(u.a)(this,t),this.trie={},fetch(p.slice(1)).then(function(){var t=Object(b.a)(v.a.mark((function t(a){var n,r,i,s,o,c;return v.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,a.text();case 2:n=t.sent,r=n.split(";"),i=new RegExp("([0-9A-Z]+):([0-9A-Z]+)"),s=new Map,o=0,r.some((function(t,a){var n=i.exec(t);return n?(s.set(e.fromAlphaCode(n[1]),e.fromAlphaCode(n[2])),!1):(o=a,!0)})),c=new Map(r.slice(o,r.length).map((function(t,e){return[e,t]}))),Object.assign(e.trie,{nodes:c,syms:s,symCount:o}),e.readyCallback();case 11:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}())}return Object(l.a)(t,[{key:"canBeMadeFromTray",value:function(t,e){var a=!0,n=t;return e.split("").forEach((function(t){n.includes(t)?n=n.replace(t,""):a=!1})),a}},{key:"fromAlphaCode",value:function(t){var e="0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";if(void 0!==e[t])return e.indexOf(t);for(var a=0,n=1,r=36,i=1;n<t.length;)a+=r,n++,r*=36;for(var s=t.length-1;s>=0;s--){var o=t.charCodeAt(s)-48;o>10&&(o-=7),a+=o*i,i*=36}return a}},{key:"getPossiblePlacements",value:function(t,e){var a=new Map,n=new Set,r=this.getWordsFromTray(t);return e.forEach((function(t){var e=a.get(t.pattern);e?e.add(t):a.set(t.pattern,new Set([t]))})),r.forEach((function(t){a.keys().forEach((function(e){e.test(t)&&a.get(e).forEach((function(t){}))}))})),n}},{key:"getWordsFromTray",value:function(t){var e=this,a=new Set;return function n(r,i){var s=e.trie.nodes.get(r);if(!s)throw console.log("!node"),console.log("index => ".concat(r)),console.log(e.trie.nodes),new Error("temp for debugging");"!"===s[0]&&(e.canBeMadeFromTray(t,i)&&a.add(i),s=s.slice(1));for(var o=s.split(/([A-Z0-9,]+)/g),c=0;c<o.length;c+=2){var u=o[c];if(u){var l=o[c+1],d=i+u;","!==l&&void 0!==l?n(e.indexFromRef(l,r),d):e.canBeMadeFromTray(t,d)&&a.add(d)}}}(0,""),a}},{key:"has",value:function(t,e){return!!t&&(e.length>1?this.has(t.get(e[0]),e.slice(1)):t.has(e))}},{key:"indexFromRef",value:function(t,e){var a=this.fromAlphaCode(t);return a<this.trie.symCount?this.trie.syms.get(a):e+a+1-this.trie.symCount}},{key:"isAWord",value:function(t){var e=t.split("");return e.push("_"),this.has(this.trie,e)}},{key:"onReady",value:function(t){this.readyCallback=t}}]),t}(),g=new(function(){function t(){var e=this;Object(u.a)(this,t),this.boardStates=new Map,this.dictionary=new y,this.running=!1,this.dictionary.onReady((function(){e.readyCallback()}))}return Object(l.a)(t,[{key:"getPossibleNextStates",value:function(t){var e=this,a=t.getTray(),n=t.getSegments(),r=this.dictionary.getPossiblePlacements(a,n),i=new Set;return r.forEach((function(a){var n=t.getStateAfterPlacement(a,e.dictionary);n&&i.add(n)})),i}},{key:"onReady",value:function(t){this.readyCallback=t}},{key:"onUpdate",value:function(t){this.updateCallback=t}},{key:"update",value:function(t,e){var a={message:t};e?(a.tray=e.getTray(),a.board=e.getBoard()):(a.tray="",a.board=[[]]),this.updateCallback(a)}},{key:"solve",value:function(t,e){var a=this,n=function(t){return new h(t)}(t),r=this.getPossibleNextStates(n);if(this.boardStates.clear(),r.size){var i=1,s=!1;if(r.forEach((function(t){s||(t.isSolution()?s=t:(a.boardStates.set(i.toString(),t),i++))})),s)return this.running=!1,void this.update("Solution found!",s);this.running=Symbol(),this.tryBoardState(this.running,"1")}else this.running=!1,this.update("No solutions possible!",n)}},{key:"tryBoardState",value:function(t,e){var a=this;if(!1===this.running||this.running===t){if(!this.boardStates.has(e)){var n=e.split(":"),r=n.length;return r<2?(this.running=!1,void this.update("No solutions possible!")):(n[r-2]=parseInt(n[r-2])+1,n[r-1]=0,void this.tryBoardState(t,n.join(":")))}var i=this.boardStates.get(e),s=this.getPossibleNextStates(i);if(i.setPossibleNextStates(s),s.size){var o=1,c=!1;if(s.forEach((function(t){c||(t.isSolution()?c=t:(a.boardStates.set("".concat(e,":").concat(o.toString()),t),o++))})),c)return this.running=!1,void this.update("Solution found!",c);var u=e.split(":"),l=u.length-1;u[l]=parseInt(u[l])+1,this.tryBoardState(t,u.join(":"))}}}}]),t}()),j=function(){var t=Object(i.useState)(""),e=Object(n.a)(t,2),a=e[0],s=e[1],o=Object(i.useState)([[]]),c=Object(n.a)(o,2),u=c[0],l=c[1],d=Object(i.useState)(""),h=Object(n.a)(d,2),f=h[0],v=h[1],b=Object(i.useState)(""),p=Object(n.a)(b,2),y=p[0],j=p[1],m=Object(i.useState)(!1),O=Object(n.a)(m,2),x=O[0],S=O[1],k=Object(i.useState)(""),w=Object(n.a)(k,2),A=w[0],E=w[1];return g.onReady((function(){S(!0)})),g.onUpdate((function(t){var e=t.tray,a=t.message,n=t.board;E(e),j(a),l(n)})),Object(r.jsxs)("div",{children:[Object(r.jsx)("div",{className:"header",children:Object(r.jsx)("h1",{children:"Bananagrams Helper"})}),Object(r.jsx)("div",{className:"letterbox",children:Object(r.jsx)("input",{type:"text",placeholder:"yourtileshere",value:f,onInput:function(t){var e=t.target.value.replace(/[^A-Z]/gi,"").toLowerCase();v(e),g.solve(e,a)},disabled:!x})}),Object(r.jsxs)("div",{className:"controls",children:[Object(r.jsxs)("div",{children:[Object(r.jsx)("label",{children:"Word Blacklist"}),Object(r.jsx)("small",{children:"(Comma-separated)"})]}),Object(r.jsx)("div",{children:Object(r.jsx)("input",{type:"text",value:a,onInput:function(t){var e=t.target.value.replace(/[^A-Z]/gi,"").toLowerCase();s(e),g.solve(f,e)},disabled:!x})})]}),Object(r.jsx)("div",{className:"boardbox",children:Object(r.jsx)("div",{className:"board",children:u.map((function(t,e){return Object(r.jsx)("div",{className:"row",children:t.map((function(t,e){return Object(r.jsx)("div",{className:" "===t?"cell empty":"cell",children:t},e)}))},e)}))})}),Object(r.jsx)("div",{className:"tray",children:A}),Object(r.jsx)("div",{className:"message",children:y})]})};c.a.render(Object(r.jsx)(s.a.StrictMode,{children:Object(r.jsx)(j,{})}),document.getElementById("app"))}},[[19,1,2]]]);
//# sourceMappingURL=main.7992e30f.chunk.js.map