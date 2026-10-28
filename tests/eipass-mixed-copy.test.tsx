import assert from "node:assert/strict";
import test from "node:test";
import React from "react";
import { act, create, type ReactTestRenderer } from "react-test-renderer";
import { clientComponent } from "./helpers/client-component";
import { EIPASS_USER_COPY } from "../src/lib/eipass-user-release";
import { getExamSpecForCert } from "../src/lib/exam-specs";
import { APPLE_DEVICE_SUPPORT_SLUG, APPLE_DEVICE_SUPPORT_MOCK_NOTICE } from "../src/lib/apple-device-support-release";

(globalThis as Record<string, unknown>).IS_REACT_ACT_ENVIRONMENT = true;
const legacyClaim = { it: "numero domande realistico", en: "official-like question count", fr: "nombre de questions proche de l’officiel", es: "número de preguntas similar al oficial" };
for (const lang of ["it", "en", "fr", "es"] as const) {
  for (const slug of ["eipass", "ccna", APPLE_DEVICE_SUPPORT_SLUG]) {
    test(`${lang}/${slug}: real mixed-page rendering scopes editorial copy without changing exam behavior`, async () => {
      const Component = clientComponent("../../src/app/[lang]/quiz/[slug]/mixed/page.tsx", {
        "next/navigation": {useParams:()=>({lang,slug}),useSearchParams:()=>new URLSearchParams()},
        "@/components/auth/AuthProvider": {useAuth:()=>({isPremiumUser:false,premiumLocked:false,isAdmin:false})},
        "@/components/quiz/QuizEngine": {__esModule:true,default:()=>React.createElement("div",null,"Fixture engine")},
        "@/components/ui/ComingSoonBox": {__esModule:true,default:()=>null},
        "@/lib/eipass-user-release": {EIPASS_USER_COPY},
        "@/lib/certs": {CERT_ID_BY_SLUG:{eipass:3,ccna:7,[APPLE_DEVICE_SUPPORT_SLUG]:999}},
        "@/lib/i18n": {withLang:(l:string,p:string)=>`/${l}${p}`},
        "@/lib/exam-specs": {getExamSpecForCert},
        "@/lib/apple-device-support-release": {APPLE_DEVICE_SUPPORT_SLUG,APPLE_DEVICE_SUPPORT_MOCK_NOTICE},
        "@/lib/apiClient": {getAccessToken:()=>null,getCertificationPoolTotal:async()=>1248,getCertificationBySlug:async()=>({id:3}),getMixedQuestions:async()=>[],getAssessmentQuestions:async()=>[],getMockExamQuestions:async()=>[],saveExam:async()=>({ok:true})},
      });
      let renderer!:ReactTestRenderer;
      await act(async()=>{renderer=create(<Component/>);});
      const rendered=JSON.stringify(renderer.toJSON());
      if(slug==="eipass"){
        assert.ok(rendered.includes(EIPASS_USER_COPY.mixedDescription[lang]));
        assert.ok(rendered.includes(EIPASS_USER_COPY.practiceTitle[lang]));
        for(const claim of Object.values(legacyClaim)) assert.ok(!rendered.includes(claim),claim);
        assert.doesNotMatch(rendered,/official|ufficial|officiel|oficial|realistic|readiness|simulaz|simulation|simulación/i);
        assert.equal(getExamSpecForCert(3,1248).questions,60,"editorial change must preserve the existing practice specification");
      } else if(slug==="ccna") assert.ok(rendered.includes(legacyClaim[lang]),"other certification copy is unchanged");
      else assert.ok(!rendered.includes(legacyClaim[lang]),"Apple's existing exclusion is preserved");
      await act(async()=>renderer.unmount());
    });
  }
}
