import Aurora from "./Aurora/Aurora"
import { useState, useEffect } from "react"
import CountUp from "./CountUp/CountUp"

const PreLoader = () => {
  const [loading, setLoading] = useState(true)
  const [countDone, setCountDone] = useState(false)
  const [fadeText, setFadeText] = useState(false)
  const [fadeScreen, setFadeScreen] = useState(false)
  const [showDeviceSelect, setShowDeviceSelect] = useState(false);

  useEffect(() => {
    if (countDone) {
      // Após a contagem, mostra seleção de dispositivo
      setShowDeviceSelect(true);
    }
  }, [countDone])

  return (
    loading && (
      <div
        className={`w-screen h-screen fixed flex items-center justify-center bg-black z-[10000] overflow-hidden transition-opacity duration-1000 ${
          fadeScreen ? "opacity-0" : "opacity-100"
        }`}
      >
        <Aurora
          colorStops={["#577870", "#1F97A6", "#127B99"]}
          blend={0.5}
          amplitude={1.0}
          speed={0.5}
        />
        {!showDeviceSelect ? (
          <div
            className={`absolute text-white text-6xl font-bold transition-all duration-1000 ${
              fadeText ? "opacity-0 -translate-y-10" : "opacity-100 translate-y-0"
            }`}
          >
            <CountUp
              from={0}
              to={100}
              separator="," 
              direction="up"
              duration={1}
              className="count-up-text"
              onEnd={() => setCountDone(true)}
            />
          </div>
        ) : (
          <div className="absolute flex flex-col items-center justify-center gap-8 w-full">
            <div className="mb-2 px-4 py-2 rounded-xl bg-blue-900/80 text-white text-center text-base font-semibold max-w-xl shadow-lg border border-blue-500">
              Atenção: a escolha diferente pode afetar a experiência de navegação e funcionalidades do site.
            </div>
            <h2 className="text-white text-3xl font-bold mb-6">Como você quer navegar?</h2>
            <div className="flex gap-8">
              <button
                className="bg-[#1a1a1a] border border-blue-500 text-white px-8 py-4 rounded-2xl font-bold text-xl shadow-lg hover:bg-blue-900/80 transition-colors"
                onClick={() => {
                  window.localStorage.setItem('siteDeviceMode', 'pc');
                  window.dispatchEvent(new Event('siteDeviceModeChange'));
                  setFadeScreen(true);
                  setTimeout(() => setLoading(false), 1000);
                }}
              >PC</button>
              <button
                className="bg-[#1a1a1a] border border-blue-500 text-white px-8 py-4 rounded-2xl font-bold text-xl shadow-lg hover:bg-blue-900/80 transition-colors"
                onClick={() => {
                  window.localStorage.setItem('siteDeviceMode', 'mobile');
                  window.dispatchEvent(new Event('siteDeviceModeChange'));
                  setFadeScreen(true);
                  setTimeout(() => setLoading(false), 1000);
                }}
              >Celular</button>
            </div>
          </div>
        )}
      </div>
    )
  )
}

export default PreLoader
