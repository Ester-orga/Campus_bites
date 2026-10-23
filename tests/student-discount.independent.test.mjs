/**
 * Facilitator-owned, independent acceptance criteria for the student discount.
 * The agents cannot edit this file through their write tools. These tests
 * exercise the observable API and frontend feature contract, not source shapes.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import {ui, handle, makeView, makeCtx, apiFrom, summaryLines} from './helpers.mjs';

function readyView(bag={pizza:1,biryani:1}, state) {return makeView(bag,state);}
function actionAndInput(html) {
  const action=html.match(/data-action\s*=\s*['"]([^'"]+)['"]/i)?.[1];
  const input=html.match(/<input\b[^>]*\bname\s*=\s*['"]([^'"]+)['"][^>]*>/i)?.[1];
  assert.ok(action, 'Feature must include an interactive data-action button');
  assert.ok(input, 'Feature must include a named input to enter a code');
  return {action,input};
}
async function apply(code, bag={pizza:1,biryani:1}, recordedCalls=[]) {
  assert.ok(ui.feature && ui.feature.slot==='bag', 'Coupon section must become a visible bag feature');
  const original=readyView(bag);
  const html=ui.render(original);
  assert.match(html, /<input\b/i, 'Feature must visibly render a coupon input');
  assert.match(html, /<button\b/i, 'Feature must visibly render an apply button');
  const {action,input}=actionAndInput(html);
  const api=apiFrom(makeCtx());
  const captured=async (name,body)=>{recordedCalls.push({name,body});return api(name,body);};
  const state=await ui.onAction(action,{[input]:code},original,captured);
  assert.ok(recordedCalls.length>0,'Applying a coupon must call the backend API');
  return {state,lines:summaryLines(ui,readyView(bag,state)),html:ui.render(readyView(bag,state))};
}
function discountAmount(lines) {
  assert.ok(Array.isArray(lines));
  return lines.reduce((sum,line)=>sum+(Number.isFinite(line.amount) && line.amount<0 ? -line.amount : 0),0);
}

// These four API cases run independently of the frontend: when the Backend
// agent finishes first, its tool receives real backend-specific feedback.
function coupon(code, items) {
  return handle('apply-coupon', {code,items}, makeCtx());
}
test('API: independent verification rejects an invalid coupon',()=>{
  const r=coupon('NOTSTUDENT10',[{id:'pizza',qty:2}]);
  assert.equal(r.valid,false);
  assert.equal(r.discount??0,0);
});

test('API: independent verification gives ₹49 on ₹488 subtotal',()=>{
  const r=coupon('STUDENT10',[{id:'pizza',qty:1},{id:'biryani',qty:1}]);
  assert.equal(r.valid,true);
  assert.equal(r.discount,49);
});

test('API: independent verification rejects ₹259 below ₹299',()=>{
  const r=coupon('STUDENT10',[{id:'pizza',qty:1,price:9999}]);
  assert.equal(r.valid,false,'Client-submitted prices must not bypass eligibility');
  assert.equal(r.discount??0,0);
});

test('API: independent verification caps discount at ₹100',()=>{
  const r=coupon('STUDENT10',[{id:'pizza',qty:10}]);
  assert.equal(r.valid,true);
  assert.equal(r.discount,100);
});

test('UI: independent verification maintains correct discount on cart changes',async()=>{
  const {state}=await apply('STUDENT10',{pizza:2,biryani:1});
  assert.equal(discountAmount(summaryLines(ui,readyView({pizza:1,biryani:1},state))),49,
    'When cart changes to ₹488, discount must recalculate to ₹49');
  assert.equal(discountAmount(summaryLines(ui,readyView({pizza:1},state))),0,
    'Coupon cannot remain effective on an ineligible ₹259 bag');
});

test('UI: independent verification renders genuine student coupon section',async()=>{
  const {html,lines}=await apply('STUDENT10');
  assert.match(html,/student|coupon|discount|offer/i);
  assert.equal(discountAmount(lines),49);
});
