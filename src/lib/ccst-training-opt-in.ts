import type {Locale} from './quiz-types';

// Preference only; never replaces an attempt handle or legacy progress.
export const ccstOptInKey = (scope:string) => `cq:ccst34:opt-in:${scope}`;
export const ccstOptInText:Record<Locale,{title:string;label:string;start:string;note:string;error:string}> = {
  en:{title:'Try improved CCST Cybersecurity questions',label:'Use improved questions for new training sessions',start:'Continue training',note:'Your current session keeps its questions. This choice applies to future sessions on this topic, in this language, on this browser.',error:'Unable to save your choice. Please try again.'},
  it:{title:'Prova le domande migliorate CCST Cybersecurity',label:'Usa le domande migliorate per le nuove sessioni di allenamento',start:'Continua allenamento',note:'La sessione corrente mantiene le proprie domande. La scelta vale per le sessioni future di questo argomento, in questa lingua, su questo browser.',error:'Impossibile salvare la scelta. Riprova.'},
  fr:{title:'Essayez les questions améliorées CCST Cybersecurity',label:'Utiliser les questions améliorées pour les nouvelles sessions d’entraînement',start:'Continuer l’entraînement',note:'La session en cours conserve ses questions. Ce choix concerne les sessions futures de ce thème, dans cette langue, sur ce navigateur.',error:'Impossible d’enregistrer votre choix. Réessayez.'},
  es:{title:'Prueba las preguntas mejoradas CCST Cybersecurity',label:'Usar las preguntas mejoradas en las nuevas sesiones de práctica',start:'Continuar la práctica',note:'La sesión actual conserva sus preguntas. La elección se aplica a futuras sesiones de este tema, en este idioma, en este navegador.',error:'No se pudo guardar tu elección. Inténtalo de nuevo.'},
};
export function readCcstOptIn(storage:Pick<Storage,'getItem'>,scope:string){
  return storage.getItem(ccstOptInKey(scope)) === '1';
}
export function saveCcstOptIn(storage:Pick<Storage,'getItem'|'setItem'>,scope:string,value:boolean){
  const raw=value?'1':'0';storage.setItem(ccstOptInKey(scope),raw);
  if(storage.getItem(ccstOptInKey(scope))!==raw)throw Error('OPT_IN_PERSISTENCE_UNAVAILABLE');
}
