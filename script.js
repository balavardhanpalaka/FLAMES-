// FLAMES checker
(function(){
  const form = document.getElementById('flamesForm');
  const name1Input = document.getElementById('name1');
  const name2Input = document.getElementById('name2');
  const resultEl = document.getElementById('result');
  const resultText = document.getElementById('resultText');
  const explain = document.getElementById('explain');
  const steps = document.getElementById('steps');
  const stepsList = document.getElementById('stepsList');
  const clearBtn = document.getElementById('clearBtn');

  const relationMap = {
    F: {text: 'Friends', cls:'rel-F', desc: 'You two are Friends.'},
    L: {text: 'Love', cls:'rel-L', desc: 'Romantic Love.'},
    A: {text: 'Affection', cls:'rel-A', desc: 'Affection / Attraction.'},
    M: {text: 'Marriage', cls:'rel-M', desc: 'Marriage / Long-term.'},
    E: {text: 'Enemy', cls:'rel-E', desc: 'Enemies / Rivalry.'},
    S: {text: 'Siblings', cls:'rel-S', desc: 'Siblings / Close like family.'}
  };

  function sanitize(name){
    if(!name) return '';
    // keep letters only, remove spaces and non-letters
    return name.toLowerCase().replace(/[^a-z]/g,'');
  }

  // Remove common letters from two strings
  function removeCommons(a, b){
    const aArr = a.split('');
    const bArr = b.split('');
    for(let i = 0; i < aArr.length; i++){
      const ch = aArr[i];
      const idx = bArr.indexOf(ch);
      if(idx !== -1){
        aArr[i] = null;
        bArr[idx] = null;
      }
    }
    const leftA = aArr.filter(Boolean);
    const leftB = bArr.filter(Boolean);
    return {leftA, leftB};
  }

  // Flames elimination algorithm
  function computeFlamesCount(count){
    // start with array of letters
    const flames = ['F','L','A','M','E','S'];
    let pointer = 0;
    // run until one left
    while(flames.length > 1){
      // compute index to remove
      // count is number of remaining letters
      // index = (pointer + count - 1) % flames.length
      const idx = (pointer + (count % flames.length) - 1 + flames.length) % flames.length;
      flames.splice(idx,1);
      pointer = idx % flames.length; // next round starts at this position
    }
    return flames[0];
  }

  function showResult(relKey, explanation){
    const rel = relationMap[relKey];
    resultText.innerHTML = `<span class="relation ${'rel-'+relKey}">${rel.text}</span>`;
    explain.textContent = explanation || rel.desc;
    resultEl.classList.remove('hidden');
    resultEl.focus();
  }

  function showSteps(lines){
    stepsList.innerHTML = '';
    lines.forEach(line => {
      const li = document.createElement('li');
      li.textContent = line;
      stepsList.appendChild(li);
    });
    steps.classList.remove('hidden');
    steps.setAttribute('aria-hidden','false');
  }

  form.addEventListener('submit', function(e){
    e.preventDefault();
    const raw1 = name1Input.value || '';
    const raw2 = name2Input.value || '';

    const a = sanitize(raw1);
    const b = sanitize(raw2);

    if(!a || !b){
      resultText.textContent = '';
      explain.textContent = 'Please enter both names using letters.';
      resultEl.classList.remove('hidden');
      steps.classList.add('hidden');
      return;
    }

    // remove common letters
    const {leftA, leftB} = removeCommons(a, b);
    const count = leftA.length + leftB.length;

    const stepLines = [
      `Sanitized male name: "${a}"`,
      `Sanitized female name: "${b}"`,
      `After removing common letters: remaining from male: "${leftA.join('')}", female: "${leftB.join('')}"`,
      `Total letters remaining: ${count}`
    ];

    if(count === 0){
      // special case: all letters cancelled
      showResult('S', 'All letters cancelled — result interpreted as "Siblings" (playful).');
      showSteps(stepLines);
      return;
    }

    const winner = computeFlamesCount(count);
    showResult(winner);
    showSteps(stepLines.concat([`FLAMES result letter: ${winner}`]));
  });

  clearBtn.addEventListener('click', function(){
    name1Input.value = '';
    name2Input.value = '';
    resultEl.classList.add('hidden');
    steps.classList.add('hidden');
    name1Input.focus();
  });

  // small UX: allow Enter on inputs
  name1Input.addEventListener('keydown', e => {
    if(e.key === 'Enter') {
      e.preventDefault();
      form.dispatchEvent(new Event('submit'));
    }
  });
  name2Input.addEventListener('keydown', e => {
    if(e.key === 'Enter') {
      e.preventDefault();
      form.dispatchEvent(new Event('submit'));
    }
  });

})();