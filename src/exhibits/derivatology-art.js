// The contours are traced from the approved mockup; no replacement font.
export function derivatologyLeft(c){
  const width=c.mediaLocale==='ru'?870:900;
  return `<svg class="deriv-left-art" viewBox="0 0 ${width} 1024" aria-hidden="true"><image href="/assets/derivatology-woman.webp" x="65" y="307" width="750" height="610" preserveAspectRatio="xMidYMax meet"/><image href="/assets/derivatology-lettering-${c.mediaLocale}.svg" x="0" y="0" width="${width}" height="1024"/></svg>`;
}
