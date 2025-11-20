const urlInput = document.getElementById("urlInput");
const gasBtn = document.getElementById("gasBtn");
const clearBtn = document.getElementById("clearBtn");
const statusBox = document.getElementById("statusBox");
const resultBox = document.getElementById("resultBox");
const resultList = document.getElementById("resultList");

function setStatus(type, message) {
  statusBox.classList.remove("hidden", "info", "error", "success");
  statusBox.classList.add(type);
  statusBox.textContent = message;
}

function clearStatus() {
  statusBox.classList.add("hidden");
}

function clearResult() {
  resultBox.classList.add("hidden");
  resultList.innerHTML = "";
}

// 👉 MOCK API — nanti ganti dengan API lu sendiri.
async function fetchDownloadInfo(videoUrl) {
  // ========== CALL_API_DI_SINI ==========
  // Contoh kalau nanti pakai API sendiri:
  //
  // const res = await fetch("https://api-kamu.com/parse", {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify({ url: videoUrl })
  // });
  // if (!res.ok) throw new Error("API error");
  // return await res.json();
  // ======================================

  // MOCK DATA buat demo (tanpa API beneran)
  await new Promise((r) => setTimeout(r, 800));
  return {
    title: "Contoh Video",
    downloads: [
      {
        label: "MP4 720p (tanpa watermark)",
        size: "3.1 MB",
        url: "https://example.com/video-720.mp4"
      },
      {
        label: "MP4 360p",
        size: "1.2 MB",
        url: "https://example.com/video-360.mp4"
      }
    ]
  };
}

function renderResult(data) {
  resultList.innerHTML = "";
  data.downloads.forEach((item) => {
    const row = document.createElement("div");
    row.className = "result-item";

    const meta = document.createElement("div");
    meta.className = "result-meta";

    const main = document.createElement("span");
    main.textContent = item.label;

    const sub = document.createElement("span");
    sub.textContent = item.size || "";

    meta.appendChild(main);
    meta.appendChild(sub);

    const btn = document.createElement("button");
    btn.textContent = "Download";
    btn.addEventListener("click", () => {
      window.open(item.url, "_blank");
    });

    row.appendChild(meta);
    row.appendChild(btn);
    resultList.appendChild(row);
  });

  resultBox.classList.remove("hidden");
}

gasBtn.addEventListener("click", async () => {
  const url = urlInput.value.trim();
  clearStatus();
  clearResult();

  if (!url) {
    setStatus("error", "Masukin dulu link videonya.");
    return;
  }

  try {
    new URL(url);
  } catch {
    setStatus("error", "Format URL tidak valid.");
    return;
  }

  setStatus("info", "Lagi ngecek link & manggil server…");
  gasBtn.disabled = true;
  gasBtn.textContent = "Proses…";

  try {
    const data = await fetchDownloadInfo(url);
    if (!data || !Array.isArray(data.downloads) || data.downloads.length === 0) {
      setStatus("error", "Server tidak mengembalikan link download.");
    } else {
      setStatus("success", "Berhasil! Pilih kualitas yang kamu mau.");
      renderResult(data);
    }
  } catch (err) {
    console.error(err);
    setStatus("error", "Gagal menghubungi server / API.");
  } finally {
    gasBtn.disabled = false;
    gasBtn.textContent = "Gas";
  }
});

clearBtn.addEventListener("click", () => {
  urlInput.value = "";
  clearStatus();
  clearResult();
  urlInput.focus();
});
