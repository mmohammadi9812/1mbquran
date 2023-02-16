// Copyright 2023 Mohammad Mohamamdi. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

async function load() {
  let e = window, $d;
  e.ls = localStorage;
  if (!ls.getItem('json')) {
    let e = await fetch("quran.json.bz2");
    let b = await e.arrayBuffer();
    const o = bz2.decompress(new Uint8Array(b));
    $d = JSON.parse(new TextDecoder('utf-8').decode(o));
    ls.setItem('json', JSON.stringify($d));
  } else {
    $d = JSON.parse(ls.getItem('json'));
  }

  const keys = $d.map($_ => Object.keys($_).at(0));
  const jozs = keys.
    reduce(
      ($acc, $_) => {
        let $n = /J(\d+)S(\d+)A(\d+)P(\d+)/.exec($_);
        $acc.hasOwnProperty($n[1]) ? $acc[$n[1]].push([$n[2], $n[3], $n[4]]) : $acc[$n[1]] = [[$n[2], $n[3], $n[4]]];
        return $acc
      }, {});

  window.joz = (e) => {
    ls.setItem('joz', e);
    loadText(e, '1')
  };
  window.sura = (e) => {
    ls.setItem('sura', e);
    loadText(ls.getItem('joz'), e)
  };
  window.page = (e) => {
    ls.setItem('pageNo', e);
    loadText(ls.getItem('joz'), ls.getItem('sura'), e)
  }


  // https://stackoverflow.com/a/58157015/8796253
  const e2p = s => s.replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[d]);

  // https://stackoverflow.com/a/9229821/8796253
  function uniq_fast(a) {
    var seen = {}, out = [], len = a.length, j = 0;
    for (let i = 0; i < len; i++) {
      const item = a[i];
      if (seen[item] !== 1) {
        seen[item] = 1;
        out[j++] = item;
      }
    }
    return out;
  }

  function loadText(j, s = null, p = null) {
    const jozSelect = Object.keys(jozs).
      map($_ => parseInt($_, 10)).
      map($_ => `<option value="${$_}" ${j == $_ ? 'selected' : ''}>${$_}</option>`).
      join('');

    const suras = uniq_fast(jozs[j].map($_ => $_.at(0)));
    s = suras.includes(s) ? s : suras[0];

    const suraSelect = suras.
      map($_ => parseInt($_, 10)).
      map(($_, $i) => `<option value="${$_}" ${(s == $_ || s == ($i + 1)) ? 'selected' : ''}>${$_}</option>`).
      join('');
    let pages = uniq_fast(jozs[j].map($_ => $_.at(2)));
    const pageSelect = pages.
      map($_ => parseInt($_, 10)).
      map(($_, $i) => `<option value="${$_}" ${(p == $_ || !p && $i == 0) ? 'selected' : ''}>${$_}</option>`).
      join('');

    pages = keys.
      filter($k => $k.startsWith(`J${j}S${s}`)). // JXSY(.*)
      map($_ => $d.filter($__ => $__.hasOwnProperty($_))). // [ {}, {}, ... ] => [ [{'JXSY.*':{}}], ... ]
      flat(). // [ [{}], [{}], ... ] => [ {}, {}, ... ]
      reduce(($acc, $o) => { // [{}, {}, ...] => {1: [{}], 2: [{}, {}, ...], ...} group by pages
        const $k = Object.keys($o).at(0);
        const $n = /J(\d+)S(\d+)A(\d+)P(\d+)/.exec($k).at(4);
        ($acc[$n] = $acc[$n] || []).push($o);
        return $acc;
      }, {});
    const page = p ? pages[p] : pages[Object.keys(pages).at(0)];
    const text = page.
      map($o => {
        let $k = Object.keys($o).at(0);
        let $n = /J(\d+)S(\d+)A(\d+)P(\d+)/.exec($k).at(3);
        let $text = Object.values($o).at(0).a;
        let $trans = Object.values($o).at(0).b;
        return `<p dir="rtl"><span>${e2p($n)}</span> ${$text}</p>
<p dir="rtl"><span>${e2p($n)}</span> ${$trans}</p><br />`;
      }).
      join('');
    document.querySelector('body').innerHTML = `<div dir="rtl">
جزء <select onchange="joz(this.value)">${jozSelect}</select>
</div>
<div dir="rtl">
سوره <select onchange="sura(this.value)">${suraSelect}</select>
</div>
<div dir="rtl">
صفحه <select onchange="page(this.value)">${pageSelect}</select>
</div>
<div class="text">${text}</div>
<p class="credits">Made by Mohammad</a></p>`
  }
  ls.setItem('joz', ls.getItem('joz') || 1);
  ls.setItem('sura', ls.getItem('sura') || 1);
  loadText(ls.getItem('joz'), ls.getItem('sura'))
}

window.onload = load;
