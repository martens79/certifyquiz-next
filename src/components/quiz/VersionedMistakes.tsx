import type {Locale} from '@/lib/quiz-types';
export type ArchivedMistake={id:number;attemptId:string;question:string;answers:{id:number;text:string}[];chosenAnswerId:number;correctAnswerId:number;explanation:string;contentHash:string};
export default function VersionedMistakes({items,lang}:{items:ArchivedMistake[];lang:Locale}){
 if(!items.length)return null;
 const title={it:'Errori dei quiz precedenti',en:'Mistakes from previous quizzes',fr:'Erreurs des quiz précédents',es:'Errores de cuestionarios anteriores'}[lang];
 return <section className="mx-auto max-w-3xl p-4" aria-label={title}><h2 className="text-xl font-semibold">{title}</h2>{items.map(q=><article key={`${q.attemptId}:${q.id}:${q.contentHash}`} className="mt-4 rounded-xl border p-4"><p className="font-semibold">{q.question}</p><ul>{q.answers.map(a=><li key={a.id} className={a.id===q.correctAnswerId?'text-emerald-700':a.id===q.chosenAnswerId?'text-red-700':''}>{a.id===q.correctAnswerId?'✓ ':a.id===q.chosenAnswerId?'✗ ':''}{a.text}</li>)}</ul><p className="mt-2">{q.explanation}</p></article>)}</section>;
}
