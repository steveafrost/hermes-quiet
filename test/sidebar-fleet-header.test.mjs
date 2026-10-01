import assert from 'node:assert/strict'
import test from 'node:test'
import {loadPluginInternals} from './helpers/load-plugin.mjs'

const connections=[{id:'local',label:'This device',kind:'local',primary:true},{id:'scooter-taild13e1-ts-net',label:'scooter',kind:'remote'},{id:'mr-chips-2',label:'mr-chips 2',kind:'ssh'}]
const roster={sources:[{connectionId:'local',reachable:true},{connectionId:'scooter-taild13e1-ts-net',reachable:false},{connectionId:'mr-chips-2',reachable:true,error:'connect-on-demand'}],agents:[{connectionId:'mr-chips-2',profile:'media'},{connectionId:'scooter-taild13e1-ts-net',profile:'media'}]}

test('fleet menu lists registered gateways plus Media on Mr Chips using canonical routes',async()=>{
 const {buildFleetHeaderChoices,fleetHeaderLabel}=await loadPluginInternals(['buildFleetHeaderChoices','fleetHeaderLabel'])
 assert.equal(typeof buildFleetHeaderChoices,'function')
 const rows=buildFleetHeaderChoices(connections,roster)
 assert.deepEqual(Array.from(rows,r=>r.label),['Laptop','Mr Chips','Scooter','Media'])
 assert.equal(rows[0].icon,'device-desktop')
 assert.equal(rows[3].connectionId,'mr-chips-2');assert.equal(rows[3].profile,'media')
 assert.equal(rows[2].detail,'Unavailable');assert.equal(rows[1].detail,'Connect on demand')
 assert.equal(fleetHeaderLabel(rows,'local','default'),'Laptop')
 assert.equal(fleetHeaderLabel(rows,'mr-chips-2','default'),'Mr Chips')
 assert.equal(fleetHeaderLabel(rows,'mr-chips-2','media'),'Media')
 assert.equal(fleetHeaderLabel(rows,'local','research'),'research')
 assert.equal(new Set(rows.map(r=>r.key)).size,rows.length)
})

test('fleet menu keeps offline gateways and extra registrations without inventing media routes',async()=>{
 const {buildFleetHeaderChoices}=await loadPluginInternals(['buildFleetHeaderChoices'])
 const rows=buildFleetHeaderChoices([...connections,{id:'lab',label:'Lab',kind:'remote'}],{sources:[],agents:[]})
 assert.ok(rows.some(r=>r.label==='Scooter'));assert.ok(rows.some(r=>r.label==='Lab'))
 assert.ok(!rows.some(r=>r.label==='Media'))
})

test('roster failure leaves registered gateways usable and reports the partial load',async()=>{
 const {loadFleetHeaderData}=await loadPluginInternals(['loadFleetHeaderData'],{host:{connections:async()=>connections,agents:async()=>{throw new Error('Roster unavailable')}}})
 const result=await loadFleetHeaderData();assert.equal(result.connections.length,3);assert.match(result.error,/Roster unavailable/)
})
