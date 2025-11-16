// FLAMES logic + animated elimination + theme handling
(function () {
  const form = document.getElementById('flames-form');
  const name1 = document.getElementById('name1');
  const name2 = document.getElementById('name2');
  const resultEl = document.getElementById('result');
  const resetBtn = document.getElementById('reset-btn');
  const themeButtons = document.querySelectorAll('.theme-btn');
  const flamesVisual = document.getElementById('flames-visual');
  const checkBtn = document.getElementById('check-btn');

  const outcomeMap = {
    'F': 'Friends',
    'L': 'Love',
    'A': 'Affection',
    'M': 'Marriage',
    'E': 'Enemies',
    'S': 'Siblings'
  };

  function normalize(s){
    return (s || '').toLowerCase().replace(/[^a-z]/g, '');
  }

  function removeCommons(a, b){
    const arrA = a.split('');
    const arrB = b.split('');
    for (let i = arrA.length - 1; i >= 0; --i) {
      const idx = arrB.indexOf(arrA[i]);
      if (idx !== -1) {
        arrA.splice(i, 1);
        arrB.splice(idx, 1);
      }
    }
    return [arrA.join(''), arrB.join('')];
  }

  function showResult(text, type='info'){
    resultEl.textContent = text;
    resultEl.dataset.type = type;
    resultEl.animate([{opacity:0.6},{opacity:1}], {duration:280, easing:'ease-out'});
  }

  // Utility sleep
  const sleep = ms => new Promise(res => setTimeout(res, ms));

  // Render the FLAMES letters visually
  function renderLetters(letters){
    flamesVisual.innerHTML = '';
    letters.forEach(l => {
      const el = document.createElement('div');
      el.className = 'flame-letter';
      el.dataset.letter = l;
      el.textContent = l;
      flamesVisual.appendChild(el);
    });
  }

  // Animate elimination steps using counting behavior
  async function animateFlames(count, onStep){
    let letters = ['F','L','A','M','E','S'];
    renderLetters(letters);
    let index = 0;

    // If count is 0, special-case: everything matched
    if (count === 0) {
      // mark all removed quickly
      const els = Array.from(flamesVisual.children);
      for (const el of els){
        el.classList.add('removed');
        await sleep(80);
      }
      return {letters};
    }

    while (letters.length > 1) {
      // Counting: highlight each element sequentially count times and land on removeIndex
      const removeIndex = ( (index + count - 1) % letters.length );
      // perform visual counting: loop count times, highlighting successive letters
      for (let c = 0; c < count; c++) {
        const pos = (index + c) % letters.length;
        const nodes = Array.from(flamesVisual.children);
        // clear previous counting states
        nodes.forEach(n => n.classList.remove('counting'));
        const targetNode = nodes[pos];
        if (targetNode) targetNode.classList.add('counting');
        await sleep(140); // per-count delay (feel free to adjust)
      }

      // remove the element at removeIndex visually
      const nodesNow = Array.from(flamesVisual.children);
      const nodeToRemove = nodesNow[removeIndex];
      if (nodeToRemove) {
        nodeToRemove.classList.remove('counting');
        nodeToRemove.classList.add('removed');
        // small pause to show removal
        await sleep(220);
        // remove from DOM
        nodeToRemove.remove();
      }

      // update array and index for next round
      letters.splice(removeIndex, 1);
      index = removeIndex % letters.length; // next starting index
      if (typeof onStep === 'function') {
        onStep([...letters]); // callback so we can announce step externally
      }
      await sleep(120);
    }

    return {letters};
  }

  // High-level compute & animate, returns final letter
  async function computeAndAnimate(leftover){
    // disable form during animation
    checkBtn.disabled = true;
    name1.disabled = true;
    name2.disabled = true;
    showResult('Animating elimination...', 'info');

    // animate and announce steps via aria
    const onStep = (letters) => {
      // update aria message during animation
      resultEl.textContent = `Remaining: ${letters.join(' ')}`;
    };

    const {letters} = await animateFlames(leftover, onStep);

    // final letter in DOM or in letters array
    const finalLetter = letters[0] || null;
    // Re-enable controls
    checkBtn.disabled = false;
    name1.disabled = false;
    name2.disabled = false;
    return finalLetter;
  }

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    const a = normalize(name1.value);
    const b = normalize(name2.value);

    if (!a || !b) {
      showResult('Please enter both names (letters only).', 'error');
      return;
    }
    const [ra, rb] = removeCommons(a, b);
    const leftover = (ra + rb).length;

    if (leftover === 0) {
      // animate quick removed state for all letters and show message
      await animateFlames(0);
      showResult("All letters matched — playful result: S (Siblings) or Affection in some variants.");
      return;
    }

    const finalLetter = await computeAndAnimate(leftover);
    const meaning = outcomeMap[finalLetter] || 'Unknown';
    showResult(`Result: ${meaning} (${finalLetter}) — leftover letters: ${leftover}`);
  });

  resetBtn.addEventListener('click', function () {
    form.reset();
    resultEl.textContent = '';
    flamesVisual.innerHTML = '';
    name1.focus();
  });

  // Theme switching (adds classes to body and updates aria-selected)
  function setTheme(themeName) {
    document.body.classList.remove('theme-classical', 'theme-romantic', 'theme-sad');
    document.body.classList.add(`theme-${themeName}`);
    themeButtons.forEach(btn => {
      const isActive = btn.dataset.theme === themeName;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-selected', String(isActive));
    });
  }

  themeButtons.forEach(btn => {
    btn.addEventListener('click', () => setTheme(btn.dataset.theme));
  });

  // Initialize focus and default theme
  setTheme('classical');
  name1.focus();
})();