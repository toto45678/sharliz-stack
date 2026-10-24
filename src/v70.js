/* ===== v70: smart difficulty (Tzach, Oct 24: "the game is really easy, maybe make it harder") =====
   The harder base values are DIFF in build.py (DIFF0 = before). This module learns how the player plays: progress.skill in [-1,1],
   only in levels mode from level 4 (the tutorial, events, tournament, daily, endless, duo and bonus never change).
   A clean win +.25, a win with one heart lost +.1, a win with more hearts lost 0, a loss -.3 (a revive or checkpoint run counts once).
   skK() in speed(): ×1.2 at +1, ×0.9 at -1 (the landing windows are in Sharliz widths, so a faster swing also leaves less time to tap).
   Measured with a timing-error bot (/mnt/project-files/game/difficulty/report.md). The tester report shows the value. */
let skCur=0;   // level whose result still counts (0 = none)
{const _sl=startLevel;startLevel=function(lv){_sl(lv);skCur=skOn()?level:0}}
const skAdd=d=>{progress.skill=Math.round(Math.max(-1,Math.min(1,(+progress.skill||0)+d))*100)/100;saveProgress()};
{const _w=win;win=function(){if(skCur&&skCur===level&&mode==='levels'){skCur=0;const n=lv.lost||0;skAdd(n===0?.25:n===1?.1:0)}_w()}}
{const _fg=failGag;failGag=async function(){if(state==='over'&&skCur&&skCur===level&&mode==='levels'){skCur=0;skAdd(-.3)}return _fg()}}
Object.assign(I18N.en,{trSkill:'Smart difficulty'});Object.assign(I18N.he,{trSkill:'קושי חכם'});
{const _tt=trText;trText=function(){const s=+progress.skill||0,k=s>0?1+.2*s:1+.1*s;
  return _tt().replace('\n\n',`\n${t('trSkill')}: ${s>0?'+':''}${s.toFixed(2)} · ×${k.toFixed(2)}\n\n`)}}
