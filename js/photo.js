// Passport photo step for the registration form: Cropper.js crop box (35x45 mm = 7:9),
// auto-placed on the face when the browser has the built-in FaceDetector. Runs fully in the browser.
const PASSPORT_RATIO = 7 / 9;

// Crop box (in image pixels) with the face's head roughly filling the passport frame.
function faceToCrop(face, imgW, imgH) {
  let h = Math.min(face.height * 2.2, imgH, imgW / PASSPORT_RATIO);
  const w = h * PASSPORT_RATIO;
  const cx = face.x + face.width / 2;
  const cy = face.y + face.height / 2;
  const x = Math.min(Math.max(cx - w / 2, 0), imgW - w);
  const y = Math.min(Math.max(cy - h * 0.45, 0), imgH - h);
  return { x, y, width: w, height: h };
}

(function () {
  if (typeof document === 'undefined') return;
  const input = document.querySelector('#regForm input[name=photo]');
  if (!input) return;
  const wrap = document.getElementById('cropWrap');
  const img = document.getElementById('cropImg');
  const msg = document.getElementById('cropMsg');
  let cropper = null;
  let url = null;

  window.resetPassportPhoto = () => {
    cropper?.destroy(); cropper = null;
    if (url) URL.revokeObjectURL(url);
    url = null; wrap.hidden = true; msg.textContent = '';
  };
  // 413x531 px is 35x45 mm at 300 dpi
  window.getPassportPhoto = () => cropper
    ? cropper.getCroppedCanvas({ width: 413, height: 531 }).toDataURL('image/jpeg', 0.85) : '';

  async function autoPlace() {
    if (!('FaceDetector' in window)) { msg.textContent = 'Drag and zoom to fit your face in the frame.'; return; }
    try {
      const faces = await new FaceDetector({ fastMode: true }).detect(img);
      if (!faces.length) { msg.textContent = 'No face detected. Please adjust the frame yourself.'; return; }
      const best = faces.reduce((a, b) => (b.boundingBox.width > a.boundingBox.width ? b : a)).boundingBox;
      cropper.setData(faceToCrop(best, img.naturalWidth, img.naturalHeight));
      msg.textContent = faces.length > 1 ? 'Several faces found; used the largest. Adjust if needed.' : 'Face detected. Adjust if needed.';
    } catch {
      msg.textContent = 'Auto-detect failed. Drag and zoom to fit your face in the frame.';
    }
  }

  input.addEventListener('change', () => {
    window.resetPassportPhoto();
    const file = input.files[0];
    if (!file || !/^image\//.test(file.type)) return;
    url = URL.createObjectURL(file);
    img.onload = () => {
      wrap.hidden = false;
      cropper = new Cropper(img, { aspectRatio: PASSPORT_RATIO, viewMode: 1, autoCropArea: 0.8, dragMode: 'move', ready: autoPlace });
    };
    img.src = url;
  });
})();

if (typeof module !== 'undefined') module.exports = { faceToCrop };
