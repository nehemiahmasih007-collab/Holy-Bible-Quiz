{/* Top Navigation Bar Bar Example */}
<header className="flex items-center justify-between p-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
  <div className="flex items-center gap-2">
    <h1 className="text-lg font-serif font-bold text-slate-900 dark:text-white">
      Bible Quiz World
    </h1>
  </div>

  <div className="flex items-center gap-2 md:gap-3">
    {/* 1. Feedback Button - Ab bilkul samne rakha gaya hai */}
    <button
      onClick={() => setShowFeedbackModal(true)}
      className="px-3.5 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 font-bold text-xs md:text-sm transition flex items-center gap-2 cursor-pointer border border-indigo-200 dark:border-indigo-800"
    >
      <MessageSquarePlus className="w-4 h-4" />
      <span>Feedback</span>
    </button>

    {/* 2. Settings Button */}
    <button
      onClick={() => setShowSettings(true)}
      className="p-2 md:p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition cursor-pointer"
      title="Settings"
    >
      <Settings className="w-5 h-5" />
    </button>
  </div>
</header>