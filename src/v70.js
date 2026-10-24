/* ===== v70: smart difficulty (Tzach, Oct 24: "the game is really easy, maybe make it harder") =====
   The harder base values are DIFF in build.py (DIFF0 = before). This module learns how the player plays: progress.skill in [-1,1],
   only in levels mode from level 4 (the tutorial, events, tournament, daily, endless, duo and bonus never change).
   DIFF.skW / skL: a clean win +.2, a win with one heart lost +.05, with more hearts lost -.1, a loss -.3 (a revive or checkpoint run counts once).
   skK() in speed(): ×1.2 at +1, ×0.8 at -1 (about the speed before Oct 24), and at -1 the perfect window is the old one too (skLo).
   Measured with a timing-error bot (/mnt/project-files/game/difficulty/report.md). The tester report shows the value. */
let skCur=0;   // level whose result still counts (0 = none)
{const _sl=startLevel;startLevel=function(lv){_sl(lv);skCur=skOn()?level:0}}
const skAdd=d=>{progress.skill=Math.round(Math.max(-1,Math.min(1,(+progress.skill||0)+d))*100)/100;saveProgress()};
{const _w=win;win=function(){if(skCur&&skCur===level&&mode==='levels'){skCur=0;skAdd(DIFF.skW[Math.min(2,lv.lost||0)])}_w()}}
{const _fg=failGag;failGag=async function(){if(state==='over'&&skCur&&skCur===level&&mode==='levels'){skCur=0;skAdd(DIFF.skL)}return _fg()}}
Object.assign(I18N.en,{trSkill:'Smart difficulty'});Object.assign(I18N.he,{trSkill:'קושי חכם'});
{const _tt=trText;trText=function(){const s=+progress.skill||0,k=1+s*(s>0?DIFF.skUp:DIFF.skDn);
  return _tt().replace('\n\n',`\n${t('trSkill')}: ${s>0?'+':''}${s.toFixed(2)} · ×${k.toFixed(2)}\n\n`)}}
