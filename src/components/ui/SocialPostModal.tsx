import { UID_SOCIAL_POST_DATA_URL } from '../../assets/uidSocialPost';
import { useGameStore } from '../../stores/useGameStore';

export function SocialPostModal() {
  const open = useGameStore((s) => s.socialPostOpen);
  const close = useGameStore((s) => s.closeSocialPost);

  if (!open) return null;

  return (
    <div className="interactive-ui absolute inset-0 z-[94] bg-black/75 backdrop-blur-[3px] flex items-center justify-center p-3 sm:p-5">
      <div className="relative w-full max-w-[720px] max-h-[94vh] overflow-auto rounded-xl border border-orange-300/40 bg-[#f8f5ef] shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between gap-3 bg-[#ea580c] px-4 py-3 text-white">
          <div>
            <div className="font-black tracking-wide">UID SOCIAL CHECK-IN</div>
            <div className="text-[11px] opacity-85">@UnityInDiversity • Our Culture</div>
          </div>
          <button
            onClick={close}
            className="rounded bg-black/25 px-3 py-1.5 text-xs font-bold hover:bg-black/40"
          >
            ✕ ĐÓNG
          </button>
        </div>

        <div className="p-3 sm:p-4">
          <img
            src={UID_SOCIAL_POST_DATA_URL}
            alt="UIDers mừng Quốc Khánh 2.9.2026"
            className="mx-auto block w-full max-w-[620px] rounded-lg border border-slate-200 shadow"
          />

          <div className="mx-auto mt-4 max-w-[620px] rounded-lg bg-white p-4 text-slate-800">
            <div className="font-black">@UnityInDiversity</div>
            <div className="text-xs text-slate-500">Ho Chi Minh City, Viet Nam</div>
            <div className="mt-3 text-sm sm:text-base">
              <b>Tết Độc Lập 🇻🇳🇻🇳</b><br />
              UIDers mừng Quốc Khánh 2.9.2026
            </div>
            <div className="mt-3 text-[11px] text-slate-500">
              Bấm E gần bảng social ở Lầu 2 để mở lại.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
