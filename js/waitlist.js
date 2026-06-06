// ============================================
// CREDFLOW LANDING — waitlist.js
// Saves email to Supabase waitlist table
// Same Supabase project as the extension/dashboard
// ============================================

const SUPABASE_URL  = 'https://mktqccyyzfdutipqlomm.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1rdHFjY3l5emZkdXRpcHFsb21tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYxNDc2MDcsImV4cCI6MjA5MTcyMzYwN30.witPYK3C6z-oLknhWiu3h-uK2qCVKA4tyKh14W9c1Ho';

const emailInput = document.getElementById('email-input');
const joinBtn    = document.getElementById('join-btn');
const msgEl      = document.getElementById('waitlist-msg');

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function setMsg(text, type) {
  msgEl.textContent = text;
  msgEl.className   = 'waitlist-note ' + type;
}

joinBtn.addEventListener('click', async function () {
  const email = emailInput.value.trim();

  if (!email) {
    setMsg('Please enter your email address.', 'error');
    emailInput.focus();
    return;
  }

  if (!isValidEmail(email)) {
    setMsg('That doesn\'t look like a valid email.', 'error');
    emailInput.focus();
    return;
  }

  joinBtn.disabled   = true;
  joinBtn.textContent = 'Joining…';
  setMsg('', '');

  try {
    const res = await fetch(
      SUPABASE_URL + '/rest/v1/waitlist',
      {
        method:  'POST',
        headers: {
          'Content-Type':  'application/json',
          'apikey':        SUPABASE_ANON,
          'Authorization': 'Bearer ' + SUPABASE_ANON,
          'Prefer':        'return=minimal'
        },
        body: JSON.stringify({
          email:      email,
          source:     'landing_page',
          signed_up_at: new Date().toISOString()
        })
      }
    );

    // 201 = inserted, 409 = already exists (duplicate key)
    if (res.status === 201) {
      setMsg('✓ You\'re on the list! We\'ll email you when it\'s live.', 'success');
      emailInput.value    = '';
      joinBtn.textContent = 'Joined ✓';
    } else if (res.status === 409) {
      setMsg('You\'re already on the list — we\'ll be in touch!', 'success');
      joinBtn.disabled    = false;
      joinBtn.textContent = 'Join Waitlist';
    } else {
      const body = await res.json().catch(() => ({}));
      console.error('Supabase error:', res.status, body);
      setMsg('Something went wrong. Please try again.', 'error');
      joinBtn.disabled    = false;
      joinBtn.textContent = 'Join Waitlist';
    }
  } catch (err) {
    console.error('Network error:', err);
    setMsg('Network error. Please check your connection and try again.', 'error');
    joinBtn.disabled    = false;
    joinBtn.textContent = 'Join Waitlist';
  }
});

// Also allow Enter key in input
emailInput.addEventListener('keydown', function (e) {
  if (e.key === 'Enter') joinBtn.click();
});
