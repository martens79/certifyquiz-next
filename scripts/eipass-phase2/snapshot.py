"""Offline XML conversion and QA only. No database client and no write SQL."""
import argparse
import hashlib
import json
import re
import xml.etree.ElementTree as ET
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
IDS = {1015,1050,1080,1169,13093,13110,25218,25228,25267,25367,25465,25508,25551,25634,25741,25753,25754,25828,25853}
LANGS = ('it','en','fr','es')

def digest(value):
    # Preserve Unicode codepoints, whitespace, NULL, empty strings and answer order.
    data = json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(',', ':'))
    return hashlib.sha256(data.encode('utf-8')).hexdigest()

def convert(xml):
    xml = re.sub(r'<\?xml[^>]*\?>', '', xml)
    result = {k: [] for k in ('metadata','schema','question','answer','topic')}
    for row in ET.fromstring('<export>'+xml+'</export>').iter('row'):
        fields = {}
        for field in row.findall('field'):
            name = field.attrib['name']
            if name in fields:
                raise ValueError('duplicate field')
            nil = field.attrib.get('{http://www.w3.org/2001/XMLSchema-instance}nil') == 'true'
            value = None if nil else (field.text or '')
            if name in ('id','topic_id','question_id','certification_id','is_correct','is_active') and value is not None:
                value = int(value)
            fields[name] = value
        entity = fields.pop('_entity')
        if entity not in result:
            raise ValueError('unknown entity')
        result[entity].append(fields)
    validate_structure(result)
    return {'data': result, 'sha256': digest(result), 'hash_algorithm':'SHA256/UTF8/JSON-sortkeys-compact/no-normalization'}

def unique(rows, label):
    mapped = {r['id']:r for r in rows}
    if len(mapped) != len(rows):
        raise ValueError('duplicate '+label+' ID')
    return mapped

def validate_structure(data):
    questions = unique(data['question'], 'question')
    answers = unique(data['answer'], 'answer')
    topics = unique(data['topic'], 'topic')
    if set(questions) != IDS:
        raise ValueError('expected exactly the 19 question IDs')
    if not data['metadata'] or data['metadata'][0].get('database_name') != 'quiz_db':
        raise ValueError('database provenance missing or unexpected')
    for q in questions.values():
        if q['topic_id'] not in topics or topics[q['topic_id']]['certification_id'] != 3:
            raise ValueError('topic/certification association mismatch')
        if q.get('certification_id', 3) not in (3,None):
            raise ValueError('question certification mismatch')
        for lang in LANGS:
            suffix = '' if lang == 'it' else '_'+lang
            if 'question'+suffix not in q or 'explanation'+suffix not in q:
                raise ValueError('missing raw language column')
    for a in answers.values():
        if a['question_id'] not in questions or a.get('is_correct') not in (0,1):
            raise ValueError('invalid answer membership/key flag')
        for lang in LANGS:
            if 'answer_text'+('' if lang=='it' else '_'+lang) not in a:
                raise ValueError('missing answer translation column')
    for qid in IDS:
        rows = [a for a in answers.values() if a['question_id']==qid]
        if not rows:
            raise ValueError('question has no answers')

def assess(snapshot, candidates):
    data = snapshot['data']
    if digest(data) != snapshot['sha256']:
        raise ValueError('snapshot hash mismatch')
    validate_structure(data)
    questions = unique(data['question'], 'question')
    result = []
    if {c['question_id'] for c in candidates['items']} != IDS or len(candidates['items']) != 19:
        raise ValueError('candidate scope mismatch')
    for c in candidates['items']:
        qid = c['question_id']; q = questions[qid]
        answers = sorted([a for a in data['answer'] if a['question_id']==qid], key=lambda a:a['id'])
        if q['topic_id'] != c['topic_id'] or {a['id'] for a in answers} != {a['id'] for a in c['candidate_it']['answers']}:
            raise ValueError('candidate identity mismatch')
        keys = [a['id'] for a in answers if a['is_correct']==1]
        key_state = 'MATCH_REQUIRES_REVIEW' if keys==[c['candidate_semantic_answer_id']] else 'KEY_DECISION_REQUIRED'
        languages = {}
        for lang in LANGS:
            suffix = '' if lang=='it' else '_'+lang
            languages[lang] = {
                'question_present': bool(q['question'+suffix] and q['question'+suffix].strip()),
                'explanation_present': bool(q['explanation'+suffix] and q['explanation'+suffix].strip()),
                'all_answers_present': all(a['answer_text'+suffix] and a['answer_text'+suffix].strip() for a in answers),
            }
        result.append({'question_id':qid,'persisted_correct_answer_ids':keys,'candidate_semantic_answer_id':c['candidate_semantic_answer_id'],
                       'key_status':key_state,'before_sha256':digest({'question':q,'answers':answers,'topic':next(t for t in data['topic'] if t['id']==q['topic_id'])}),
                       'languages':languages,'ready_for_approval':False})
    # A matching ID is NOT proof of semantic correctness or a reviewer signature.
    return {'ready_for_approval':0,'items':result,'production_writes':0}

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('mode', choices=['convert','assess'])
    parser.add_argument('input', type=Path)
    args = parser.parse_args()
    if args.mode == 'convert':
        output = convert(args.input.read_text(encoding='utf-8'))
    else:
        output = assess(json.loads(args.input.read_text()), json.loads((ROOT/'docs/eipass-phase2/candidates.json').read_text()))
    print(json.dumps(output,ensure_ascii=False,indent=2))
