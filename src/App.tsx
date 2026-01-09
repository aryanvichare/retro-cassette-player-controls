import { useState, useEffect, useRef } from "react";

export function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFastForwarding, setIsFastForwarding] = useState(false);
  const [isRewinding, setIsRewinding] = useState(false);
  const [tapePosition, setTapePosition] = useState(0);
  const [showPress, setShowPress] = useState<string | null>(null);
  const animationRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  // Handle tape position updates
  useEffect(() => {
    if (!isPlaying && !isFastForwarding && !isRewinding) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      return;
    }

    const animate = (timestamp: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const delta = timestamp - lastTimeRef.current;
      lastTimeRef.current = timestamp;

      setTapePosition((prev) => {
        let next = prev;
        if (isPlaying) next += delta * 0.01;
        if (isFastForwarding) next += delta * 0.05;
        if (isRewinding) next -= delta * 0.05;

        // Clamp between 0 and 100
        return Math.max(0, Math.min(100, next));
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, isFastForwarding, isRewinding]);

  const handlePress = (action: string) => {
    setShowPress(action);
    setTimeout(() => setShowPress(null), 150);
  };

  const handlePlayPause = () => {
    handlePress("play");
    if (isPlaying) {
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      setIsFastForwarding(false);
      setIsRewinding(false);
    }
  };

  const handleFastForward = () => {
    handlePress("ff");
    setIsFastForwarding(!isFastForwarding);
    if (!isFastForwarding) {
      setIsPlaying(false);
      setIsRewinding(false);
    }
  };

  const handleRewind = () => {
    handlePress("rw");
    setIsRewinding(!isRewinding);
    if (!isRewinding) {
      setIsPlaying(false);
      setIsFastForwarding(false);
    }
  };

  const handleStop = () => {
    handlePress("stop");
    setIsPlaying(false);
    setIsFastForwarding(false);
    setIsRewinding(false);
  };

  const isMoving = isPlaying || isFastForwarding || isRewinding;

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-100 to-amber-200 flex items-center justify-center p-8">
      <div className="w-full max-w-md">
        {/* Cassette Player Body */}
        <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-8 shadow-2xl border-4 border-gray-700">
          {/* Top Section - Cassette Window */}
          <div className="mb-8">
            <div className="relative bg-gray-900 rounded-xl p-4 border-2 border-gray-600 shadow-inner">
              {/* Cassette Window */}
              <div className="relative bg-gray-800 rounded-lg p-3 border border-gray-700 overflow-hidden">
                {/* Window Glass Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-700/20 to-transparent pointer-events-none" />
                {/* Window Reflection */}
                <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
                
                {/* Tape Reels Container */}
                <div className="relative h-32 flex items-center justify-between px-8">
                  {/* Left Reel */}
                  <div className="relative w-20 h-20">
                    <div className="absolute inset-0 rounded-full bg-gray-700 border-4 border-gray-600 flex items-center justify-center shadow-lg">
                      <div className={`w-16 h-16 rounded-full bg-gray-800 border-2 border-gray-500 flex items-center justify-center transition-transform duration-75 ${
                        isMoving ? "animate-spin-fast" : ""
                      }`}>
                        {/* Spokes */}
                        <div className="absolute w-full h-full animate-spin-slow">
                          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-4 bg-gray-500"></div>
                          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-4 bg-gray-500"></div>
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-1 bg-gray-500"></div>
                          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-1 bg-gray-500"></div>
                        </div>
                        {/* Tape Circle */}
                        <div className={`absolute w-12 h-12 rounded-full bg-gray-900 border-2 border-gray-600 transition-all duration-300 flex items-center justify-center ${
                          isMoving ? "border-amber-600 shadow-[0_0_15px_rgba(217,119,6,0.6)]" : ""
                        }`}>
                          {/* Inner hub */}
                          <div className="w-2 h-2 bg-gray-700 rounded-full" />
                        </div>
                      </div>
                    </div>
                    {/* Tape Amount Indicator */}
                    <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-amber-600 font-mono font-bold">
                      {Math.round(100 - tapePosition)}%
                    </div>
                  </div>

                  {/* Center Spindle */}
                  <div className="w-8 h-1 bg-gray-600 rounded-full relative">
                    <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-2 h-2 bg-gray-500 rounded-full" />
                  </div>

                  {/* Right Reel */}
                  <div className="relative w-20 h-20">
                    <div className="absolute inset-0 rounded-full bg-gray-700 border-4 border-gray-600 flex items-center justify-center shadow-lg">
                      <div className={`w-16 h-16 rounded-full bg-gray-800 border-2 border-gray-500 flex items-center justify-center transition-transform duration-75 ${
                        isMoving ? "animate-spin-fast" : ""
                      }`}>
                        {/* Spokes */}
                        <div className="absolute w-full h-full animate-spin-slow">
                          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-4 bg-gray-500"></div>
                          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-4 bg-gray-500"></div>
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-1 bg-gray-500"></div>
                          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-1 bg-gray-500"></div>
                        </div>
                        {/* Tape Circle */}
                        <div className={`absolute w-12 h-12 rounded-full bg-gray-900 border-2 border-gray-600 transition-all duration-300 flex items-center justify-center ${
                          isMoving ? "border-amber-600 shadow-[0_0_15px_rgba(217,119,6,0.6)]" : ""
                        }`}>
                          {/* Inner hub */}
                          <div className="w-2 h-2 bg-gray-700 rounded-full" />
                        </div>
                      </div>
                    </div>
                    {/* Tape Amount Indicator */}
                    <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-amber-600 font-mono font-bold">
                      {Math.round(tapePosition)}%
                    </div>
                  </div>
                </div>

                {/* Tape Window Bottom Decoration */}
                <div className="mt-2 flex justify-between items-center px-4">
                  <div className="w-12 h-1 bg-gray-700 rounded-full" />
                  <div className="w-12 h-1 bg-gray-700 rounded-full" />
                </div>
              </div>

              {/* Cassette Label */}
              <div className="mt-3 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg p-2 border border-gray-600 shadow-sm">
                <div className="text-center text-white font-bold text-sm tracking-wider drop-shadow-md">
                  MIXTAPE VOL. 1
                </div>
              </div>
            </div>
          </div>

          {/* Control Panel */}
          <div className="bg-gray-800 rounded-xl p-4 border-2 border-gray-700 shadow-inner">
            {/* Status Display */}
            <div className="mb-4 bg-gray-900 rounded-lg p-2 border border-gray-700">
              <div className="text-center text-amber-500 font-mono text-xs font-bold tracking-wider">
                {isPlaying ? "PLAYING" : isFastForwarding ? "FF >>" : isRewinding ? "<< RW" : "STOPPED"}
              </div>
              {/* Tape Counter */}
              <div className="mt-1 text-center text-amber-600 font-mono text-xs">
                {tapePosition.toFixed(1).padStart(5, "0")}
              </div>
            </div>

                          {/* Mechanical Buttons */}
            <div className="grid grid-cols-4 gap-3">
              {/* Rewind Button */}
              <button
                onClick={handleRewind}
                className={`group relative h-16 rounded-lg transition-all duration-100 active:translate-y-1 active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)] ${
                  showPress === "rw" 
                    ? "bg-gray-700 shadow-[inset_0_4px_8px_rgba(0,0,0,0.6),inset_0_0_15px_rgba(0,0,0,0.4)] border-y-2 border-gray-900 translate-y-1"
                    : "bg-gradient-to-b from-gray-700 to-gray-600 border-y-2 border-gray-800 shadow-[0_4px_0_0_rgba(39,39,42,1),inset_0_1px_2px_rgba(255,255,255,0.15)] hover:from-gray-600 hover:to-gray-500 hover:shadow-[0_3px_0_0_rgba(39,39,42,1)]"
                } ${isRewinding ? "ring-2 ring-amber-500 ring-offset-2 ring-offset-gray-800" : ""}`}
              >
                <div className="flex flex-col items-center justify-center gap-1">
                  <div className="flex items-center gap-0.5">
                    <div className={`w-0 h-0 border-y-[7px] border-r-[10px] border-y-transparent transition-all duration-100 ${
                      isRewinding ? "border-r-amber-400 filter drop-shadow-[0_0_3px_rgba(251,191,36,0.8)]" : "border-r-gray-400"
                    }`} />
                    <div className={`w-0 h-0 border-y-[7px] border-r-[10px] border-y-transparent transition-all duration-100 ${
                      isRewinding ? "border-r-amber-400 filter drop-shadow-[0_0_3px_rgba(251,191,36,0.8)]" : "border-r-gray-400"
                    }`} />
                  </div>
                  <span className={`text-[10px] font-bold transition-colors ${
                    isRewinding ? "text-amber-400" : "text-gray-300"
                  }`}>RW</span>
                </div>
              </button>

              {/* Play/Pause Button */}
              <button
                onClick={handlePlayPause}
                className={`group relative h-16 rounded-lg transition-all duration-100 active:translate-y-1 active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)] ${
                  showPress === "play" 
                    ? "bg-gray-700 shadow-[inset_0_4px_8px_rgba(0,0,0,0.6),inset_0_0_15px_rgba(0,0,0,0.4)] border-y-2 border-gray-900 translate-y-1"
                    : "bg-gradient-to-b from-gray-700 to-gray-600 border-y-2 border-gray-800 shadow-[0_4px_0_0_rgba(39,39,42,1),inset_0_1px_2px_rgba(255,255,255,0.15)] hover:from-gray-600 hover:to-gray-500 hover:shadow-[0_3px_0_0_rgba(39,39,42,1)]"
                } ${isPlaying ? "ring-2 ring-green-500 ring-offset-2 ring-offset-gray-800" : ""}`}
              >
                <div className="flex flex-col items-center justify-center gap-1">
                  {isPlaying ? (
                    <div className="flex gap-1">
                      <div className={`w-1.5 h-6 bg-gray-300 rounded-sm transition-all duration-100 ${
                        isPlaying ? "bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.9),0_0_2px_rgba(74,222,128,1)]" : ""
                      }`} />
                      <div className={`w-1.5 h-6 bg-gray-300 rounded-sm transition-all duration-100 ${
                        isPlaying ? "bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.9),0_0_2px_rgba(74,222,128,1)]" : ""
                      }`} />
                    </div>
                  ) : (
                    <div className={`w-0 h-0 border-y-[11px] border-l-[18px] border-y-transparent transition-all duration-100 ml-1 ${
                      isPlaying ? "border-l-green-400 filter drop-shadow-[0_0_3px_rgba(74,222,128,0.8)]" : "border-l-gray-300"
                    }`} />
                  )}
                  <span className={`text-[10px] font-bold transition-colors ${
                    isPlaying ? "text-green-400" : "text-gray-300"
                  }`}>{isPlaying ? "PAUSE" : "PLAY"}</span>
                </div>
              </button>

              {/* Stop Button */}
              <button
                onClick={handleStop}
                className={`group relative h-16 rounded-lg transition-all duration-100 active:translate-y-1 active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)] ${
                  showPress === "stop" 
                    ? "bg-gray-700 shadow-[inset_0_4px_8px_rgba(0,0,0,0.6),inset_0_0_15px_rgba(0,0,0,0.4)] border-y-2 border-gray-900 translate-y-1"
                    : "bg-gradient-to-b from-gray-700 to-gray-600 border-y-2 border-gray-800 shadow-[0_4px_0_0_rgba(39,39,42,1),inset_0_1px_2px_rgba(255,255,255,0.15)] hover:from-gray-600 hover:to-gray-500 hover:shadow-[0_3px_0_0_rgba(39,39,42,1)]"
                }`}
              >
                <div className="flex flex-col items-center justify-center gap-1">
                  <div className={`w-5 h-5 bg-gray-300 rounded-sm transition-all duration-100 ${
                    showPress === "stop" ? "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.9),0_0_3px_rgba(239,68,68,1)]" : ""
                  }`} />
                  <span className="text-[10px] font-bold text-gray-300">STOP</span>
                </div>
              </button>

              {/* Fast Forward Button */}
              <button
                onClick={handleFastForward}
                className={`group relative h-16 rounded-lg transition-all duration-100 active:translate-y-1 active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)] ${
                  showPress === "ff" 
                    ? "bg-gray-700 shadow-[inset_0_4px_8px_rgba(0,0,0,0.6),inset_0_0_15px_rgba(0,0,0,0.4)] border-y-2 border-gray-900 translate-y-1"
                    : "bg-gradient-to-b from-gray-700 to-gray-600 border-y-2 border-gray-800 shadow-[0_4px_0_0_rgba(39,39,42,1),inset_0_1px_2px_rgba(255,255,255,0.15)] hover:from-gray-600 hover:to-gray-500 hover:shadow-[0_3px_0_0_rgba(39,39,42,1)]"
                } ${isFastForwarding ? "ring-2 ring-amber-500 ring-offset-2 ring-offset-gray-800" : ""}`}
              >
                <div className="flex flex-col items-center justify-center gap-1">
                  <div className="flex items-center gap-0.5">
                    <div className={`w-0 h-0 border-y-[7px] border-l-[10px] border-y-transparent transition-all duration-100 ${
                      isFastForwarding ? "border-l-amber-400 filter drop-shadow-[0_0_3px_rgba(251,191,36,0.8)]" : "border-l-gray-400"
                    }`} />
                    <div className={`w-0 h-0 border-y-[7px] border-l-[10px] border-y-transparent transition-all duration-100 ${
                      isFastForwarding ? "border-l-amber-400 filter drop-shadow-[0_0_3px_rgba(251,191,36,0.8)]" : "border-l-gray-400"
                    }`} />
                  </div>
                  <span className={`text-[10px] font-bold transition-colors ${
                    isFastForwarding ? "text-amber-400" : "text-gray-300"
                  }`}>FF</span>
                </div>
              </button>
            </div>
          </div>

          {/* Brand Logo */}
          <div className="mt-6 text-center">
            <div className="inline-block px-4 py-2 bg-gradient-to-r from-gray-900 to-black rounded-lg border border-gray-700 shadow-md">
              <span className="text-sm font-bold text-gray-400 tracking-[0.3em]">RETRO AUDIO</span>
              <span className="text-xs font-bold text-amber-600 ml-1">TAPE DECK</span>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute -top-2 -right-2 w-3 h-3 bg-red-500 rounded-full shadow-[0_0_10px_rgba(239,68,68,0.8)] animate-pulse" />
          <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-green-500 rounded-full shadow-[0_0_10px_rgba(74,222,128,0.8)]" />
        </div>

        {/* Instructions */}
        <div className="mt-6 text-center text-amber-800/70 text-sm font-medium">
          <p>Click buttons to control the cassette player</p>
          <p className="text-xs mt-1 opacity-75">Watch the reels spin and tape move!</p>
        </div>
      </div>
    </div>
  );
}
