const terminals = new Set([
  'battery-plus', 'battery-minus', 'resistor-in', 'resistor-out',
  'led-anode', 'led-cathode', 'switch-in', 'switch-out'
]);

const colors = {positive:'#d62222', negative:'#252525', floating:'#4a61a0', short:'#8b3d8f'};

// Trace one shortest zero-resistance fault path. Branches outside this path are
// not marked as damaged; resistor and LED bodies are not ideal conductors.
export function traceShortCircuit(edges, {switchClosed = false} = {}) {
  const graph = new Map([...terminals].map(id => [id, []]));
  const add = (a, b, id, throughSwitch = false) => {
    graph.get(a).push({node:b, id, throughSwitch});
    graph.get(b).push({node:a, id, throughSwitch});
  };
  for (const edge of edges) {
    if (!edge || !terminals.has(edge.a) || !terminals.has(edge.b) || edge.a === edge.b) continue;
    add(edge.a, edge.b, edge.id ?? [edge.a, edge.b].sort().join('--'));
  }
  if (switchClosed) add('switch-in', 'switch-out', null, true);
  const queue = ['battery-plus'], previous = new Map([['battery-plus', null]]);
  for (let i = 0; i < queue.length && !previous.has('battery-minus'); i++) {
    for (const edge of graph.get(queue[i])) {
      if (previous.has(edge.node)) continue;
      previous.set(edge.node, {from:queue[i], ...edge});
      queue.push(edge.node);
    }
  }
  if (!previous.has('battery-minus')) return {wireIds:[], throughSwitch:false};
  const wireIds = [];
  let node = 'battery-minus', throughSwitch = false;
  while (previous.get(node)) {
    const edge = previous.get(node);
    if (edge.throughSwitch) throughSwitch = true;
    else wireIds.push(edge.id);
    node = edge.from;
  }
  return {wireIds:wireIds.reverse(), throughSwitch};
}

// A qualitative topology model, not a voltage/current simulation. The resistor
// limits LED current only when it is in the forward loop and has no wire bypass.
// A battery short takes priority: it does not imply the LED itself burns out.
export function analyzeCircuit(edges, {switchClosed = false} = {}) {
  const parent = new Map([...terminals].map(id => [id, id]));
  const root = id => {
    const next = parent.get(id);
    if (next !== id) parent.set(id, root(next));
    return parent.get(id);
  };
  const join = (a, b) => parent.set(root(a), root(b));
  const wires = edges.filter(edge => edge && terminals.has(edge.a) && terminals.has(edge.b) && edge.a !== edge.b);
  for (const edge of wires) join(edge.a, edge.b);
  if (switchClosed) join('switch-in', 'switch-out');

  const positive = root('battery-plus'), negative = root('battery-minus');
  const anode = root('led-anode'), cathode = root('led-cathode');
  const resistorA = root('resistor-in'), resistorB = root('resistor-out');
  const resistorBetween = (a, b) => a !== b &&
    ((resistorA === a && resistorB === b) || (resistorA === b && resistorB === a));

  let state = 'off';
  if (positive === negative) state = 'short';
  else if (anode === positive && cathode === negative) state = 'burnout';
  else if (
    (cathode === negative && anode !== negative && resistorBetween(positive, anode)) ||
    (anode === positive && cathode !== positive && resistorBetween(cathode, negative))
  ) state = 'lit';

  const networkColors = new Map();
  networkColors.set(positive, positive === negative ? colors.short : colors.positive);
  if (positive !== negative) networkColors.set(negative, colors.negative);
  // Carry the rail convention through the resistor to an otherwise floating
  // branch, while preserving an independently wired opposite rail's color.
  if (positive !== negative && resistorA !== resistorB) {
    if (networkColors.has(resistorA) && !networkColors.has(resistorB))
      networkColors.set(resistorB, networkColors.get(resistorA));
    else if (networkColors.has(resistorB) && !networkColors.has(resistorA))
      networkColors.set(resistorA, networkColors.get(resistorB));
  }
  const wireColors = Object.fromEntries(wires.map(edge => [
    edge.id ?? [edge.a, edge.b].sort().join('--'),
    networkColors.get(root(edge.a)) ?? colors.floating
  ]));
  return {state, wireColors};
}
