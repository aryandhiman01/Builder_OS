import Image from "next/image";

export default function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
        <Image
          src="/Builder_OS_logo.png"
          alt="BuilderOS"
          width={28}
          height={28}
          className="rounded-md object-contain"
        />
      </div>

      <span className="text-[17px] font-semibold tracking-tight text-white">
        BuilderOS
      </span>
    </div>
  );
}