import Image from "next/image";

export default function Logo() {
  return (
    <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
      <div className="flex h-8 w-8 sm:h-11 sm:w-11 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] shadow-[0_0_0_1px_rgba(255,255,255,0.02)] shrink-0">
        <Image
          src="/Builder_OS_logo.png"
          alt="BuilderOS"
          width={22}
          height={22}
          className="rounded-md object-contain sm:w-[28px] sm:h-[28px]"
        />
      </div>

      <span className="text-[13px] sm:text-[17px] font-semibold tracking-tight text-white whitespace-nowrap">
        BuilderOS
      </span>
    </div>
  );
}