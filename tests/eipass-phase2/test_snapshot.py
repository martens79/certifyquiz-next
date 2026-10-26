"""Synthetic offline QA: passing tests do NOT validate production keys."""
import copy
import importlib.util
import json
import pathlib
import re
import unittest

ROOT = pathlib.Path(__file__).resolve().parents[2]
spec = importlib.util.spec_from_file_location('snapshot', ROOT/'scripts/eipass-phase2/snapshot.py')
qa = importlib.util.module_from_spec(spec)
spec.loader.exec_module(qa)
C = json.loads((ROOT/'docs/eipass-phase2/candidates.json').read_text())

def synthetic():
    data = {'metadata':[{'database_name':'quiz_db'}],'schema':[], 'question':[], 'answer':[], 'topic':[]}
    for t in {c['topic_id'] for c in C['items']}:
        data['topic'].append({'id':t,'certification_id':3})
    for c in C['items']:
        q = {'id':c['question_id'],'topic_id':c['topic_id'],'is_active':1}
        for lang in qa.LANGS:
            suffix = '' if lang=='it' else '_'+lang
            q['question'+suffix] = c['audit_it']['question'] if lang=='it' else None
            q['explanation'+suffix] = None
        data['question'].append(q)
        for a in c['audit_it']['answers']:
            data['answer'].append({'id':a['id'],'question_id':c['question_id'],'is_correct':int(a['id']==c['candidate_semantic_answer_id']),
                                   'answer_text':a['text'],'answer_text_en':None,'answer_text_fr':None,'answer_text_es':None})
    return {'data':data,'sha256':qa.digest(data)}

