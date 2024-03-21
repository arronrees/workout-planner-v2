type Props = {
  className?: string;
};

export default function DividerLine({ className }: Props) {
  return (
    <div className={`py-4 ${className ? className : ''}`}>
      <span className='block w-full h-[1px] bg-zinc-200'></span>
    </div>
  );
}
