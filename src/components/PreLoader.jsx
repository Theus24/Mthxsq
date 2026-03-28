import { useEffect, useMemo, useState } from "react";
import Aurora from "./Aurora/Aurora";
import { listProyek, listTools } from "../data";

const baseUrl = import.meta.env.BASE_URL || "/";

const resolveAssetUrl = (path) => `${baseUrl}${path}`.replace(/([^:]\/)\/+/g, "$1");

const imageAssets = [
  resolveAssetUrl("assets/faris.png"),
  resolveAssetUrl("assets/faris1.jpg"),
  resolveAssetUrl("assets/hero-img.webp"),
  ...listTools.map((tool) => tool.gambar),
  ...listProyek.map((project) => project.image),
];

const fileAssets = [
  resolveAssetUrl("assets/card.glb"),
  resolveAssetUrl("assets/lanyard.png"),
];

const uniqueAssets = [...new Set([...imageAssets, ...fileAssets])];

const waitForWindowLoad = () =>
  new Promise((resolve) => {
    if (document.readyState === "complete") {
      resolve();
      return;
    }

    window.addEventListener("load", resolve, { once: true });
  });

const waitForFonts = async () => {
  if (!document.fonts?.ready) return;

  try {
    await document.fonts.ready;
  } catch {
    // If fonts fail, we still let the app continue.
  }
};

const preloadImage = (url) =>
  new Promise((resolve) => {
    const img = new Image();
    img.decoding = "async";
    img.loading = "eager";
    img.onload = () => resolve({ url, ok: true });
    img.onerror = () => resolve({ url, ok: false });
    img.src = url;
  });

const preloadFile = async (url) => {
  try {
    const response = await fetch(url, { cache: "force-cache" });
    if (!response.ok) {
      return { url, ok: false };
    }

    await response.blob();
    return { url, ok: true };
  } catch {
    return { url, ok: false };
  }
};

const loadAsset = (url) => {
  const normalized = url.toLowerCase();
  const isImage = [".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg"].some((ext) =>
    normalized.endsWith(ext)
  );

  return isImage ? preloadImage(url) : preloadFile(url);
};

const PreLoader = ({ children }) => {
  const savedMode =
    typeof window !== "undefined" ? window.localStorage.getItem("siteDeviceMode") : null;

  const [deviceMode, setDeviceMode] = useState(savedMode === "pc" || savedMode === "mobile" ? savedMode : null);
  const [phase, setPhase] = useState("select");
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState(deviceMode ? "Carregando recursos essenciais..." : "Escolha como deseja navegar.");
  const [isVisible, setIsVisible] = useState(true);
  const [isReady, setIsReady] = useState(false);

  const assetsToLoad = useMemo(() => uniqueAssets, []);

  useEffect(() => {
    if (phase !== "loading" || !deviceMode) return;

    let isCancelled = false;

    const runPreload = async () => {
      setStatus("Carregando imagens, interface e recursos 3D...");
      setProgress(0);

      const totalSteps = assetsToLoad.length + 2;
      let completedSteps = 0;

      const advance = () => {
        completedSteps += 1;
        if (!isCancelled) {
          setProgress(Math.round((completedSteps / totalSteps) * 100));
        }
      };

      await Promise.allSettled(
        assetsToLoad.map(async (assetUrl) => {
          await loadAsset(assetUrl);
          advance();
        })
      );

      setStatus("Finalizando ambiente e tipografia...");
      await Promise.all([waitForFonts(), waitForWindowLoad()]);
      advance();

      await new Promise((resolve) => window.setTimeout(resolve, 250));
      advance();

      if (isCancelled) return;

      setProgress(100);
      setStatus("Tudo pronto.");
      setIsReady(true);
      setTimeout(() => {
        if (isCancelled) return;
        setIsVisible(false);
        setTimeout(() => {
          window.dispatchEvent(new Event("siteIntroStart"));
          setPhase("done");
        }, 700);
      }, 250);
    };

    runPreload();

    return () => {
      isCancelled = true;
    };
  }, [assetsToLoad, deviceMode, phase]);

  const handleModeSelect = (mode) => {
    window.localStorage.setItem("siteDeviceMode", mode);
    window.dispatchEvent(new Event("siteDeviceModeChange"));
    setDeviceMode(mode);
    setPhase("loading");
    setStatus(`Modo ${mode === "pc" ? "PC" : "Celular"} selecionado. Iniciando carregamento...`);
  };

  return (
    <>
      {phase === "done" ? children : null}

      {phase !== "done" && (
        <div
          className={`fixed inset-0 z-[10000] flex items-center justify-center overflow-hidden bg-black transition-opacity duration-700 ${
            isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <Aurora
            colorStops={["#577870", "#1F97A6", "#127B99"]}
            blend={0.5}
            amplitude={1.0}
            speed={0.5}
          />

          <div className="absolute mx-6 w-full max-w-2xl rounded-[28px] border border-blue-500/40 bg-[#0b0f16]/85 p-8 text-white shadow-[0_0_40px_rgba(18,123,153,0.2)] backdrop-blur-xl">
            <div className="mb-6">
              <p className="mb-3 text-sm uppercase tracking-[0.35em] text-cyan-300/80">Portfolio Loader</p>
              <h3 className="text-3xl font-bold md:text-4xl">by mthxsq</h3>
              <p className="mt-3 text-sm text-zinc-300 md:text-base">{status}</p>
            </div>

            {phase === "select" ? (
              <div className="space-y-6">
                <div className="rounded-2xl border border-blue-500/30 bg-blue-950/30 px-4 py-3 text-sm text-zinc-200">
                  Aten&#231;&#227;o: escolher o dispositivo errado pode causar falhas visuais ou de desempenho. Selecione a op&#231;&#227;o que mais combina com o aparelho que voc&#234; est&#225; usando agora.
                </div>

                {savedMode && (
                  <div className="text-sm text-zinc-400">
                    Escolha anterior detectada: {savedMode === "pc" ? "PC" : "Celular"}.
                  </div>
                )}

                <div className="grid gap-4 sm:grid-cols-2">
                  <button
                    className="rounded-2xl border border-blue-400/60 bg-[#101826] px-6 py-5 text-left transition-colors hover:bg-blue-950/60"
                    onClick={() => handleModeSelect("pc")}
                  >
                    <div className="mb-2 text-xl font-bold">PC</div>
                    <div className="text-sm text-zinc-300">Interface completa para desktop, com todos os efeitos e se&#231;&#245;es.</div>
                  </button>

                  <button
                    className="rounded-2xl border border-blue-400/60 bg-[#101826] px-6 py-5 text-left transition-colors hover:bg-blue-950/60"
                    onClick={() => handleModeSelect("mobile")}
                  >
                    <div className="mb-2 text-xl font-bold">Celular</div>
                    <div className="text-sm text-zinc-300">Experi&#234;ncia otimizada para toque e telas menores.</div>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="flex items-center justify-between text-sm text-zinc-300">
                  <span>Modo selecionado: {deviceMode === "pc" ? "PC" : "Celular"}</span>
                  <span>{progress}%</span>
                </div>

                <div className="h-3 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-sky-300 transition-[width] duration-300 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-xs uppercase tracking-[0.25em] text-zinc-400">
                  <span>Assets</span>
                  <span>{isReady ? "Ready" : "Loading"}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default PreLoader;
