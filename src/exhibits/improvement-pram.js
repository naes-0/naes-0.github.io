// Original vector drawing, using a real bassinet stroller's side construction.
// Grip endpoints map to (40.2, -78.2) and (46.15, -78.2), under the mother's hands.
export function pramArt(){
  return `<g class="park-pram" transform="translate(81 0) scale(.85)">
    <path d="M-17-24Q4-18 28-24L34-16Q9-7-16-17Z" fill="#536b60"/>
    <path d="M-12-22Q6-17 25-22" fill="none" stroke="#71887a" stroke-width="2"/>
    <g fill="none" stroke="#37554e" stroke-width="5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M0-43L-16-14M0-43Q17-37 35-26L38-13"/>
      <path d="M2-43V-62"/>
    </g>
    <g class="park-pram-wheels">
      <circle cx="-16" cy="-13" r="13" fill="#304b45"/>
      <circle cx="-16" cy="-13" r="8.5" fill="#b6c0b0"/>
      <circle cx="-16" cy="-13" r="3" fill="#37554e"/>
      <path d="M-16-21V-5M-24-13H-8M-22-19L-10-7M-22-7L-10-19" stroke="#647d6e" stroke-width="1.5"/>
      <circle cx="37" cy="-9" r="9" fill="#304b45"/>
      <circle cx="37" cy="-9" r="5" fill="#b6c0b0"/>
      <circle cx="37" cy="-9" r="2" fill="#37554e"/>
    </g>
    <path d="M-32-69H44L42-51Q41-46 35-46H-24Q-30-46-31-52Z" fill="#af8797"/>
    <path d="M-28-67H39V-53Q9-48-27-54Z" fill="#b991a1"/>
    <path d="M-29-68Q5-73 42-68" fill="#e5dfcb"/>
    <g class="park-baby">
      <path d="M-26-68Q-11-76 6-69H19V-64H-26Z" fill="#cad7c5"/>
      <ellipse cx="9" cy="-72" rx="4" ry="3.5" fill="#dfb995"/>
    </g>
    <path d="M5-69L2-102Q14-99 29-96Q37-98 40-90L49-71Q30-66 5-69Z" fill="#967487"/>
    <path d="M29-96Q37-95 40-90L49-71Q32-69 17-70L26-80Z" fill="#88687c"/>
    <path d="M2-102L5-70" stroke="#d6b9c6" stroke-width="2.5"/>
    <path d="M29-96L26-80L7-70M26-80L47-72" fill="none" stroke="#ab8c9e" stroke-width="1.5"/>
    <path d="M-32-69H44" stroke="#dfc4cf" stroke-width="4" stroke-linecap="round"/>
    <path d="M-24-49H35" stroke="#8f6b7e" stroke-width="2"/>
    <g class="park-pram-pushbar" fill="none" stroke-linecap="round" stroke-linejoin="round">
      <path d="M-45-90L-20-67L0-43" stroke="#37554e" stroke-width="5"/>
      <path d="M-48-92L-41-92" stroke="#29453f" stroke-width="7"/>
      <path d="M-37-83L-22-69" stroke="#789183" stroke-width="1.5"/>
    </g>
    <circle cx="0" cy="-43" r="5" fill="#294b43"/>
    <circle cx="2" cy="-62" r="4" fill="#37554e"/>
  </g>`;
}
