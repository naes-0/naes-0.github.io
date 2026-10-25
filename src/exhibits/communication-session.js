// Damage lasts for the document lifetime; wire rebuilding never repairs components.
export function createCommunicationSession(damage={battery:false,led:false}) {
  const attempts=new Set();
  return {
    damage,
    observe(state) {
      const batteryFailedNow=state==='short'&&!damage.battery;
      const ledFailedNow=state==='burnout'&&!damage.battery&&!damage.led;
      if(batteryFailedNow)damage.battery=true;
      if(ledFailedNow)damage.led=true;
      return {batteryFailedNow,ledFailedNow,lit:state==='lit'&&!damage.battery&&!damage.led,
        state:damage.battery?'battery-dead':damage.led?'burnout':state};
    },
    connect(a,b) {if(a!==b)attempts.add([a,b].sort().join('--'));return attempts.size>=10;},
    get count(){return attempts.size;},
    resetRound(){attempts.clear();}
  };
}
