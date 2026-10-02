<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Docly — Just save it. We'll remember where it is.</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=Karla:wght@400;500;700;800&display=swap" rel="stylesheet">
<style>
:root{
  --pine:#0D2B25; --pine2:#123830;
  --cream:#FFF6E6; --card:#FFFDF6;
  --ink:#143A32; --muted:#6E8078; --line:#EFE2C6;
  --marigold:#FFB700; --marigold-d:#D89A00;
  --coral:#FF6B57; --coral-d:#E04E3C;
  --mint:#2EC27E; --mint-d:#1FA165;
  --sky:#3FB5F2; --sky-d:#2492CE;
  --grape:#8B7CF6;
  --disp:'Fredoka',system-ui,sans-serif;
  --body:'Karla',system-ui,sans-serif;
}
*{margin:0;padding:0;box-sizing:border-box}
html{scroll-behavior:smooth}
body{
  font-family:var(--body); color:var(--cream); background:var(--pine);
  background-image:
    radial-gradient(900px 500px at 12% -5%, rgba(46,194,126,.10), transparent 60%),
    radial-gradient(800px 600px at 95% 90%, rgba(255,183,0,.07), transparent 60%),
    radial-gradient(rgba(255,246,230,.05) 1px, transparent 1.5px);
  background-size:auto,auto,22px 22px;
  min-height:100vh; overflow-x:hidden;
}
/* ---------- floating background doodles ---------- */
.doodle{position:fixed;opacity:.10;pointer-events:none;z-index:0;animation:drift 16s ease-in-out infinite alternate}
.doodle svg{display:block}
@keyframes drift{from{transform:translateY(-14px) rotate(-6deg)}to{transform:translateY(16px) rotate(7deg)}}
/* ---------- top bar ---------- */
header.top{position:relative;z-index:2;display:flex;align-items:center;justify-content:space-between;gap:16px;
  max-width:1300px;margin:0 auto;padding:26px 36px 8px;flex-wrap:wrap}
.brand{display:flex;align-items:center;gap:13px}
.brand .mark{width:46px;height:46px;background:var(--marigold);border-radius:14px;display:grid;place-items:center;
  box-shadow:0 4px 0 var(--marigold-d);transform:rotate(-3deg)}