class SnapshotTests(unittest.TestCase):
    def test_scope_matches_the_complete_main_audit(self):
        audit = (ROOT/'docs/eipass-release1/QUESTION_REVIEW_19.md').read_text()
        pairs = {(int(a),int(b)) for a,b in re.findall(r'## ID (\d+) — topic(\d+)', audit)}
        self.assertEqual(pairs, {(x['question_id'],x['topic_id']) for x in C['items']})
        self.assertEqual(len(pairs),19)

    def test_no_candidate_claims_a_database_key_or_missing_translation(self):
        self.assertFalse(C['database_read']); self.assertEqual(C['ready_for_approval'],0)
        for c in C['items']:
            with self.subTest(id=c['question_id']):
                self.assertIsNone(c['db_correct_answer_ids']);self.assertIsNone(c['db_before'])
                self.assertEqual(c['audit_sha256'],qa.digest(c['audit_it']))
                self.assertEqual({a['id'] for a in c['audit_it']['answers']},{a['id'] for a in c['candidate_it']['answers']})
                self.assertIn(c['candidate_semantic_answer_id'],{a['id'] for a in c['candidate_it']['answers']})
                self.assertEqual(len({a['text'].strip().casefold() for a in c['candidate_it']['answers']}),4)
                self.assertTrue(c['candidate_it']['explanation'].strip())
                for lang in ('en','fr','es'):self.assertEqual(c['languages'][lang]['after_status'],'NOT_PREPARED_PENDING_BASELINE')

    def test_key_id_match_does_not_approve(self):
        result = qa.assess(synthetic(),C)
        self.assertEqual(result['ready_for_approval'],0)
        self.assertTrue(all(not r['ready_for_approval'] for r in result['items']))

    def test_wrong_key_requires_decision_and_is_never_rewritten(self):
        s = synthetic()
        rows = [a for a in s['data']['answer'] if a['question_id']==1015]
        for a in rows:a['is_correct']=int(a['id']==3823)
        s['sha256']=qa.digest(s['data']); before=copy.deepcopy(s)
        row=qa.assess(s,C)['items'][0]
        self.assertEqual(row['key_status'],'KEY_DECISION_REQUIRED')
        self.assertEqual(row['persisted_correct_answer_ids'],[3823]);self.assertEqual(s,before)

    def test_missing_or_multiple_keys_are_not_approved(self):
        for value in (0,1):
            s=synthetic()
            for a in s['data']['answer']:
                if a['question_id']==1015:a['is_correct']=value
            s['sha256']=qa.digest(s['data'])
            self.assertEqual(qa.assess(s,C)['items'][0]['key_status'],'KEY_DECISION_REQUIRED')

    def test_hash_tampering_is_rejected(self):
        s=synthetic();s['data']['question'][0]['question']='modified'
        with self.assertRaisesRegex(ValueError,'hash mismatch'):qa.assess(s,C)

    def test_null_empty_and_whitespace_produce_different_hashes(self):
        self.assertEqual(len({qa.digest({'x':v}) for v in (None,'',' ','é','e\u0301')}),5)

    def test_wrong_topic_or_certification_is_rejected(self):
        s=synthetic();s['data']['topic'][0]['certification_id']=99;s['sha256']=qa.digest(s['data'])
        with self.assertRaisesRegex(ValueError,'association mismatch'):qa.assess(s,C)

    def test_duplicate_and_missing_question_are_rejected(self):
        for duplicate in (True,False):
            s=synthetic()
            if duplicate:s['data']['question'].append(copy.deepcopy(s['data']['question'][0]))
            else:s['data']['question'].pop()
            s['sha256']=qa.digest(s['data'])
            with self.assertRaises(ValueError):qa.assess(s,C)

    def test_answer_id_drift_is_rejected(self):
        s=synthetic();s['data']['answer'][0]['id']=999999;s['sha256']=qa.digest(s['data'])
        with self.assertRaisesRegex(ValueError,'identity mismatch'):qa.assess(s,C)

    def test_missing_language_stays_missing_without_fallback(self):
        row=qa.assess(synthetic(),C)['items'][0]
        self.assertFalse(row['languages']['en']['question_present'])
        self.assertFalse(row['languages']['en']['explanation_present'])
        self.assertFalse(row['languages']['en']['all_answers_present'])

    def test_xml_retains_null_and_escapes(self):
        # Generate synthetic mysql XML for a complete export; all values remain exact.
        import xml.etree.ElementTree as ET
        data=synthetic()['data'];data['question'][0]['explanation']='A < B & C'
        result=ET.Element('resultset',{'xmlns:xsi':'http://www.w3.org/2001/XMLSchema-instance'})
        for entity,rows in data.items():
            for item in rows:
                row=ET.SubElement(result,'row')
                ET.SubElement(row,'field',{'name':'_entity'}).text=entity
                for key,value in item.items():
                    f=ET.SubElement(row,'field',{'name':key})
                    if value is None:f.set('xsi:nil','true')
                    else:f.text=str(value)
        converted=qa.convert(ET.tostring(result,encoding='unicode'))
        self.assertEqual(converted['data'],data)

    def test_formula_scenarios_and_explanations(self):
        expected={1050:('=A1+B1','=A2+B2'),13093:('=B4*C4','=B5*C5'),13110:('=A1+$B$1','=A2+$B$1')}
        for qid,(start,finish) in expected.items():
            c=next(x for x in C['items'] if x['question_id']==qid)
            answer=next(a['text'] for a in c['candidate_it']['answers'] if a['id']==c['candidate_semantic_answer_id'])
            self.assertIn(start,c['candidate_it']['question']);self.assertEqual(answer,finish)
        self.assertIn('assoluto',next(x for x in C['items'] if x['question_id']==13110)['candidate_it']['explanation'])

    def test_export_has_no_data_mutation_statement(self):
        sql=(ROOT/'scripts/eipass-phase2/export_readonly.sql').read_text()
        sql=re.sub(r'--[^\n]*','',sql)
        statements=[s.strip() for s in sql.split(';') if s.strip()]
        for s in statements:self.assertRegex(s,r'^(SELECT|SET TRANSACTION|START TRANSACTION|ROLLBACK)\b')
        self.assertIn('READ ONLY',sql);self.assertNotIn('INTO OUTFILE',sql.upper())

if __name__=='__main__':unittest.main()
