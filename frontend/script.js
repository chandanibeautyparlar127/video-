// ============================================
// DubAI — Frontend Logic
// ============================================

lucide.createIcons();

// 🔗 CHANGE THIS after deploying backend to Hugging Face
const BACKEND_URL = "https://your-username-dubai-backend.hf.space";

// ============ NAVBAR SCROLL ============
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });

// ============ FILE UPLOAD ============
const dropzone = document.getElementById('dropzone');
const fileInput = document.getElementById('fileInput');
const fileInfo = document.getElementById('fileInfo');
const fileNameEl = document.getElementById('fileName');
const fileSizeEl = document.getElementById('fileSize');
const startBtn = document.getElementById('startBtn');

let selectedFile = null;

// Drag & drop
['dragenter', 'dragover'].forEach(ev => {
  dropzone.addEventListener(ev, e => {
    e.preventDefault();
    dropzone.classList.add('dragover');
  });
});
['dragleave', 'drop'].forEach(ev => {
  dropzone.addEventListener(ev, e => {
    e.preventDefault();
    dropzone.classList.remove('dragover');
  });
});
dropzone.addEventListener('drop', e => {
  const f = e.dataTransfer.files[0];
  if (f && f.type.startsWith('video/')) handleFile(f);
  else alert('Please select a video file (MP4, MOV, AVI, MKV)');
});
dropzone.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', e => {
  if (e.target.files[0]) handleFile(e.target.files[0]);
});

function handleFile(file) {
  selectedFile = file;
  fileNameEl.textContent = file.name;
  fileSizeEl.textContent = formatSize(file.size);
  dropzone.classList.add('hidden');
  fileInfo.classList.remove('hidden');
  startBtn.disabled = false;
}

function formatSize(bytes) {
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  if (bytes < 1024 * 1024 * 1024) return (bytes / 1024 / 1024).toFixed(1) + ' MB';
  return (bytes / 1024 / 1024 / 1024).toFixed(2) + ' GB';
}

function resetUpload() {
  selectedFile = null;
  fileInput.value = '';
  dropzone.classList.remove('hidden');
  fileInfo.classList.add('hidden');
  document.getElementById('progressBox').classList.add('hidden');
  document.getElementById('resultBox').classList.add('hidden');
  startBtn.disabled = true;
  startBtn.innerHTML = '<i data-lucide="sparkles"></i> Start Dubbing';
  lucide.createIcons();
}

// ============ START DUBBING ============
startBtn.addEventListener('click', async () => {
  if (!selectedFile) return;

  const voice = document.getElementById('voiceSelect').value;
  const music = document.getElementById('musicSelect').value;

  startBtn.disabled = true;
  startBtn.innerHTML = '<i data-lucide="loader" class="spin"></i> Processing...';
  lucide.createIcons();

  document.getElementById('progressBox').classList.remove('hidden');
  updateProgress('Uploading video...', 10, 'Sending to AI server...');

  try {
    // 1. Upload
    const formData = new FormData();
    formData.append('video', selectedFile);
    formData.append('voice', voice);
    formData.append('music', music);

    const uploadRes = await fetch(`${BACKEND_URL}/dub`, {
      method: 'POST',
      body: formData,
    });

    if (!uploadRes.ok) throw new Error('Upload failed');
    const { job_id } = await uploadRes.json();

    updateProgress('Processing with AI...', 25, 'Transcribing English audio...');

    // 2. Poll status
    let attempts = 0;
    const maxAttempts = 240; // 20 min max (5s x 240)

    const poll = setInterval(async () => {
      attempts++;
      if (attempts > maxAttempts) {
        clearInterval(poll);
        alert('Timeout. Try a shorter video.');
        resetUpload();
        return;
      }

      try {
        const statusRes = await fetch(`${BACKEND_URL}/status/${job_id}`);
        const status = await statusRes.json();

        if (status.status === 'done') {
          clearInterval(poll);
          updateProgress('Complete!', 100, 'Preparing download...');
          setTimeout(() => showResult(`${BACKEND_URL}${status.url}`), 500);
        } else {
          // Fake progress based on time
          const fakeProgress = Math.min(90, 25 + attempts * 2);
          const stage = status.stage || 'Processing...';
          updateProgress(stage, fakeProgress, 'AI is working — please wait');
        }
      } catch (err) {
        console.error('Poll error', err);
      }
    }, 5000);

  } catch (err) {
    console.error(err);
    alert('Something went wrong. Check console. Is your backend URL set?');
    resetUpload();
  }
});

function updateProgress(title, percent, hint) {
  document.getElementById('progressTitle').textContent = title;
  document.getElementById('progressBar').style.width = percent + '%';
  document.getElementById('progressHint').textContent = hint;
}

function showResult(videoUrl) {
  document.getElementById('progressBox').classList.add('hidden');
  document.getElementById('resultBox').classList.remove('hidden');
  document.getElementById('resultVideo').src = videoUrl;
  document.getElementById('downloadBtn').href = videoUrl;
  document.getElementById('resultBox').scrollIntoView({ behavior: 'smooth', block: 'center' });
}