.brand h1{font-family:var(--disp);font-weight:700;font-size:28px;letter-spacing:.3px}
.brand small{display:block;font-size:13px;color:#A9C4B8;font-weight:500;margin-top:-2px}
.pill{font-size:12.5px;font-weight:700;color:var(--ink);background:var(--cream);padding:8px 14px;border-radius:999px;
  box-shadow:0 3px 0 rgba(0,0,0,.28)}
/* ---------- stage ---------- */
main.stage{position:relative;z-index:2;display:grid;grid-template-columns:250px auto 210px;gap:44px;
  max-width:1300px;margin:0 auto;padding:26px 36px 10px;align-items:start;justify-items:center}
/* notes */
aside.notes{display:flex;flex-direction:column;gap:18px;position:sticky;top:24px}
.notes h3{font-family:var(--disp);font-size:15px;letter-spacing:1.5px;text-transform:uppercase;color:#8FB3A5;margin-left:4px}
.note{background:var(--cream);color:var(--ink);border-radius:12px;padding:16px 16px 14px;position:relative;
  box-shadow:0 10px 24px rgba(0,0,0,.35);transition:transform .3s}
.note::before{content:"";position:absolute;top:-7px;left:50%;width:12px;height:12px;border-radius:50%;
  background:var(--coral);box-shadow:inset 0 -2px 0 rgba(0,0,0,.25);transform:translateX(-50%)}
.note b{font-family:var(--disp);font-size:15.5px;display:block;margin-bottom:5px}
.note p{font-size:12.5px;line-height:1.5;color:#3F5A51}
.note:nth-child(2){transform:rotate(-1.8deg)}.note:nth-child(3){transform:rotate(1.4deg)}
.note:nth-child(4){transform:rotate(-1.1deg)}.note:nth-child(5){transform:rotate(1.9deg)}
.note:hover{transform:rotate(0) scale(1.03)}
/* ---------- phone ---------- */
.phoneCol{display:flex;flex-direction:column;align-items:center;gap:14px}
.phone{width:392px;max-width:94vw;height:808px;background:#0B1F1B;border-radius:48px;padding:11px;
  box-shadow:0 30px 70px rgba(0,0,0,.55), 0 4px 0 rgba(0,0,0,.4), inset 0 0 0 2px #1E4A40;position:relative}
.ph-notch{position:absolute;top:22px;left:50%;transform:translateX(-50%);width:12px;height:12px;border-radius:50%;
  background:#04110E;box-shadow:inset 0 0 3px #2a5;z-index:40}
.viewport{position:relative;width:100%;height:100%;border-radius:38px;overflow:hidden;background:var(--cream)}
.statusbar{position:absolute;top:0;left:0;right:0;height:38px;display:flex;justify-content:space-between;align-items:center;
  padding:0 26px;z-index:35;color:var(--ink);font-weight:800;font-size:13px;pointer-events:none}
.statusbar .r{display:flex;align-items:center;gap:6px}
.phoneCaption{font-size:12.5px;color:#8FB3A5;font-weight:700;letter-spacing:.4px}
/* screens */
.screen{position:absolute;inset:0;display:flex;flex-direction:column;opacity:0;pointer-events:none;
  transform:translateY(12px);transition:opacity .3s,transform .3s;background:var(--cream);
  background-image:radial-gradient(rgba(20,58,50,.05) 1px, transparent 1.4px);background-size:20px 20px}
.screen.active{opacity:1;pointer-events:auto;transform:translateY(0)}
.sbody{flex:1;overflow-y:auto;padding:52px 20px 96px}
.screen.no-nav .sbody{padding-bottom:28px}
.sbody::-webkit-scrollbar{width:0}
h2.hello{font-family:var(--disp);font-weight:700;font-size:25px;color:var(--ink);line-height:1.15}
.sub{font-size:13px;color:var(--muted);font-weight:500;margin-top:3px}
.section-h{display:flex;justify-content:space-between;align-items:baseline;margin:22px 2px 10px;
  font-family:var(--disp);font-weight:600;font-size:16px;color:var(--ink)}
.section-h a{font-family:var(--body);font-size:12px;font-weight:800;color:var(--sky-d);cursor:pointer;text-decoration:none}
/* buttons */
.btn{font-family:var(--disp);font-weight:600;border:none;cursor:pointer;border-radius:15px;
  padding:13px 20px;font-size:16px;display:inline-flex;align-items:center;justify-content:center;gap:8px;
  transition:transform .08s,box-shadow .08s;width:100%;color:var(--ink)}
.btn.primary{background:var(--marigold);box-shadow:0 4px 0 var(--marigold-d)}
.btn.primary:active{transform:translateY(3px);box-shadow:0 1px 0 var(--marigold-d)}
.btn.green{background:var(--mint);color:#06301E;box-shadow:0 4px 0 var(--mint-d)}
.btn.green:active{transform:translateY(3px);box-shadow:0 1px 0 var(--mint-d)}
.btn.ghost{background:#FFFDF6;color:var(--ink);box-shadow:0 4px 0 var(--line);border:2px solid var(--line)}
.btn.ghost:active{transform:translateY(3px);box-shadow:0 1px 0 var(--line)}
.btn.small{width:auto;padding:9px 15px;font-size:13.5px;border-radius:12px}
.linky{background:none;border:none;color:var(--sky-d);font-weight:800;font-size:13px;cursor:pointer;font-family:var(--body)}
/* header row of a screen */
.toprow{display:flex;align-items:center;gap:10px;margin-bottom:14px}
.avatar{width:40px;height:40px;border-radius:50%;background:var(--grape);color:#fff;display:grid;place-items:center;
  font-family:var(--disp);font-weight:700;font-size:18px;box-shadow:0 3px 0 rgba(0,0,0,.15);cursor:pointer}
.iconbtn{margin-left:auto;width:38px;height:38px;border-radius:12px;background:#FFFDF6;border:2px solid var(--line);
  display:grid;place-items:center;cursor:pointer;box-shadow:0 3px 0 var(--line);transition:transform .1s}
.iconbtn:active{transform:translateY(2px);box-shadow:0 1px 0 var(--line)}
.backbtn{width:38px;height:38px;border-radius:12px;background:#FFFDF6;border:2px solid var(--line);box-shadow:0 3px 0 var(--line);
  display:grid;place-items:center;cursor:pointer;font-size:17px;color:var(--ink);font-weight:800}
/* search pill */
.searchpill{display:flex;align-items:center;gap:10px;background:#FFFDF6;border:2px solid var(--line);border-radius:16px;
  padding:14px 16px;font-size:15px;color:var(--muted);font-weight:700;cursor:pointer;box-shadow:0 3px 0 var(--line);margin-top:16px}
.searchpill:hover{border-color:#E0CFA5}
/* big add */
.addbig{margin-top:14px;background:var(--marigold);border-radius:22px;padding:20px 22px;cursor:pointer;position:relative;
  box-shadow:0 6px 0 var(--marigold-d);transition:transform .09s,box-shadow .09s;overflow:hidden}
.addbig:active{transform:translateY(4px);box-shadow:0 2px 0 var(--marigold-d)}
.addbig .plus{width:44px;height:44px;border-radius:14px;background:var(--ink);color:var(--marigold);display:grid;place-items:center;
  font-size:28px;font-family:var(--disp);font-weight:700;float:left;margin-right:14px}
.addbig b{font-family:var(--disp);font-size:21px;color:var(--ink);display:block}
.addbig span{font-size:12.5px;font-weight:700;color:#6B4E00}
.addbig .spark{position:absolute;right:14px;top:12px;font-size:20px;animation:twinkle 2.2s infinite}
@keyframes twinkle{0%,100%{transform:scale(1) rotate(0)}50%{transform:scale(1.25) rotate(18deg)}}
.addhint{font-size:12px;color:var(--muted);font-weight:600;margin-top:9px;padding:0 4px}
/* inbox row */
.inboxrow{display:flex;align-items:center;gap:11px;background:#FFFDF6;border:2px solid var(--line);border-radius:16px;
  padding:13px 16px;margin-top:14px;cursor:pointer;box-shadow:0 3px 0 var(--line);transition:transform .1s}
.inboxrow:active{transform:translateY(2px)}
.inboxrow .ic{font-size:21px}
.inboxrow b{font-family:var(--disp);font-size:16px;color:var(--ink)}
.badge{margin-left:auto;background:var(--coral);color:#fff;font-weight:800;font-size:13px;min-width:26px;height:26px;
  border-radius:13px;display:grid;place-items:center;padding:0 7px;box-shadow:0 2px 0 var(--coral-d)}
/* category tiles */
.catgrid{display:grid;grid-template-columns:1fr 1fr;gap:11px}
.cat{border-radius:18px;padding:14px;cursor:pointer;border:2px solid transparent;transition:transform .12s;display:block}
.cat:hover{transform:translateY(-3px)}
.cat .em{font-size:25px}
.cat b{font-family:var(--disp);font-weight:600;font-size:15px;display:block;margin-top:6px}
.cat span{font-size:11.5px;font-weight:700;opacity:.75}
.c-bills{background:#FFE9B8;border-color:#F3D389;color:#8A5A00}
.c-veh{background:#D7EEFF;border-color:#AAD8F5;color:#0F6AA8}
.c-fin{background:#D6F5E3;border-color:#A6E6C3;color:#0B7A50}
.c-home{background:#FFE0D6;border-color:#F7BDA9;color:#C2471F}
/* coming up */
.due{display:flex;align-items:center;gap:11px;background:#FFFDF6;border:2px solid var(--line);border-radius:15px;
  padding:11px 13px;margin-bottom:9px;box-shadow:0 3px 0 var(--line)}
.due .em{font-size:20px}
.due b{font-size:13.5px;color:var(--ink);display:block}
.due span{font-size:11.5px;color:var(--muted);font-weight:600}
.duepill{margin-left:auto;font-size:11.5px;font-weight:800;border-radius:999px;padding:5px 10px}
.duepill.warn{background:#FFE9B8;color:#8A5A00}
.duepill.ok{background:#D6F5E3;color:#0B7A50}
/* recent rows */
.docrow{display:flex;align-items:center;gap:12px;background:#FFFDF6;border:2px solid var(--line);border-radius:15px;
  padding:11px 13px;margin-bottom:9px;cursor:pointer;box-shadow:0 3px 0 var(--line);transition:transform .1s}
.docrow:active{transform:translateY(2px)}
.docrow .em{width:40px;height:40px;border-radius:12px;display:grid;place-items:center;font-size:20px;flex-shrink:0}
.docrow b{font-size:14px;color:var(--ink);display:block}
.docrow span{font-size:11.5px;color:var(--muted);font-weight:600}
.docrow .rt{margin-left:auto;font-size:11px;color:#A3B3AB;font-weight:700;text-align:right}
.docrow .chk{color:var(--mint-d);font-weight:800}
/* ---------- tab bar ---------- */
.tabbar{position:absolute;bottom:0;left:0;right:0;height:76px;background:#FFFDF6;border-top:2px solid var(--line);
  display:flex;align-items:flex-start;justify-content:space-around;padding-top:9px;z-index:30;transition:transform .3s}
.phone.navless .tabbar{transform:translateY(110%)}
.tab{background:none;border:none;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:3px;
  font-family:var(--disp);font-size:11px;font-weight:600;color:#A3B3AB;width:64px;position:relative}
.tab svg{width:24px;height:24px}
.tab.on{color:var(--ink)}
.tab.on .tico{animation:pop .35s}
@keyframes pop{40%{transform:scale(1.28)}}
.tab .badge{position:absolute;top:-4px;right:8px;min-width:19px;height:19px;font-size:10.5px;border-radius:10px;
  background:var(--coral);color:#fff;display:grid;place-items:center;box-shadow:0 2px 0 var(--coral-d);padding:0 4px}
.tabplus{width:58px;height:58px;border-radius:50%;background:var(--marigold);box-shadow:0 5px 0 var(--marigold-d);
  border:none;cursor:pointer;margin-top:-26px;display:grid;place-items:center;transition:transform .09s,box-shadow .09s}
.tabplus:active{transform:translateY(4px);box-shadow:0 1px 0 var(--marigold-d)}
/* ---------- search screen ---------- */
.searchbar{display:flex;gap:9px;align-items:center}
.searchinput{flex:1;border:2px solid var(--line);background:#FFFDF6;border-radius:15px;padding:13px 15px;
  font-family:var(--body);font-size:15px;font-weight:700;color:var(--ink);outline:none;box-shadow:0 3px 0 var(--line)}
.searchinput:focus{border-color:var(--marigold)}
.chips{display:flex;gap:8px;flex-wrap:wrap;margin:13px 0 4px}
.chip{font-size:12px;font-weight:800;background:#FFFDF6;border:2px solid var(--line);border-radius:999px;
  padding:7px 13px;cursor:pointer;color:var(--ink);box-shadow:0 2px 0 var(--line);transition:transform .1s}
.chip:hover{transform:translateY(-2px);border-color:var(--marigold)}
.rescount{font-size:12.5px;font-weight:800;color:var(--muted);margin:12px 3px 9px;letter-spacing:.4px}
.rescard{background:#FFFDF6;border:2px solid var(--line);border-radius:18px;padding:15px;margin-bottom:11px;cursor:pointer;
  box-shadow:0 4px 0 var(--line);transition:transform .12s}
.rescard:hover{transform:translateY(-3px)}
.rescard .top{display:flex;gap:11px;align-items:flex-start}
.rescard .em{width:44px;height:44px;border-radius:13px;display:grid;place-items:center;font-size:22px;flex-shrink:0}
.rescard b{font-family:var(--disp);font-size:16px;color:var(--ink);display:block;line-height:1.2}
.rescard .meta{font-size:12px;color:var(--muted);font-weight:600;margin-top:3px}
.rescard .foot{display:flex;align-items:center;gap:8px;margin-top:10px}
.ftag{font-size:11px;font-weight:800;border-radius:8px;padding:4px 9px}
.ftag.pdf{background:#FFE9B8;color:#8A5A00}
.ftag.img{background:#D7EEFF;color:#0F6AA8}
.rescard .exp{margin-left:auto;font-size:11.5px;font-weight:800;color:var(--coral-d)}
/* ---------- add sheet ---------- */
.dim{position:absolute;inset:0;background:rgba(13,43,37,.5);opacity:0;pointer-events:none;transition:opacity .25s;z-index:45}
.dim.show{opacity:1;pointer-events:auto}
.sheet{position:absolute;left:0;right:0;bottom:0;background:var(--cream);border-radius:26px 26px 0 0;padding:14px 20px 30px;
  transform:translateY(105%);transition:transform .32s cubic-bezier(.32,1.2,.4,1);z-index:46;box-shadow:0 -10px 30px rgba(0,0,0,.18)}
.sheet.show{transform:translateY(0)}
.grab{width:44px;height:5px;border-radius:3px;background:#E3D5B6;margin:0 auto 14px}
.sheet h3{font-family:var(--disp);font-size:19px;color:var(--ink);margin-bottom:14px}
.opt{display:flex;align-items:center;gap:14px;background:#FFFDF6;border:2px solid var(--line);border-radius:16px;
  padding:14px 16px;margin-bottom:10px;cursor:pointer;box-shadow:0 3px 0 var(--line);transition:transform .1s;width:100%;
  font-family:var(--body);text-align:left}
.opt:active{transform:translateY(2px)}
.opt .em{width:42px;height:42px;border-radius:13px;display:grid;place-items:center;font-size:21px}
.opt b{font-family:var(--disp);font-weight:600;font-size:15.5px;color:var(--ink);display:block}
.opt span{font-size:11.5px;color:var(--muted);font-weight:700}
.opt .arr{margin-left:auto;color:#C9BB99;font-weight:800}
.sheet .tip{font-size:11.5px;color:var(--muted);font-weight:700;text-align:center;margin-top:6px}
/* ---------- scanner ---------- */
.scr-head{display:flex;align-items:center;gap:12px;padding:52px 18px 12px}
.scr-head h2{font-family:var(--disp);font-size:19px;color:var(--ink)}
.viewfinder{flex:1;margin:6px 18px;background:#0E211D;border-radius:24px;position:relative;overflow:hidden}
.corner{position:absolute;width:34px;height:34px;border:4px solid var(--marigold);animation:cpulse 2s infinite}
@keyframes cpulse{50%{opacity:.45}}
.tl{top:26px;left:26px;border-right:none;border-bottom:none;border-radius:8px 0 0 0}
.tr{top:26px;right:26px;border-left:none;border-bottom:none;border-radius:0 8px 0 0}
.bl{bottom:26px;left:26px;border-right:none;border-top:none;border-radius:0 0 0 8px}
.br{bottom:26px;right:26px;border-left:none;border-top:none;border-radius:0 0 8px 0}
.ghostdoc{position:absolute;inset:56px 46px;border:2px dashed rgba(255,246,230,.3);border-radius:10px;
  display:grid;place-items:center;color:rgba(255,246,230,.4);font-family:var(--disp);letter-spacing:3px;font-size:14px;
  animation:bob 4s ease-in-out infinite}
@keyframes bob{50%{transform:translateY(-7px)}}
.laser{position:absolute;left:30px;right:30px;height:2px;background:linear-gradient(90deg,transparent,var(--mint),transparent);
  top:20%;animation:scan 3.4s ease-in-out infinite;opacity:.85}
@keyframes scan{0%{top:16%}50%{top:80%}100%{top:16%}}
.detect{position:absolute;bottom:18px;left:50%;transform:translateX(-50%);background:rgba(255,246,230,.13);
  color:var(--cream);font-size:11.5px;font-weight:800;padding:7px 14px;border-radius:999px;white-space:nowrap}
.shutterrow{display:flex;align-items:center;justify-content:center;gap:26px;padding:16px 0 20px;position:relative}
.thumbs{position:absolute;left:22px;display:flex}
.thumbs .th{width:34px;height:42px;background:#fff;border-radius:6px;border:2px solid var(--line);margin-left:-10px;
  display:grid;place-items:center;font-size:10px;font-weight:800;color:var(--muted)}
.shutter{width:70px;height:70px;border-radius:50%;background:#fff;border:5px solid var(--ink);cursor:pointer;
  box-shadow:0 5px 0 rgba(0,0,0,.3);transition:transform .08s}
.shutter:active{transform:scale(.9)}
.doneScan{position:absolute;right:22px;background:var(--mint);border:none;color:#06301E;font-family:var(--disp);
  font-weight:600;padding:10px 15px;border-radius:12px;box-shadow:0 3px 0 var(--mint-d);cursor:pointer;
  opacity:0;pointer-events:none;transition:opacity .2s}
.doneScan.show{opacity:1;pointer-events:auto}
.flashfx{position:absolute;inset:0;background:#fff;opacity:0;pointer-events:none;z-index:5}
.flashfx.go{animation:flash .35s}
@keyframes flash{0%{opacity:.95}100%{opacity:0}}
/* capture review */
.review{position:absolute;left:0;right:0;bottom:0;background:var(--cream);border-radius:26px 26px 0 0;padding:20px;
  transform:translateY(105%);transition:transform .32s cubic-bezier(.32,1.2,.4,1);z-index:6}
.review.show{transform:translateY(0)}
.review h3{font-family:var(--disp);font-size:20px;color:var(--ink)}
.pagelist{margin:13px 0}
.pagerow{display:flex;align-items:center;gap:10px;background:#FFFDF6;border:2px solid var(--line);border-radius:12px;
  padding:9px 12px;margin-bottom:7px;font-weight:800;font-size:13px;color:var(--ink)}
.pagerow .pv{width:26px;height:33px;background:#fff;border:2px solid var(--line);border-radius:5px}
.pagerow .ok{margin-left:auto;color:var(--mint-d)}
/* ---------- processing ---------- */
.procwrap{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:26px 30px;text-align:center}
.procfile{display:inline-flex;align-items:center;gap:10px;background:#FFFDF6;border:2px solid var(--line);
  border-radius:14px;padding:11px 16px;font-weight:800;font-size:13.5px;color:var(--ink);box-shadow:0 3px 0 var(--line)}
.procspark{font-size:34px;margin:20px 0 4px;animation:twinkle 1.4s infinite}
.procwrap h2{font-family:var(--disp);font-size:23px;color:var(--ink)}
.steps{width:100%;margin-top:22px;text-align:left}
.step{display:flex;align-items:center;gap:12px;padding:9px 4px;font-size:14.5px;font-weight:700;color:#C4B691;transition:color .3s}
.step .dot{width:24px;height:24px;border-radius:50%;border:2.5px solid #E3D5B6;display:grid;place-items:center;
  font-size:12px;flex-shrink:0;background:#FFFDF6;transition:all .3s}
.step.active{color:var(--ink)}
.step.active .dot{border-color:var(--marigold);border-top-color:transparent;animation:spin .7s linear infinite;background:var(--marigold)}
@keyframes spin{to{transform:rotate(360deg)}}
.step.done{color:var(--ink)}
.step.done .dot{border-color:var(--mint);background:var(--mint);color:#06301E;animation:pop .35s}
.pbar{width:100%;height:12px;background:#F2E7CB;border-radius:99px;margin-top:18px;overflow:hidden}
.pbar i{display:block;height:100%;width:0;background:var(--marigold);border-radius:99px;transition:width .5s}
.pct{font-size:12px;font-weight:800;color:var(--muted);margin-top:8px}
#procDone{margin-top:18px;opacity:0;pointer-events:none;transition:opacity .3s;width:auto;padding:12px 30px}
#procDone.show{opacity:1;pointer-events:auto}
/* ---------- result ---------- */
.reswrap{flex:1;overflow-y:auto;padding:60px 24px 30px;text-align:center}
.reswrap h2{font-family:var(--disp);font-size:33px;color:var(--ink)}
.reswrap h2 em{font-style:normal;display:inline-block;animation:wig 1.2s ease-in-out}
@keyframes wig{25%{transform:rotate(14deg)}50%{transform:rotate(-10deg)}75%{transform:rotate(7deg)}}
.herocard{background:#FFFDF6;border:2px solid var(--line);border-radius:22px;padding:20px;margin-top:18px;text-align:left;
  box-shadow:0 5px 0 var(--line)}
.herotop{display:flex;gap:13px;align-items:center}
.herotop .em{width:54px;height:54px;border-radius:16px;background:#D7EEFF;display:grid;place-items:center;font-size:28px;flex-shrink:0}
.herotop b{font-family:var(--disp);font-size:19px;color:var(--ink);display:block}
.herotop span{font-size:12.5px;color:var(--muted);font-weight:700}
.heroline{display:flex;align-items:center;gap:9px;font-size:13.5px;font-weight:800;color:var(--ink);margin-top:13px;
  background:#FFF6E0;border-radius:11px;padding:10px 13px}
.heroline .arr{color:var(--marigold-d)}
.savedto{margin-top:14px;font-size:12.5px;font-weight:700;color:var(--muted);display:flex;align-items:center;gap:7px;flex-wrap:wrap}
.savedto .fold{background:#E8E1FF;color:#5B4BC4;border-radius:8px;padding:4px 10px;font-weight:800;font-size:11.5px}
.savedto .drv{background:#D6F5E3;color:#0B7A50;border-radius:8px;padding:4px 10px;font-weight:800;font-size:11.5px}
.checkrow{margin-top:16px;background:#FFFDF6;border:2px dashed var(--line);border-radius:16px;padding:14px}
.checkrow p{font-size:13px;font-weight:800;color:var(--ink);margin-bottom:10px}
.checkbtns{display:flex;gap:9px}
/* ---------- inbox ---------- */
.inboxcard{background:#FFFDF6;border:2px solid var(--line);border-radius:18px;padding:16px;margin-bottom:13px;
  box-shadow:0 4px 0 var(--line);transition:transform .35s,opacity .35s}
.inboxcard.bye{transform:translateX(130%) rotate(4deg);opacity:0}
.inboxcard .top{display:flex;gap:11px;align-items:center}
.inboxcard .em{width:42px;height:42px;border-radius:13px;display:grid;place-items:center;font-size:21px;flex-shrink:0}
.inboxcard b{font-family:var(--disp);font-size:15.5px;color:var(--ink);display:block}
.inboxcard .meta{font-size:11.5px;color:var(--muted);font-weight:700}
.ailine{display:flex;gap:8px;margin:11px 0;font-size:13px;color:#3F5A51;font-weight:600;background:#FFF6E0;
  border-radius:11px;padding:10px 12px;line-height:1.4}
.ailine .sp{flex-shrink:0}
.conf{margin-left:auto;font-size:10.5px;font-weight:800;border-radius:99px;padding:3px 9px;white-space:nowrap;height:fit-content}
.conf.hi{background:#D6F5E3;color:#0B7A50}
.conf.lo{background:#FFE9B8;color:#8A5A00}
.rowbtns{display:flex;gap:9px}
.catpick{display:none;grid-template-columns:repeat(4,1fr);gap:7px;margin-top:11px}
.catpick.show{display:grid}
.catpick button{border:2px solid var(--line);background:#FFFDF6;border-radius:11px;padding:8px 2px;cursor:pointer;
  font-size:10.5px;font-weight:800;color:var(--ink);display:flex;flex-direction:column;align-items:center;gap:3px}
.catpick button span{font-size:17px}
.catpick button:hover{border-color:var(--marigold);transform:translateY(-2px)}
.inboxempty{text-align:center;padding:60px 20px;display:none}
.inboxempty .big{font-size:44px}
.inboxempty h3{font-family:var(--disp);font-size:21px;color:var(--ink);margin-top:10px}
.inboxempty p{font-size:13px;color:var(--muted);font-weight:600}
/* ---------- document viewer ---------- */
.doc-head{display:flex;align-items:center;gap:11px;padding:50px 18px 12px}
.doc-head h2{font-family:var(--disp);font-size:18px;color:var(--ink);flex:1}
.pdfpage{background:#fff;border:2px solid var(--line);border-radius:14px;padding:18px;box-shadow:0 5px 0 var(--line);
  position:relative;overflow:hidden;margin-bottom:16px}
.pdfpage::after{content:"";position:absolute;top:0;right:0;border-style:solid;border-width:0 26px 26px 0;
  border-color:var(--cream) var(--cream) var(--line) transparent}
.phead{display:flex;gap:9px;align-items:center}
.plogo{width:32px;height:32px;border-radius:9px;background:var(--coral);color:#fff;display:grid;place-items:center;
  font-family:var(--disp);font-weight:700;font-size:12px}
.phead b{font-size:13px;letter-spacing:1px;color:#B3401F;display:block}
.phead span{font-size:9px;color:var(--muted);font-weight:700;letter-spacing:.6px}
.ptitle{font-family:var(--disp);font-size:14px;color:var(--ink);margin:13px 0 9px}
.pline{height:7px;border-radius:4px;background:#EFEAD9;margin-bottom:6px}
.pgrid{display:grid;grid-template-columns:1fr 1fr;gap:7px;margin-top:11px}
.pcell{background:#FBF7EC;border-radius:8px;padding:7px 9px}
.pcell span{font-size:8px;font-weight:800;letter-spacing:.7px;color:#A79C7C;display:block}
.pcell b{font-size:10.5px;color:var(--ink)}
.stamp{position:absolute;right:16px;bottom:14px;width:58px;height:58px;border:3px solid rgba(46,194,126,.55);border-radius:50%;
  display:grid;place-items:center;color:rgba(31,161,101,.75);font-family:var(--disp);font-size:9.5px;font-weight:700;
  transform:rotate(-14deg);letter-spacing:1px}
.facts{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:15px}
.fact{font-size:12px;font-weight:800;background:#FFFDF6;border:2px solid var(--line);border-radius:999px;padding:7px 13px;color:var(--ink)}
.fact.hl{background:#FFE9B8;border-color:#F3D389;color:#8A5A00}
.dlist{background:#FFFDF6;border:2px solid var(--line);border-radius:16px;overflow:hidden;margin-bottom:15px}
.drow{display:flex;justify-content:space-between;padding:11px 15px;font-size:13px;border-bottom:2px solid #F7EFDC}
.drow:last-child{border-bottom:none}
.drow span{color:var(--muted);font-weight:700}
.drow b{color:var(--ink)}
.tags{display:flex;gap:7px;flex-wrap:wrap;margin-bottom:18px}
.tag{font-size:11.5px;font-weight:800;background:#D7EEFF;color:#0F6AA8;border-radius:8px;padding:5px 11px}
/* ask overlay */
.askpanel{position:absolute;inset:0;background:var(--cream);z-index:47;display:flex;flex-direction:column;
  transform:translateY(100%);transition:transform .32s cubic-bezier(.32,1.1,.4,1)}
.askpanel.show{transform:translateY(0)}
.askhead{display:flex;align-items:center;gap:11px;padding:52px 18px 12px;border-bottom:2px solid var(--line)}
.askhead h2{font-family:var(--disp);font-size:18px;color:var(--ink);flex:1}
.chat{flex:1;overflow-y:auto;padding:18px;display:flex;flex-direction:column;gap:11px}
.bub{max-width:82%;padding:11px 14px;border-radius:16px;font-size:13.5px;line-height:1.5;font-weight:600}
.bub.user{align-self:flex-end;background:var(--marigold);color:var(--ink);border-bottom-right-radius:5px;box-shadow:0 3px 0 var(--marigold-d)}
.bub.ai{align-self:flex-start;background:#FFFDF6;border:2px solid var(--line);color:var(--ink);border-bottom-left-radius:5px}
.cite{display:inline-block;margin-top:8px;font-size:10.5px;font-weight:800;background:#D6F5E3;color:#0B7A50;
  border-radius:7px;padding:3px 9px}
.typing{display:flex;gap:4px;padding:13px 15px}
.typing i{width:7px;height:7px;border-radius:50%;background:#C9BB99;animation:blink 1s infinite}
.typing i:nth-child(2){animation-delay:.18s}.typing i:nth-child(3){animation-delay:.36s}
@keyframes blink{50%{opacity:.25;transform:translateY(-3px)}}
.askchips{display:flex;gap:8px;padding:0 18px 10px;flex-wrap:wrap}
.askinput{display:flex;gap:9px;padding:10px 16px 22px;border-top:2px solid var(--line)}
.askinput input{flex:1;border:2px solid var(--line);border-radius:99px;padding:11px 17px;font-family:var(--body);
  font-weight:700;font-size:13.5px;outline:none;background:#FFFDF6;color:var(--ink)}
.askinput button{width:44px;height:44px;border-radius:50%;background:var(--marigold);border:none;box-shadow:0 3px 0 var(--marigold-d);
  cursor:pointer;font-size:16px;flex-shrink:0}
/* ---------- settings ---------- */
.setrow{display:flex;align-items:center;gap:13px;background:#FFFDF6;border:2px solid var(--line);border-radius:16px;
  padding:14px 16px;margin-bottom:10px;box-shadow:0 3px 0 var(--line)}
.setrow .em{font-size:21px}
.setrow b{font-size:14px;color:var(--ink);display:block}
.setrow span{font-size:11.5px;color:var(--muted);font-weight:700}
.setrow .end{margin-left:auto}
.okpill{background:#D6F5E3;color:#0B7A50;font-size:11.5px;font-weight:800;border-radius:99px;padding:5px 12px}
.switch{width:46px;height:27px;border-radius:99px;background:#E3D5B6;position:relative;cursor:pointer;transition:background .2s;flex-shrink:0}
.switch::after{content:"";position:absolute;top:3px;left:3px;width:21px;height:21px;border-radius:50%;background:#fff;
  transition:left .2s;box-shadow:0 1px 3px rgba(0,0,0,.3)}
.switch.on{background:var(--mint)}
.switch.on::after{left:22px}
.privnote{font-size:11.5px;color:var(--muted);font-weight:700;line-height:1.55;background:#FFF6E0;border-radius:13px;
  padding:13px 15px;margin-top:6px}
/* ---------- onboarding ---------- */
.obwrap{flex:1;display:flex;flex-direction:column;padding:70px 34px 40px;text-align:center}
.obart{font-size:74px;margin:auto 0 24px;line-height:1}
.obwrap h2{font-family:var(--disp);font-size:27px;color:var(--ink);line-height:1.25}
.obwrap p{font-size:14.5px;color:var(--muted);font-weight:600;margin-top:12px;line-height:1.55}
.obdots{display:flex;gap:7px;justify-content:center;margin:22px 0 18px}
.obdots i{width:8px;height:8px;border-radius:50%;background:#E3D5B6;transition:all .25s}
.obdots i.on{width:22px;border-radius:5px;background:var(--marigold)}
.scope{font-size:11.5px;font-weight:700;color:var(--muted);margin-top:11px}
/* ---------- toast & confetti ---------- */
.toast{position:absolute;bottom:96px;left:50%;transform:translateX(-50%) translateY(20px);background:var(--ink);color:var(--cream);
  font-size:13px;font-weight:800;padding:11px 19px;border-radius:99px;opacity:0;transition:all .3s;z-index:60;white-space:nowrap;
  box-shadow:0 8px 20px rgba(0,0,0,.3);pointer-events:none}
.toast.show{opacity:1;transform:translateX(-50%) translateY(0)}
.confetti-box{position:absolute;inset:0;pointer-events:none;overflow:hidden;z-index:70}
.cf{position:absolute;width:9px;height:13px;top:-16px;border-radius:2px;animation:fall linear forwards}
@keyframes fall{to{transform:translateY(860px) rotate(560deg);opacity:.6}}
/* ---------- rail ---------- */
aside.rail{position:sticky;top:24px;display:flex;flex-direction:column;gap:7px;width:100%}
.rail h3{font-family:var(--disp);font-size:15px;letter-spacing:1.5px;text-transform:uppercase;color:#8FB3A5;margin:0 0 6px 4px}
.railitem{display:flex;align-items:center;gap:11px;background:rgba(255,246,230,.06);border:2px solid rgba(255,246,230,.1);
  color:#CFE2D8;border-radius:13px;padding:9px 13px;cursor:pointer;font-family:var(--body);font-weight:800;font-size:13px;
  transition:all .15s;text-align:left;width:100%}
.railitem .n{font-family:var(--disp);font-size:11px;opacity:.55;width:18px}
.railitem:hover{transform:translateX(4px);border-color:rgba(255,183,0,.5)}
.railitem.on{background:var(--marigold);color:var(--ink);border-color:var(--marigold-d);box-shadow:0 3px 0 var(--marigold-d)}
.railitem.on .n{opacity:.7}
/* ---------- footer flow ---------- */
footer.flow{position:relative;z-index:2;max-width:1300px;margin:30px auto 0;padding:30px 36px 54px}
.flowtrack{display:flex;align-items:stretch;justify-content:center;gap:14px;flex-wrap:wrap}
.flowstep{border-radius:20px;padding:20px 28px;min-width:230px;flex:1;max-width:330px}
.flowstep b{font-family:var(--disp);font-size:21px;display:block}
.flowstep span{font-size:13px;font-weight:700;opacity:.8}
.fs1{background:var(--marigold);color:var(--ink);box-shadow:0 6px 0 var(--marigold-d)}
.fs2{background:var(--mint);color:#06301E;box-shadow:0 6px 0 var(--mint-d)}
.fs3{background:var(--sky);color:#06304A;box-shadow:0 6px 0 var(--sky-d)}
.flowarrow{display:grid;place-items:center;font-family:var(--disp);font-size:26px;color:#8FB3A5}
.flowline{text-align:center;margin-top:22px;font-size:13px;font-weight:700;color:#8FB3A5;line-height:1.7}
.flowline b{color:var(--cream)}
/* entrance */
.rise{animation:rise .6s both}
@keyframes rise{from{opacity:0;transform:translateY(18px)}}
@media(max-width:1120px){
  main.stage{grid-template-columns:1fr;gap:26px}
  aside.notes{position:static;flex-direction:row;flex-wrap:wrap;order:3}
  aside.notes .note{flex:1 1 220px}
  aside.rail{position:static;flex-direction:row;flex-wrap:wrap;order:1}
  aside.rail h3{width:100%}
  .railitem{width:auto}
  .phoneCol{order:2}
}
</style>
</head>
<body>

<!-- floating doodles -->
<div class="doodle" style="top:9%;left:4%"><svg width="70" height="86" viewBox="0 0 70 86"><path d="M8 6h38l16 16v58H8z" fill="none" stroke="#FFF6E6" stroke-width="3"/><path d="M46 6v16h16" fill="none" stroke="#FFF6E6" stroke-width="3"/><path d="M20 40h30M20 52h30M20 64h18" stroke="#FFF6E6" stroke-width="3"/></svg></div>
<div class="doodle" style="top:64%;left:7%;animation-delay:-6s"><svg width="44" height="44" viewBox="0 0 44 44"><path d="M22 2l5 15h15l-12 9 5 15-13-9-13 9 5-15L2 17h15z" fill="#FFB700"/></svg></div>
<div class="doodle" style="top:16%;right:5%;animation-delay:-3s"><svg width="64" height="80" viewBox="0 0 70 86"><path d="M8 6h38l16 16v58H8z" fill="none" stroke="#2EC27E" stroke-width="3"/><path d="M46 6v16h16" fill="none" stroke="#2EC27E" stroke-width="3"/></svg></div>
<div class="doodle" style="top:74%;right:8%;animation-delay:-9s"><svg width="38" height="38" viewBox="0 0 44 44"><path d="M22 2l5 15h15l-12 9 5 15-13-9-13 9 5-15L2 17h15z" fill="#FFF6E6"/></svg></div>

<header class="top rise">
  <div class="brand">
    <div class="mark">
      <svg width="26" height="26" viewBox="0 0 26 26"><path d="M4 2h13l5 5v17H4z" fill="#FFFDF6"/><path d="M17 2v5h5" fill="#E8B400"/><circle cx="9.5" cy="13" r="1.4" fill="#143A32"/><circle cx="16.5" cy="13" r="1.4" fill="#143A32"/><path d="M9 17.5q4 3.4 8 0" stroke="#143A32" stroke-width="1.8" fill="none" stroke-linecap="round"/></svg>
    </div>
    <div><h1>Docly</h1><small>Just save it. We'll remember where it is.</small></div>
  </div>
  <div class="pill">Interactive HTML mock · tap the phone ✨</div>
</header>

<main class="stage">

  <!-- design notes -->
  <aside class="notes">
    <h3 class="rise">Design notes</h3>
    <div class="note rise" style="animation-delay:.05s"><b>One giant ＋</b><p>Capture is the only chore. Photo, file, PDF — or share straight from WhatsApp. No "which folder?" ever.</p></div>
    <div class="note rise" style="animation-delay:.1s"><b>Ask when unsure</b><p>98% confident → organised silently. 63% → it asks. Confidence drives trust, so the AI never bluffs.</p></div>
    <div class="note rise" style="animation-delay:.15s"><b>Your Drive stays yours</b><p>Files live in Google Drive (<code>drive.file</code> scope). Docly keeps only the smart layer — tags, dates, meaning.</p></div>
    <div class="note rise" style="animation-delay:.2s"><b>Reward, don't nag</b><p>A little confetti, friendly words. No streaks, no XP, no guilt. It's a utility that's fun — not habit-bait.</p></div>
  </aside>

  <!-- phone -->
  <div class="phoneCol rise" style="animation-delay:.1s">
    <div class="phone" id="phone">
      <div class="ph-notch"></div>
      <div class="viewport">
        <div class="statusbar">
          <span>20:16</span>
          <span class="r">
            <svg width="16" height="11" viewBox="0 0 16 11"><rect x="0" y="7" width="3" height="4" rx="1" fill="#143A32"/><rect x="4.5" y="5" width="3" height="6" rx="1" fill="#143A32"/><rect x="9" y="2.5" width="3" height="8.5" rx="1" fill="#143A32"/><rect x="13" y="0" width="3" height="11" rx="1" fill="#CBD8CF"/></svg>
            <svg width="16" height="12" viewBox="0 0 16 12"><path d="M8 11.2 1.2 4.6a9.6 9.6 0 0 1 13.6 0z" fill="#143A32"/></svg>
            <svg width="23" height="12" viewBox="0 0 23 12"><rect x="0.5" y="0.5" width="19" height="11" rx="3" fill="none" stroke="#143A32" opacity=".5"/><rect x="2.5" y="2.5" width="12" height="7" rx="1.5" fill="#143A32"/><rect x="21" y="3.5" width="2" height="5" rx="1" fill="#143A32" opacity=".5"/></svg>
          </span>
        </div>

        <!-- ================= HOME ================= -->
        <section class="screen has-nav active" id="scr-home">
          <div class="sbody">
            <div class="toprow">
              <div class="avatar" onclick="go('scr-settings')">A</div>
              <div><h2 class="hello">Good evening,<br>Anirudh 👋</h2></div>
              <div class="iconbtn" onclick="go('scr-settings')">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#143A32" stroke-width="2.2"><circle cx="12" cy="12" r="3.2"/><path d="M19 12a7 7 0 0 0-.15-1.4l2-1.55-2-3.45-2.35.95A7.3 7.3 0 0 0 14.1 5.1L13.75 2.6h-3.5L9.9 5.1a7.3 7.3 0 0 0-2.4 1.45l-2.35-.95-2 3.45 2 1.55A7 7 0 0 0 5 12c0 .48.05.94.15 1.4l-2 1.55 2 3.45 2.35-.95a7.3 7.3 0 0 0 2.4 1.45l.35 2.5h3.5l.35-2.5a7.3 7.3 0 0 0 2.4-1.45l2.35.95 2-3.45-2-1.55c.1-.46.15-.92.15-1.4z"/></svg>
              </div>
            </div>
            <p class="sub">128 documents · all safe in your Drive ☁️</p>

            <div class="searchpill" onclick="go('scr-search')">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6E8078" stroke-width="2.4"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m20 20-4.8-4.8"/></svg>
              What are you looking for?
            </div>

            <div class="addbig" onclick="openAdd()">
              <span class="spark">✨</span>
              <div class="plus">＋</div>
              <b>Add anything</b>
              <span>Photo, PDF, file — or share from any app</span>
            </div>
            <p class="addhint">💡 In WhatsApp? <b>Share → Docly</b>. That's it.</p>

            <div class="inboxrow" onclick="go('scr-inbox')">
              <span class="ic">📥</span><b>Inbox</b>
              <span style="font-size:12px;color:var(--muted);font-weight:700">needs you</span>
              <span class="badge" id="homeBadge">3</span>
            </div>

            <div class="section-h">Your documents <a onclick="toast('Customise categories — coming right up 🏷️')">Customise</a></div>
            <div class="catgrid">
              <div class="cat c-bills" onclick="searchFor('bills')"><span class="em">🧾</span><b>Bills</b><span>24 documents</span></div>
              <div class="cat c-veh" onclick="searchFor('vehicle')"><span class="em">🚗</span><b>Vehicle</b><span>8 documents</span></div>
              <div class="cat c-fin" onclick="searchFor('hdfc')"><span class="em">🏦</span><b>Finance</b><span>18 documents</span></div>
              <div class="cat c-home" onclick="searchFor('home')"><span class="em">🏠</span><b>Home</b><span>12 documents</span></div>
            </div>

            <div class="section-h">Coming up</div>
            <div class="due"><span class="em">🌫️</span><div><b>PUC certificate</b><span>Expires 12 Dec 2026</span></div><span class="duepill warn">2 months</span></div>
            <div class="due"><span class="em">🚗</span><div><b>Car insurance</b><span>Renews 23 Sep 2027</span></div><span class="duepill ok">11 months</span></div>

            <div class="section-h">Recently added</div>
            <div class="docrow" onclick="openDoc()"><span class="em" style="background:#D7EEFF">🚗</span><div><b>Tata AIG Car Insurance</b><span>Insurance / Vehicle</span></div><span class="rt"><span class="chk">✓ organised</span><br>2 hrs ago</span></div>
            <div class="docrow" onclick="openDoc()"><span class="em" style="background:#D6F5E3">🏦</span><div><b>HDFC Statement — Sep</b><span>Finance / Bank</span></div><span class="rt"><span class="chk">✓ organised</span><br>Yesterday</span></div>
            <div class="docrow" onclick="openDoc()"><span class="em" style="background:#FFE9B8">🧾</span><div><b>Amazon Invoice</b><span>Purchases / Invoice</span></div><span class="rt"><span class="chk">✓ organised</span><br>Yesterday</span></div>
          </div>
        </section>

        <!-- ================= SEARCH ================= -->
        <section class="screen has-nav" id="scr-search">
          <div class="sbody">
            <div class="searchbar">
              <div class="backbtn" onclick="go('scr-home')">←</div>
              <input class="searchinput" id="q" value="car insurance" oninput="runSearch()" placeholder="Try “documents expiring soon”…">
            </div>
            <div class="chips">
              <span class="chip" onclick="chip('expiring')">expiring</span>
              <span class="chip" onclick="chip('HDFC statement')">HDFC statement</span>
              <span class="chip" onclick="chip('Amazon')">Amazon</span>
              <span class="chip" onclick="chip('passport')">passport</span>
            </div>
            <div class="rescount" id="rescount">3 results</div>
            <div id="results"></div>
          </div>
        </section>

        <!-- ================= SCANNER ================= -->
        <section class="screen no-nav" id="scr-scan">
          <div class="scr-head">
            <div class="backbtn" onclick="go('scr-home')">←</div>
            <h2>Scan document</h2>
          </div>
          <div class="viewfinder">
            <div class="flashfx" id="flashfx"></div>
            <span class="corner tl"></span><span class="corner tr"></span><span class="corner bl"></span><span class="corner br"></span>
            <div class="ghostdoc">DOCUMENT</div>
            <div class="laser"></div>
            <div class="detect">✨ Auto detect · Auto crop</div>
          </div>
          <div class="shutterrow">
            <div class="thumbs" id="thumbs"></div>
            <button class="shutter" onclick="snap()" aria-label="Take photo"></button>
            <button class="doneScan" id="doneScan" onclick="go('scr-proc')">Done →</button>
          </div>
          <div class="review" id="review">
            <h3>Looks good! 🎉</h3>
            <div class="pagelist" id="pagelist"></div>
            <button class="btn ghost" style="margin-bottom:9px" onclick="morePages()">＋ Add another page</button>
            <button class="btn primary" onclick="go('scr-proc')">Save document</button>
          </div>
        </section>

        <!-- ================= PROCESSING ================= -->
        <section class="screen no-nav" id="scr-proc">
          <div class="procwrap">
            <div class="procfile">📄 scan_20261003_2016.pdf</div>
            <div class="procspark">✨</div>
            <h2 id="procTitle">Organising…</h2>
            <div class="steps" id="steps">
              <div class="step"><span class="dot"></span>Reading document</div>
              <div class="step"><span class="dot"></span>Identifying document</div>
              <div class="step"><span class="dot"></span>Extracting details</div>
              <div class="step"><span class="dot"></span>Finding dates</div>
              <div class="step"><span class="dot"></span>Organizing</div>
            </div>
            <div class="pbar"><i id="pfill"></i></div>
            <div class="pct" id="pct">0%</div>
            <button class="btn green" id="procDone" onclick="finishProc()">See what I found →</button>
          </div>
        </section>

        <!-- ================= RESULT ================= -->
        <section class="screen no-nav" id="scr-result">
          <div class="reswrap">
            <h2>Got it! <em>🎉</em></h2>
            <p class="sub">I know exactly what this is.</p>
            <div class="herocard">
              <div class="herotop">
                <span class="em">🚗</span>
                <div><b>Car Insurance</b><span>Tata AIG · renamed to “Tata AIG Car Insurance — 2026.pdf”</span></div>
              </div>
              <div class="heroline">🗓️ 24 Sep 2026 <span class="arr">→</span> 23 Sep 2027</div>
              <div class="heroline">🚙 23 BH 764 &nbsp;·&nbsp; 💰 ₹18,450</div>
              <div class="savedto">Saved to <span class="fold">🛡 Insurance / Vehicle</span> <span class="drv">☁️ in your Google Drive</span></div>
            </div>
            <div class="checkrow">
              <p>Everything looks right?</p>
              <div class="checkbtns">
                <button class="btn green small" onclick="confirmResult()">✓ Yes, perfect</button>
                <button class="btn ghost small" onclick="notQuite()">Not quite…</button>
              </div>
            </div>
            <button class="btn ghost" style="margin-top:13px" onclick="openDoc()">Open document</button>
          </div>
        </section>

        <!-- ================= INBOX ================= -->
        <section class="screen has-nav" id="scr-inbox">
          <div class="sbody">
            <h2 class="hello">Inbox 📥</h2>
            <p class="sub" id="inboxSub">3 things need your attention</p>
            <div style="height:16px"></div>

            <div class="inboxcard" id="ic1">
              <div class="top"><span class="em" style="background:#FFE9B8">🧾</span>
                <div><b>Electricity bill — BESCOM</b><span class="meta">September · ₹1,240 · from WhatsApp</span></div>
                <span class="conf hi">98%</span></div>
              <div class="ailine"><span class="sp">✨</span><div>Pretty sure this is a bill. Save it to <b>&nbsp;Bills&nbsp;</b>?</div></div>
              <div class="rowbtns">
                <button class="btn green small" onclick="resolve('ic1','Saved to Bills ✓')">✓ Looks right</button>
                <button class="btn ghost small" onclick="togglePick('pk1')">Change</button>
              </div>
              <div class="catpick" id="pk1"></div>
            </div>

            <div class="inboxcard" id="ic2">
              <div class="top"><span class="em" style="background:#EFEAD9">📄</span>
                <div><b>Unknown document</b><span class="meta">scan_0042.pdf · scanned today</span></div>
                <span class="conf lo">63%</span></div>
              <div class="ailine"><span class="sp">🤔</span><div>I couldn't identify this one. Where should it live?</div></div>
              <button class="btn ghost small" onclick="togglePick('pk2')">Choose category</button>
              <div class="catpick" id="pk2"></div>
            </div>

            <div class="inboxcard" id="ic3">
              <div class="top"><span class="em" style="background:#FFE9B8">🧾</span>
                <div><b>Amazon Invoice (again?)</b><span class="meta">shared from Chrome</span></div></div>
              <div class="ailine"><span class="sp">👀</span><div>This looks like a duplicate of <b>&nbsp;“Amazon Invoice — Sep 2026”</b>. Keep both?</div></div>
              <div class="rowbtns">
                <button class="btn green small" onclick="resolve('ic3','Kept both — linked together 🔗')">Keep both</button>
                <button class="btn ghost small" onclick="resolve('ic3','Duplicate skipped 🗑️')">Skip</button>
              </div>
            </div>

            <div class="inboxempty" id="inboxEmpty">
              <div class="big">🎉</div>
              <h3>All clear!</h3>
              <p>Nothing needs you right now. Go enjoy your evening.</p>
            </div>
          </div>
        </section>

        <!-- ================= DOCUMENT ================= -->
        <section class="screen has-nav" id="scr-doc">
          <div class="doc-head">
            <div class="backbtn" onclick="go('scr-home')">←</div>
            <h2>Document</h2>
            <div class="iconbtn" onclick="toast('Share · Download · Move to Archive…')">⋮</div>
          </div>
          <div class="sbody" style="padding-top:6px">
            <div class="pdfpage">
              <div class="phead"><div class="plogo">TA</div><div><b>TATA AIG</b><span>GENERAL INSURANCE CO. LTD.</span></div></div>
              <div class="ptitle">Motor Insurance Policy — Schedule</div>
              <div class="pline" style="width:92%"></div><div class="pline" style="width:78%"></div><div class="pline" style="width:86%"></div>
              <div class="pgrid">
                <div class="pcell"><span>POLICY №</span><b>TAG-88231</b></div>
                <div class="pcell"><span>VEHICLE</span><b>23 BH 764</b></div>
                <div class="pcell"><span>PERIOD</span><b>24/09/26 – 23/09/27</b></div>
                <div class="pcell"><span>IDV</span><b>₹6,40,000</b></div>
              </div>
              <div class="stamp">ACTIVE ✓</div>
            </div>

            <h2 class="hello" style="font-size:22px">Tata AIG Car Insurance</h2>
            <div class="facts">
              <span class="fact hl">🗓 24 Sep 2026 → 23 Sep 2027</span>
              <span class="fact">🚙 23 BH 764</span>
              <span class="fact">💰 ₹18,450</span>
            </div>

            <div class="section-h" style="margin-top:6px">Details</div>
            <div class="dlist">
              <div class="drow"><span>Company</span><b>Tata AIG</b></div>
              <div class="drow"><span>Type</span><b>Insurance</b></div>
              <div class="drow"><span>Category</span><b>🚗 Vehicle</b></div>
              <div class="drow"><span>Confidence</span><b>98% ✨</b></div>
            </div>

            <div class="tags"><span class="tag">#car</span><span class="tag">#insurance</span><span class="tag">#2026</span><span class="tag">#tata-aig</span></div>

            <button class="btn primary" style="margin-bottom:10px" onclick="openAsk()">✨ Ask this document</button>
            <button class="btn ghost" onclick="toast('Opening in Google Drive… ☁️')">
              <svg width="15" height="14" viewBox="0 0 24 22" style="flex-shrink:0"><path d="M8.2 2h7.6l6.9 12h-7.6z" fill="#3FB5F2"/><path d="M22.7 14 19 20.5H4.6L8.4 14z" fill="#2EC27E"/><path d="M8.2 2 1.3 14l3.7 6.5L11.9 8.5z" fill="#FFB700"/></svg>
              Open in Google Drive
            </button>
            <p class="addhint" style="text-align:center;margin-top:11px">The original file never leaves your Drive 🔒</p>
          </div>
        </section>

        <!-- ================= SETTINGS ================= -->
        <section class="screen has-nav" id="scr-settings">
          <div class="sbody">
            <div class="toprow">
              <div class="backbtn" onclick="go('scr-home')">←</div>
              <h2 class="hello" style="font-size:22px">Settings</h2>
            </div>
            <div class="setrow"><span class="em">☁️</span><div><b>Google Drive</b><span>anirudh@gmail.com</span></div><span class="end okpill">Connected ✓</span></div>
            <div class="setrow"><span class="em">📁</span><div><b>Storage</b><span>My Drive / Docly</span></div></div>
            <div class="setrow"><span class="em">🤖</span><div><b>Auto-organise new documents</b><span>High confidence → filed automatically</span></div><span class="end"><div class="switch on" onclick="this.classList.toggle('on')"></div></span></div>
            <div class="setrow"><span class="em">🔔</span><div><b>Expiry reminders</b><span>30 days before a date hits</span></div><span class="end"><div class="switch on" onclick="this.classList.toggle('on')"></div></span></div>
            <div class="setrow"><span class="em">🔐</span><div><b>Delete AI data</b><span>Clears OCR text, embeddings & summaries</span></div><span class="end"><button class="btn ghost small" onclick="toast('AI data cleared — files stay in Drive 🔒')">Clear</button></span></div>
            <div class="setrow"><span class="em">🏷️</span><div><b>Categories</b><span>12 defaults · 0 custom</span></div></div>
            <div class="privnote">🔒 <b>Privacy by design:</b> Docly uses the narrow <b>drive.file</b> scope — it can only ever see the files <i>you</i> hand it. Nothing else in your Drive is touched.</div>
          </div>
        </section>

        <!-- ================= ONBOARDING ================= -->
        <section class="screen no-nav" id="scr-onb">
          <div class="obwrap">
            <div class="obart" id="obArt">🗂️</div>
            <h2 id="obTitle">Your documents,<br>finally organized.</h2>
            <p id="obText">Keep everything in your own Google Drive. Docly just makes it findable.</p>
            <div style="margin-top:auto"></div>
            <div class="obdots" id="obDots"><i class="on"></i><i></i><i></i></div>
            <button class="btn primary" id="obBtn" onclick="obNext()">Continue</button>
            <p class="scope" id="obScope"></p>
          </div>
        </section>

        <!-- ================= TAB BAR ================= -->
        <nav class="tabbar">
          <button class="tab on" id="tab-home" onclick="go('scr-home')"><span class="tico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3"><path d="M3.5 10.5 12 3l8.5 7.5"/><path d="M6 9.5V20h12V9.5"/></svg></span>Home</button>
          <button class="tab" id="tab-search" onclick="go('scr-search')"><span class="tico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3"><circle cx="10.5" cy="10.5" r="6.3"/><path d="m20.5 20.5-5-5"/></svg></span>Search</button>
          <button class="tabplus" onclick="openAdd()" aria-label="Add"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#143A32" stroke-width="3.2" stroke-linecap="round"><path d="M12 4.5v15M4.5 12h15"/></svg></button>
          <button class="tab" id="tab-inbox" onclick="go('scr-inbox')"><span class="tico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3"><path d="M3.5 13 6 4.5h12L20.5 13"/><path d="M3.5 13v5.5h17V13"/><path d="M3.5 13h5l1.6 2.5h3.8L15.5 13h5"/></svg></span>Inbox<span class="badge" id="tabBadge">3</span></button>
        </nav>

        <!-- add sheet -->
        <div class="dim" id="addDim" onclick="closeAdd()"></div>
        <div class="sheet" id="addSheet">
          <div class="grab"></div>
          <h3>What do you want to add?</h3>
          <button class="opt" onclick="closeAdd();resetScan();go('scr-scan')"><span class="em" style="background:#D7EEFF">📷</span><div><b>Take photo</b><span>Multi-page scanner with auto-crop</span></div><span class="arr">›</span></button>
          <button class="opt" onclick="closeAdd();go('scr-proc')"><span class="em" style="background:#E8E1FF">🖼️</span><div><b>Choose image</b><span>From your gallery</span></div><span class="arr">›</span></button>
          <button class="opt" onclick="closeAdd();go('scr-proc')"><span class="em" style="background:#FFE9B8">📄</span><div><b>Choose file</b><span>PDF, DOCX, anything</span></div><span class="arr">›</span></button>
          <button class="opt" onclick="closeAdd();toast('Picking from Google Drive… ☁️');setTimeout(()=>go('scr-proc'),700)"><span class="em" style="background:#D6F5E3">☁️</span><div><b>Google Drive</b><span>Import a file that's already there</span></div><span class="arr">›</span></button>
          <p class="tip">Tip: from WhatsApp, Chrome or Gmail — just hit <b>Share → Docly</b></p>
        </div>

        <!-- ask overlay -->
        <div class="askpanel" id="askPanel">
          <div class="askhead">
            <div class="backbtn" onclick="closeAsk()">←</div>
            <h2>✨ Ask this document</h2>
          </div>
          <div class="chat" id="chat"></div>
          <div class="askchips">
            <span class="chip" onclick="askQA(0)">Expiry date?</span>
            <span class="chip" onclick="askQA(1)">Insured amount?</span>
            <span class="chip" onclick="askQA(2)">Roadside assistance?</span>
          </div>
          <div class="askinput">
            <input id="askText" placeholder="Ask anything about this policy…" onkeydown="if(event.key==='Enter')freeAsk()">
            <button onclick="freeAsk()">➤</button>
          </div>
        </div>

        <div class="toast" id="toast"></div>
        <div class="confetti-box" id="cfbox"></div>
      </div>
    </div>
    <div class="phoneCaption">↑ it's live — tap through the whole capture → organise → find loop · or use the rail</div>
  </div>

  <!-- screen rail -->
  <aside class="rail rise" style="animation-delay:.15s">
    <h3>Screens</h3>
    <button class="railitem on" data-s="scr-home" onclick="go('scr-home')"><span class="n">01</span>Home</button>
    <button class="railitem" data-s="scr-search" onclick="go('scr-search')"><span class="n">02</span>Search</button>
    <button class="railitem" data-x="add" onclick="go('scr-home');setTimeout(openAdd,250)"><span class="n">03</span>Add sheet</button>
    <button class="railitem" data-s="scr-scan" onclick="resetScan();go('scr-scan')"><span class="n">04</span>Scanner</button>
    <button class="railitem" data-s="scr-proc" onclick="go('scr-proc')"><span class="n">05</span>✨ Processing</button>
    <button class="railitem" data-s="scr-result" onclick="go('scr-result')"><span class="n">06</span>Got it! 🎉</button>
    <button class="railitem" data-s="scr-inbox" onclick="go('scr-inbox')"><span class="n">07</span>Inbox</button>
    <button class="railitem" data-s="scr-doc" onclick="openDoc()"><span class="n">08</span>Document</button>
    <button class="railitem" data-x="ask" onclick="openDoc();setTimeout(openAsk,250)"><span class="n">09</span>Ask ✨</button>
    <button class="railitem" data-s="scr-settings" onclick="go('scr-settings')"><span class="n">10</span>Settings</button>
    <button class="railitem" data-s="scr-onb" onclick="obReset();go('scr-onb')"><span class="n">11</span>Onboarding</button>
  </aside>
</main>

<footer class="flow rise" style="animation-delay:.25s">
  <div class="flowtrack">
    <div class="flowstep fs1"><b>＋ ADD</b><span>Snap it · share it · upload it</span></div>
    <div class="flowarrow">→</div>
    <div class="flowstep fs2"><b>✨ ORGANIZE</b><span>AI reads, names, tags &amp; files it</span></div>
    <div class="flowarrow">→</div>
    <div class="flowstep fs3"><b>🔍 FIND</b><span>Search or ask in plain words</span></div>
  </div>
  <p class="flowline"><b>Files never leave your Google Drive.</b> Docly is the smart layer on top —<br>Drive API + Supabase + pgvector + a job queue humming underneath.</p>
</footer>

<script>
/* ============ helpers ============ */
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const phone=$('#phone');
let toastTimer;
function toast(msg){const t=$('#toast');t.textContent=msg;t.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.classList.remove('show'),2000);}
function confetti(n=70){
  const box=$('#cfbox'),colors=['#FFB700','#FF6B57','#2EC27E','#3FB5F2','#8B7CF6','#FFF6E6'];
  for(let i=0;i<n;i++){const p=document.createElement('i');p.className='cf';
    p.style.left=Math.random()*100+'%';p.style.background=colors[i%colors.length];
    p.style.animationDuration=(0.9+Math.random()*0.9)+'s';p.style.animationDelay=(Math.random()*0.35)+'s';
    p.style.transform='rotate('+Math.random()*360+'deg)';box.appendChild(p);
    setTimeout(()=>p.remove(),2300);}
}
/* ============ navigation ============ */
const NAVLESS=['scr-scan','scr-proc','scr-result','scr-onb'];
const TABMAP={'scr-home':'home','scr-search':'search','scr-inbox':'inbox','scr-doc':'home','scr-settings':'home'};
function go(id){
  $$('.screen').forEach(s=>s.classList.remove('active'));
  const scr=document.getElementById(id);scr.classList.add('active');
  phone.classList.toggle('navless',NAVLESS.includes(id));
  $$('.tab').forEach(t=>t.classList.remove('on'));
  if(TABMAP[id]){const tb=$('#tab-'+TABMAP[id]);if(tb){tb.classList.remove('on');void tb.offsetWidth;tb.classList.add('on');}}
  $$('.railitem').forEach(r=>r.classList.toggle('on',r.dataset.s===id));
  if(id==='scr-proc')runProcessing();
  if(id==='scr-search'){setTimeout(()=>$('#q').focus(),350);runSearch();}
  scr.querySelector('.sbody')?.scrollTo({top:0});
}
/* ============ add sheet ============ */
function openAdd(){$('#addDim').classList.add('show');$('#addSheet').classList.add('show');}
function closeAdd(){$('#addDim').classList.remove('show');$('#addSheet').classList.remove('show');}
/* ============ search ============ */
const DOCS=[
 {e:'🚗',bg:'#D7EEFF',t:'Tata AIG Car Insurance',m:'2026–2027 · Tata AIG · Vehicle',n:'Expires 23 Sep 2027',b:'PDF',k:'car insurance tata vehicle policy'},
 {e:'🚗',bg:'#D7EEFF',t:'Previous Car Insurance',m:'2025–2026 · ICICI Lombard · Vehicle',n:'Expired',b:'PDF',k:'car insurance icici lombard vehicle previous old'},
 {e:'🪪',bg:'#EFEAD9',t:'Car RC — 23 BH 764',m:'Valid until 2041 · Vehicle',n:'',b:'IMG',k:'car rc registration vehicle 23bh'},
 {e:'🌫️',bg:'#D6F5E3',t:'PUC Certificate',m:'Expires 12 Dec 2026 · Vehicle',n:'Expires soon ⚠️',b:'PDF',k:'puc pollution certificate vehicle expiring'},
 {e:'🏦',bg:'#D6F5E3',t:'HDFC Statement — Sep 2026',m:'Finance · Bank statement',n:'',b:'PDF',k:'hdfc statement bank finance'},
 {e:'🧾',bg:'#FFE9B8',t:'Amazon Invoice — ANC Headphones',m:'12 Sep 2026 · Purchases',n:'₹7,999',b:'PDF',k:'amazon invoice purchase shopping headphones'},
 {e:'📄',bg:'#E8E1FF',t:'Passport',m:'Expires 14 Jun 2034 · Personal',n:'',b:'IMG',k:'passport personal travel identity'},
];
function runSearch(){
  const q=$('#q').value.trim().toLowerCase();const out=$('#results');
  let list;
  if(!q){out.innerHTML='<div class="ailine" style="margin-top:6px"><span class="sp">💡</span><div>Try <b>“car insurance”</b>, <b>“expiring”</b> or <b>“Amazon”</b> — no folders, no filters, just words.</div></div>';$('#rescount').textContent='Natural search';return;}
  const toks=q.split(/\s+/);
  list=DOCS.map(d=>({...d,score:toks.filter(t=>(d.t+' '+d.m+' '+d.k).toLowerCase().includes(t)).length})).filter(d=>d.score>0).sort((a,b)=>b.score-a.score);
  $('#rescount').textContent=list.length?('✨ '+list.length+' result'+(list.length>1?'s':'')):'No matches — yet';
  out.innerHTML=list.map(d=>`<div class="rescard" onclick="openDoc()">
    <div class="top"><span class="em" style="background:${d.bg}">${d.e}</span>
    <div><b>${d.t}</b><div class="meta">${d.m}</div></div></div>
    <div class="foot"><span class="ftag ${d.b==='PDF'?'pdf':'img'}">${d.b}</span>${d.n?`<span class="exp">${d.n}</span>`:''}</div></div>`).join('')
   ||'<div class="ailine" style="margin-top:6px"><span class="sp">🤷</span><div>Nothing found. In the real app I’d also search OCR text, Drive and meanings.</div></div>';
}
function chip(v){$('#q').value=v;runSearch();}
function searchFor(v){go('scr-search');$('#q').value=v;runSearch();}
/* ============ scanner ============ */
let pages=0;
function resetScan(){pages=0;$('#thumbs').innerHTML='';$('#pagelist').innerHTML='';$('#review').classList.remove('show');$('#doneScan').classList.remove('show');}
function snap(){
  const f=$('#flashfx');f.classList.remove('go');void f.offsetWidth;f.classList.add('go');
  pages++;
  $('#thumbs').insertAdjacentHTML('beforeend',`<div class="th">${pages}</div>`);
  $('#pagelist').insertAdjacentHTML('beforeend',`<div class="pagerow"><span class="pv"></span>Page ${pages}<span class="ok">✓</span></div>`);
  $('#doneScan').classList.add('show');
  setTimeout(()=>$('#review').classList.add('show'),380);
}
function morePages(){$('#review').classList.remove('show');toast('Add another page 📄');}
/* ============ processing ============ */
let procToken=0;
function runProcessing(){
  procToken++;const tk=procToken;
  const steps=$$('#steps .step');
  steps.forEach(s=>s.classList.remove('active','done'));
  $('#pfill').style.width='0%';$('#pct').textContent='0%';
  $('#procDone').classList.remove('show');$('#procTitle').textContent='Organising…';
  const durs=[750,850,950,750,850];let t=300,done=0;
  durs.forEach((d,i)=>{
    setTimeout(()=>{if(tk!==procToken)return;steps[i].classList.add('active');},t);
    t+=d;
    setTimeout(()=>{if(tk!==procToken)return;steps[i].classList.remove('active');steps[i].classList.add('done');
      steps[i].querySelector('.dot').textContent='✓';done++;
      const pct=Math.round(done/5*100);$('#pfill').style.width=pct+'%';$('#pct').textContent=pct+'%';
      if(done===5){$('#procTitle').textContent='Done! 🎉';$('#procDone').classList.add('show');}
    },t);
  });
  steps.forEach(s=>s.querySelector('.dot').textContent='');
}
function finishProc(){go('scr-result');confetti();}
/* ============ result ============ */
function confirmResult(){confetti();toast('Nice! Saved to your documents ✓');setTimeout(()=>go('scr-home'),800);}
function notQuite(){toast('Moved to Inbox — tell me where it goes 📥');bumpInbox(1);setTimeout(()=>go('scr-inbox'),700);}
/* ============ inbox ============ */
let inboxCount=3;
function bumpInbox(n){inboxCount+=n;const b=Math.max(inboxCount,0);$('#homeBadge').textContent=b;$('#tabBadge').textContent=b;}
function setBadges(){$('#homeBadge').textContent=inboxCount;$('#tabBadge').textContent=inboxCount;
  $('#inboxSub').textContent=inboxCount?inboxCount+' thing'+(inboxCount>1?'s':'')+' need'+(inboxCount>1?'':'s')+' your attention':'All clear 🎉';}
function resolve(id,msg){const c=document.getElementById(id);c.classList.add('bye');
  setTimeout(()=>{c.style.display='none';inboxCount--;setBadges();toast(msg);if(inboxCount<=0)$('#inboxEmpty').style.display='block';},360);}
const CATS=[['🧾','Bills'],['🏦','Finance'],['🚗','Vehicle'],['🏠','Home'],['🛡️','Insurance'],['💼','Work'],['📜','Legal'],['📦','Other']];
function fillPicks(){$$('.catpick').forEach(pk=>{pk.innerHTML=CATS.map(c=>`<button onclick="pickCat(this,'${c[1]}')"><span>${c[0]}</span>${c[1]}</button>`).join('');});}
function togglePick(id){$('#'+id).classList.toggle('show');}
function pickCat(btn,cat){const card=btn.closest('.inboxcard');resolve(card.id,'Saved to '+cat+' ✓');}
/* ============ document & ask ============ */
function openDoc(){closeAsk();go('scr-doc');}
const QA=[
 {q:'What is the expiry date?',a:'Your Tata AIG policy expires on <b>23 September 2027</b> — about 11 months from now. Want me to remind you 30 days before? 🔔',c:'Page 1 · Policy schedule'},
 {q:'What’s the insured amount?',a:'The Insured Declared Value (IDV) is <b>₹6,40,000</b>, and the annual premium is <b>₹18,450</b>.',c:'Page 1 · Schedule'},
 {q:'Is roadside assistance included?',a:'Yes ✅ <b>24×7 roadside assistance</b> is included as an add-on cover on this policy.',c:'Page 3 · Add-on covers'}];
function openAsk(){const p=$('#askPanel');$('#chat').innerHTML='';p.classList.add('show');
  setTimeout(()=>askQA(0),450);}
function closeAsk(){$('#askPanel').classList.remove('show');}
function askQA(i){pushQA(QA[i].q,QA[i].a,QA[i].c);}
function pushQA(q,a,c){
  const chat=$('#chat');
  chat.insertAdjacentHTML('beforeend',`<div class="bub user">${q}</div>`);
  const tid='t'+Date.now();
  chat.insertAdjacentHTML('beforeend',`<div class="bub ai typing" id="${tid}"><i></i><i></i><i></i></div>`);
  chat.scrollTo({top:chat.scrollHeight});
  setTimeout(()=>{const el=document.getElementById(tid);
    el.classList.remove('typing');el.innerHTML=a+(c?`<br><span class="cite">📎 ${c}</span>`:'');
    chat.scrollTo({top:chat.scrollHeight});},850);
}
function freeAsk(){const i=$('#askText');const v=i.value.trim();if(!v)return;i.value='';
  pushQA(v,'Great question! In the real app I’d answer straight from your document — with page citations. (This part is still a mock 🤖)',null);}
/* ============ onboarding ============ */
const OB=[
 {art:'🗂️',t:'Your documents,<br>finally organized.',x:'Keep everything in your own Google Drive. Docly just makes it findable.',btn:'Continue',s:''},
 {art:'📸 → ✨',t:'Snap anything.',x:'We’ll read it, understand it, and organize it — bills, policies, IDs, invoices.',btn:'Continue',s:''},
 {art:'☁️',t:'Connect Google Drive',x:'Your files stay in your Google Drive. Always.',btn:'Connect Google Drive',s:'🔒 Only the files you give Docly — never your whole Drive.'}];
let obI=0;
function obRender(){const o=OB[obI];$('#obArt').textContent=o.art;$('#obTitle').innerHTML=o.t;$('#obText').textContent=o.x;
  $('#obBtn').textContent=o.btn;$('#obScope').textContent=o.s;
  $$('#obDots i').forEach((d,i)=>d.classList.toggle('on',i===obI));}
function obNext(){if(obI<2){obI++;obRender();}else{go('scr-home');toast('Google Drive connected ✓');confetti(45);}}
function obReset(){obI=0;obRender();}
/* ============ init ============ */
fillPicks();setBadges();runSearch();go('scr-home');
</script>
</body>
</html>
