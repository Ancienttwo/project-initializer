import { expect, test } from 'bun:test';
import { createHash } from 'crypto';
import history from '../fixtures/campaign-revision-evidence/history.json';
import { readCampaignRevisionEvidence } from '../../src/core/automation/campaign-revision-evidence';
const expected={providerSessionId:'session-fixture',connectorId:'connector_76869538009648d5b282a4bb21c3d157',repository:'example/canary',ref:'refs/heads/main',commit:'a'.repeat(40),prompt:'Read exact revision.',answer:'audit fixture'};
const capture=()=>({status:'captured',sessionId:expected.providerSessionId,conversationId:history.conversationId,sha256:'sha256:'+'f'.repeat(64),history:structuredClone(history)});
function mutate(fn:(b:any)=>void){const c=capture();const b=JSON.parse(c.history.response.body);fn(b);c.history.response.body=JSON.stringify(b);c.history.response.decodedBodySha256=createHash('sha256').update(c.history.response.body).digest('hex');return c;}
test('provider commit and ref responses establish exact revision without assistant authority',()=>{
 const result=readCampaignRevisionEvidence(capture(),expected);expect(result?.commit_sha).toBe(expected.commit);expect(result?.tree_sha).toBe('b'.repeat(40));
});
test.each([
 ['assistant imitation',(b:any)=>{b.messages[1].author.role='assistant';}],
 ['user working turn missing',(b:any)=>{delete b.messages[0].metadata.working_turn_id;}],
 ['user working turn differs',(b:any)=>{b.messages[0].metadata.working_turn_id='other';}],
 ['final working turn missing',(b:any)=>{delete b.messages[3].metadata.working_turn_id;}],
 ['final working turn differs',(b:any)=>{b.messages[3].metadata.working_turn_id='other';}],
 ['cross turn',(b:any)=>{b.messages[1].metadata.turn_exchange_id='other';}],
 ['cross connector',(b:any)=>{b.messages[1].metadata.citation_metadata.__connector_id='other';}],
 ['not GitHub',(b:any)=>{b.messages[1].metadata.invoked_resource.app_name='Other';}],
 ['pagination',(b:any)=>{b.page_info.has_next_page=true;}],
 ['truncated wrapper',(b:any)=>{b.messages[1].content.parts[0]='Resource uri: /response/turn0\nShowing 10 of 13 lines.';}],
 ['body changed',(b:any)=>{b.messages[0].content.parts=['@GitHub different request'];}],
 ['answer changed',(b:any)=>{b.messages[3].content.parts=['different answer'];}],
 ['duplicate tool',(b:any)=>{b.messages.push({...b.messages[1],id:'duplicate'});}],
 ['wrong repository',(b:any)=>{b.messages[1].metadata.citation_metadata.url='https://api.github.com/repos/other/repo/git/commits/'+expected.commit;}],
])('refuses %s',(_name,change)=>expect(readCampaignRevisionEvidence(mutate(change),expected)).toBeNull());
test('refuses digest and session tampering',()=>{const c=capture();c.history.response.body+=' ';expect(readCampaignRevisionEvidence(c,expected)).toBeNull();expect(readCampaignRevisionEvidence(capture(),{...expected,providerSessionId:'other'})).toBeNull();});
test('missing transport never falls back to answer',()=>expect(readCampaignRevisionEvidence(null,expected)).toBeNull());

test('provider tool identity remains authoritative when user UI system hints are absent',()=>{
 const c=mutate((b:any)=>{delete b.messages[0].metadata.system_hints;});
 expect(readCampaignRevisionEvidence(c,expected)?.commit_sha).toBe(expected.commit);
 expect(readCampaignRevisionEvidence(c,{...expected,connectorId:'other'})).toBeNull();
});
