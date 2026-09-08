import { createHash } from 'crypto';
import { canonicalMessageDigest } from '../messages/mechanics';

type ObjectValue = Record<string, unknown>;
function object(value: unknown): ObjectValue {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('revision evidence object missing');
  return value as ObjectValue;
}
function requireThat(value: unknown): asserts value {
  if (!value) throw new Error('revision evidence binding differs');
}
const sha = (value: string) => 'sha256:' + createHash('sha256').update(value).digest('hex');
export interface CampaignRevisionEvidence {
  readonly protocol: 1;
  readonly kind: 'repo-harness-campaign-revision-evidence';
  readonly provider_session_ref: string;
  readonly conversation_id: string;
  readonly turn_id: string;
  readonly connector_id: string;
  readonly repository: string;
  readonly ref: string;
  readonly commit_sha: string;
  readonly tree_sha: string;
  readonly history_sha256: string;
  readonly capture_sha256: string;
  readonly prompt_sha256: string;
  readonly answer_sha256: string;
  readonly commit_message_id: string;
  readonly ref_message_id: string;
  readonly evidence_sha256: string;
}
export interface RevisionExpectation {
  readonly providerSessionId: string;
  readonly connectorId: string;
  readonly repository: string;
  readonly ref: string;
  readonly commit: string;
  readonly prompt: string;
  readonly answer: string;
}

/** Decode the provider's complete numbered JSON wrapper; never scan answer text for an OID. */
function toolObject(message: ObjectValue, connector: string, turn: string, url: string): ObjectValue | null {
  const author=object(message.author), meta=object(message.metadata);
  if(author.role!=='tool' || author.name!=='api_tool.call_tool') return null;
  const citation=object(meta.citation_metadata);
  if(citation.url!==url) return null;
  const resource=object(meta.invoked_resource);
  requireThat(meta.turn_exchange_id===turn && meta.working_turn_id===turn && citation.__connector_id===connector
    && resource.app_name==='GitHub' && resource.api_tool_version==='v2' && resource.publish_status==='published'
    && typeof resource.resource_uri==='string' && resource.resource_uri.startsWith('/'+connector+'/') && resource.resource_uri.endsWith('/fetch')
    && message.status==='finished_successfully');
  const content=object(message.content), parts=content.parts;
  requireThat(content.content_type==='multimodal_text' && Array.isArray(parts) && parts.length===3 && parts.every(p=>typeof p==='string'));
  const header=(parts[0] as string).match(/^Resource uri: \/response\/turn\d+\nShowing (\d+) of (\d+) lines\.$/);
  requireThat(header && header[1]===header[2]);
  const lines=(parts[2] as string).split('\n');
  requireThat(lines.length===Number(header[1]));
  const wrapper=object(JSON.parse(lines.map((line,i)=>{const prefix=`[L${i+1}] `;requireThat(line.startsWith(prefix));return line.slice(prefix.length);}).join('\n')));
  const structured=object(wrapper.structuredContent);
  requireThat(wrapper.url===url && wrapper.display_url===url && structured.display_url===url && typeof wrapper.content==='string' && structured.content===wrapper.content);
  return object(JSON.parse(wrapper.content as string));
}

