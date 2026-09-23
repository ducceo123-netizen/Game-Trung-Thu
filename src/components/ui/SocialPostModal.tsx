import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { UID_SOCIAL_POST_DATA_URL } from '../../assets/uidSocialPost';
import { useGameStore } from '../../stores/useGameStore';
import { useSocialScreenStore } from '../../stores/useSocialScreenStore';

async function compressImage(file: File): Promise<string> {
  const source = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => typeof reader.result === 'string' ? resolve(reader.result) : reject(new Error('read failed'));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });

  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const next = new Image();
    next.onload = () => resolve(next);
    next.onerror = () => reject(new Error('image failed'));
    next.src = source;
  });

  const maxSide = 640;
  const scale = Math.min(1, maxSide / Math.max(img.naturalWidth, img.naturalHeight));
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(img.naturalWidth * scale));
  canvas.height = Math.max(1, Math.round(img.naturalHeight * scale));
  const ctx = canvas.getContext('2d');
  if (!ctx) return source;

  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL('image/jpeg', 0.76);
}

export function SocialPostModal() {
  const open = useGameStore((s) => s.socialPostOpen);
  const close = useGameStore((s) => s.closeSocialPost);
  const playerName = useGameStore((s) => s.playerName);
  const showAchievement = useGameStore((s) => s.showAchievement);

  const posts = useSocialScreenStore((s) => s.posts);
  const init = useSocialScreenStore((s) => s.init);
  const addPost = useSocialScreenStore((s) => s.addPost);
  const replaceAll = useSocialScreenStore((s) => s.replaceAllWithMine);

  const inputRef = useRef<HTMLInputElement>(null);
  const [draft, setDraft] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (open) void init();
  }, [open, init]);

  if (!open) return null;

  const onFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    try {
      setBusy(true);
      setDraft(await compressImage(file));
    } finally {
      setBusy(false);
      e.target.value = '';
    }
  };

  const upload = async (replace: boolean) => {
    if (!draft || busy) return;
    setBusy(true);
    const ok = replace
      ? await replaceAll(playerName, draft)
      : await addPost(playerName, draft);

    setBusy(false);

    showAchievement({
      id: replace ? 'social_takeover' : 'social_upload',
      title: ok ? (replace ? '📺 ĐÃ TAKE OVER MÀN HÌNH' : '📸 ĐÃ THÊM VÀO CAROUSEL') : 'UPLOAD CHƯA THÀNH CÔNG',
      subtitle: ok
        ? (replace
          ? 'Ảnh cũ đã được dọn hết. Màn hình giờ chỉ show ảnh của bạn.'
          : 'Ảnh của bạn đã xếp vào playlist và sẽ lần lượt xuất hiện.')
        : 'Mạng đang chập chờn, thử lại nha.',
    });

    if (ok) setDraft(null);
  };

  const preview = draft ?? posts[posts.length - 1]?.image_data ?? UID_SOCIAL_POST_DATA_URL;

  return (
    <div className="interactive-ui absolute inset-0 z-[94] bg-black/75 backdrop-blur-[3px] flex items-center justify-center p-3 sm:p-5">
      <div className="relative w-full max-w-[920px] max-h-[94vh] overflow-auto rounded-xl border border-orange-300/40 bg-[#f8f5ef] shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between gap-3 bg-[#ea580c] px-4 py-3 text-white">
          <div>
            <div className="font-black tracking-wide">📺 UID SOCIAL SCREEN</div>
            <div className="text-[11px] opacity-90">
              {posts.length} ảnh đang trong carousel • tự chuyển slide chậm
            </div>
          </div>
          <button
            onClick={close}
            className="rounded bg-black/25 px-3 py-1.5 text-xs font-bold hover:bg-black/40"
          >
            ✕ ĐÓNG
          </button>
        </div>

        <div className="grid gap-4 p-4 md:grid-cols-[1.15fr_.85fr]">
          <div>
            <div className="rounded-xl bg-[#171a1d] p-3 shadow-inner">
              <div className="mb-2 flex items-center justify-between text-[11px] text-slate-300">
                <span>LIVE PREVIEW</span>
                <span>{draft ? 'ẢNH ĐANG CHỌN' : 'ẢNH ĐANG CÓ TRÊN MÀN HÌNH'}</span>
              </div>
              <img
                src={preview}
                alt="UID social screen preview"
                className="mx-auto block max-h-[58vh] w-full object-contain rounded-lg bg-black"
              />
            </div>

            {posts.length > 0 && (
              <div className="mt-3">
                <div className="mb-2 text-xs font-black text-slate-700">
                  PLAYLIST HIỆN TẠI • {posts.length}/12
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {posts.map((post, index) => (
                    <div key={post.id} className="w-24 shrink-0">
                      <img
                        src={post.image_data}
                        alt={post.player_name}
                        className="h-20 w-24 rounded border border-slate-300 bg-black object-cover"
                      />
                      <div className="mt-1 truncate text-[10px] font-bold text-slate-600">
                        {index + 1}. {post.player_name}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <div className="rounded-lg border-2 border-slate-300 bg-white p-4 text-slate-800">
              <div className="font-black">UP ẢNH LÊN MÀN HÌNH</div>
              <div className="mt-1 text-xs leading-relaxed text-slate-600">
                Mỗi UIDer có thể thêm ảnh/meme. Khi có nhiều ảnh, màn hình 3D sẽ chạy carousel lần lượt và fade chuyển slide từ từ.
              </div>

              <button
                onClick={() => inputRef.current?.click()}
                disabled={busy}
                className="mt-4 w-full rounded bg-slate-900 px-4 py-3 text-sm font-black text-white disabled:opacity-50"
              >
                {busy ? 'ĐANG XỬ LÝ...' : '📸 CHỌN ẢNH / MEME'}
              </button>
              <input ref={inputRef} type="file" accept="image/*" onChange={onFile} className="hidden" />
            </div>

            <button
              disabled={!draft || busy}
              onClick={() => void upload(false)}
              className="w-full rounded border-2 border-emerald-700 bg-emerald-500 px-4 py-3 text-sm font-black text-slate-950 disabled:cursor-not-allowed disabled:opacity-40"
            >
              ➕ THÊM ẢNH CỦA TÔI VÀO CAROUSEL
            </button>

            <button
              disabled={!draft || busy}
              onClick={() => void upload(true)}
              className="w-full rounded border-2 border-red-800 bg-red-600 px-4 py-3 text-sm font-black text-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              🔥 CHỈ SHOW ẢNH CỦA TÔI
            </button>

            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-xs leading-relaxed text-red-900">
              <b>“Chỉ show ảnh của tôi”</b> sẽ xoá toàn bộ ảnh đang có trong carousel rồi thay bằng đúng ảnh bạn vừa chọn.
            </div>

            <div className="rounded-lg bg-orange-100 p-3 text-xs leading-relaxed text-orange-950">
              Màn hình giữ tối đa <b>12 ảnh</b>. Nếu playlist đầy, ảnh cũ nhất sẽ tự rời carousel khi có ảnh mới.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
