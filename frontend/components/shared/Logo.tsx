import Image from "next/image";

export default function Logo() {
  return (
    <div className="flex items-center gap-3">
      <Image
        src="/Builder_OS_logo.png"
        alt="BuilderOS"
        width={42}
        height={42}
        className="rounded-lg object-contain"
      />

      <span className="text-lg font-semibold tracking-tight text-white">
        BuilderOS
      </span>
    </div>
  );
}