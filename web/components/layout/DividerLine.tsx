type Props = {
  small?: boolean;
  className?: string;
};

export default function DividerLine({ small, className }: Props) {
  return (
    <div
      className={`py-4 ${small ? 'px-4' : ''} ${className ? className : ''}`}
    >
      <span className='block w-full h-[2px] bg-zinc-200'></span>
    </div>
  );
}
