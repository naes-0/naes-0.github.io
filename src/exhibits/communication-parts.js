// Original technical vector artwork. Four components; no change to the circuit.
export function communicationParts(){return `
<defs>
 <linearGradient id="comm-steel" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#dedede"/><stop offset=".42" stop-color="#fafafa"/><stop offset=".6" stop-color="#a5a5a5"/><stop offset="1" stop-color="#d3d3d3"/></linearGradient>
 <linearGradient id="comm-lens" x1="0" y1="0" x2="1" y2="0"><stop stop-color="#d52729"/><stop offset=".3" stop-color="#f87268"/><stop offset=".55" stop-color="#ee4644"/><stop offset="1" stop-color="#b91a21"/></linearGradient>
 <radialGradient id="comm-led-light"><stop stop-color="#ffce8b" stop-opacity=".7"/><stop offset="1" stop-color="#ffbb6e" stop-opacity="0"/></radialGradient>
 <radialGradient id="comm-burn-light"><stop stop-color="#fff"/><stop offset=".2" stop-color="#fffbd3"/><stop offset=".55" stop-color="#ffb431" stop-opacity=".9"/><stop offset="1" stop-color="#ff7018" stop-opacity="0"/></radialGradient>
 <radialGradient id="comm-hot-battery"><stop stop-color="#ffb337" stop-opacity=".75"/><stop offset="1" stop-color="#e44013" stop-opacity="0"/></radialGradient>
</defs>
<!-- 9V battery, front and top cap. -->
<g class="communication-battery" stroke-linejoin="round">
 <rect class="communication-battery-heat" x="70" y="260" width="153" height="284" rx="8" fill="none" stroke="#d45d27" stroke-width="2"/>
 <rect x="74" y="265" width="145" height="275" rx="5" fill="#303030" stroke="#151515" stroke-width="1"/>
 <path d="M75 265H218V328H75Z" fill="#c48746"/>
 <path d="M79 330H214M79 534H214" stroke="#585858" stroke-width="1"/>
 <path d="M80 333V530" stroke="#666" stroke-width=".7"/>
 <path d="M214 333V530" stroke="#151515" stroke-width="1"/>
 <rect x="73" y="258" width="147" height="12" rx="2" fill="#4b4b4b" stroke="#1a1a1a"/>
 <path d="M99 258V249Q99 245 104 244H116Q121 245 121 249V258Z" fill="url(#comm-steel)" stroke="#777" stroke-width=".8"/>
 <ellipse cx="110" cy="246" rx="11" ry="3" fill="#e1e1e1" stroke="#777" stroke-width=".7"/>
 <path d="M166 258V247L173 242H187L194 247V258Z" fill="url(#comm-steel)" stroke="#777" stroke-width=".8"/>
 <path d="M171 248L175 245H185L189 248L185 252H175Z" fill="#555" stroke="#888" stroke-width=".6"/>
 <path d="M105 290H115M110 285V295M175 290H185" stroke="#46301c" stroke-width="1.5"/>
 <text x="146" y="411" text-anchor="middle" fill="#f2f2f2" font-size="30" font-family="Arial,sans-serif">9V</text>
 <rect class="communication-battery-hot" x="75" y="270" width="143" height="268" rx="4" fill="#e65d1e"/>
 <path class="communication-battery-scorch" d="M188 271l9 12-5 9 16 13-9 12 19 19V271ZM215 365l-12 17 6 10-15 25 24-12Z" fill="#171310"/>
</g>
<g class="communication-battery-fx" pointer-events="none">
 <ellipse class="communication-battery-aura" cx="147" cy="365" rx="112" ry="177" fill="url(#comm-hot-battery)"/>
 <g class="communication-battery-steam" fill="none" stroke="#776c61" stroke-width="7" stroke-linecap="round">
  <path d="M109 244C84 226 125 211 107 190S99 157 110 141"/>
  <path d="M178 241C201 222 162 207 182 185S191 155 180 139"/>
  <path d="M147 249C133 232 158 214 143 199" stroke="#b5a699" stroke-width="10"/>
 </g>
</g>
<!-- Axial resistor: continuous tinned leads and four narrow colour bands. -->
<g transform="translate(0 48)">
 <path d="M310 160H380M420 160H490" stroke="#8c8c8c" stroke-width="3"/>
 <path d="M310 159.3H380M420 159.3H490" stroke="#e6e6e6" stroke-width=".8"/>
 <path d="M380 154L383 151H389L392 153H408L411 151H417L420 154V166L417 169H411L408 167H392L389 169H383L380 166Z" fill="#d6bd8b" stroke="#aa9063" stroke-width=".7"/>
 <path d="M386 151V169" stroke="#7b482f" stroke-width="3"/><path d="M394 153V167" stroke="#242424" stroke-width="3"/><path d="M402 153V167" stroke="#c3372a" stroke-width="3"/><path d="M413 151V169" stroke="#b4a04b" stroke-width="2"/>
 <path d="M381 154H384M406 154H409" stroke="#eee0b9" stroke-width=".7"/>
</g>
<!-- LED lens, flange, lead frame and two separate legs. -->
<g>
 <path d="M624 242V279L600 300M638 242V279L680 300" fill="none" stroke="#999" stroke-width="3" stroke-linejoin="round"/>
 <path d="M623.4 242V278L600 299.3M637.4 242V278L680 299.3" fill="none" stroke="#e5e5e5" stroke-width=".9"/>
 <path class="communication-led-lens" d="M615 239V216A16 16 0 0 1 647 216V239Z" fill="url(#comm-lens)" fill-opacity=".85" stroke="#b32228" stroke-width=".7"/>
 <path d="M623 239V223L630 229H638V239M636 229V218" fill="none" stroke="#a5282c" stroke-width="1" opacity=".7"/>
 <path d="M619 215Q619 207 626 205" stroke="#fff" stroke-width="2.4" stroke-linecap="round" fill="none" opacity=".7"/>
 <path d="M612 239H650V245H612Z" fill="#db4444" fill-opacity=".9" stroke="#ac2027" stroke-width=".6"/>
 <path d="M614 241H648" stroke="#ff8c7c" stroke-width=".7"/>
</g>
<circle class="communication-led-glow" cx="631" cy="220" r="50" fill="url(#comm-led-light)"/>
<g class="communication-burn-effects" pointer-events="none">
 <circle class="communication-burn-flare" cx="631" cy="219" r="64" fill="url(#comm-burn-light)"/>
 <g transform="translate(631 219)"><g class="communication-sparks" stroke="#e47a1b" stroke-width="3" stroke-linecap="round" fill="none">
  <path d="M-27-24l-20-19M-9-34l-3-25M19-29l14-22M34-7l26-6M29 21l19 16M4 33l2 22M-24 23l-20 18M-35 2l-23 3"/>
 </g></g>
 <g class="communication-smoke" fill="none" stroke="#6e6762" stroke-width="8" stroke-linecap="round">
  <path d="M628 202C605 186 649 173 628 150S610 117 631 104"/>
  <path d="M636 199C659 181 617 167 641 141S658 115 642 100"/>
  <path d="M631 197C638 181 631 171 622 159" stroke="#aaa09a" stroke-width="11"/>
 </g>
</g>
<!-- The original two-terminal switch; lead geometry stays visible. -->
<g stroke-linejoin="round">
 <path d="M460 440H502M598 440H640" stroke="#999" stroke-width="3"/>
 <path d="M460 439.3H502M598 439.3H640" stroke="#eee" stroke-width=".9"/>
 <rect x="490" y="412" width="120" height="58" rx="2" fill="#353535" stroke="#191919"/>
 <rect x="497" y="419" width="106" height="44" rx="1" fill="#dedede" stroke="#939393" stroke-width=".7"/>
 <path d="M501 456H599" stroke="#b2b2b2" stroke-width="1"/>
 <rect class="communication-switch-contact" x="502" y="431" width="12" height="18" rx="1" fill="#b6a370" stroke="#8c7f5c" stroke-width=".8"/>
 <rect class="communication-switch-contact" x="586" y="431" width="12" height="18" rx="1" fill="#b6a370" stroke="#8c7f5c" stroke-width=".8"/>
 <g class="communication-switch-blade"><path d="M508 440H592" stroke="#8a8a8a" stroke-width="7"/><path d="M508 437.5H592" stroke="#f5f5f5" stroke-width="1.5"/><rect x="562" y="434" width="23" height="12" rx="1" fill="#242424" stroke="#111" stroke-width=".6"/></g>
 <circle cx="508" cy="440" r="4.5" fill="url(#comm-steel)" stroke="#777" stroke-width=".6"/><path d="M505 440H511" stroke="#666" stroke-width=".8"/>
 <circle cx="592" cy="440" r="4.5" fill="url(#comm-steel)" stroke="#777" stroke-width=".6"/><path d="M589 440H595" stroke="#666" stroke-width=".8"/>
</g>
<g class="communication-switch-fx" pointer-events="none">
 <path class="communication-switch-scorch" d="M497 432l11-9 9 10-5 18-14 3ZM581 430l15-7 8 16-8 15-17-6Z" fill="#27201c"/>
 <g transform="translate(508 440)"><g class="communication-switch-sparks" fill="none" stroke="#f7951b" stroke-width="3" stroke-linecap="round"><path d="M-9-11l-14-17M3-13l5-20M14-4l20-5M11 8l17 15M-12 7l-20 11"/></g></g>
 <g transform="translate(592 440)"><g class="communication-switch-sparks" fill="none" stroke="#f7951b" stroke-width="3" stroke-linecap="round"><path d="M-12-5l-16-9M-2-13l-4-18M12-8l18-14M12 7l17 13M-9 11l-8 15"/></g></g>
</g>`;}
