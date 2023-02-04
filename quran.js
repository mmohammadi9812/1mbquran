// Copyright 2022 Mohammad Mohamamdi. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

async function load() {
    //e.ls = localStorage;
    // const ls = localStorage, e = window;
    let e = window;
    e.ls = localStorage;
    let $d;
    if (!ls.getItem('json')) {
        let e = await fetch("quran.json.bz2");
        let b = await e.arrayBuffer();
        const o = bz2.decompress(new Uint8Array(b));
        $d = JSON.parse(new TextDecoder('utf-8').decode(o));
        ls.setItem('json', JSON.stringify($d));
    } else {
        $d = JSON.parse(ls.getItem('json'));
    }

    const jozs = Object.keys($d).
                  map($_ => $_.split(',')).
                  reduce(
                    ($acc, $_) => {
                      $acc.hasOwnProperty($_[0]) ? $acc[$_[0]].add($_[1]) : $acc[$_[0]] = new Set([$_[1]]);
                      return $acc
                    }, {});

    window.joz = function (e) {
      console.log("joz function, e: ", e);
      ls.setItem('joz', e);
      r(e, 1)
    };
    window.sura = function (e) {
      console.log("sura function, e: ", e);
      ls.setItem('sura', e);
      r(ls.getItem('joz'), e)
    };


    function r(e, t = 1) {
        e = parseInt(e);
        t = parseInt(t);
        // https://stackoverflow.com/a/58157015/8796253
        const e2p = s => s.replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[d]);
        let suraSelect = Array.from(jozs[(e).toString()]).
                      map($_ => parseInt($_, 10)).
                      map($_ => `<option value="${$_}" ${t == $_ ? 'selected' : ''}>${$_}</option>`).
                      join('');
        let jozSelect = Object.keys(jozs).
                        map($_ => parseInt($_, 10)).
                        map($_ => `<option value="${$_}" ${e == $_ ? 'selected' : ''}>${$_}</option>`).
                        join('');
        let text = Object.keys($d).
                    filter($k => $k.startsWith(`${e},${t}`)).
                    map($k => `<p dir="rtl"><span>${e2p($k.split(',').at(2))}</span> ${$d[$k]}</p>`).
                    join('');

        document.querySelector('body').innerHTML = `
<div dir="rtl">
جزء <select onchange="joz(this.value)">${jozSelect}</select>
</div>
<div dir="rtl">
سوره <select onchange="sura(this.value)">${suraSelect}</select>
</div>
<div class="text">${text}</div>
<p class="credits">Made by Mohammad</a></p>`
    }
    ls.setItem('joz', ls.getItem('joz') || 1);
    ls.setItem('sura', ls.getItem('sura') || 1);
    r(ls.getItem('joz'), ls.getItem('sura'))
}

window.onload = load;
