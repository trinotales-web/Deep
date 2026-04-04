interface DecorativeKanjiProps {
  character: string;
  className?: string;
}

export default function DecorativeKanji({
  character,
  className = "",
}: DecorativeKanjiProps) {
  return (
    <span
      aria-hidden="true"
      className={`font-jp absolute pointer-events-none select-none text-[160px] leading-none opacity-[0.04] ${className}`}
    >
      {character}
    </span>
  );
}