/** Caller supplies only history obtained at the invocation-owned provider effect boundary. */
export function readCampaignRevisionEvidence(capture: unknown, expected: RevisionExpectation): CampaignRevisionEvidence | null {
  try {
    const c=object(capture); if(c.status!=='captured') return null;
    requireThat(c.sessionId===expected.providerSessionId && typeof c.sha256==='string' && /^sha256:[a-f0-9]{64}$/.test(c.sha256));
    const h=object(c.history), request=object(h.request), response=object(h.response);
    requireThat(h.protocol===1 && h.kind==='chatgpt-conversation-history' && typeof h.conversationId==='string' && h.conversationId===c.conversationId
      && typeof h.capturedAt==='string' && Number.isFinite(Date.parse(h.capturedAt)));
    const url=new URL(String(request.url));
    requireThat(request.method==='GET' && url.origin==='https://chatgpt.com' && url.pathname===`/backend-api/conversations/${h.conversationId}`
      && response.status===200 && response.mimeType==='application/json' && typeof response.body==='string' && Buffer.byteLength(response.body)<=8*1024*1024
      && sha(response.body)==='sha256:'+response.decodedBodySha256);
    const history=object(JSON.parse(response.body as string)), page=object(history.page_info);
    requireThat(history.conversation_id===h.conversationId && page.has_previous_page===false && page.has_next_page===false && history.context_truncation_continuation===null
      && Array.isArray(history.messages) && history.messages.length<=1024);
    const messages=(history.messages as unknown[]).map(object);
    requireThat(new Set(messages.map(m=>m.id)).size===messages.length && messages.every(m=>typeof m.id==='string'));
    const users=messages.filter(m=>object(m.author).role==='user'); requireThat(users.length===1);
    const user=users[0]!, userMeta=object(user.metadata), content=object(user.content);
    requireThat(content.content_type==='text' && Array.isArray(content.parts) && content.parts.length===1
      && content.parts[0]==='@GitHub '+expected.prompt && Array.isArray(userMeta.system_hints) && userMeta.system_hints.includes('plugin:'+expected.connectorId)
      && typeof userMeta.turn_exchange_id==='string');
    const turn=userMeta.turn_exchange_id as string;
    const final=messages.find(m=>m.id===history.current_node);requireThat(final && object(final.author).role==='assistant' && final.status==='finished_successfully' && final.end_turn===true
      && object(final.metadata).turn_exchange_id===turn);
    const finalContent=object(final.content);requireThat(finalContent.content_type==='text' && Array.isArray(finalContent.parts) && finalContent.parts.length===1
      && typeof finalContent.parts[0]==='string' && finalContent.parts[0].trim()===expected.answer.trim());
    requireThat(/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(expected.repository) && expected.ref.startsWith('refs/heads/') && /^[a-f0-9]{40}$/.test(expected.commit));
    const base='https://api.github.com/repos/'+expected.repository;
    const commitUrl=base+'/git/commits/'+expected.commit, refUrl=base+'/git/ref/'+expected.ref.slice(5);
    const toolMessages=messages.filter(m=>object(m.author).role==='tool' && object(m.author).name==='api_tool.call_tool');
    const commits=toolMessages.map(m=>({m,value:toolObject(m,expected.connectorId,turn,commitUrl)})).filter(e=>e.value);
    const refs=toolMessages.map(m=>({m,value:toolObject(m,expected.connectorId,turn,refUrl)})).filter(e=>e.value);
    requireThat(commits.length===1 && refs.length===1);
    const commit=commits[0]!.value!, ref=refs[0]!.value!, tree=object(commit.tree), refObject=object(ref.object);
    requireThat(commit.sha===expected.commit && commit.url===commitUrl && typeof tree.sha==='string' && /^[a-f0-9]{40}$/.test(tree.sha)
      && tree.url===base+'/git/trees/'+tree.sha && ref.ref===expected.ref && ref.url===base+'/git/'+expected.ref
      && refObject.type==='commit' && refObject.sha===expected.commit && refObject.url===commitUrl);
    const basis={protocol:1 as const,kind:'repo-harness-campaign-revision-evidence' as const,provider_session_ref:expected.providerSessionId,
      conversation_id:h.conversationId as string,turn_id:turn,connector_id:expected.connectorId,repository:expected.repository,ref:expected.ref,commit_sha:expected.commit,
      tree_sha:tree.sha as string,history_sha256:sha(response.body as string),capture_sha256:c.sha256 as string,prompt_sha256:sha(expected.prompt),answer_sha256:sha(expected.answer),
      commit_message_id:commits[0]!.m.id as string,ref_message_id:refs[0]!.m.id as string};
    return {...basis,evidence_sha256:canonicalMessageDigest(basis)};
  } catch { return null; }
}
